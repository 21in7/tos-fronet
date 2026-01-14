# deploy.ps1

# 설정 변수 (사용자 환경에 맞게 수정 필요)
$SERVER_IP = "192.168.50.224"
$SERVER_USER = "root"
$SERVER_PATH = "/mnt/nfs_2tb/tos/front" # 서버에 배포할 경로
$PM2_NAME = "tos-frontend"

Write-Host "Starting deployment to $SERVER_USER@$SERVER_IP..." -ForegroundColor Green

# 1. Build
Write-Host "1. Building Project..." -ForegroundColor Yellow
$buildProcess = Start-Process -FilePath "npm.cmd" -ArgumentList "run", "build" -NoNewWindow -PassThru -Wait
if ($buildProcess.ExitCode -ne 0) {
    Write-Error "Build failed!"
    exit 1
}

# 2. Prepare Standalone Directory
Write-Host "2. Preparing Standalone Directory..." -ForegroundColor Yellow
# Copy public folder
New-Item -ItemType Directory -Force -Path ".next/standalone/public"
Copy-Item -Path "public\*" -Destination ".next/standalone/public" -Recurse -Force

# Copy static assets
New-Item -ItemType Directory -Force -Path ".next/standalone/.next/static"
Copy-Item -Path ".next\static\*" -Destination ".next/standalone/.next/static" -Recurse -Force

# 3. Deploy to Server (SCP)
Write-Host "3. Uploading to Server (This may take a while)..." -ForegroundColor Yellow
# Clean remote directory first (Optional, safer)
ssh $SERVER_USER@$SERVER_IP "rm -rf $SERVER_PATH/.next"

# Upload standalone folder
# Note: Using scp recursively on Windows can be tricky with paths. 
# Alternatively, compress locally, upload, and unzip remotely is faster.

Write-Host "   Compressing build..." -ForegroundColor Cyan
Compress-Archive -Path ".next/standalone/*" -DestinationPath "deploy_package.zip" -Force

Write-Host "   Uploading zip..." -ForegroundColor Cyan
scp deploy_package.zip "${SERVER_USER}@${SERVER_IP}:${SERVER_PATH}/deploy_package.zip"

# 4. Extract and Restart (SSH)
Write-Host "4. Extracting and Restarting Application..." -ForegroundColor Yellow
$commands = @(
    "cd $SERVER_PATH",
    "unzip -o deploy_package.zip",
    "rm deploy_package.zip",
    "echo 'Reinstalling dependencies for Linux compatibility...'",
    "rm -rf node_modules",
    "npm install --production",
    "pm2 delete $PM2_NAME || true",
    "PORT=3001 pm2 start server.js --name $PM2_NAME",
    "pm2 save"
)
$commandString = $commands -join " && "

ssh "$SERVER_USER@$SERVER_IP" $commandString

# 5. Cleanup
Remove-Item "deploy_package.zip" -Force

Write-Host "Deployment Complete!" -ForegroundColor Green

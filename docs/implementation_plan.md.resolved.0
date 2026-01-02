# 모바일 반응형 최적화 구현 계획

모든 페이지를 모바일 환경(320px~414px 뷰포트)에 최적화하여 데스크탑과 동일한 사용자 경험을 제공합니다.

## 현재 상태 분석

현재 프로젝트는 Tailwind CSS를 사용하고 있으며, `lg:` 브레이크포인트 중심의 반응형을 일부 적용하고 있습니다:
- grid: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3/4`
- 네비게이션: `lg:hidden` / `hidden lg:flex` 사용
- 대부분의 입력필드: `sm:text-sm` 적용

**문제점:**
1. 헤더 로고가 모바일에서 너무 큼
2. 시뮬레이터 페이지의 그리드가 모바일에서 복잡함
3. 플래너 ClassSelector가 수평 스크롤 발생
4. 통계 패널이 모바일에서 가독성 저하
5. 테이블이 가로 스크롤 필요

---

## Proposed Changes

### 레이아웃/네비게이션

#### [MODIFY] [Header.tsx](file:///e:/develop/tos-fronet/tos-frontend/src/components/layout/Header.tsx)
- 로고 텍스트를 모바일에서 축약 (`text-lg sm:text-xl`)
- 모바일 메뉴 버튼 터치 영역 확대 (`p-3` → `p-4`)
- API 상태 표시 모바일 숨김 조정

---

### 대시보드/리스트 페이지

#### [MODIFY] [page.tsx](file:///e:/develop/tos-fronet/tos-frontend/src/app/page.tsx)
- StatsCard 그리드 개선: `grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-4 sm:gap-5`
- 제목 폰트 사이즈 조정: `text-xl sm:text-2xl`

#### [MODIFY] [jobs/page.tsx](file:///e:/develop/tos-fronet/tos-frontend/src/app/jobs/page.tsx)
- 직업 타입 필터 버튼 가로 스크롤 가능하게 변경
- 카드 내부 레이아웃 모바일 최적화 (이미지 크기 축소)

#### [MODIFY] [items/page.tsx](file:///e:/develop/tos-fronet/tos-frontend/src/app/items/page.tsx)
- 검색바 너비 `max-w-md` → `w-full sm:max-w-md`
- 카드 그리드 유지, 패딩 조정

#### [MODIFY] [skills/page.tsx](file:///e:/develop/tos-fronet/tos-frontend/src/app/skills/page.tsx)
- 카드 내부 정보 표시 간소화 (모바일에서 일부 숨김)

---

### 시뮬레이터 페이지

#### [MODIFY] [archeology/page.tsx](file:///e:/develop/tos-fronet/tos-frontend/src/app/simulator/archeology/page.tsx)
- 버튼 그룹 수직 정렬: `flex-col sm:flex-row`
- 옵션 선택 그리드 `grid-cols-1` 유지 후 간격 조정
- 통계 패널 그리드: `grid-cols-3` → `grid-cols-1 sm:grid-cols-3`
- 결과 카드 패딩 축소

#### [MODIFY] [reinforce/page.tsx](file:///e:/develop/tos-fronet/tos-frontend/src/app/simulator/reinforce/page.tsx)
- 설정 패널 그리드: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4`
- 결과 통계: `grid-cols-2 sm:grid-cols-2 md:grid-cols-4`
- 확률표 테이블 가로 스크롤 래퍼 추가 (이미 있음 - 확인)

#### [MODIFY] [gearscore/page.tsx](file:///e:/develop/tos-fronet/tos-frontend/src/app/simulator/gearscore/page.tsx)
- 장비 입력 그리드: `grid-cols-1 sm:grid-cols-2 md:grid-cols-4`
- 조건부 옵션 영역 반응형 조정

---

### 플래너 페이지

#### [MODIFY] [ClassSelector.tsx](file:///e:/develop/tos-fronet/tos-frontend/src/components/planner/ClassSelector.tsx)
- 슬롯 컨테이너 가로 스크롤 또는 그리드로 변경
- 슬롯 크기 축소: `w-20 h-20` → `w-16 h-16 sm:w-20 sm:h-20`
- 화살표 구분자 모바일에서 숨김

#### [MODIFY] [planner/page.tsx](file:///e:/develop/tos-fronet/tos-frontend/src/app/planner/page.tsx)
- 버튼 그룹 레이아웃 조정 (이미 `flex-col sm:flex-row` 적용됨)

---

### 공통 컴포넌트

#### [MODIFY] [Pagination.tsx](file:///e:/develop/tos-fronet/tos-frontend/src/components/common/Pagination.tsx)
- 페이지 버튼 크기 및 간격 모바일 최적화

---

## Verification Plan

### 브라우저 테스트
브라우저 도구를 사용하여 다음 페이지들의 모바일 뷰(375px 너비)를 확인합니다:
1. 대시보드 페이지 (`/`)
2. 직업 목록 페이지 (`/jobs`)
3. 고고학 시뮬레이터 (`/simulator/archeology`)
4. 기어스코어 계산기 (`/simulator/gearscore`)
5. 플래너 페이지 (`/planner`)

각 페이지에서 확인 사항:
- 가로 스크롤 발생 여부
- 버튼/입력 필드 터치 가능성
- 텍스트 가독성
- 그리드 레이아웃 정상 표시

### 수동 검증
사용자에게 다음 확인 요청:
- 실제 모바일 기기에서 각 페이지 테스트
- 터치 인터랙션 정상 동작 확인

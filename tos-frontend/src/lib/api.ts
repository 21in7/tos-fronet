import { ApiResponse, ApiError, QueryParams } from '@/types/api';

// Next.js API 프록시를 통해 CORS 문제 해결
const API_BASE_URL = '/api';

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      console.log(`🔄 API 요청: ${options.method || 'GET'} ${url}`);
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.message || `HTTP ${response.status}: ${response.statusText}`;
        console.error(`❌ API 오류 [${response.status}]: ${url}`, errorData);
        
        // 더 구체적인 에러 메시지 제공
        if (response.status === 400) {
          throw new Error(`잘못된 요청입니다: ${errorMessage}`);
        } else if (response.status === 404) {
          throw new Error(`요청한 리소스를 찾을 수 없습니다: ${errorMessage}`);
        } else if (response.status === 500) {
          throw new Error(`서버 내부 오류가 발생했습니다: ${errorMessage}`);
        } else {
          throw new Error(errorMessage);
        }
      }

      const data = await response.json();
      console.log(`✅ API 성공: ${url}`, data.success ? '성공' : '응답 받음');
      
      // API 응답이 에러인 경우 처리
      if (data.error) {
        console.error(`❌ API 응답 에러: ${url}`, data.error);
        throw new Error(data.error);
      }
      
      return data;
    } catch (error) {
      console.error(`💥 API 요청 실패: ${url}`, error);
      
      // API 서버가 실행되지 않은 경우 더 친화적인 에러 메시지
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        throw new Error('API 서버에 연결할 수 없습니다. 서버가 실행 중인지 확인해주세요.');
      }
      
      throw error;
    }
  }

  // GET 요청
  async get<T>(endpoint: string, params?: QueryParams): Promise<ApiResponse<T>> {
    const searchParams = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, value.toString());
        }
      });
    }

    const queryString = searchParams.toString();
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;
    
    console.log('🌐 API GET 요청:', { endpoint, params, url });

    return this.request<T>(url, { method: 'GET' });
  }

  // POST 요청
  async post<T>(endpoint: string, data: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // PUT 요청
  async put<T>(endpoint: string, data: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // DELETE 요청
  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

// API 클라이언트 인스턴스
export const apiClient = new ApiClient(API_BASE_URL);

// Attributes API
export const attributesApi = {
  getAll: (params?: QueryParams) => apiClient.get('/attributes', params),
  getById: (ids: string | number) => apiClient.get(`/attributes/${ids}`),
  create: (data: any) => apiClient.post('/attributes', data),
  update: (ids: string | number, data: any) => apiClient.put(`/attributes/${ids}`, data),
  delete: (ids: string | number) => apiClient.delete(`/attributes/${ids}`),
  getStats: () => apiClient.get('/attributes/stats'),
  getTypes: () => apiClient.get('/attributes/types'),
};

// Items API
export const itemsApi = {
  getAll: (params?: QueryParams) => apiClient.get('/items', params),
  getById: (id: number) => apiClient.get(`/items/${id}`),
  create: (data: any) => apiClient.post('/items', data),
  update: (id: number, data: any) => apiClient.put(`/items/${id}`, data),
  delete: (id: number) => apiClient.delete(`/items/${id}`),
  getStats: () => apiClient.get('/items/stats'),
  getTypes: () => apiClient.get('/items/types'),
  getRarities: () => apiClient.get('/items/rarities'),
};

// Monsters API - 기존 REST API 호출 방식
export const monstersApi = {
  getAll: (params?: QueryParams) => apiClient.get('/monsters', params),
  getById: (ids: string) => apiClient.get(`/monsters/${ids}`),
  create: (data: any) => apiClient.post('/monsters', data),
  update: (ids: string, data: any) => apiClient.put(`/monsters/${ids}`, data),
  delete: (ids: string) => apiClient.delete(`/monsters/${ids}`),
  getStats: () => apiClient.get('/monsters/stats'),
};

// Skills API
export const skillsApi = {
  getAll: (params?: QueryParams) => apiClient.get('/skills', params),
  getById: (id: number) => apiClient.get(`/skills/${id}`),
  create: (data: any) => apiClient.post('/skills', data),
  update: (id: number, data: any) => apiClient.put(`/skills/${id}`, data),
  delete: (id: number) => apiClient.delete(`/skills/${id}`),
  getStats: () => apiClient.get('/skills/stats'),
};

// Jobs API
export const jobsApi = {
  getAll: (params?: QueryParams) => apiClient.get('/jobs', params),
  getById: (id: number) => apiClient.get(`/jobs/${id}`),
  create: (data: any) => apiClient.post('/jobs', data),
  update: (id: number, data: any) => apiClient.put(`/jobs/${id}`, data),
  delete: (id: number) => apiClient.delete(`/jobs/${id}`),
  getStats: () => apiClient.get('/jobs/stats'),
};

// Maps API
export const mapsApi = {
  getAll: (params?: QueryParams) => apiClient.get('/maps', params),
  getById: (id: number) => apiClient.get(`/maps/${id}`),
  create: (data: any) => apiClient.post('/maps', data),
  update: (id: number, data: any) => apiClient.put(`/maps/${id}`, data),
  delete: (id: number) => apiClient.delete(`/maps/${id}`),
  getStats: () => apiClient.get('/maps/stats'),
};

// Dashboard API
export const dashboardApi = {
  getStats: () => apiClient.get('/dashboard/stats'),
  getRecent: () => apiClient.get('/dashboard/recent'),
  getStatus: () => apiClient.get('/dashboard/status'),
  getTables: () => apiClient.get('/dashboard/tables'),
};

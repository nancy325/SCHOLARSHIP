const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000/api';

interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: any;
  error?: string;
}

interface User {
  id: number;
  name: string;
  email: string;
  category: string;
  role?: string;
  institute_id?: number | null;
  university_id?: number | null;
}

interface AuthResponse {
  user: User;
  token: string;
}

class ApiService {
  private getAuthToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  private setAuthToken(token: string): void {
    localStorage.setItem('auth_token', token);
  }

  private removeAuthToken(): void {
    localStorage.removeItem('auth_token');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${API_BASE_URL}${endpoint}`;
    const token = this.getAuthToken();

    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      console.log('Making API request to:', url);
      console.log('Request config:', config);
      
      const response = await fetch(url, config);
      const data = await response.json();
      
      console.log('API response status:', response.status);
      console.log('API response data:', data);

      if (!response.ok) {
        // Create a custom error that preserves the response data
        console.log('API Error Response:', data);
        const error = new Error(data.message || 'Request failed');
        (error as any).response = { data };
        throw error;
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Generic helpers for arbitrary endpoints
  async get<T = any>(endpoint: string, params?: Record<string, string | number | boolean | undefined>): Promise<ApiResponse<T>> {
    const qs = params
      ? `?${Object.entries(params)
          .filter(([, v]) => v !== undefined && v !== null)
          .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
          .join('&')}`
      : '';
    return this.request<T>(`${endpoint}${qs}`);
  }

  async post<T = any>(endpoint: string, body?: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  }

  async put<T = any>(endpoint: string, body?: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  }

  async delete<T = any>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  // Authentication methods
  async register(userData: {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
    category: string;
  }): Promise<ApiResponse<AuthResponse>> {
    return this.request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async login(credentials: {
    email: string;
    password: string;
  }): Promise<ApiResponse<AuthResponse>> {
    const response = await this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    if (response.success && response.data?.token) {
      this.setAuthToken(response.data.token);
    }

    return response;
  }

  async logout(): Promise<ApiResponse> {
    const response = await this.request('/auth/logout', {
      method: 'POST',
    });

    this.removeAuthToken();
    return response;
  }

  async getCurrentUser(): Promise<ApiResponse<{ user: User }>> {
    return this.request<{ user: User }>('/auth/me');
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!this.getAuthToken();
  }

  // Get current user from localStorage (for initial app state)
  getStoredUser(): User | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  // Store user data
  storeUser(user: User): void {
    localStorage.setItem('user', JSON.stringify(user));
  }

  // Remove user data
  removeUser(): void {
    localStorage.removeItem('user');
  }

  // Admin Dashboard methods
  async getDashboardStats(): Promise<ApiResponse> {
    return this.request('/admin/dashboard/stats');
  }

  async getRecentActivity(): Promise<ApiResponse> {
    return this.request('/admin/dashboard/activity');
  }

  async getAnalytics(): Promise<ApiResponse> {
    return this.request('/admin/dashboard/analytics');
  }

  // User Management
  async getUsers(params?: { search?: string; status?: string; role?: string; page?: number }): Promise<ApiResponse> {
    const queryParams = new URLSearchParams();
    if (params?.search) queryParams.append('search', params.search);
    if (params?.status) queryParams.append('status', params.status);
    if (params?.role) queryParams.append('role', params.role);
    if (params?.page) queryParams.append('page', params.page.toString());
    
    const query = queryParams.toString();
    return this.request(`/admin/users${query ? `?${query}` : ''}`);
  }

  async getUser(id: number): Promise<ApiResponse> {
    return this.request(`/admin/users/${id}`);
  }

  async createUser(userData: any): Promise<ApiResponse> {
    return this.request('/admin/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async updateUser(id: number, userData: any): Promise<ApiResponse> {
    return this.request(`/admin/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  async deleteUser(id: number): Promise<ApiResponse> {
    return this.request(`/admin/users/${id}`, {
      method: 'DELETE',
    });
  }

  async getUserStats(): Promise<ApiResponse> {
    return this.request('/admin/users/stats');
  }

  // Institute Management
  async getInstitutes(params?: { search?: string; status?: string; type?: string; page?: number }): Promise<ApiResponse> {
    const queryParams = new URLSearchParams();
    if (params?.search) queryParams.append('search', params.search);
    if (params?.status) queryParams.append('status', params.status);
    if (params?.type) queryParams.append('type', params.type);
    if (params?.page) queryParams.append('page', params.page.toString());
    
    const query = queryParams.toString();
    return this.request(`/admin/institutes${query ? `?${query}` : ''}`);
  }

  async getInstitute(id: number): Promise<ApiResponse> {
    return this.request(`/admin/institutes/${id}`);
  }

  async createInstitute(instituteData: any): Promise<ApiResponse> {
    console.log('API Service - Creating institute with data:', instituteData);
    return this.request('/admin/institutes', {
      method: 'POST',
      body: JSON.stringify(instituteData),
    });
  }

  async updateInstitute(id: number, instituteData: any): Promise<ApiResponse> {
    return this.request(`/admin/institutes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(instituteData),
    });
  }

  async deleteInstitute(id: number): Promise<ApiResponse> {
    return this.request(`/admin/institutes/${id}`, {
      method: 'DELETE',
    });
  }

  async getInstituteStats(): Promise<ApiResponse> {
    return this.request('/admin/institutes/stats');
  }

  // Scholarship Management (spec-aligned)
  async getScholarships(params?: { search?: string; type?: string; university_id?: number; institute_id?: number; page?: number }): Promise<ApiResponse> {
    const queryParams = new URLSearchParams();
    if (params?.search) queryParams.append('search', params.search);
    if (params?.type) queryParams.append('type', params.type);
    if (params?.university_id) queryParams.append('university_id', params.university_id.toString());
    if (params?.institute_id) queryParams.append('institute_id', params.institute_id.toString());
    if (params?.page) queryParams.append('page', params.page.toString());
    
    const query = queryParams.toString();
    return this.request(`/scholarships${query ? `?${query}` : ''}`);
  }

  // Admin Scholarship Management
  async getAdminScholarships(params?: { search?: string; type?: string; university_id?: number; institute_id?: number; page?: number }): Promise<ApiResponse> {
    const queryParams = new URLSearchParams();
    if (params?.search) queryParams.append('search', params.search);
    if (params?.type) queryParams.append('type', params.type);
    if (params?.university_id) queryParams.append('university_id', params.university_id.toString());
    if (params?.institute_id) queryParams.append('institute_id', params.institute_id.toString());
    if (params?.page) queryParams.append('page', params.page.toString());
    const query = queryParams.toString();
    return this.request(`/admin/scholarships${query ? `?${query}` : ''}`);
  }

  async getScholarship(id: number): Promise<ApiResponse> {
    return this.request(`/scholarships/${id}`);
  }

  async createScholarship(scholarshipData: any): Promise<ApiResponse> {
    return this.request('/scholarships', {
      method: 'POST',
      body: JSON.stringify(scholarshipData),
    });
  }

  async updateScholarship(id: number, scholarshipData: any): Promise<ApiResponse> {
    return this.request(`/scholarships/${id}`, {
      method: 'PUT',
      body: JSON.stringify(scholarshipData),
    });
  }

  async deleteScholarship(id: number): Promise<ApiResponse> {
    return this.request(`/scholarships/${id}`, {
      method: 'DELETE',
    });
  }

  async getScholarshipInstitutes(): Promise<ApiResponse> {
    return this.request('/institutes/options');
  }

  async getUniversities(): Promise<ApiResponse> {
    return this.request('/universities/options');
  }

<<<<<<< Updated upstream
  // Student Dashboard
  async getStudentDashboard(): Promise<ApiResponse> {
    return this.request('/student/dashboard');
=======
  async createUniversity(universityData: any): Promise<ApiResponse> {
    return this.request('/admin/universities', {
      method: 'POST',
      body: JSON.stringify(universityData),
    });
>>>>>>> Stashed changes
  }
}

export const apiService = new ApiService();
export type { User, AuthResponse, ApiResponse };

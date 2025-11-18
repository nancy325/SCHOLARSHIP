const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000/api';

interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: any;
  error?: string;
  pagination?: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
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

  // Health check
  async getHealth(): Promise<ApiResponse> {
    return this.request('/health');
  }

  // Statistics
  async getStats(): Promise<ApiResponse> {
    return this.request('/stats');
  }

  // Search scholarships
  async searchScholarships(params?: { 
    q?: string; 
    type?: string; 
    university_id?: number; 
    institute_id?: number; 
    per_page?: number 
  }): Promise<ApiResponse> {
    const queryParams = new URLSearchParams();
    if (params?.q) queryParams.append('q', params.q);
    if (params?.type) queryParams.append('type', params.type);
    if (params?.university_id) queryParams.append('university_id', params.university_id.toString());
    if (params?.institute_id) queryParams.append('institute_id', params.institute_id.toString());
    if (params?.per_page) queryParams.append('per_page', params.per_page.toString());
    
    const query = queryParams.toString();
    return this.request(`/search${query ? `?${query}` : ''}`);
  }

  // Scholarship types
  async getScholarshipTypes(): Promise<ApiResponse> {
    return this.request('/scholarship-types');
  }

  // User categories
  async getUserCategories(): Promise<ApiResponse> {
    return this.request('/user-categories');
  }

  // Scholarship Management
  async getScholarships(params?: { search?: string; type?: string; university_id?: number; institute_id?: number; page?: number; per_page?: number }): Promise<ApiResponse> {
    return this.get('/scholarships', params);
  }

  async getScholarship(id: number): Promise<ApiResponse> {
    return this.get('/scholarships', { id });
  }

  async createScholarship(scholarshipData: any): Promise<ApiResponse> {
    return this.request('/scholarships', {
      method: 'POST',
      body: JSON.stringify(scholarshipData),
    });
  }

  async updateScholarship(id: number, scholarshipData: any): Promise<ApiResponse> {
    // Include the scholarship ID in the request body
    const requestData = { ...scholarshipData, id };
    return this.request('/scholarships', {
      method: 'PUT',
      body: JSON.stringify(requestData),
    });
  }

  async deleteScholarship(id: number): Promise<ApiResponse> {
    return this.request('/scholarships', { 
      method: 'DELETE',
      body: JSON.stringify({ id })
    });
  }

  // Options for dropdowns
  async getInstitutesOptions(): Promise<ApiResponse> {
    return this.request('/institutes/options');
  }

  async getUniversitiesOptions(): Promise<ApiResponse> {
    return this.request('/universities/options');
  }

  // Profile management
  async getProfile(): Promise<ApiResponse> {
    return this.request('/profile');
  }

  async updateProfile(profileData: any): Promise<ApiResponse> {
    return this.request('/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  // Admin Dashboard
  async getDashboardStats(): Promise<ApiResponse> {
    return this.request('/admin/dashboard/stats');
  }

  async getRecentActivity(): Promise<ApiResponse> {
    return this.request('/admin/dashboard/recent-activity');
  }

  // Analytics endpoint
  async getAnalytics(): Promise<ApiResponse> {
    return this.request('/admin/dashboard/stats');
  }

  // User Management
  async getUsers(params?: { search?: string; status?: string; rec_status?: string; page?: number; per_page?: number }): Promise<ApiResponse> {
    return this.get('/admin/users', params);
  }

  async getUser(id: number): Promise<ApiResponse> {
    return this.request(`/admin/users?id=${id}`);
  }

  async createUser(userData: any): Promise<ApiResponse> {
    return this.request('/admin/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async updateUser(id: number, userData: any): Promise<ApiResponse> {
    // Include the user ID in the request body
    const requestData = { ...userData, id };
    return this.request('/admin/users', {
      method: 'PUT',
      body: JSON.stringify(requestData),
    });
  }

  // Alternative method that uses a generic update endpoint (if you prefer this approach)
  async updateUserById(userData: any): Promise<ApiResponse> {
    // User ID must be included in userData
    if (!userData.id) {
      throw new Error('User ID is required in userData');
    }
    return this.request(`/admin/users/update`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  async deleteUser(id: number): Promise<ApiResponse> {
    return this.request('/admin/users', { 
      method: 'DELETE',
      body: JSON.stringify({ id })
    });
  }

  // Institutes Management
  async getInstitutes(params?: { search?: string; status?: string; university_id?: number; page?: number; per_page?: number }): Promise<ApiResponse> {
    return this.get('/institutes', params);
  }

  async getInstitute(id: number): Promise<ApiResponse> {
    return this.request(`/institutes/${id}`);
  }

  async createInstitute(instituteData: any): Promise<ApiResponse> {
    return this.request('/institutes', {
      method: 'POST',
      body: JSON.stringify(instituteData),
    });
  }

  async updateInstitute(id: number, instituteData: any): Promise<ApiResponse> {
    return this.request(`/institutes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(instituteData),
    });
  }

  async deleteInstitute(id: number): Promise<ApiResponse> {
    return this.request(`/institutes/${id}`, { method: 'DELETE' });
  }

  // Scholarship-specific institutes endpoint
  async getScholarshipInstitutes(): Promise<ApiResponse> {
    return this.request('/institutes/options');
  }

  // Admin-specific scholarship endpoints
  async getAdminScholarships(params?: { search?: string; type?: string; university_id?: number; institute_id?: number; page?: number; per_page?: number }): Promise<ApiResponse> {
    return this.get('/scholarships', params);
  }

  // Universities Management
  async getUniversities(params?: { page?: number; per_page?: number }): Promise<ApiResponse> {
    return this.get('/universities', params);
  }

  async createUniversity(universityData: any): Promise<ApiResponse> {
    return this.request('/universities', {
      method: 'POST',
      body: JSON.stringify(universityData),
    });
  }

  async updateUniversity(id: number, universityData: any): Promise<ApiResponse> {
    return this.request(`/universities/${id}`, {
      method: 'PUT',
      body: JSON.stringify(universityData),
    });
  }

  async deleteUniversity(id: number): Promise<ApiResponse> {
    return this.request(`/universities/${id}`, { method: 'DELETE' });
  }

  // Student Dashboard
  async getStudentDashboard(): Promise<ApiResponse> {
    return this.request('/student/dashboard');
  }
}

export const apiService = new ApiService();
export type { User, AuthResponse, ApiResponse };

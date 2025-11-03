// API Configuration
const API_BASE_URL = 'http://127.0.0.1:8000';

// Token management
export const getToken = (): string | null => {
  return localStorage.getItem('userToken');
};

export const setToken = (token: string): void => {
  localStorage.setItem('userToken', token);
};

export const removeToken = (): void => {
  localStorage.removeItem('userToken');
};

// API Request wrapper
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    console.log(`Making API request to: ${API_BASE_URL}${endpoint}`, {
      method: options.method || 'GET',
      headers: headers
    });

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    console.log('Response status:', response.status);
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ 
        detail: `Failed to parse error response: ${response.statusText}` 
      }));
      console.error('API Error:', {
        status: response.status,
        statusText: response.statusText,
        error: error
      });
      throw new Error(error.detail || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('API Response:', data);
    return data;
  } catch (error) {
    console.error('Network/API Error:', error);
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      throw new Error('Unable to connect to the server. Please check if the backend service is running at ' + API_BASE_URL);
    }
    throw error;
  }
}

// Auth API
export interface SignUpRequest {
  username: string;
  password: string;
}

export interface SignInRequest {
  username: string;
  password: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
}

export interface User {
  id: number;
  username: string;
}

export const authApi = {
  signUp: async (data: SignUpRequest): Promise<User> => {
    return apiRequest<User>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  signIn: async (data: SignInRequest): Promise<TokenResponse> => {
    // FastAPI OAuth2PasswordRequestForm expects form data
    const formData = new URLSearchParams();
    formData.append('username', data.username);
    formData.append('password', data.password);

    const token = getToken();
    const headers: HeadersInit = {
      'Content-Type': 'application/x-www-form-urlencoded',
    };

    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers,
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: response.statusText }));
      throw new Error(error.detail || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  },
};

// Model Update API
export interface ModelUpdatePayload {
  feature_attributions: {
    text: number;
    typing: number;
    voice: number;
  };
}

export interface ModelUpdateResponse {
  status: string;
  new_data_point: {
    id: number;
    timestamp: string;
    avg_text_importance: number;
    avg_typing_importance: number;
    avg_voice_importance: number;
    owner_username: string;
  };
}

export const modelApi = {
  submitUpdate: async (payload: ModelUpdatePayload): Promise<ModelUpdateResponse> => {
    return apiRequest<ModelUpdateResponse>('/v1/submit-update', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
};

// Dashboard API
export interface DashboardDataPoint {
  id: number;
  timestamp: string;
  avg_text_importance: number;
  avg_typing_importance: number;
  avg_voice_importance: number;
  owner_username: string;
}

export const dashboardApi = {
  getDashboardData: async (): Promise<DashboardDataPoint[]> => {
    return apiRequest<DashboardDataPoint[]>('/v1/dashboard-data');
  },
};

// Health check
export const healthCheck = async (): Promise<{ status: string }> => {
  return apiRequest<{ status: string }>('/');
};


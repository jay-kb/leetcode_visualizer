import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    // Token 过期，跳转登录
    if (error.response?.status === 401) {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('isAdmin');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// 题解管理 API
export const solutionAdminApi = {
  getList: (params) => api.get('/solutions', { params }),
  getById: (id) => api.get(`/solutions/${id}`),
  create: (data) => api.post('/solutions', data),
  update: (id, data) => api.put(`/solutions/${id}`, data),
  delete: (id) => api.delete(`/solutions/${id}`),
};

// 标签管理 API
export const tagAdminApi = {
  getList: (params) => api.get('/tags', { params }),
  getAll: () => api.get('/tags', { params: { all: true } }),
  getById: (id) => api.get(`/tags/${id}`),
  create: (data) => api.post('/tags', data),
  update: (id, data) => api.put(`/tags/${id}`, data),
  delete: (id) => api.delete(`/tags/${id}`),
};

// 登录 API (使用绝对路径，因为 auth 在 /api 下，不在 /admin/api 下)
export const authApi = {
  login: (username, password) => api.post('/api/auth/login', { username, password }),
  logout: () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('isAdmin');
  },
};

// 浏览量统计 API
export const viewStatsApi = {
  // 获取统计概览
  getOverview: () => api.get('/view-stats/overview'),
  // 获取统计数据（按维度）
  getStats: (params) => api.get('/view-stats', { params }),
  // 获取热门排行
  getTop: (params) => api.get('/view-stats/top', { params }),
};

export default api;

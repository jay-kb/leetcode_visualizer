import axios from 'axios';

const MOCK_MODE = false; // 开启 Mock 模式演示

// Mock 数据
const mockSolutions = [
  { id: 1, title: '两数之和', description: '暴力解法和哈希表解法可视化演示', leetcodeQuestionId: '1', leetcodeUrl: 'https://leetcode.com/problems/two-sum', difficulty: 1, viewCount: 1520, tags: [{ id: 1, name: '数组', color: '#87d068' }, { id: 3, name: '哈希表', color: '#722ed1' }] },
  { id: 2, title: '两数相加', description: '链表逆序相加可视化演示', leetcodeQuestionId: '2', leetcodeUrl: 'https://leetcode.com/problems/add-two-numbers', difficulty: 2, viewCount: 980, tags: [{ id: 15, name: '链表', color: '#1890ff' }] },
  { id: 3, title: '无重复字符的最长子串', description: '滑动窗口解法可视化', leetcodeQuestionId: '3', leetcodeUrl: 'https://leetcode.com/problems/longest-substring-without-repeating-characters', difficulty: 2, viewCount: 1340, tags: [{ id: 2, name: '字符串', color: '#1890ff' }, { id: 19, name: '滑动窗口', color: '#f5222d' }] },
  { id: 4, title: '寻找两个正序数组的中位数', description: '二分查找解法可视化', leetcodeQuestionId: '4', leetcodeUrl: 'https://leetcode.com/problems/median-of-two-sorted-arrays', difficulty: 3, viewCount: 756, tags: [{ id: 16, name: '二分查找', color: '#faad14' }, { id: 1, name: '数组', color: '#87d068' }] },
  { id: 5, title: '最长回文子串', description: '动态规划与中心扩展法可视化', leetcodeQuestionId: '5', leetcodeUrl: 'https://leetcode.com/problems/longest-palindromic-substring', difficulty: 2, viewCount: 1120, tags: [{ id: 4, name: '动态规划', color: '#eb2f96' }] },
  { id: 6, title: 'Z 字形变换', description: '按行访问解法可视化', leetcodeQuestionId: '6', leetcodeUrl: 'https://leetcode.com/problems/zigzag-conversion', difficulty: 2, viewCount: 650, tags: [{ id: 2, name: '字符串', color: '#1890ff' }] },
  { id: 7, title: '整数反转', description: '数学解法可视化', leetcodeQuestionId: '7', leetcodeUrl: 'https://leetcode.com/problems/reverse-integer', difficulty: 1, viewCount: 890, tags: [{ id: 5, name: '数学', color: '#faad14' }] },
  { id: 8, title: '回文数', description: '数学解法可视化', leetcodeQuestionId: '9', leetcodeUrl: 'https://leetcode.com/problems/palindrome-number', difficulty: 1, viewCount: 720, tags: [{ id: 5, name: '数学', color: '#faad14' }] },
  { id: 9, title: '盛最多水的容器', description: '双指针解法可视化', leetcodeQuestionId: '11', leetcodeUrl: 'https://leetcode.com/problems/container-with-most-water', difficulty: 2, viewCount: 1180, tags: [{ id: 11, name: '双指针', color: '#a0d911' }] },
  { id: 10, title: '三数之和', description: '双指针+排序解法可视化', leetcodeQuestionId: '15', leetcodeUrl: 'https://leetcode.com/problems/3sum', difficulty: 2, viewCount: 1650, tags: [{ id: 1, name: '数组', color: '#87d068' }, { id: 6, name: '排序', color: '#13c2c2' }] },
  { id: 11, title: '有效的括号', description: '栈解法可视化', leetcodeQuestionId: '20', leetcodeUrl: 'https://leetcode.com/problems/valid-parentheses', difficulty: 1, viewCount: 1380, tags: [{ id: 12, name: '栈', color: '#eb6f76' }] },
  { id: 12, title: '合并两个有序链表', description: '迭代与递归解法可视化', leetcodeQuestionId: '21', leetcodeUrl: null, difficulty: 1, viewCount: 1100, tags: [{ id: 15, name: '链表', color: '#1890ff' }] },
];

const mockTags = [
  { id: 1, name: '数组', color: '#87d068' },
  { id: 2, name: '字符串', color: '#1890ff' },
  { id: 3, name: '哈希表', color: '#722ed1' },
  { id: 4, name: '动态规划', color: '#eb2f96' },
  { id: 5, name: '数学', color: '#faad14' },
  { id: 6, name: '排序', color: '#13c2c2' },
];

// 模拟 API 请求延迟
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // 允许发送 Cookie
});

// Mock 拦截器
if (MOCK_MODE) {
  api.interceptors.request.use(async (config) => {
    await delay(300); // 模拟网络延迟
    return config;
  });

  api.interceptors.response.use(
    (response) => {
      return response.data;
    },
    (error) => {
      // Mock 模式下的响应处理
      const url = error.config?.url || '';

      if (url.includes('/solutions')) {
        // 题解列表
        if (url === '/solutions' || url.includes('/solutions?')) {
          return {
            records: mockSolutions,
            total: mockSolutions.length
          };
        }
        // 详情
        const id = url.match(/\/solutions\/(\d+)/)?.[1];
        if (id) {
          const solution = mockSolutions.find(s => s.id === parseInt(id));
          return solution || null;
        }
      }

      if (url.includes('/tags')) {
        return mockTags;
      }

      return Promise.reject(error);
    }
  );
} else {
  // 正常模式
  api.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  api.interceptors.response.use(
    (response) => response.data,
    (error) => {
      console.error('API Error:', error);
      return Promise.reject(error);
    }
  );
}

// 题解相关 API
export const solutionApi = {
  getList: (params) => api.get('/solutions', { params }),
  getById: (id) => api.get(`/solutions/${id}`),
  getHot: (limit = 10) => api.get('/solutions/hot', { params: { limit } }),
  getTodayNew: (limit = 10) => api.get('/solutions/today', { params: { limit } }),
  create: (data) => api.post('/solutions', data),
  update: (id, data) => api.put(`/solutions/${id}`, data),
  delete: (id) => api.delete(`/solutions/${id}`),
};

// 标签相关 API
export const tagApi = {
  getAll: () => api.get('/tags'),
  create: (data) => api.post('/tags', data),
  delete: (id) => api.delete(`/tags/${id}`),
  update: (id, data) => api.put(`/tags/${id}`, data),
};

// 文件上传 API
export const uploadApi = {
  uploadHtml: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/upload/html', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  uploadCover: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/upload/cover', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};

// 登录 API
export const authApi = {
  login: (username, password) => api.post('/auth/login', { username, password }),
};

export default api;

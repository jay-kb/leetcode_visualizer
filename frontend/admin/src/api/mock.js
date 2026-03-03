// Mock 数据开关
const MOCK_MODE = false;

// 模拟延迟
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Mock 标签数据
export const mockTags = [
  { id: 1, name: '数组', color: '#87d068', solutionCount: 15, createTime: '2024-01-01 10:00:00' },
  { id: 2, name: '字符串', color: '#1890ff', solutionCount: 8, createTime: '2024-01-02 10:00:00' },
  { id: 3, name: '哈希表', color: '#722ed1', solutionCount: 12, createTime: '2024-01-03 10:00:00' },
  { id: 4, name: '动态规划', color: '#eb2f96', solutionCount: 10, createTime: '2024-01-04 10:00:00' },
  { id: 5, name: '数学', color: '#faad14', solutionCount: 6, createTime: '2024-01-05 10:00:00' },
  { id: 6, name: '排序', color: '#13c2c2', solutionCount: 5, createTime: '2024-01-06 10:00:00' },
  { id: 7, name: '贪心', color: '#f5222d', solutionCount: 7, createTime: '2024-01-07 10:00:00' },
  { id: 8, name: '深度优先搜索', color: '#2f54eb', solutionCount: 9, createTime: '2024-01-08 10:00:00' },
  { id: 9, name: '二叉树', color: '#52c41a', solutionCount: 11, createTime: '2024-01-09 10:00:00' },
  { id: 10, name: '广度优先搜索', color: '#fa8c16', solutionCount: 4, createTime: '2024-01-10 10:00:00' },
  { id: 11, name: '双指针', color: '#a0d911', solutionCount: 8, createTime: '2024-01-11 10:00:00' },
  { id: 12, name: '栈', color: '#eb6f76', solutionCount: 3, createTime: '2024-01-12 10:00:00' },
  { id: 13, name: '堆', color: '#722ed1', solutionCount: 2, createTime: '2024-01-13 10:00:00' },
  { id: 14, name: '回溯', color: '#13c2c2', solutionCount: 6, createTime: '2024-01-14 10:00:00' },
  { id: 15, name: '链表', color: '#1890ff', solutionCount: 7, createTime: '2024-01-15 10:00:00' },
];

// Mock 题解数据
export const mockSolutions = [
  {
    id: 1,
    title: '两数之和',
    description: '暴力解法和哈希表解法可视化演示',
    leetcodeQuestionId: '1',
    difficulty: 1,
    htmlFileUrl: '/solutions/two-sum.html',
    coverImageUrl: null,
    viewCount: 1520,
    likeCount: 89,
    status: 1,
    tags: [mockTags[0], mockTags[2]],
    createTime: '2024-01-01 10:00:00',
  },
  {
    id: 2,
    title: '两数相加',
    description: '链表逆序相加可视化演示',
    leetcodeQuestionId: '2',
    difficulty: 2,
    htmlFileUrl: '/solutions/add-two-numbers.html',
    coverImageUrl: null,
    viewCount: 980,
    likeCount: 56,
    status: 1,
    tags: [mockTags[14]],
    createTime: '2024-01-02 10:00:00',
  },
  {
    id: 3,
    title: '无重复字符的最长子串',
    description: '滑动窗口解法可视化',
    leetcodeQuestionId: '3',
    difficulty: 2,
    htmlFileUrl: '/solutions/longest-substring.html',
    coverImageUrl: null,
    viewCount: 1340,
    likeCount: 78,
    status: 1,
    tags: [mockTags[1], mockTags[9], mockTags[10]],
    createTime: '2024-01-03 10:00:00',
  },
  {
    id: 4,
    title: '寻找两个正序数组的中位数',
    description: '二分查找解法可视化',
    leetcodeQuestionId: '4',
    difficulty: 3,
    htmlFileUrl: '/solutions/median-sorted-arrays.html',
    coverImageUrl: null,
    viewCount: 756,
    likeCount: 45,
    status: 1,
    tags: [mockTags[0]],
    createTime: '2024-01-04 10:00:00',
  },
  {
    id: 5,
    title: '最长回文子串',
    description: '动态规划与中心扩展法可视化',
    leetcodeQuestionId: '5',
    difficulty: 2,
    htmlFileUrl: '/solutions/longest-palindromic.html',
    coverImageUrl: null,
    viewCount: 1120,
    likeCount: 67,
    status: 1,
    tags: [mockTags[3], mockTags[1]],
    createTime: '2024-01-05 10:00:00',
  },
  {
    id: 6,
    title: 'Z 字形变换',
    description: '按行访问解法可视化',
    leetcodeQuestionId: '6',
    difficulty: 2,
    htmlFileUrl: '/solutions/zigzag-conversion.html',
    coverImageUrl: null,
    viewCount: 650,
    likeCount: 38,
    status: 0,
    tags: [mockTags[1]],
    createTime: '2024-01-06 10:00:00',
  },
  {
    id: 7,
    title: '盛最多水的容器',
    description: '双指针解法可视化',
    leetcodeQuestionId: '11',
    difficulty: 2,
    htmlFileUrl: '/solutions/container-water.html',
    coverImageUrl: null,
    viewCount: 1180,
    likeCount: 71,
    status: 1,
    tags: [mockTags[10], mockTags[0]],
    createTime: '2024-01-07 10:00:00',
  },
  {
    id: 8,
    title: '三数之和',
    description: '双指针+排序解法可视化',
    leetcodeQuestionId: '15',
    difficulty: 2,
    htmlFileUrl: '/solutions/3sum.html',
    coverImageUrl: null,
    viewCount: 1650,
    likeCount: 95,
    status: 1,
    tags: [mockTags[0], mockTags[5], mockTags[10]],
    createTime: '2024-01-08 10:00:00',
  },
  {
    id: 9,
    title: '有效的括号',
    description: '栈解法可视化',
    leetcodeQuestionId: '20',
    difficulty: 1,
    htmlFileUrl: '/solutions/valid-parentheses.html',
    coverImageUrl: null,
    viewCount: 1380,
    likeCount: 82,
    status: 1,
    tags: [mockTags[11], mockTags[1]],
    createTime: '2024-01-09 10:00:00',
  },
  {
    id: 10,
    title: '删除链表的倒数第 N 个结点',
    description: '双指针解法可视化',
    leetcodeQuestionId: '19',
    difficulty: 2,
    htmlFileUrl: '/solutions/remove-nth-node.html',
    coverImageUrl: null,
    viewCount: 950,
    likeCount: 58,
    status: 1,
    tags: [mockTags[14], mockTags[10]],
    createTime: '2024-01-10 10:00:00',
  },
];

// Mock API 实现
export const mockAdminApi = {
  // 标签管理
  getTags: async (params = {}) => {
    await delay(300);
    let list = [...mockTags];

    // 搜索筛选
    if (params.keyword) {
      list = list.filter(t => t.name.includes(params.keyword));
    }

    // 分页
    const page = params.page || 1;
    const size = params.size || 10;
    const start = (page - 1) * size;
    const end = start + size;

    return {
      code: 200,
      data: {
        records: list.slice(start, end),
        total: list.length,
        current: page,
        size,
      },
    };
  },

  getAllTags: async () => {
    await delay(200);
    return { code: 200, data: mockTags };
  },

  createTag: async (data) => {
    await delay(300);
    const newTag = {
      id: mockTags.length + 1,
      ...data,
      solutionCount: 0,
      createTime: new Date().toLocaleString('zh-CN'),
    };
    mockTags.push(newTag);
    return { code: 200, data: newTag };
  },

  updateTag: async (id, data) => {
    await delay(300);
    const index = mockTags.findIndex(t => t.id === Number(id));
    if (index !== -1) {
      mockTags[index] = { ...mockTags[index], ...data };
      return { code: 200, data: mockTags[index] };
    }
    return { code: 404, message: '标签不存在' };
  },

  deleteTag: async (id) => {
    await delay(300);
    const index = mockTags.findIndex(t => t.id === Number(id));
    if (index !== -1) {
      mockTags.splice(index, 1);
      return { code: 200 };
    }
    return { code: 404, message: '标签不存在' };
  },

  // 题解管理
  getSolutions: async (params = {}) => {
    await delay(300);
    let list = [...mockSolutions];

    // 搜索筛选
    if (params.keyword) {
      list = list.filter(s => s.title.includes(params.keyword));
    }

    // 难度筛选
    if (params.difficulty) {
      list = list.filter(s => s.difficulty === Number(params.difficulty));
    }

    // 状态筛选
    if (params.status !== undefined && params.status !== '') {
      list = list.filter(s => s.status === Number(params.status));
    }

    // 分页
    const page = params.page || 1;
    const size = params.size || 10;
    const start = (page - 1) * size;
    const end = start + size;

    return {
      code: 200,
      data: {
        records: list.slice(start, end),
        total: list.length,
        current: page,
        size,
      },
    };
  },

  getSolutionById: async (id) => {
    await delay(200);
    const solution = mockSolutions.find(s => s.id === Number(id));
    if (solution) {
      return { code: 200, data: solution };
    }
    return { code: 404, message: '题解不存在' };
  },

  createSolution: async (data) => {
    await delay(300);
    const newSolution = {
      id: mockSolutions.length + 1,
      ...data,
      viewCount: 0,
      likeCount: 0,
      createTime: new Date().toLocaleString('zh-CN'),
    };
    mockSolutions.push(newSolution);
    return { code: 200, data: newSolution };
  },

  updateSolution: async (id, data) => {
    await delay(300);
    const index = mockSolutions.findIndex(s => s.id === Number(id));
    if (index !== -1) {
      mockSolutions[index] = { ...mockSolutions[index], ...data };
      return { code: 200, data: mockSolutions[index] };
    }
    return { code: 404, message: '题解不存在' };
  },

  deleteSolution: async (id) => {
    await delay(300);
    const index = mockSolutions.findIndex(s => s.id === Number(id));
    if (index !== -1) {
      mockSolutions.splice(index, 1);
      return { code: 200 };
    }
    return { code: 404, message: '题解不存在' };
  },

  // 登录
  login: async (username, password) => {
    await delay(500);
    if (username && password) {
      return {
        code: 200,
        data: {
          token: 'mock-admin-token-' + Date.now(),
          username,
        },
      };
    }
    return { code: 401, message: '用户名或密码错误' };
  },
};

// Mock 数据
export const MOCK_MODE = true;

// 模拟延迟
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Mock 标签数据
export const mockTags = [
  { id: 1, name: '数组', color: '#1890ff' },
  { id: 2, name: '字符串', color: '#52c41a' },
  { id: 3, name: '链表', color: '#722ed1' },
  { id: 4, name: '二叉树', color: '#fa8c16' },
  { id: 5, name: '动态规划', color: '#eb2f96' },
  { id: 6, name: '回溯', color: '#13c2c2' },
  { id: 7, name: '贪心', color: '#2f54eb' },
  { id: 8, name: '排序', color: '#a0d911' },
];

// Mock 题解数据
export const mockSolutions = [
  {
    id: 1,
    title: '两数之和',
    description: '暴力解法和哈希表解法可视化演示',
    leetcodeQuestionId: '1',
    difficulty: 1,
    viewCount: 1520,
    likeCount: 89,
    status: 1,
    tags: [mockTags[0]],
    coverImageUrl: null,
    htmlFileUrl: 'https://algorithm-visualizer.org/brute-force/two-sum',
  },
  {
    id: 2,
    title: '两数相加',
    description: '链表反转与合并可视化',
    leetcodeQuestionId: '2',
    difficulty: 2,
    viewCount: 980,
    likeCount: 56,
    status: 1,
    tags: [mockTags[2]],
    coverImageUrl: null,
    htmlFileUrl: 'https://algorithm-visualizer.org/brute-force/add-two-numbers',
  },
  {
    id: 3,
    title: '无重复字符的最长子串',
    description: '滑动窗口算法可视化演示',
    leetcodeQuestionId: '3',
    difficulty: 2,
    viewCount: 2340,
    likeCount: 156,
    status: 1,
    tags: [mockTags[1], mockTags[6]],
    coverImageUrl: null,
    htmlFileUrl: 'https://algorithm-visualizer.org/brute-force/longest-substring',
  },
  {
    id: 4,
    title: '寻找两个正序数组的中位数',
    description: '二分查找算法可视化',
    leetcodeQuestionId: '4',
    difficulty: 3,
    viewCount: 780,
    likeCount: 45,
    status: 1,
    tags: [mockTags[0], mockTags[4]],
    coverImageUrl: null,
    htmlFileUrl: 'https://algorithm-visualizer.org/divide-and-conquer/median-of-two-sorted-arrays',
  },
  {
    id: 5,
    title: '最长回文子串',
    description: '中心扩展与动态规划解法',
    leetcodeQuestionId: '5',
    difficulty: 2,
    viewCount: 1120,
    likeCount: 78,
    status: 1,
    tags: [mockTags[1], mockTags[4]],
    coverImageUrl: null,
    htmlFileUrl: 'https://algorithm-visualizer.org/brute-force/longest-palindromic-substring',
  },
  {
    id: 6,
    title: 'Z 字形变换',
    description: '按行访问算法可视化',
    leetcodeQuestionId: '6',
    difficulty: 2,
    viewCount: 650,
    likeCount: 32,
    status: 1,
    tags: [mockTags[1]],
    coverImageUrl: null,
    htmlFileUrl: null,
  },
  {
    id: 7,
    title: '反转链表',
    description: '迭代与递归解法可视化',
    leetcodeQuestionId: '206',
    difficulty: 1,
    viewCount: 1890,
    likeCount: 123,
    status: 1,
    tags: [mockTags[2]],
    coverImageUrl: null,
    htmlFileUrl: 'https://algorithm-visualizer.org/brute-force/reverse-linked-list',
  },
  {
    id: 8,
    title: '合并两个有序链表',
    description: '归并排序思想可视化',
    leetcodeQuestionId: '21',
    difficulty: 1,
    viewCount: 1450,
    likeCount: 89,
    status: 1,
    tags: [mockTags[2], mockTags[0]],
    coverImageUrl: null,
    htmlFileUrl: 'https://algorithm-visualizer.org/branch-and-bound/merge-two-sorted-lists',
  },
  {
    id: 9,
    title: '二叉树的最大深度',
    description: 'DFS 与 BFS 可视化对比',
    leetcodeQuestionId: '104',
    difficulty: 1,
    viewCount: 980,
    likeCount: 67,
    status: 1,
    tags: [mockTags[3]],
    coverImageUrl: null,
    htmlFileUrl: 'https://algorithm-visualizer.org/brute-force/maximum-depth-of-binary-tree',
  },
  {
    id: 10,
    title: '验证二叉搜索树',
    description: '中序遍历验证 BST',
    leetcodeQuestionId: '98',
    difficulty: 2,
    viewCount: 760,
    likeCount: 45,
    status: 1,
    tags: [mockTags[3]],
    coverImageUrl: null,
    htmlFileUrl: null,
  },
  {
    id: 11,
    title: '买卖股票的最佳时机',
    description: '动态规划与贪心算法',
    leetcodeQuestionId: '121',
    difficulty: 1,
    viewCount: 2100,
    likeCount: 145,
    status: 1,
    tags: [mockTags[4], mockTags[6]],
    coverImageUrl: null,
    htmlFileUrl: 'https://algorithm-visualizer.org/dynamic-programming/best-time-to-buy-and-sell-stock',
  },
  {
    id: 12,
    title: '全排列',
    description: '回溯算法可视化',
    leetcodeQuestionId: '46',
    difficulty: 2,
    viewCount: 1340,
    likeCount: 98,
    status: 1,
    tags: [mockTags[5]],
    coverImageUrl: null,
    htmlFileUrl: 'https://algorithm-visualizer.org/backtracking/permutations',
  },
];

// Mock API 实现
export const mockApi = {
  // 题解列表
  getSolutions: async (params = {}) => {
    await delay(300);
    let list = [...mockSolutions];

    // 标签筛选
    if (params.tagId) {
      const tagIds = params.tagId.split(',').map(Number);
      list = list.filter((s) => s.tags.some((t) => tagIds.includes(t.id)));
    }

    // 分页
    const page = params.page || 1;
    const size = params.size || 12;
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

  // 题解详情
  getSolutionById: async (id) => {
    await delay(200);
    const solution = mockSolutions.find((s) => s.id === Number(id));
    if (solution) {
      return { code: 200, data: solution };
    }
    return { code: 404, message: '题解不存在' };
  },

  // 创建题解
  createSolution: async (data) => {
    await delay(300);
    const newSolution = {
      id: mockSolutions.length + 1,
      ...data,
      viewCount: 0,
      likeCount: 0,
      status: 1,
      createdAt: new Date().toISOString(),
    };
    mockSolutions.push(newSolution);
    return { code: 200, data: newSolution };
  },

  // 更新题解
  updateSolution: async (id, data) => {
    await delay(300);
    const index = mockSolutions.findIndex((s) => s.id === Number(id));
    if (index !== -1) {
      mockSolutions[index] = { ...mockSolutions[index], ...data };
      return { code: 200, data: mockSolutions[index] };
    }
    return { code: 404, message: '题解不存在' };
  },

  // 删除题解
  deleteSolution: async (id) => {
    await delay(300);
    const index = mockSolutions.findIndex((s) => s.id === Number(id));
    if (index !== -1) {
      mockSolutions.splice(index, 1);
      return { code: 200 };
    }
    return { code: 404, message: '题解不存在' };
  },

  // 获取所有标签
  getTags: async () => {
    await delay(200);
    return { code: 200, data: mockTags };
  },

  // 创建标签
  createTag: async (data) => {
    await delay(300);
    const newTag = {
      id: mockTags.length + 1,
      ...data,
      createdAt: new Date().toISOString(),
    };
    mockTags.push(newTag);
    return { code: 200, data: newTag };
  },

  // 更新标签
  updateTag: async (id, data) => {
    await delay(300);
    const index = mockTags.findIndex((t) => t.id === Number(id));
    if (index !== -1) {
      mockTags[index] = { ...mockTags[index], ...data };
      return { code: 200, data: mockTags[index] };
    }
    return { code: 404, message: '标签不存在' };
  },

  // 删除标签
  deleteTag: async (id) => {
    await delay(300);
    const index = mockTags.findIndex((t) => t.id === Number(id));
    if (index !== -1) {
      mockTags.splice(index, 1);
      return { code: 200 };
    }
    return { code: 404, message: '标签不存在' };
  },

  // 登录
  login: async (username, password) => {
    await delay(500);
    if (username && password) {
      return {
        code: 200,
        data: {
          token: 'mock-token-' + Date.now(),
          username,
        },
      };
    }
    return { code: 401, message: '用户名或密码错误' };
  },

  // 文件上传（模拟）
  uploadFile: async () => {
    await delay(500);
    return {
      code: 200,
      data: '/uploads/mock-' + Date.now() + '.html',
    };
  },
};

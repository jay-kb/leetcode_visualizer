import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Tag, Pagination, Empty, Spin, Popover, Row, Col, Input, Button, Modal, message } from 'antd';
import { EyeOutlined, CodeOutlined, FireOutlined, BookOutlined, ThunderboltOutlined, LinkOutlined, SearchOutlined, GithubOutlined, MailOutlined } from '@ant-design/icons';
import { solutionApi, tagApi } from '../api';
import HotSolutions from '../components/HotSolutions';
import TodayNewSolutions from '../components/TodayNewSolutions';

// 封面背景渐变配置
const coverGradients = [
  'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
  'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
  'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
  'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
  'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
];

const Home = () => {
  const [solutions, setSolutions] = useState([]);
  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [searchQuestionId, setSearchQuestionId] = useState('');
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 9,
    total: 0,
  });

  // 防抖定时器 ref
  const searchDebounceRef = useRef(null);

  // 加载标签列表
  useEffect(() => {
    loadTags();
  }, []);

  // 组件卸载时清除防抖定时器
  useEffect(() => {
    return () => {
      if (searchDebounceRef.current) {
        clearTimeout(searchDebounceRef.current);
      }
    };
  }, []);

  // 加载题解列表（初始加载和分页/标签变化时）
  useEffect(() => {
    loadSolutions(searchQuestionId);
  }, [pagination.current, selectedTags]);

  const loadTags = async () => {
    try {
      const res = await tagApi.getAll();
      setTags(res.data || res || []);
    } catch (error) {
      console.error('加载标签失败:', error);
    }
  };

  const loadSolutions = async (questionId) => {
    setLoading(true);
    try {
      const params = {
        page: pagination.current,
        size: pagination.pageSize,
        tagId: selectedTags.join(','),
        questionId: questionId || undefined,
      };
      console.log('搜索参数:', params); // 调试日志
      const res = await solutionApi.getList(params);
      const records = res.records || res.data?.records || res.data || [];
      const total = res.total || res.data?.total || records.length || 0;
      setSolutions(records);
      setPagination((prev) => ({ ...prev, total }));
    } catch (error) {
      console.error('加载题解失败:', error);
      setSolutions([]);
    } finally {
      setLoading(false);
    }
  };

  // 搜索验证
  const validateQuestionId = (value) => {
    if (!value) {
      return { valid: true, value: '' };
    }
    // 限制只能输入数字
    const numValue = value.replace(/\D/g, '');
    if (value !== numValue) {
      Modal.warning({
        title: '输入提示',
        content: '题号仅支持输入数字',
        okText: '知道了',
      });
      return { valid: false, value: numValue };
    }
    // 验证范围
    const num = parseInt(numValue, 10);
    if (numValue && (num <= 0 || num >= 10000)) {
      Modal.warning({
        title: '输入提示',
        content: '题号需大于0且小于10000',
        okText: '知道了',
      });
      return { valid: false, value: '' };
    }
    return { valid: true, value: numValue };
  };

  // 执行搜索
  const executeSearch = (questionId) => {
    loadSolutions(questionId);
    setPagination((prev) => ({ ...prev, current: 1 }));
  };

  // 搜索框输入处理（带防抖）
  const handleSearchChange = (e) => {
    const rawValue = e.target.value;

    // 清除之前的定时器
    if (searchDebounceRef.current) {
      clearTimeout(searchDebounceRef.current);
    }

    // 验证输入
    const { valid, value } = validateQuestionId(rawValue);
    setSearchQuestionId(value);

    if (!valid) {
      return;
    }

    // 防抖：500ms 后自动搜索
    if (value) {
      searchDebounceRef.current = setTimeout(() => {
        executeSearch(value);
      }, 500);
    } else {
      // 空值时立即搜索
      executeSearch('');
    }
  };

  // 手动搜索按钮
  const handleSearch = () => {
    const { valid, value } = validateQuestionId(searchQuestionId);
    if (valid) {
      // 清除防抖定时器
      if (searchDebounceRef.current) {
        clearTimeout(searchDebounceRef.current);
      }
      executeSearch(searchQuestionId);
    }
  };

  const handleTagClick = (tagId) => {
    setSelectedTags((prev) =>
      prev.includes(tagId)
        ? prev.filter((id) => id !== tagId)
        : [...prev, tagId]
    );
    setPagination((prev) => ({ ...prev, current: 1 }));
  };

  const handlePageChange = (page) => {
    setPagination((prev) => ({ ...prev, current: page }));
  };

  const getDifficultyInfo = (difficulty) => {
    const map = {
      1: { text: '简单', color: '#52c41a', bg: '#f6ffed' },
      2: { text: '中等', color: '#fa8c16', bg: '#fff7e6' },
      3: { text: '困难', color: '#f5222d', bg: '#fff1f0' },
    };
    return map[difficulty] || map[1];
  };

  // 根据 ID 获取渐变背景
  const getCoverGradient = (id) => {
    return coverGradients[id % coverGradients.length];
  };

  return (
    <div className="home-page">
      <Helmet>
        <title>LeetCode 题解可视化 - 算法学习平台</title>
        <meta name="description" content="通过交互式可视化深入理解 LeetCode 算法执行过程，轻松掌握数据结构与算法，提供热门题解、标签筛选、题号搜索等功能" />
        <meta name="keywords" content="LeetCode,算法,题解,可视化,数据结构,算法学习,面试,编程" />
        <link rel="canonical" href={window.location.origin + '/'} />
        <meta property="og:title" content="LeetCode 题解可视化 - 算法学习平台" />
        <meta property="og:description" content="通过交互式可视化深入理解算法执行过程" />
        <meta property="og:type" content="website" />
      </Helmet>

      {/* 顶部导航 */}
      <header className="navbar">
        <div className="navbar-container">
          <Link to="/" className="navbar-logo">
            <ThunderboltOutlined className="logo-icon" style={{ color: '#6366f1' }} />
            题解可视化
          </Link>
          <nav className="navbar-menu">
            <Link to="/" className="menu-link active">
              <BookOutlined /> 首页
            </Link>
            {import.meta.env.VITE_GITHUB_URL && (
              <a
                href={import.meta.env.VITE_GITHUB_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="menu-link github-link"
                title="访问 GitHub 仓库"
              >
                <GithubOutlined />
              </a>
            )}
            {import.meta.env.VITE_CONTACT_EMAIL && (
              <a
                className="menu-link email-link"
                title={import.meta.env.VITE_CONTACT_EMAIL}
                onClick={() => {
                  const email = import.meta.env.VITE_CONTACT_EMAIL;
                  if (navigator.clipboard && window.isSecureContext) {
                    navigator.clipboard.writeText(email)
                      .then(() => message.success('邮箱已复制到剪贴板'))
                      .catch(() => message.error('复制失败，请手动复制'));
                  } else {
                    const textArea = document.createElement('textarea');
                    textArea.value = email;
                    textArea.style.position = 'fixed';
                    textArea.style.left = '-9999px';
                    document.body.appendChild(textArea);
                    textArea.select();
                    try {
                      document.execCommand('copy');
                      message.success('邮箱已复制到剪贴板');
                    } catch {
                      message.error('复制失败，请手动复制');
                    }
                    document.body.removeChild(textArea);
                  }
                }}
              >
                <MailOutlined />
              </a>
            )}
          </nav>
        </div>
      </header>

      {/* 页面标题区 */}
      <div className="home-hero">
        <div className="hero-content">
          <h1 className="hero-title">LeetCode 题解算法可视化</h1>
        </div>
        <div className="hero-stats">
          <div className="hero-stat">
            <span className="stat-number">{pagination.total}</span>
            <span className="stat-label">题解</span>
          </div>
          <div className="hero-stat">
            <span className="stat-number">{tags.length}</span>
            <span className="stat-label">标签</span>
          </div>
        </div>
      </div>

      {/* 主要内容 */}
      <main className="main-content">
        <Row gutter={24}>
          {/* 左侧：题解列表 */}
          <Col xs={24} lg={16}>
            {/* 筛选栏 */}
            <div className="filter-bar">
              <div className="filter-left">
                <span className="filter-title">
                  <FireOutlined /> 热门题解
                </span>
              </div>
              <div className="filter-right">
                {/* 搜索框 */}
                <div className="search-box">
                  <Input
                    className="question-search-input"
                    placeholder="输入题号搜索..."
                    value={searchQuestionId}
                    onChange={handleSearchChange}
                    onPressEnter={handleSearch}
                    allowClear
                    onClear={() => {
                      setSearchQuestionId('');
                      executeSearch('');
                    }}
                  />
                  <Button
                    type="primary"
                    icon={<SearchOutlined />}
                    className="search-btn"
                    onClick={() => {
                      handleSearch();
                    }}
                  >
                    搜索
                  </Button>
                </div>
              </div>
              <div className="filter-tags">
                <Tag.CheckableTag
                  checked={selectedTags.length === 0}
                  onClick={() => setSelectedTags([])}
                  className="filter-tag-item"
                  style={{
                    color: selectedTags.length === 0 ? '#1890ff' : '#999',
                    fontWeight: selectedTags.length === 0 ? 600 : 400,
                  }}
                >
                  全部
                </Tag.CheckableTag>
                {tags.map((tag) => {
                  const isSelected = selectedTags.includes(tag.id);
                  return (
                    <Tag.CheckableTag
                      key={tag.id}
                      checked={isSelected}
                      onClick={() => handleTagClick(tag.id)}
                      className="filter-tag-item"
                      style={{
                        color: isSelected ? tag.color : '#999',
                        fontWeight: isSelected ? 600 : 400,
                      }}
                    >
                      {tag.name}
                    </Tag.CheckableTag>
                  );
                })}
              </div>
            </div>

            {/* 题解卡片列表 */}
            {loading ? (
              <div className="loading-container">
                <Spin size="large" />
              </div>
            ) : solutions.length > 0 ? (
              <>
                <div className="solution-grid">
                  {solutions.map((solution, index) => {
                    const difficultyInfo = getDifficultyInfo(solution.difficulty);
                    return (
                      <Link
                        to={`/solution/${solution.id}`}
                        key={solution.id}
                        className="solution-card"
                        style={{ animationDelay: `${index * 0.05}s` }}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <div
                          className="solution-card-cover"
                          style={{ background: getCoverGradient(solution.id) }}
                        >
                          <CodeOutlined className="cover-icon" />
                          <div className="cover-overlay">
                            <span className="question-number">#{solution.leetcodeQuestionId}</span>
                          </div>
                        </div>
                        <div className="solution-card-body">
                          <h3 className="solution-card-title">{solution.title}</h3>
                          <p className="solution-card-desc">{solution.description}</p>
                          <div className="solution-card-footer">
                            <div className="solution-card-tags">
                              <span
                                className="difficulty-badge"
                                style={{
                                  backgroundColor: difficultyInfo.bg,
                                  color: difficultyInfo.color
                                }}
                              >
                                {difficultyInfo.text}
                              </span>
                              {solution.tags && solution.tags.length > 0 ? (
                                solution.tags.length > 2 ? (
                                  <Popover
                                    content={
                                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, maxWidth: 200 }}>
                                        {solution.tags.map((tag) => (
                                          <Tag key={tag.id} color={tag.color} style={{ margin: 0 }}>
                                            {tag.name}
                                          </Tag>
                                        ))}
                                      </div>
                                    }
                                    title="全部标签"
                                    trigger="hover"
                                  >
                                    <Tag color={solution.tags[0]?.color} className="card-tag card-tag-more">
                                      +{solution.tags.length - 2} 更多
                                    </Tag>
                                  </Popover>
                                ) : (
                                  solution.tags.slice(0, 2).map((tag) => (
                                    <Tag key={tag.id} color={tag.color} className="card-tag">
                                      {tag.name}
                                    </Tag>
                                  ))
                                )
                              ) : null}
                            </div>
                          </div>
                          <div className="solution-card-stats">
                            <span className="view-count">
                              <EyeOutlined /> {solution.viewCount || 0}
                            </span>
                            {solution.leetcodeUrl && (
                              <a
                                href={solution.leetcodeUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="leetcode-link"
                                onClick={(e) => e.stopPropagation()}
                                title="跳转到 LeetCode"
                              >
                                <LinkOutlined /> LeetCode
                              </a>
                            )}
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>

                {/* 分页 */}
                {pagination.total > pagination.pageSize && (
                  <div className="pagination-wrapper">
                    <Pagination
                      current={pagination.current}
                      pageSize={pagination.pageSize}
                      total={pagination.total}
                      onChange={handlePageChange}
                      showSizeChanger={false}
                      size="default"
                    />
                  </div>
                )}
              </>
            ) : (
              <Empty description="暂无题解" className="empty-state-custom" />
            )}
          </Col>

          {/* 右侧：侧边栏（热门题解 + 今日新增） */}
          <Col xs={24} lg={8}>
            <div className="sidebar-group">
              <HotSolutions />
              <TodayNewSolutions />
            </div>
          </Col>
        </Row>
      </main>

      {/* 底部栏 */}
      <footer className="site-footer">
        <div className="footer-content">
          {import.meta.env.VITE_ICP_LICENSE && (
            <a
              href={`https://beian.miit.gov.cn/`}
              target="_blank"
              rel="noopener noreferrer"
              className="footer-icp"
            >
              {import.meta.env.VITE_ICP_LICENSE}
            </a>
          )}
          {import.meta.env.VITE_POLICE_LICENSE && (
            <a
              href={`https://www.beian.gov.cn/`}
              target="_blank"
              rel="noopener noreferrer"
              className="footer-police"
            >
              {import.meta.env.VITE_POLICE_LICENSE}
            </a>
          )}
        </div>
      </footer>
    </div>
  );
};

export default Home;

import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Spin, message, Button, Tag, Empty } from 'antd';
import { FileTextOutlined, SearchOutlined } from '@ant-design/icons';
import { ArrowLeftOutlined, FullscreenOutlined, HomeOutlined, BarChartOutlined, ThunderboltOutlined, EyeOutlined } from '@ant-design/icons';
import { solutionApi } from '../api';

const SolutionDetail = () => {
  const { id } = useParams();
  const [solution, setSolution] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    loadSolution();
  }, [id]);

  // 监听全屏状态变化
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const loadSolution = async () => {
    setLoading(true);
    try {
      const res = await solutionApi.getById(id);
      setSolution(res.data || res);
    } catch (error) {
      console.error('加载题解详情失败:', error);
      message.error('加载失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  // 切换全屏
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  // 全屏模式：只显示 iframe
  if (isFullscreen && solution?.htmlFileUrl) {
    return (
      <div className="fullscreen-viewer">
        <iframe
          className="fullscreen-iframe"
          src={solution.htmlFileUrl}
          title={solution.title}
          sandbox="allow-scripts allow-same-origin"
        />
        <button className="exit-fullscreen-btn" onClick={toggleFullscreen}>
          <ArrowLeftOutlined /> 退出全屏
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="detail-page-loading">
        <div className="loading-spinner">
          <Spin size="large" />
          <p>加载中...</p>
        </div>
      </div>
    );
  }

  if (!solution) {
    return (
      <div className="detail-page">
        <div className="empty-state glass-card" style={{ margin: '40px auto', maxWidth: 400, padding: 40 }}>
          <SearchOutlined className="empty-state-icon" style={{ fontSize: 48, color: '#6366f1' }} />
          <p style={{ marginTop: 16, fontSize: 16 }}>题解不存在</p>
          <Link to="/">
            <Button type="primary" size="large">
              返回首页
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="detail-page" ref={containerRef}>
      {/* 顶部导航 */}
      <header className="navbar">
        <div className="navbar-container">
          <Link to="/" className="navbar-logo">
            <ThunderboltOutlined className="logo-icon" style={{ color: '#6366f1' }} />
            题解可视化
          </Link>
          <nav className="navbar-menu">
            <Link to="/" className="menu-link">
              <HomeOutlined /> 首页
            </Link>
            <a href={`${import.meta.env.VITE_ADMIN_URL || 'http://localhost:8083'}/login`} className="menu-link">
              <BarChartOutlined /> 管理后台
            </a>
          </nav>
        </div>
      </header>

      {/* 主要内容 */}
      <main className="main-content">
        {/* 面包屑导航 */}
        <div className="detail-breadcrumb">
          <Link to="/">首页</Link>
          <span className="breadcrumb-separator">/</span>
          <span className="breadcrumb-current">{solution.title}</span>
        </div>

        {/* 详情头部卡片 */}
        <div className="detail-header-card">
          <div className="detail-header-content">
            <div className="detail-header-left">
              <div className="detail-title-row">
                <h1 className="detail-title">{solution.title}</h1>
                {solution.leetcodeQuestionId && (
                  <span className="question-id-tag">#{solution.leetcodeQuestionId}</span>
                )}
              </div>
              <p className="detail-description">{solution.description}</p>
              <div className="detail-meta-row">
                <span
                  className="difficulty-badge"
                  style={{
                    backgroundColor:
                      solution.difficulty === 1 ? '#52c41a' : solution.difficulty === 2 ? '#fa8c16' : '#f5222d'
                  }}
                >
                  {solution.difficulty === 1 ? '简单' : solution.difficulty === 2 ? '中等' : '困难'}
                </span>
                <div className="detail-tags">
                  {solution.tags?.map((tag) => (
                    <Tag
                      key={tag.id}
                      color={tag.color}
                      className="detail-tag"
                      style={{ borderRadius: '15px' }}
                    >
                      {tag.name}
                    </Tag>
                  ))}
                </div>
              </div>
            </div>
            <div className="detail-header-right">
              <div className="detail-stats">
                <span className="stat-item"><EyeOutlined /> {solution.viewCount || 0} 次浏览</span>
              </div>
              <div className="detail-actions">
                <Link to="/">
                  <Button icon={<ArrowLeftOutlined />} className="btn-back">
                    返回列表
                  </Button>
                </Link>
                {solution.leetcodeUrl && (
                  <a
                    href={solution.leetcodeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-leetcode"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 3.6c4.638 0 8.4 3.762 8.4 8.4s-3.762 8.4-8.4 8.4-8.4-3.762-8.4-8.4S7.362 3.6 12 3.6zm-1.2 3.6v8.4l6-4.2-6-4.2z"/>
                    </svg>
                    LeetCode
                  </a>
                )}
                {solution.htmlFileUrl && (
                  <Button type="primary" icon={<FullscreenOutlined />} className="btn-fullscreen" onClick={toggleFullscreen}>
                    全屏查看
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 可视化内容 */}
        <div className="detail-content-card">
          {solution.htmlFileUrl ? (
            <iframe
              className="detail-iframe"
              src={solution.htmlFileUrl}
              title={solution.title}
              sandbox="allow-scripts allow-same-origin"
            />
          ) : (
            <div className="empty-visualization">
              <FileTextOutlined style={{ fontSize: 72, color: '#94a3b8' }} />
              <p>暂无可视化内容</p>
              <Link to="/">
                <Button type="primary">返回首页</Button>
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default SolutionDetail;

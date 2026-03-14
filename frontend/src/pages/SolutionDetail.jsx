import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Spin, message, Button, Tag, Empty, Collapse } from 'antd';
import { FileTextOutlined, SearchOutlined, RightOutlined, LinkOutlined, BookOutlined, BulbOutlined, ReadOutlined, GithubOutlined } from '@ant-design/icons';
import { ArrowLeftOutlined, FullscreenOutlined, HomeOutlined, ThunderboltOutlined, EyeOutlined, MenuFoldOutlined, MenuUnfoldOutlined, MailOutlined } from '@ant-design/icons';
import { solutionApi } from '../api';

// 模拟数据
const mockSolution = {
  id: 1,
  title: '两数之和',
  leetcodeQuestionId: 1,
  description: '给定一个整数数组 nums 和一个目标值 target，请你在该数组中找出和为目标值 target 的那两个整数，并返回它们的数组下标。',
  difficulty: 1,
  viewCount: 1234,
  leetcodeUrl: 'https://leetcode.cn/problems/two-sum/',
  htmlFileUrl: '/solutions/1-two-sum.html',
  tags: [
    { id: 1, name: '数组', color: '#1890ff' },
    { id: 2, name: '哈希表', color: '#52c41a' }
  ],
  // 新增字段
  points: '哈希表, 数组遍历, 时间复杂度优化',
  solutionThoughts: `## 解题思路

### 方法一：暴力枚举
遍历数组，对每个元素 x，查找 target - x 是否存在。
- 时间复杂度：O(n²)
- 空间复杂度：O(1)

### 方法二：哈希表
使用 HashMap 存储已遍历的元素和其索引。
- 时间复杂度：O(n)
- 空间复杂度：O(n)

**推荐使用方法二**`,
  referenceLinks: [
    { title: '代码随想录 - 两数之和', url: 'https://programmercarl.com/0001.%E4%B8%A4%E6%95%B0%E4%B9%8B%E5%92%8C.html', type: 'article' },
    { title: '官方题解', url: 'https://leetcode.cn/problems/two-sum/solution/liang-shu-zhi-he-by-leetcode-solution/', type: 'article' },
    { title: 'B站讲解视频', url: 'https://www.bilibili.com/video/BV1Xu411J7Lz', type: 'video' }
  ]
};

const SolutionDetail = () => {
  const { id } = useParams();
  const [solution, setSolution] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPanelCollapsed, setIsPanelCollapsed] = useState(false);
  const containerRef = useRef(null);
  const [useMockData, setUseMockData] = useState(false); // 默认使用真实 API 数据

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

  // 监听来自 iframe 的 postMessage 消息（用于转发键盘事件）
  useEffect(() => {
    const handleMessage = (event) => {
      // 验证消息来源并处理键盘事件
      if (event.data && event.data.type === 'iframe-keydown') {
        const key = event.data.key;
        if (key === 'x' || key === 'X') {
          setIsPanelCollapsed(prev => !prev);
        }
      }
    };
    window.addEventListener('message', handleMessage);
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  // 监听键盘快捷键 - 使用 capture 阶段捕获，确保 iframe 内部也能响应
  useEffect(() => {
    const handleKeyDown = (e) => {
      // 按 x 键切换左侧面板（排除输入框）
      if (e.key === 'x' || e.key === 'X') {
        const target = e.target;
        if (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA' && !target.isContentEditable) {
          e.preventDefault();
          e.stopPropagation();
          setIsPanelCollapsed(prev => !prev);
        }
      }
    };
    // 使用 window 添加监听，配合 capture 确保全局捕获
    window.addEventListener('keydown', handleKeyDown, true);
    return () => {
      window.removeEventListener('keydown', handleKeyDown, true);
    };
  }, []);

  const loadSolution = async () => {
    setLoading(true);
    setLoadError(false);
    try {
      if (useMockData) {
        // 使用模拟数据
        setTimeout(() => {
          setSolution(mockSolution);
          setLoading(false);
        }, 500);
      } else {
        const res = await solutionApi.getById(id);
        const data = res.data || res;
        // 解析 referenceLinks JSON 字符串
        if (data.referenceLinks && typeof data.referenceLinks === 'string') {
          try {
            data.referenceLinks = JSON.parse(data.referenceLinks);
          } catch (e) {
            data.referenceLinks = [];
          }
        }
        setSolution(data);
        setLoading(false);
      }
    } catch (error) {
      console.error('加载题解详情失败:', error);
      setLoadError(true);
      setLoading(false);
      message.error('加载失败，请稍后重试');
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

  // loading 状态优先显示
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

  // 加载失败或数据不存在
  if (!solution) {
    return (
      <div className="detail-page">
        <div className="empty-state glass-card" style={{ margin: '40px auto', maxWidth: 400, padding: 40 }}>
          <SearchOutlined className="empty-state-icon" style={{ fontSize: 48, color: '#6366f1' }} />
          <p style={{ marginTop: 16, fontSize: 16 }}>{loadError ? '加载失败' : '题解不存在'}</p>
          <Link to="/">
            <Button type="primary" size="large">
              返回首页
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // 切换面板折叠状态
  const togglePanel = () => {
    setIsPanelCollapsed(!isPanelCollapsed);
  };

  // 渲染 Markdown 简易版本（标题和列表）
  const renderMarkdown = (text) => {
    if (!text) return null;
    const lines = text.split('\n');
    return lines.map((line, index) => {
      const trimmed = line.trim();
      if (trimmed.startsWith('## ')) {
        return <h4 key={index} style={{ margin: '12px 0 8px', color: '#1f2937', fontWeight: 600 }}>{trimmed.replace('## ', '')}</h4>;
      }
      if (trimmed.startsWith('### ')) {
        return <h5 key={index} style={{ margin: '10px 0 6px', color: '#374151', fontWeight: 500 }}>{trimmed.replace('### ', '')}</h5>;
      }
      if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        return <li key={index} style={{ marginLeft: 16, marginBottom: 4, color: '#4b5563' }}>{trimmed.substring(2)}</li>;
      }
      if (trimmed.match(/^\d+\. /)) {
        return <li key={index} style={{ marginLeft: 16, marginBottom: 4, color: '#4b5563' }}>{trimmed.replace(/^\d+\. /, '')}</li>;
      }
      if (trimmed.startsWith('**') && trimmed.endsWith('**')) {
        return <p key={index} style={{ margin: '8px 0', fontWeight: 600, color: '#1f2937' }}>{trimmed.replace(/\*\*/g, '')}</p>;
      }
      if (trimmed === '') {
        return <br key={index} />;
      }
      return <p key={index} style={{ margin: '4px 0', color: '#4b5563' }}>{trimmed}</p>;
    });
  };

  // Collapse items
  const collapseItems = [
    {
      key: 'description',
      label: (
        <span style={{ fontWeight: 600, fontSize: 14 }}>
          <ReadOutlined style={{ marginRight: 8 }} />
          题目描述
        </span>
      ),
      children: <p style={{ color: '#4b5563', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>{solution.description}</p>
    },
    {
      key: 'points',
      label: (
        <span style={{ fontWeight: 600, fontSize: 14 }}>
          <BookOutlined style={{ marginRight: 8 }} />
          考察的问题点
        </span>
      ),
      children: solution.points ? (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {solution.points.split(',').map((point, idx) => (
            <Tag key={idx} color="blue" style={{ borderRadius: 12 }}>{point.trim()}</Tag>
          ))}
        </div>
      ) : <p style={{ color: '#9ca3af' }}>暂无</p>
    },
    {
      key: 'thoughts',
      label: (
        <span style={{ fontWeight: 600, fontSize: 14 }}>
          <BulbOutlined style={{ marginRight: 8 }} />
          解题思路
        </span>
      ),
      children: solution.solutionThoughts ? (
        <div style={{ fontSize: 13, lineHeight: 1.6 }}>{renderMarkdown(solution.solutionThoughts)}</div>
      ) : <p style={{ color: '#9ca3af' }}>暂无</p>
    },
    {
      key: 'links',
      label: (
        <span style={{ fontWeight: 600, fontSize: 14 }}>
          <LinkOutlined style={{ marginRight: 8 }} />
          相关链接
        </span>
      ),
      children: solution.referenceLinks && solution.referenceLinks.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {solution.referenceLinks.map((link, idx) => (
            <a
              key={idx}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                color: '#6366f1',
                textDecoration: 'none',
                padding: '6px 10px',
                borderRadius: 6,
                background: '#f0f5ff',
                transition: 'all 0.2s'
              }}
            >
              <LinkOutlined />
              <span style={{ flex: 1 }}>{link.title}</span>
              <span style={{ fontSize: 11, color: '#9ca3af' }}>
                {link.type === 'video' ? '视频' : '文章'}
              </span>
            </a>
          ))}
        </div>
      ) : <p style={{ color: '#9ca3af' }}>暂无</p>
    }
  ];

  // 处理容器键盘事件
  const handleContainerKeyDown = (e) => {
    if (e.key === 'x' || e.key === 'X') {
      e.preventDefault();
      setIsPanelCollapsed(prev => !prev);
    }
  };

  return (
    <div
      className="detail-page"
      ref={containerRef}
      tabIndex={-1}
      onKeyDown={handleContainerKeyDown}
    >
      {/* 顶部导航 */}
      <header className="navbar">
        <div className="navbar-container">
          <Link to="/" className="navbar-logo">
            <ThunderboltOutlined className="logo-icon" style={{ color: '#6366f1' }} />
            题解可视化
          </Link>
          <nav className="navbar-menu">
            <Link to="/" className="menu-link">
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
                    } catch (err) {
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

      {/* 主要内容 - 左右分栏 */}
      <main className="main-content detail-split-layout">
        {/* 标题栏 */}
        <div className="detail-title-bar">
          <div className="title-bar-left">
            <h1 className="detail-title">{solution.title}</h1>
            {solution.leetcodeQuestionId && (
              <span className="question-id-tag">#{solution.leetcodeQuestionId}</span>
            )}
            <span
              className="difficulty-badge"
              style={{
                backgroundColor:
                  solution.difficulty === 1 ? '#52c41a' : solution.difficulty === 2 ? '#fa8c16' : '#f5222d'
              }}
            >
              {solution.difficulty === 1 ? '简单' : solution.difficulty === 2 ? '中等' : '困难'}
            </span>
          </div>
          <div className="title-bar-right">
            <span className="view-count"><EyeOutlined /> {solution.viewCount || 0}</span>
            {solution.leetcodeUrl && (
              <a
                href={solution.leetcodeUrl.startsWith('http') ? solution.leetcodeUrl : `https://${solution.leetcodeUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="detail-action-btn btn-leetcode"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 3.6c4.638 0 8.4 3.762 8.4 8.4s-3.762 8.4-8.4 8.4-8.4-3.762-8.4-8.4S7.362 3.6 12 3.6zm-1.2 3.6v8.4l6-4.2-6-4.2z"/>
                </svg>
                LeetCode
              </a>
            )}
            {solution.htmlFileUrl && (
              <button className="detail-action-btn btn-fullscreen" onClick={toggleFullscreen}>
                <FullscreenOutlined />
                全屏查看
              </button>
            )}
          </div>
        </div>

        {/* 分栏容器 */}
        <div className="detail-split-container">
          {/* 左侧信息面板 */}
          <aside className={`detail-info-panel ${isPanelCollapsed ? 'collapsed' : ''}`}>
            <div className="panel-header">
              <span className="panel-title">题解信息</span>
            </div>
            <div className="panel-content">
              <Collapse
                defaultActiveKey={['description']}
                ghost
                items={collapseItems}
              />
            </div>
            <div className="panel-footer">
              <Button
                type="text"
                icon={<MenuFoldOutlined />}
                onClick={togglePanel}
                block
                className="collapse-btn"
              >
                收起信息面板 (X)
              </Button>
            </div>
          </aside>

          {/* 折叠后的展开按钮 */}
          {isPanelCollapsed && (
            <div className="expand-panel-btn" onClick={togglePanel}>
              <MenuUnfoldOutlined />
              <span>展开详情 (X)</span>
            </div>
          )}

          {/* 右侧可视化区域 */}
          <div className="detail-visualization" onKeyDown={(e) => {
            if (e.key === 'x' || e.key === 'X') {
              e.preventDefault();
              setIsPanelCollapsed(prev => !prev);
            }
          }} tabIndex={-1}>
            {solution.htmlFileUrl ? (
              <>
                <iframe
                  className="detail-iframe"
                  src={solution.htmlFileUrl}
                  title={solution.title}
                  sandbox="allow-scripts allow-same-origin"
                  ref={(iframe) => {
                    if (iframe) {
                      iframe.onload = () => {
                        try {
                          // 向 iframe 注入键盘事件转发脚本
                          const script = `
                            document.addEventListener('keydown', function(e) {
                              window.parent.postMessage({
                                type: 'iframe-keydown',
                                key: e.key,
                                ctrlKey: e.ctrlKey,
                                altKey: e.altKey,
                                metaKey: e.metaKey
                              }, '*');
                            }, true);
                          `;
                          const doc = iframe.contentDocument || iframe.contentWindow.document;
                          const scriptEl = doc.createElement('script');
                          scriptEl.textContent = script;
                          doc.head.appendChild(scriptEl);
                        } catch (e) {
                          // 跨域限制无法注入脚本
                          console.log('无法注入脚本:', e);
                        }
                      };
                    }
                  }}
                />
              </>
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
        </div>
      </main>
    </div>
  );
};

export default SolutionDetail;

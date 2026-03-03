import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Spin } from 'antd';
import { CalendarOutlined } from '@ant-design/icons';
import { solutionApi } from '../api';

const TodayNewSolutions = () => {
  const [solutions, setSolutions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTodayNewSolutions();
  }, []);

  const loadTodayNewSolutions = async () => {
    try {
      const res = await solutionApi.getTodayNew(10);
      const data = res.data || res || [];
      setSolutions(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('加载今日新增题解失败:', error);
      setSolutions([]);
    } finally {
      setLoading(false);
    }
  };

  const getDifficultyInfo = (difficulty) => {
    const map = {
      1: { text: '简单', color: '#52c41a', bg: '#f6ffed', borderColor: '#b7eb8f' },
      2: { text: '中等', color: '#fa8c16', bg: '#fff7e6', borderColor: '#ffd591' },
      3: { text: '困难', color: '#f5222d', bg: '#fff1f0', borderColor: '#ffa39e' },
    };
    return map[difficulty] || map[1];
  };

  // 格式化相对时间
  const formatRelativeTime = (createTime) => {
    if (!createTime) return '';

    const now = new Date();
    const createDate = new Date(createTime);
    const diffMs = now - createDate;
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMinutes < 1) {
      return '刚刚';
    } else if (diffMinutes < 60) {
      return `${diffMinutes}分钟前`;
    } else if (diffHours < 24) {
      return `${diffHours}小时前`;
    } else {
      return `${diffDays}天前`;
    }
  };

  if (loading) {
    return (
      <div className="today-new-solutions">
        <div className="today-new-solutions-header">
          <CalendarOutlined className="today-new-icon" />
          <span>最近新增</span>
        </div>
        <div className="today-new-solutions-loading">
          <Spin size="small" />
        </div>
      </div>
    );
  }

  if (solutions.length === 0) {
    return null;
  }

  return (
    <div className="today-new-solutions">
      <div className="today-new-solutions-header">
        <CalendarOutlined className="today-new-icon" />
        <span>最近新增</span>
      </div>
      <div className="today-new-solutions-list">
        {solutions.map((solution) => {
          const difficultyInfo = getDifficultyInfo(solution.difficulty);
          return (
            <Link
              to={`/solution/${solution.id}`}
              key={solution.id}
              className="today-new-solutions-item"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="today-new-solutions-content">
                <div className="today-new-solutions-title">
                  <span className="today-new-solutions-qid">#{solution.leetcodeQuestionId}</span>
                  <span className="today-new-solutions-name">{solution.title}</span>
                </div>
                <div className="today-new-solutions-meta">
                  <span
                    className="today-new-solutions-difficulty"
                    style={{
                      color: difficultyInfo.color,
                      backgroundColor: difficultyInfo.bg,
                      borderColor: difficultyInfo.borderColor,
                    }}
                  >
                    {difficultyInfo.text}
                  </span>
                  <span className="today-new-solutions-time">
                    {formatRelativeTime(solution.createTime)}
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default TodayNewSolutions;

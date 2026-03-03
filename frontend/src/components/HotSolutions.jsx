import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Spin } from 'antd';
import { FireOutlined, EyeOutlined } from '@ant-design/icons';
import { solutionApi } from '../api';

const HotSolutions = () => {
  const [solutions, setSolutions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHotSolutions();
  }, []);

  const loadHotSolutions = async () => {
    try {
      const res = await solutionApi.getHot(10);
      const data = res.data || res || [];
      setSolutions(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('加载热门题解失败:', error);
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

  const formatViewCount = (count) => {
    if (count >= 1000) {
      return (count / 1000).toFixed(1) + 'k';
    }
    return count;
  };

  if (loading) {
    return (
      <div className="hot-solutions">
        <div className="hot-solutions-header">
          <FireOutlined className="hot-icon" />
          <span>热门题解</span>
        </div>
        <div className="hot-solutions-loading">
          <Spin size="small" />
        </div>
      </div>
    );
  }

  if (solutions.length === 0) {
    return null;
  }

  return (
    <div className="hot-solutions">
      <div className="hot-solutions-header">
        <FireOutlined className="hot-icon" />
        <span>热门题解</span>
      </div>
      <div className="hot-solutions-list">
        {solutions.map((solution, index) => {
          const difficultyInfo = getDifficultyInfo(solution.difficulty);
          return (
            <Link
              to={`/solution/${solution.id}`}
              key={solution.id}
              className="hot-solutions-item"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="hot-solutions-rank">{index + 1}</div>
              <div className="hot-solutions-content">
                <div className="hot-solutions-title">
                  <span className="hot-solutions-qid">#{solution.leetcodeQuestionId}</span>
                  <span className="hot-solutions-name">{solution.title}</span>
                </div>
                <div className="hot-solutions-meta">
                  <span
                    className="hot-solutions-difficulty"
                    style={{
                      color: difficultyInfo.color,
                      backgroundColor: difficultyInfo.bg,
                      borderColor: difficultyInfo.borderColor,
                    }}
                  >
                    {difficultyInfo.text}
                  </span>
                  <span className="hot-solutions-views">
                    <EyeOutlined /> {formatViewCount(solution.viewCount || 0)}
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

export default HotSolutions;

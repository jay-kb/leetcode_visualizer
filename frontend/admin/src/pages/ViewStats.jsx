import { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, DatePicker, Table, Spin, Select, Tag } from 'antd';
import { Line } from '@ant-design/charts';
import { viewStatsApi } from '../api';
import { EyeOutlined, ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';

const { RangePicker } = DatePicker;

const ViewStats = () => {
  const [loading, setLoading] = useState(false);
  const [dimension, setDimension] = useState('day');
  const [overview, setOverview] = useState({});
  const [chartData, setChartData] = useState([]);
  const [topData, setTopData] = useState([]);

  useEffect(() => {
    loadOverview();
    loadChartData();
    loadTopData();
  }, [dimension]);

  const loadOverview = async () => {
    try {
      const res = await viewStatsApi.getOverview();
      setOverview(res.data || res || {});
    } catch (error) {
      console.error('加载概览失败:', error);
    }
  };

  const loadChartData = async () => {
    setLoading(true);
    try {
      // 计算日期范围
      const endDate = new Date();
      let startDate = new Date();
      switch (dimension) {
        case 'day':
          startDate.setDate(startDate.getDate() - 7);
          break;
        case 'week':
          startDate.setDate(startDate.getDate() - 28);
          break;
        case 'month':
          startDate.setMonth(startDate.getMonth() - 6);
          break;
        case 'year':
          startDate.setFullYear(startDate.getFullYear() - 1);
          break;
        default:
          startDate.setDate(startDate.getDate() - 7);
      }

      const res = await viewStatsApi.getStats({
        dimension,
        startDate: formatDate(startDate),
        endDate: formatDate(endDate),
      });

      const records = res.data?.records || res.records || res || [];
      setChartData(records);
    } catch (error) {
      console.error('加载图表数据失败:', error);
      setChartData([]);
    } finally {
      setLoading(false);
    }
  };

  const loadTopData = async () => {
    try {
      const res = await viewStatsApi.getTop({
        dimension,
        limit: 10,
      });
      const records = res.data || res || [];
      setTopData(records);
    } catch (error) {
      console.error('加载排行数据失败:', error);
      setTopData([]);
    }
  };

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const getTrendColor = (trend) => {
    if (!trend) return '#999';
    return trend.startsWith('+') ? '#52c41a' : '#ff4d4f';
  };

  const getTrendIcon = (trend) => {
    if (!trend) return null;
    return trend.startsWith('+') ? <ArrowUpOutlined /> : <ArrowDownOutlined />;
  };

  // 折线图配置
  const lineConfig = {
    data: chartData,
    xField: 'date',
    yField: 'viewCount',
    smooth: true,
    height: 300,
    color: '#6366f1',
    point: {
      size: 3,
      shape: 'circle',
    },
    area: {
      style: {
        fill: 'l(270) 0:#ffffff 1:#6366f120',
      },
    },
    xAxis: {
      label: {
        autoRotate: true,
      },
    },
    tooltip: {
      showMarkers: true,
    },
  };

  // 表格列配置
  const columns = [
    {
      title: '排名',
      dataIndex: 'rank',
      key: 'rank',
      width: 60,
      render: (text, record, index) => {
        const colors = ['#FFD700', '#C0C0C0', '#CD7F32'];
        return <span style={{ color: colors[index] || '#999', fontWeight: 700 }}>{index + 1}</span>;
      },
    },
    {
      title: '题解ID',
      dataIndex: 'leetcodeQuestionId',
      key: 'leetcodeQuestionId',
      width: 80,
      render: (text) => <Tag color="blue">#{text}</Tag>,
    },
    {
      title: '题解标题',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: '浏览量',
      dataIndex: 'viewCount',
      key: 'viewCount',
      width: 100,
      sorter: (a, b) => a.viewCount - b.viewCount,
      render: (text) => <span style={{ fontWeight: 600 }}>{text?.toLocaleString()}</span>,
    },
  ];

  return (
    <div className="view-stats-page">
      <Spin spinning={loading}>
        {/* 概览卡片 */}
        <Row gutter={[16, 16]} className="stats-overview">
          <Col xs={12} sm={6}>
            <Card className="stats-card">
              <Statistic
                title="今日浏览"
                value={overview.todayViews || 0}
                prefix={<EyeOutlined />}
                valueStyle={{ color: '#6366f1' }}
              />
              <div className="stats-trend" style={{ color: getTrendColor(overview.trend?.day) }}>
                {getTrendIcon(overview.trend?.day)} {overview.trend?.day || '0%'}
              </div>
            </Card>
          </Col>
          <Col xs={12} sm={6}>
            <Card className="stats-card">
              <Statistic
                title="本周浏览"
                value={overview.weekViews || 0}
                prefix={<EyeOutlined />}
                valueStyle={{ color: '#6366f1' }}
              />
              <div className="stats-trend" style={{ color: getTrendColor(overview.trend?.week) }}>
                {getTrendIcon(overview.trend?.week)} {overview.trend?.week || '0%'}
              </div>
            </Card>
          </Col>
          <Col xs={12} sm={6}>
            <Card className="stats-card">
              <Statistic
                title="本月浏览"
                value={overview.monthViews || 0}
                prefix={<EyeOutlined />}
                valueStyle={{ color: '#6366f1' }}
              />
              <div className="stats-trend" style={{ color: getTrendColor(overview.trend?.month) }}>
                {getTrendIcon(overview.trend?.month)} {overview.trend?.month || '0%'}
              </div>
            </Card>
          </Col>
          <Col xs={12} sm={6}>
            <Card className="stats-card">
              <Statistic
                title="今年浏览"
                value={overview.yearViews || 0}
                prefix={<EyeOutlined />}
                valueStyle={{ color: '#6366f1' }}
              />
              <div className="stats-trend" style={{ color: getTrendColor(overview.trend?.year) }}>
                {getTrendIcon(overview.trend?.year)} {overview.trend?.year || '0%'}
              </div>
            </Card>
          </Col>
        </Row>

        {/* 统计维度选择 */}
        <Card className="chart-card">
          <div className="chart-header">
            <h3>浏览量趋势</h3>
            <Select
              value={dimension}
              onChange={(value) => setDimension(value)}
              style={{ width: 120 }}
              options={[
                { value: 'day', label: '按日' },
                { value: 'week', label: '按周' },
                { value: 'month', label: '按月' },
                { value: 'year', label: '按年' },
              ]}
            />
          </div>
          <div className="chart-container">
            {chartData.length > 0 ? (
              <Line {...lineConfig} />
            ) : (
              <div className="no-data">暂无数据</div>
            )}
          </div>
        </Card>

        {/* 热门排行 */}
        <Card className="top-card">
          <h3>热门题解排行</h3>
          <Table
            columns={columns}
            dataSource={topData}
            rowKey="leetcodeQuestionId"
            pagination={false}
            size="small"
          />
        </Card>
      </Spin>
    </div>
  );
};

export default ViewStats;

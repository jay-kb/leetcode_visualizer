import { useNavigate, Link, useLocation, Outlet } from 'react-router-dom';
import { Button, Dropdown, message } from 'antd';
import {
  LogoutOutlined,
  UserOutlined,
  TagsOutlined,
  SolutionOutlined,
  HomeOutlined,
  BarChartOutlined
} from '@ant-design/icons';

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const username = localStorage.getItem('adminUsername') || 'admin';

  const handleLogout = () => {
    message.success('已退出登录');
    localStorage.removeItem('adminToken');
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('adminUsername');
    navigate('/login');
  };

  const userMenuItems = [
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      onClick: handleLogout,
    },
  ];

  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes('/admin/solutions')) return '题解管理';
    if (path.includes('/admin/tags')) return '标签管理';
    if (path.includes('/admin/view-stats')) return '浏览量统计';
    return '管理后台';
  };

  return (
    <div className="admin-layout">
      {/* 侧边栏 */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar-logo">
          <h1>管理后台</h1>
        </div>
        <nav className="admin-menu">
          <Link
            to="/admin/view-stats"
            className={`admin-menu-item ${location.pathname.includes('/admin/view-stats') ? 'active' : ''}`}
          >
            <BarChartOutlined />
            浏览量统计
          </Link>
          <Link
            to="/admin/solutions"
            className={`admin-menu-item ${location.pathname.includes('/admin/solutions') ? 'active' : ''}`}
          >
            <SolutionOutlined />
            题解管理
          </Link>
          <Link
            to="/admin/tags"
            className={`admin-menu-item ${location.pathname.includes('/admin/tags') ? 'active' : ''}`}
          >
            <TagsOutlined />
            标签管理
          </Link>
          <a
            href={import.meta.env.VITE_FRONTEND_URL || 'http://localhost:8082'}
            target="_blank"
            rel="noopener noreferrer"
            className="admin-menu-item"
          >
            <HomeOutlined />
            访问前台
          </a>
        </nav>
      </aside>

      {/* 主内容区 */}
      <div className="admin-main">
        {/* 顶部栏 */}
        <header className="admin-header">
          <h2 className="admin-header-title">{getPageTitle()}</h2>
          <div className="admin-header-right">
            <span className="admin-user-info">
              <UserOutlined />
              {username}
            </span>
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
              <Button type="text">设置</Button>
            </Dropdown>
          </div>
        </header>

        {/* 内容区 */}
        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;

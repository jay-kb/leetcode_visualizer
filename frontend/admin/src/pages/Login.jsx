import { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import { UserOutlined, LockOutlined, ThunderboltOutlined } from '@ant-design/icons';
import { authApi } from '../api';
import QuickSortBackground from '../components/QuickSortBackground';

const Login = () => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const res = await authApi.login(values.username, values.password);
      if (res.code === 200) {
        localStorage.setItem('adminToken', res.data.token);
        localStorage.setItem('isAdmin', 'true');
        localStorage.setItem('adminUsername', res.data.username || values.username);
        message.success('登录成功');
        window.location.href = '/admin/solutions';
      } else {
        message.error(res.message || '登录失败');
      }
    } catch (error) {
      console.error('登录失败:', error);
      message.error('登录失败，请检查用户名和密码');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      {/* 快速排序动态背景 */}
      <QuickSortBackground />

      {/* 登录卡片 */}
      <div className="login-card">
        <div className="login-logo">
          <ThunderboltOutlined style={{ fontSize: 40, color: '#6366f1' }} />
        </div>
        <h1 className="login-title">
          LeetCode 可视化
        </h1>
        <p className="login-subtitle">管理后台</p>

        <Form
          name="login"
          onFinish={handleSubmit}
          autoComplete="off"
          size="large"
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: '请输入用户名' }]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="用户名"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: '请输入密码' }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="密码"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
              className="login-btn"
            >
              登 录
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default Login;

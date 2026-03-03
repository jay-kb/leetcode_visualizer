import { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, ColorPicker, message, Popconfirm, Tag } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import { tagAdminApi } from '../api';

const TagManage = () => {
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form] = Form.useForm();
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const [keyword, setKeyword] = useState('');

  useEffect(() => {
    loadTags();
  }, [pagination.current, keyword]);

  const loadTags = async () => {
    setLoading(true);
    try {
      const res = await tagAdminApi.getList({
        page: pagination.current,
        size: pagination.pageSize,
        keyword: keyword,
      });
      // 兼容不同返回格式
      let records = [];
      if (res.data?.records) {
        records = res.data.records;
      } else if (res.records) {
        records = res.records;
      } else if (Array.isArray(res.data)) {
        records = res.data;
      } else if (Array.isArray(res)) {
        records = res;
      }

      // 兼容字段名（name 或 tagName）
      records = records.map(tag => ({
        ...tag,
        name: tag.name || tag.tagName || tag.label
      }));

      const total = res.data?.total || res.total || records.length || 0;
      setTags(records);
      setPagination(prev => ({ ...prev, total }));
    } catch (error) {
      console.error('加载标签失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingId(null);
    form.resetFields();
    form.setFieldsValue({ color: '#1890ff' });
    setModalVisible(true);
  };

  const handleEdit = (record) => {
    setEditingId(record.id);
    form.setFieldsValue({
      name: record.name,
      color: record.color,
    });
    setModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      await tagAdminApi.delete(id);
      message.success('删除成功');
      loadTags();
    } catch (error) {
      message.error('删除失败');
    }
  };

  const handleSubmit = async (values) => {
    try {
      const color = typeof values.color === 'string' ? values.color : '#1890ff';
      const data = { ...values, color };

      if (editingId) {
        await tagAdminApi.update(editingId, data);
        message.success('更新成功');
      } else {
        await tagAdminApi.create(data);
        message.success('创建成功');
      }
      setModalVisible(false);
      loadTags();
    } catch (error) {
      message.error(error.response?.data?.message || (editingId ? '更新失败' : '创建失败'));
    }
  };

  const handleSearch = (value) => {
    setKeyword(value);
    setPagination(prev => ({ ...prev, current: 1 }));
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 80,
    },
    {
      title: '标签名称',
      dataIndex: 'name',
    },
    {
      title: '颜色',
      dataIndex: 'color',
      width: 150,
      render: (color) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{
            display: 'inline-block',
            width: 24,
            height: 24,
            borderRadius: 4,
            backgroundColor: color
          }} />
          <span style={{ color: '#999' }}>{color}</span>
        </div>
      ),
    },
    {
      title: '题解数量',
      dataIndex: 'solutionCount',
      width: 100,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      width: 180,
    },
    {
      title: '操作',
      width: 150,
      render: (_, record) => (
        <div className="table-actions">
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确认删除？"
            description="删除后数据不可恢复"
            onConfirm={() => handleDelete(record.id)}
            okText="确认"
            cancelText="取消"
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div>
      {/* 页面头部 */}
      <div className="page-header">
        <span className="page-header-title">标签列表</span>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          新增标签
        </Button>
      </div>

      {/* 内容区域 */}
      <div className="content-card">
        {/* 搜索栏 */}
        <div className="search-bar">
          <Input.Search
            placeholder="搜索标签名称"
            allowClear
            enterButton={<SearchOutlined />}
            onSearch={handleSearch}
            style={{ width: 300 }}
          />
        </div>

        {/* 表格 */}
        <Table
          columns={columns}
          dataSource={tags}
          rowKey="id"
          loading={loading}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            onChange: (page) => setPagination(prev => ({ ...prev, current: page })),
            showSizeChanger: false,
            showTotal: (total) => `共 ${total} 条`,
          }}
        />
      </div>

      {/* 新增/编辑弹窗 */}
      <Modal
        title={editingId ? '编辑标签' : '新增标签'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width="480"
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{ color: '#1890ff' }}
        >
          <Form.Item
            name="name"
            label="标签名称"
            rules={[
              { required: true, message: '请输入标签名称' },
              { max: 50, message: '标签名称不能超过50个字符' }
            ]}
          >
            <Input placeholder="请输入标签名称" />
          </Form.Item>

          <Form.Item
            name="color"
            label="颜色"
            initialValue="#1890ff"
          >
            <ColorPicker format="hex" />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, marginTop: 24 }}>
            <Button type="primary" htmlType="submit" style={{ marginRight: 12 }}>
              提 交
            </Button>
            <Button onClick={() => setModalVisible(false)}>
              取 消
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default TagManage;

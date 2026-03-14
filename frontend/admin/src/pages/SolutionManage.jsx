import { useState, useEffect } from 'react';
import { Table, Button, Input, InputNumber, Select, message, Popconfirm, Tag as AntTag, Modal, Form, Radio, Checkbox, Upload, Progress, Tabs, Tooltip } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined, LinkOutlined, SaveOutlined, UploadOutlined, FileOutlined, InboxOutlined, MinusCircleOutlined, FileTextOutlined, BulbOutlined, LinkOutlined as RefLinkOutlined } from '@ant-design/icons';
import { solutionAdminApi, tagAdminApi } from '../api';
import axios from 'axios';

const { TextArea } = Input;
const { Option } = Select;

// 首页基础 URL，用于转换相对路径
const FRONTEND_BASE_URL = import.meta.env.VITE_FRONTEND_URL || 'http://localhost:8082';

// 处理 URL，relativePath 转换为绝对路径
const getFullUrl = (relativePath) => {
  if (!relativePath) return '';
  if (relativePath.startsWith('http://') || relativePath.startsWith('https://')) {
    return relativePath;
  }
  return FRONTEND_BASE_URL + relativePath;
};

const SolutionManage = () => {
  const [solutions, setSolutions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const [filters, setFilters] = useState({ keyword: '', difficulty: undefined, status: undefined, questionId: undefined });

  // 弹框相关状态
  const [modalVisible, setModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [tags, setTags] = useState([]);
  const [form] = Form.useForm();

  // 上传相关状态
  const [htmlUploading, setHtmlUploading] = useState(false);
  const [htmlProgress, setHtmlProgress] = useState(0);
  const [coverUploading, setCoverUploading] = useState(false);
  const [coverProgress, setCoverProgress] = useState(0);

  useEffect(() => {
    loadSolutions();
    loadTags();
  }, [pagination.current, filters]);

  const loadSolutions = async () => {
    setLoading(true);
    try {
      const params = {
        page: pagination.current,
        size: pagination.pageSize,
        keyword: filters.keyword,
        difficulty: filters.difficulty,
        status: filters.status,
        questionId: filters.questionId,
      };
      const res = await solutionAdminApi.getList(params);
      const records = res.data?.records || res.records || [];
      const total = res.data?.total || res.total || 0;
      setSolutions(records);
      setPagination(prev => ({ ...prev, total }));
    } catch (error) {
      console.error('加载题解失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadTags = async () => {
    try {
      const res = await tagAdminApi.getAll();
      let tagsData = res.data || res;
      if (!tagsData) tagsData = [];
      if (!Array.isArray(tagsData)) tagsData = tagsData.records || tagsData.list || [];
      setTags(tagsData.map(tag => ({
        ...tag,
        name: tag.name || tag.tagName || tag.label
      })));
    } catch (error) {
      console.error('加载标签失败:', error);
    }
  };

// 获取 API 基础地址
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

  // 上传 HTML 文件
  const handleHtmlUpload = async (file) => {
    setHtmlUploading(true);
    setHtmlProgress(0);

    const formData = new FormData();
    formData.append('file', file);

    // 获取表单中的题目 ID
    const questionId = form.getFieldValue('leetcodeQuestionId');
    if (questionId) {
      formData.append('leetcodeQuestionId', questionId);
    }

    const token = localStorage.getItem('adminToken');

    try {
      const res = await axios.post(`${API_BASE_URL}/upload/html`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`,
        },
        onUploadProgress: (progressEvent) => {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setHtmlProgress(percent);
        },
      });

      if (res.data.code === 200) {
        form.setFieldsValue({ htmlFileUrl: res.data.data.filePath });
        message.success('上传成功');
      } else {
        message.error(res.data.message || '上传失败');
      }
    } catch (error) {
      console.error('上传失败:', error);
      message.error('上传失败，请重试');
    } finally {
      setHtmlUploading(false);
      setHtmlProgress(0);
    }

    return false; // 阻止默认上传行为
  };

  // 上传封面图片
  const handleCoverUpload = async (file) => {
    setCoverUploading(true);
    setCoverProgress(0);

    const formData = new FormData();
    formData.append('file', file);

    const token = localStorage.getItem('adminToken');

    try {
      const res = await axios.post(`${API_BASE_URL}/upload/cover`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`,
        },
        onUploadProgress: (progressEvent) => {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setCoverProgress(percent);
        },
      });

      if (res.data.code === 200) {
        form.setFieldsValue({ coverImageUrl: res.data.data.filePath });
        message.success('封面上传成功');
      } else {
        message.error(res.data.message || '上传失败');
      }
    } catch (error) {
      console.error('上传失败:', error);
      message.error('上传失败，请重试');
    } finally {
      setCoverUploading(false);
      setCoverProgress(0);
    }

    return false;
  };

  // 打开新增弹框
  const handleAdd = () => {
    setEditingRecord(null);
    form.resetFields();
    form.setFieldsValue({
      difficulty: 1,
      status: 1,
      tagIds: [],
    });
    setModalVisible(true);
  };

  // 打开编辑弹框
  const handleEdit = (record) => {
    setEditingRecord(record);
    // 解析相关链接 JSON
    let referenceLinks = [];
    if (record.referenceLinks) {
      try {
        referenceLinks = typeof record.referenceLinks === 'string'
          ? JSON.parse(record.referenceLinks)
          : record.referenceLinks;
      } catch (e) {
        console.error('解析 referenceLinks 失败:', e);
        referenceLinks = [];
      }
    }
    form.setFieldsValue({
      title: record.title,
      description: record.description,
      points: record.points,
      solutionThoughts: record.solutionThoughts,
      referenceLinks: referenceLinks,
      leetcodeQuestionId: record.leetcodeQuestionId,
      leetcodeUrl: record.leetcodeUrl,
      difficulty: record.difficulty,
      htmlFileUrl: record.htmlFileUrl,
      coverImageUrl: record.coverImageUrl,
      tagIds: record.tags?.map(t => t.id) || [],
      status: record.status,
    });
    setModalVisible(true);
  };

  // 提交表单
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setSubmitLoading(true);

      // 处理相关链接：转换为 JSON 字符串
      let referenceLinksStr = null;
      if (values.referenceLinks && values.referenceLinks.length > 0) {
        // 过滤掉空链接
        const validLinks = values.referenceLinks.filter(link => link.title && link.url);
        if (validLinks.length > 0) {
          referenceLinksStr = JSON.stringify(validLinks);
        }
      }

      const data = {
        ...values,
        tagIds: values.tagIds || [],
        referenceLinks: referenceLinksStr,
      };

      if (editingRecord) {
        await solutionAdminApi.update(editingRecord.id, data);
        message.success('更新成功');
      } else {
        await solutionAdminApi.create(data);
        message.success('创建成功');
      }

      setModalVisible(false);
      loadSolutions();
    } catch (error) {
      console.error('提交失败:', error);
      message.error(editingRecord ? '更新失败' : '创建失败');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await solutionAdminApi.delete(id);
      message.success('删除成功');
      loadSolutions();
    } catch (error) {
      message.error('删除失败');
    }
  };

  const handleSearch = (value) => {
    setFilters(prev => ({ ...prev, keyword: value }));
    setPagination(prev => ({ ...prev, current: 1 }));
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, current: 1 }));
  };

  const getDifficultyInfo = (difficulty) => {
    const map = {
      1: { text: '简单', className: 'difficulty-easy' },
      2: { text: '中等', className: 'difficulty-medium' },
      3: { text: '困难', className: 'difficulty-hard' },
    };
    return map[difficulty] || { text: '未知', className: '' };
  };

  const getStatusInfo = (status) => {
    const map = {
      0: { text: '草稿', className: 'status-draft' },
      1: { text: '已发布', className: 'status-published' },
    };
    return map[status] || { text: '未知', className: '' };
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 60,
    },
    {
      title: '标题',
      dataIndex: 'title',
      ellipsis: true,
      width: 150,
    },
    {
      title: '题号',
      dataIndex: 'leetcodeQuestionId',
      width: 60,
    },
    {
      title: '链接',
      dataIndex: 'leetcodeUrl',
      width: 60,
      render: (url, record) => {
        return (
          <div style={{ display: 'flex', gap: 8 }}>
            {url && (
              <a href={url} target="_blank" rel="noopener noreferrer" style={{ color: '#ffa116' }} title="LeetCode">
                <LinkOutlined />
              </a>
            )}
            {record.htmlFileUrl && (
              <a href={getFullUrl(record.htmlFileUrl)} target="_blank" rel="noopener noreferrer" style={{ color: '#1890ff' }} title="可视化">
                <FileOutlined />
              </a>
            )}
            {!url && !record.htmlFileUrl && <span style={{ color: '#999' }}>-</span>}
          </div>
        );
      },
    },
    {
      title: '难度',
      dataIndex: 'difficulty',
      width: 60,
      render: (difficulty) => {
        const info = getDifficultyInfo(difficulty);
        return <span className={`difficulty-tag ${info.className}`}>{info.text}</span>;
      },
    },
    {
      title: '标签',
      dataIndex: 'tags',
      width: 100,
      render: (tags) => {
        if (!tags || tags.length === 0) return null;
        const displayTags = tags.slice(0, 2);
        return (
          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
            {displayTags.map((tag) => (
              <AntTag key={tag.id} color={tag.color}>{tag.name}</AntTag>
            ))}
          </div>
        );
      },
    },
    {
      title: '考察点',
      dataIndex: 'points',
      width: 120,
      render: (points) => {
        if (!points) return <span style={{ color: '#999' }}>-</span>;
        const pointsList = points.split(',').map(p => p.trim()).filter(p => p);
        return (
          <div style={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            {pointsList.slice(0, 2).map((point, idx) => (
              <AntTag key={idx} color="blue" style={{ fontSize: 11, padding: '0 4px' }}>{point}</AntTag>
            ))}
            {pointsList.length > 2 && <AntTag style={{ fontSize: 11 }}>+{pointsList.length - 2}</AntTag>}
          </div>
        );
      },
    },
    {
      title: '解题思路',
      dataIndex: 'solutionThoughts',
      width: 140,
      render: (thoughts) => {
        if (!thoughts) return <span style={{ color: '#999' }}>-</span>;
        // 提取纯文本，移除 Markdown 格式符号
        const text = thoughts
          .replace(/^#+\s*/gm, '')
          .replace(/\*\*/g, '')
          .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
          .replace(/\n/g, ' ')
          .trim();
        const displayText = text.length > 60 ? text.substring(0, 60) + '...' : text;
        return (
          <Tooltip title={text}>
            <span style={{ cursor: 'pointer', color: '#1890ff' }}>
              {displayText}
            </span>
          </Tooltip>
        );
      },
    },
    {
      title: '链接',
      dataIndex: 'referenceLinks',
      width: 80,
      render: (links) => {
        if (!links) return <span style={{ color: '#999' }}>-</span>;
        let linkList = [];
        try {
          linkList = typeof links === 'string' ? JSON.parse(links) : links;
        } catch (e) {
          linkList = [];
        }
        if (!linkList || linkList.length === 0) return <span style={{ color: '#999' }}>-</span>;
        // 只显示链接数量，用弹窗显示列表
        return (
          <Tooltip
            title={
              <div style={{ maxHeight: 150, overflow: 'auto' }}>
                {linkList.map((link, idx) => (
                  <div key={idx} style={{ marginBottom: 4 }}>
                    <a href={link.url} target="_blank" rel="noopener noreferrer" style={{ color: '#fff' }}>
                      {link.title}
                    </a>
                  </div>
                ))}
              </div>
            }
          >
            <AntTag color="purple" style={{ cursor: 'pointer' }}>
              <LinkOutlined /> {linkList.length}
            </AntTag>
          </Tooltip>
        );
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 60,
      render: (status) => {
        const info = getStatusInfo(status);
        return <span className={`status-tag ${info.className}`}>{info.text}</span>;
      },
    },
    {
      title: '浏览',
      dataIndex: 'viewCount',
      width: 60,
    },
    {
      title: '操作',
      width: 100,
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
        <span className="page-header-title">题解列表</span>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          新增题解
        </Button>
      </div>

      {/* 内容区域 */}
      <div className="content-card">
        {/* 搜索栏 */}
        <div className="search-bar">
          <Input.Search
            placeholder="搜索标题"
            allowClear
            enterButton={<SearchOutlined />}
            onSearch={handleSearch}
            style={{ width: 250 }}
          />
          <InputNumber
            placeholder="题目ID"
            allowClear
            min={1}
            style={{ width: 120 }}
            onChange={(value) => handleFilterChange('questionId', value)}
          />
          <Select
            placeholder="难度"
            allowClear
            style={{ width: 100 }}
            onChange={(value) => handleFilterChange('difficulty', value)}
          >
            <Option value={1}>简单</Option>
            <Option value={2}>中等</Option>
            <Option value={3}>困难</Option>
          </Select>
          <Select
            placeholder="状态"
            allowClear
            style={{ width: 100 }}
            onChange={(value) => handleFilterChange('status', value)}
          >
            <Option value={0}>草稿</Option>
            <Option value={1}>已发布</Option>
          </Select>
        </div>

        {/* 表格 */}
        <Table
          columns={columns}
          dataSource={solutions}
          rowKey="id"
          loading={loading}
          scroll={{ x: 1000 }}
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

      {/* 编辑弹框 */}
      <Modal
        title={editingRecord ? '编辑题解' : '新增题解'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        width={700}
        footer={[
          <Button key="cancel" onClick={() => setModalVisible(false)}>
            取消
          </Button>,
          <Button key="submit" type="primary" icon={<SaveOutlined />} loading={submitLoading} onClick={handleSubmit}>
            提交
          </Button>,
        ]}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            difficulty: 1,
            status: 1,
            tagIds: [],
          }}
        >
          <Tabs
            defaultActiveKey="basic"
            items={[
              {
                key: 'basic',
                label: (
                  <span>
                    <FileTextOutlined />
                    基本信息
                  </span>
                ),
                children: (
                  <>
                    <Form.Item
                      name="title"
                      label="标题"
                      rules={[
                        { required: true, message: '请输入题解标题' },
                        { max: 200, message: '标题不能超过200个字符' }
                      ]}
                    >
                      <Input placeholder="请输入题解标题" />
                    </Form.Item>

                    <div style={{ display: 'flex', gap: 16 }}>
                      <Form.Item
                        name="leetcodeQuestionId"
                        label="LeetCode 题目 ID"
                        rules={[{ required: true, message: '请输入题目ID' }]}
                        style={{ flex: 1 }}
                      >
                        <Input placeholder="如: 1, 15, 206" />
                      </Form.Item>

                      <Form.Item
                        name="difficulty"
                        label="难度"
                        rules={[{ required: true }]}
                        style={{ flex: 1 }}
                      >
                        <Radio.Group>
                          <Radio.Button value={1}>
                            <span style={{ color: '#52c41a' }}>简单</span>
                          </Radio.Button>
                          <Radio.Button value={2}>
                            <span style={{ color: '#fa8c16' }}>中等</span>
                          </Radio.Button>
                          <Radio.Button value={3}>
                            <span style={{ color: '#f5222d' }}>困难</span>
                          </Radio.Button>
                        </Radio.Group>
                      </Form.Item>
                    </div>

                    <Form.Item
                      name="leetcodeUrl"
                      label="LeetCode 题目链接"
                      extra="填写 LeetCode 题目页面地址"
                    >
                      <Input
                        placeholder="https://leetcode.com/problems/two-sum"
                        prefix={<LinkOutlined />}
                      />
                    </Form.Item>

                    <Form.Item
                      name="description"
                      label="描述"
                    >
                      <TextArea rows={2} placeholder="请输入简短描述" />
                    </Form.Item>
                  </>
                ),
              },
              {
                key: 'content',
                label: (
                  <span>
                    <BulbOutlined />
                    题解内容
                  </span>
                ),
                children: (
                  <>
                    <Form.Item
                      name="points"
                      label="考察的问题点"
                      extra="多个考察点用逗号分隔，如：哈希表、数组遍历、时间复杂度优化"
                    >
                      <TextArea rows={2} placeholder="如：哈希表, 数组遍历, 时间复杂度优化" />
                    </Form.Item>

                    <Form.Item
                      name="solutionThoughts"
                      label="解题思路"
                      extra="支持 Markdown 格式"
                    >
                      <TextArea rows={6} placeholder="请输入解题思路，支持 Markdown 格式" />
                    </Form.Item>

                    <Form.Item
                      name="referenceLinks"
                      label="相关链接"
                      extra="添加参考资料链接"
                    >
                      <Form.List name="referenceLinks">
                        {(fields, { add, remove }) => (
                          <>
                            {fields.map(({ key, name, ...restField }) => (
                              <div key={key} style={{ display: 'flex', alignItems: 'center', marginBottom: 8, gap: 8 }}>
                                <Form.Item
                                  {...restField}
                                  name={[name, 'title']}
                                  style={{ flex: 1, marginBottom: 0 }}
                                >
                                  <Input placeholder="标题" />
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        name={[name, 'url']}
                        style={{ flex: 2, marginBottom: 0 }}
                      >
                        <Input placeholder="链接地址" />
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        name={[name, 'type']}
                        style={{ width: 100, marginBottom: 0 }}
                      >
                        <Select placeholder="类型">
                          <Select.Option value="article">文章</Select.Option>
                          <Select.Option value="video">视频</Select.Option>
                          <Select.Option value="discussion">讨论</Select.Option>
                        </Select>
                      </Form.Item>
                      <MinusCircleOutlined onClick={() => remove(name)} style={{ color: '#ff4d4f' }} />
                    </div>
                  ))}
                  <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                    添加链接
                  </Button>
                </>
              )}
            </Form.List>
          </Form.Item>
                  </>
                ),
              },
              {
                key: 'files',
                label: (
                  <span>
                    <UploadOutlined />
                    文件与标签
                  </span>
                ),
                children: (
                  <>
                    <Form.Item
                      name="htmlFileUrl"
                      label="HTML 可视化文件"
                      extra="上传可视化 HTML 文件，支持拖拽上传（可选）"
                    >
                      <div>
                        <Upload
                          accept=".html"
                          showUploadList={false}
                          beforeUpload={handleHtmlUpload}
                          disabled={htmlUploading}
                        >
                          <Button icon={<UploadOutlined />} loading={htmlUploading}>
                            {htmlUploading ? '上传中...' : '选择 HTML 文件'}
                          </Button>
                        </Upload>
                        {htmlUploading && <Progress percent={htmlProgress} size="small" style={{ marginTop: 8 }} />}
                        {form.getFieldValue('htmlFileUrl') && !htmlUploading && (
                          <div style={{ marginTop: 8, color: '#52c41a' }}>
                            <FileOutlined /> 已选择: {form.getFieldValue('htmlFileUrl')}
                          </div>
                        )}
                      </div>
                    </Form.Item>

                    <Form.Item
                      name="coverImageUrl"
                      label="封面图片"
                      extra="上传封面图片，支持 jpg、png、gif 格式"
                    >
                      <div>
                        <Upload
                          accept=".jpg,.jpeg,.png,.gif"
                          showUploadList={false}
                          beforeUpload={handleCoverUpload}
                          disabled={coverUploading}
                        >
                          <Button icon={<UploadOutlined />} loading={coverUploading}>
                            {coverUploading ? '上传中...' : '选择封面图片'}
                          </Button>
                        </Upload>
                        {coverUploading && <Progress percent={coverProgress} size="small" style={{ marginTop: 8 }} />}
                        {form.getFieldValue('coverImageUrl') && !coverUploading && (
                          <div style={{ marginTop: 8, color: '#52c41a' }}>
                            <FileOutlined /> 已选择: {form.getFieldValue('coverImageUrl')}
                          </div>
                        )}
                      </div>
                    </Form.Item>

                    <Form.Item
                      name="tagIds"
                      label="标签"
                      extra="选择相关标签，支持搜索"
                    >
                      <Select
                        mode="multiple"
                        placeholder="搜索并选择标签"
                        allowClear
                        showSearch
                        filterOption={(input, option) =>
                          (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                        }
                        style={{ width: '100%' }}
                        options={tags.map(tag => ({
                          value: tag.id,
                          label: tag.name,
                        }))}
                      />
                    </Form.Item>

                    <Form.Item
                      name="status"
                      label="发布状态"
                    >
                      <Radio.Group>
                        <Radio value={1}>已发布</Radio>
                        <Radio value={0}>草稿</Radio>
                      </Radio.Group>
                    </Form.Item>
                  </>
                ),
              },
            ]}
          />
        </Form>
      </Modal>
    </div>
  );
};

export default SolutionManage;

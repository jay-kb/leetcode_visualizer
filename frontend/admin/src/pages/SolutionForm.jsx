import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Input, Select, Radio, Button, message, Checkbox, Tag } from 'antd';
import { ArrowLeftOutlined, SaveOutlined, LinkOutlined } from '@ant-design/icons';
import { solutionAdminApi, tagAdminApi } from '../api';

const { TextArea } = Input;
const { Option } = Select;

const SolutionForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [tags, setTags] = useState([]);
  const [initialLoading, setInitialLoading] = useState(!!id);
  const isEdit = !!id;

  useEffect(() => {
    loadTags();
    if (id) {
      loadSolution();
    }
  }, [id]);

  const loadTags = async () => {
    try {
      const res = await tagAdminApi.getAll();
      console.log('标签响应数据:', res);

      // 兼容不同返回格式
      let tagsData = res.data || res;
      if (!tagsData) {
        tagsData = [];
      }
      if (!Array.isArray(tagsData)) {
        // 可能是分页格式，取 records
        tagsData = tagsData.records || tagsData.list || [];
      }
      if (!Array.isArray(tagsData)) {
        tagsData = [];
      }

      console.log('处理后的标签数据:', tagsData);

      // 兼容字段名
      setTags(tagsData.map(tag => ({
        ...tag,
        name: tag.name || tag.tagName || tag.label
      })));
    } catch (error) {
      console.error('加载标签失败:', error);
    }
  };

  const loadSolution = async () => {
    setInitialLoading(true);
    try {
      const res = await solutionAdminApi.getById(id);
      const data = res.data || res;
      form.setFieldsValue({
        title: data.title,
        description: data.description,
        leetcodeQuestionId: data.leetcodeQuestionId,
        leetcodeUrl: data.leetcodeUrl,
        difficulty: data.difficulty,
        htmlFileUrl: data.htmlFileUrl,
        coverImageUrl: data.coverImageUrl,
        tagIds: data.tags?.map(t => t.id) || [],
        status: data.status,
      });
    } catch (error) {
      message.error('加载题解失败');
      navigate('/admin/solutions');
    } finally {
      setInitialLoading(false);
    }
  };

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const data = {
        ...values,
        tagIds: values.tagIds || [],
      };

      if (isEdit) {
        await solutionAdminApi.update(id, data);
        message.success('更新成功');
      } else {
        await solutionAdminApi.create(data);
        message.success('创建成功');
      }
      navigate('/admin/solutions');
    } catch (error) {
      message.error(error.response?.data?.message || (isEdit ? '更新失败' : '创建失败'));
    } finally {
      setLoading(false);
    }
  };

  const getDifficultyColor = (difficulty) => {
    const map = { 1: '#52c41a', 2: '#fa8c16', 3: '#f5222d' };
    return map[difficulty] || '#52c41a';
  };

  if (initialLoading) {
    return (
      <div className="content-card" style={{ textAlign: 'center', padding: 60 }}>
        加载中...
      </div>
    );
  }

  return (
    <div>
      {/* 页面头部 */}
      <div className="page-header">
        <span className="page-header-title">
          <Button
            type="link"
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate('/admin/solutions')}
            style={{ marginRight: 8, padding: 0 }}
          />
          {isEdit ? '编辑题解' : '新增题解'}
        </span>
      </div>

      {/* 内容区域 */}
      <div className="content-card">
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            difficulty: 1,
            status: 1,
            tagIds: [],
          }}
        >
          {/* 基本信息 */}
          <div className="form-section">
            <div className="form-section-title">基本信息</div>
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

            <div className="form-row">
              <Form.Item
                name="leetcodeQuestionId"
                label="LeetCode 题目 ID"
                rules={[{ required: true, message: '请输入题目ID' }]}
              >
                <Input placeholder="如: 1, 15, 206" />
              </Form.Item>

              <Form.Item
                name="difficulty"
                label="难度"
                rules={[{ required: true }]}
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
              extra="填写 LeetCode 题目页面地址，用户可点击跳转到 LeetCode"
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
              <TextArea rows={3} placeholder="请输入简短描述" />
            </Form.Item>
          </div>

          {/* 文件信息 */}
          <div className="form-section">
            <div className="form-section-title">文件信息</div>
            <Form.Item
              name="htmlFileUrl"
              label="HTML 文件路径"
              rules={[{ required: true, message: '请输入HTML文件路径' }]}
              extra="填写格式: /solutions/xxx.html"
            >
              <Input placeholder="/solutions/two-sum.html" />
            </Form.Item>

            <Form.Item
              name="coverImageUrl"
              label="封面图 URL"
              extra="可选，如: /covers/xxx.jpg"
            >
              <Input placeholder="/covers/xxx.jpg" />
            </Form.Item>
          </div>

          {/* 标签 */}
          <div className="form-section">
            <div className="form-section-title">标签</div>
            <Form.Item name="tagIds">
              <Checkbox.Group>
                <div className="tag-select-list">
                  {tags.map((tag) => (
                    <Checkbox
                      key={tag.id}
                      value={tag.id}
                      style={{ marginRight: 8, marginBottom: 8 }}
                    >
                      <Tag color={tag.color}>{tag.name}</Tag>
                    </Checkbox>
                  ))}
                </div>
              </Checkbox.Group>
            </Form.Item>
          </div>

          {/* 状态 */}
          <div className="form-section">
            <div className="form-section-title">发布状态</div>
            <Form.Item name="status">
              <Radio.Group>
                <Radio value={1}>已发布</Radio>
                <Radio value={0}>草稿</Radio>
              </Radio.Group>
            </Form.Item>
          </div>

          {/* 提交按钮 */}
          <Form.Item style={{ marginBottom: 0, marginTop: 24 }}>
            <Button
              type="primary"
              htmlType="submit"
              icon={<SaveOutlined />}
              loading={loading}
              style={{ marginRight: 12 }}
            >
              提 交
            </Button>
            <Button onClick={() => navigate('/admin/solutions')}>
              取 消
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default SolutionForm;

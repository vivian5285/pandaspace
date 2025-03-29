import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Input,
  Select,
  Modal,
  Form,
  message,
  Space,
  Card,
  Row,
  Col,
  Typography,
} from 'antd';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

const { Title } = Typography;
const { Option } = Select;

interface User {
  _id: string;
  email: string;
  balance: number;
  service_fee_balance: number;
  status: string;
  registration_date: string;
  last_login: string;
  is_admin: boolean;
}

const UserManagement: React.FC = () => {
  const { t } = useTranslation();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [modalVisible, setModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [form] = Form.useForm();

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/admin/users', {
        params: {
          search: searchText,
          status: statusFilter,
        },
      });
      setUsers(response.data);
    } catch (error) {
      message.error(t('error'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [searchText, statusFilter]);

  const handleCreateUser = () => {
    setEditingUser(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    form.setFieldsValue(user);
    setModalVisible(true);
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      await axios.delete(`/api/admin/users/${userId}`);
      message.success(t('user_deleted'));
      fetchUsers();
    } catch (error) {
      message.error(t('error'));
    }
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      if (editingUser) {
        await axios.put(`/api/admin/users/${editingUser._id}`, values);
        message.success(t('success'));
      } else {
        await axios.post('/api/admin/users', values);
        message.success(t('success'));
      }
      setModalVisible(false);
      fetchUsers();
    } catch (error) {
      message.error(t('error'));
    }
  };

  const columns = [
    {
      title: t('email'),
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: t('balance'),
      dataIndex: 'balance',
      key: 'balance',
      render: (balance: number) => balance.toFixed(2),
    },
    {
      title: t('service_fee'),
      dataIndex: 'service_fee_balance',
      key: 'service_fee_balance',
      render: (balance: number) => balance.toFixed(2),
    },
    {
      title: t('status'),
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Select value={status} style={{ width: 100 }}>
          <Option value="active">{t('active')}</Option>
          <Option value="inactive">{t('inactive')}</Option>
        </Select>
      ),
    },
    {
      title: t('registration_date'),
      dataIndex: 'registration_date',
      key: 'registration_date',
      render: (date: string) => new Date(date).toLocaleString(),
    },
    {
      title: t('actions'),
      key: 'actions',
      render: (_: any, record: User) => (
        <Space>
          <Button type="link" onClick={() => handleEditUser(record)}>
            {t('edit_user')}
          </Button>
          <Button type="link" danger onClick={() => handleDeleteUser(record._id)}>
            {t('delete_user')}
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Card>
        <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
          <Col>
            <Title level={2}>{t('user_list')}</Title>
          </Col>
          <Col>
            <Button type="primary" onClick={handleCreateUser}>
              {t('create_user')}
            </Button>
          </Col>
        </Row>

        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col span={12}>
            <Input
              placeholder={t('search')}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </Col>
          <Col span={12}>
            <Select
              style={{ width: '100%' }}
              placeholder={t('filter')}
              value={statusFilter}
              onChange={setStatusFilter}
              allowClear
            >
              <Option value="active">{t('active')}</Option>
              <Option value="inactive">{t('inactive')}</Option>
            </Select>
          </Col>
        </Row>

        <Table
          columns={columns}
          dataSource={users}
          rowKey="_id"
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      </Card>

      <Modal
        title={editingUser ? t('edit_user') : t('create_user')}
        visible={modalVisible}
        onOk={handleModalOk}
        onCancel={() => setModalVisible(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="email"
            label={t('email')}
            rules={[{ required: true, type: 'email' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="balance"
            label={t('balance')}
            rules={[{ required: true, type: 'number' }]}
          >
            <Input type="number" step="0.01" />
          </Form.Item>
          <Form.Item
            name="service_fee_balance"
            label={t('service_fee')}
            rules={[{ required: true, type: 'number' }]}
          >
            <Input type="number" step="0.01" />
          </Form.Item>
          <Form.Item
            name="status"
            label={t('status')}
            rules={[{ required: true }]}
          >
            <Select>
              <Option value="active">{t('active')}</Option>
              <Option value="inactive">{t('inactive')}</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UserManagement; 
import React, { useState } from 'react';
import { Layout, Menu, Typography, Button, Modal, Form, Input, Row, Col, Card } from 'antd';
import {
  HomeOutlined,
  UserOutlined,
  BarChartOutlined,
  SettingOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import Navbar from './Navbar';

const { Header, Sider, Content } = Layout;
const { Title } = Typography;

const Dashboard = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedKey, setSelectedKey] = useState('facilities'); // default to facilities
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [facilities, setFacilities] = useState([]);

  const [form] = Form.useForm();

  const handleMenuClick = e => {
    setSelectedKey(e.key);
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleAddFacility = (values) => {
    const newFacility = {
      id: Date.now(), // temporary id, replace with real id from backend later
      name: values.name,
      location: values.location,
    };
    setFacilities(prev => [...prev, newFacility]);
    setIsModalVisible(false);
    form.resetFields();
  };

  // Facilities tab content
  const facilitiesContent = (
    <>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={showModal}
        style={{ marginBottom: 24, backgroundColor: '#fadb14', borderColor: '#fadb14', color: '#004080' }}
      >
        Add New Facility
      </Button>
      <Row gutter={[24, 24]}>
        {facilities.length === 0 && (
          <Col span={24} style={{ textAlign: 'center', color: '#888' }}>
            No facilities added yet.
          </Col>
        )}
        {facilities.map(facility => (
          <Col key={facility.id} xs={24} sm={12} md={8} lg={6}>
            <Card
              hoverable
              title={facility.name}
              style={{ borderColor: '#fadb14' }}
              headStyle={{ backgroundColor: '#fadb14', color: '#004080' }}
            >
              <p><strong>Location:</strong> {facility.location}</p>
            </Card>
          </Col>
        ))}
      </Row>

      <Modal
        title="Add New Facility"
        visible={isModalVisible}
        onCancel={handleCancel}
        okText="Add"
        onOk={() => form.submit()}
        okButtonProps={{ style: { backgroundColor: '#fadb14', borderColor: '#fadb14', color: '#004080' } }}
      >
        <Form form={form} layout="vertical" onFinish={handleAddFacility}>
          <Form.Item
            label="Facility Name"
            name="name"
            rules={[{ required: true, message: 'Please input the facility name!' }]}
          >
            <Input placeholder="Enter facility name" />
          </Form.Item>
          <Form.Item
            label="Location"
            name="location"
            rules={[{ required: true, message: 'Please input the location!' }]}
          >
            <Input placeholder="Enter location" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );

  // Placeholder content for other tabs
  const placeholderContent = key => (
    <div style={{ textAlign: 'center', color: '#888', fontSize: 18, padding: 40 }}>
      {key.charAt(0).toUpperCase() + key.slice(1)} content is not implemented yet.
    </div>
  );

  return (
    <Layout style={{ minHeight: '100vh', backgroundColor: '#e6f7ff' }}>
      <Header style={{ padding: 0, backgroundColor: '#004080' }}>
        <Navbar />
      </Header>
      <Layout>
        <Sider
          collapsible
          collapsed={collapsed}
          onCollapse={setCollapsed}
          width={220}
          style={{ backgroundColor: '#001529' }}
        >
          <Menu
            theme="dark"
            mode="inline"
            selectedKeys={[selectedKey]}
            onClick={handleMenuClick}
            style={{ height: '100%', borderRight: 0 }}
          >
            <Menu.Item key="facilities" icon={<HomeOutlined />}>
              Facilities
            </Menu.Item>
            <Menu.Item key="users" icon={<UserOutlined />}>
              Users
            </Menu.Item>
            <Menu.Item key="analytics" icon={<BarChartOutlined />}>
              Analytics
            </Menu.Item>
            <Menu.Item key="settings" icon={<SettingOutlined />}>
              Settings
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout style={{ padding: '24px', backgroundColor: '#e6f7ff' }}>
          <Content
            style={{
              padding: 24,
              margin: 0,
              minHeight: 280,
              backgroundColor: '#ffffff',
              borderRadius: 8,
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            }}
          >
            <Title level={2} style={{ color: '#004080', marginBottom: 24 }}>
              {selectedKey === 'facilities' ? 'Your Facilities' : selectedKey.charAt(0).toUpperCase() + selectedKey.slice(1)}
            </Title>
            {selectedKey === 'facilities' ? facilitiesContent : placeholderContent(selectedKey)}
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default Dashboard;

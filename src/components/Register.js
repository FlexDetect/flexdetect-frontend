import React, { useState } from 'react';
import { Form, Input, Button, Typography, Layout, message } from 'antd';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar';

const { Title, Text } = Typography;
const { Content } = Layout;

const API_URL = 'http://localhost:8080/api/users';

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      await axios.post(`${API_URL}/register`, {
        email: values.email,
        password: values.password,
      });
      message.success('Registration successful! You can now log in.');
      navigate('/dashboard');
    } catch (error) {
      message.error(error.response?.data || 'Registration failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout style={{ backgroundColor: '#e6f7ff' }}>
      <Navbar />
      <Content
        style={{
          maxWidth: 500,
          minHeight: 400,
          margin: '80px auto',
          padding: 32,
          background: '#fff',
          borderRadius: 8,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        <Title
          level={2}
          style={{ textAlign: 'center', color: '#004080', fontSize: '2.5rem' }}
        >
          Create Account
        </Title>
        <Form name="register" layout="vertical" onFinish={onFinish} requiredMark={false}>
          {/* ... ostali Form.Item-i ostanejo enaki ... */}
          <Form.Item
            label={<span style={{ fontSize: '1.2rem' }}>Email</span>}
            name="email"
            rules={[
              { required: true, message: 'Please input your email!' },
              { type: 'email', message: 'Please enter a valid email!' },
            ]}
          >
            <Input size="large" />
          </Form.Item>

          <Form.Item
            label={<span style={{ fontSize: '1.2rem' }}>Password</span>}
            name="password"
            rules={[
              { required: true, message: 'Please input your password!' },
              { min: 6, message: 'Password must be minimum 6 characters.' },
            ]}
          >
            <Input.Password size="large" />
          </Form.Item>

          <Form.Item
            label={<span style={{ fontSize: '1.2rem' }}>Confirm Password</span>}
            name="confirmPassword"
            dependencies={['password']}
            rules={[
              { required: true, message: 'Please confirm your password!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('The two passwords do not match!'));
                },
              }),
            ]}
          >
            <Input.Password size="large" />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              loading={loading}
              style={{
                backgroundColor: '#fadb14',
                borderColor: '#fadb14',
                color: '#004080',
                fontSize: '1.2rem',
              }}
            >
              Register
            </Button>
          </Form.Item>
        </Form>

        <Text style={{ textAlign: 'center', marginTop: 16, display: 'block' }}>
          Already have an account? <Link to="/login">Log in</Link>
        </Text>
      </Content>
    </Layout>
  );
};

export default Register;

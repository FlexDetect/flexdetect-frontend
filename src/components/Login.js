import React, { useState } from 'react';
import { Form, Input, Button, Typography, Layout, message } from 'antd';
import Navbar from './Navbar';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../services/auth';

const { Title, Text } = Typography;
const { Content } = Layout;

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      await login(email, password);
      // po uspešni prijavi osveži stanje aplikacije, nato preusmeri uporabnika
      navigate('/dashboard'); // prilagodi, če želiš
    } catch (err) {
      setError('Error. Please check your credentials and try again.');
    }
  };

  return (
    <Layout style={{ backgroundColor: '#e6f7ff' }}>
      <Navbar />
      <Content
        style={{
          maxWidth: 500,
          minHeight: 300,
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
          Login
        </Title>

        <Form layout="vertical" onSubmitCapture={handleSubmit} requiredMark={false}>
          <Form.Item
            label={<span style={{ fontSize: '1.2rem' }}>Email</span>}
            name="email"
            rules={[
              { required: true, message: 'Please, enter a valid email' },
              { type: 'email', message: 'Please, enter a valid email' },
            ]}
          >
            <Input
              size="large"
              value={email}
              onChange={e => setEmail(e.target.value)}
              type="email"
            />
          </Form.Item>

          <Form.Item
            label={<span style={{ fontSize: '1.2rem' }}>Password</span>}
            name="password"
            rules={[{ required: true, message: 'Please, enter your password' }]}
          >
            <Input.Password
              size="large"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </Form.Item>

          {error && <p style={{ color: 'red', marginBottom: 16 }}>{error}</p>}

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              style={{
                backgroundColor: '#fadb14',
                borderColor: '#fadb14',
                color: '#004080',
                fontSize: '1.2rem',
              }}
            >
              Login
            </Button>
          </Form.Item>
        </Form>

        <Text style={{ textAlign: 'center', marginTop: 16, display: 'block' }}>
          Don't have an account yet? <Link to="/register">Register</Link>
        </Text>
      </Content>
    </Layout>
  );
};

export default Login;

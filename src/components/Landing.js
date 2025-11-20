import React from 'react';
import { Layout, Menu, Button, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import { isLoggedIn } from '../services/auth';

const { Header, Content, Footer } = Layout;
const { Title, Paragraph } = Typography;

const Landing = () => {
  const navigate = useNavigate();
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: '#004080',
          padding: '0 24px',
        }}
      >
        <div style={{ color: '#fff', fontWeight: 'bold', fontSize: 24 }}>
          FlexDetect
        </div>

        {isLoggedIn() ? (
          <Button
            type="primary"
            style={{ backgroundColor: '#fadb14', borderColor: '#fadb14', color: '#004080'  }}
            onClick={() => navigate('/dashboard')}
          >
            Dashboard
          </Button>
        ) : (
          <Button
            type="primary"
            style={{ backgroundColor: '#fadb14', borderColor: '#fadb14', color: '#004080' }}
            onClick={() => navigate('/register')}
          >
            Register
          </Button>
        )}
      </Header>

      <Content style={{ padding: '80px 50px', backgroundColor: '#e6f7ff' /* light blue */ }}>
        <div
          style={{
            maxWidth: 800,
            margin: '0 auto',
            textAlign: 'center',
            color: '#004080',
          }}
        >
          <Title level={1} style={{ fontWeight: 'bold' }}>
            Flexible Energy Management
          </Title>
          <Paragraph style={{ fontSize: 18, lineHeight: 1.6 }}>
            Monitor and optimize energy usage in your buildings with FlexDetect.  
            Our platform helps you detect and adapt energy consumption patterns  
            for a smarter, sustainable future.
          </Paragraph>
          <Button
            type="primary"
            size="large"
            style={{ backgroundColor: '#fadb14', borderColor: '#fadb14', color: '#004080' }}
          >
            Get Started
          </Button>
        </div>
      </Content>
      <Footer style={{ textAlign: 'center', backgroundColor: '#004080', color: '#fff' }}>
        © 2025 FlexDetect. Aljaž Brodar.
      </Footer>
    </Layout>
  );
};

export default Landing;

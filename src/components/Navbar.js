import React from 'react';
import { Layout, Menu, Button } from 'antd';
import { Link, useNavigate } from 'react-router-dom';

const { Header } = Layout;

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <Header
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#004080',
        padding: '0 24px',
      }}
    >
    <div style={{ color: '#fff', fontWeight: 'bold', fontSize: 24}} onClick={() => navigate('/')}>
      FlexDetect
    </div>
    </Header>
  );
};

export default Navbar;

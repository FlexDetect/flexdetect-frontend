// src/components/Dashboard.js
import React, { useState, useEffect, useCallback } from 'react';
import { Layout, Menu, Typography } from 'antd';
import {
  HomeOutlined,
  ProfileOutlined,
  DatabaseOutlined,
  BarChartOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import {
  fetchFacilities,
  fetchMeasurementNames,
  fetchDatasets,
  fetchMeasurements,
} from '../services/dataServiceClient'; // Assuming this path

import Navbar from './Navbar';
import Facilities from './Facilities';
import CustomFields from './CustomFields';
import Datasets from './Datasets';
import Measurements from './Measurements';
import MLDetection from './MLDetection';


const { Header, Sider, Content } = Layout;
const { Title } = Typography;

const Dashboard = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedKey, setSelectedKey] = useState('facilities');

  // Shared data states
  const [facilities, setFacilities] = useState([]);
  const [measurementNames, setMeasurementNames] = useState([]);
  const [datasets, setDatasets] = useState([]);
  const [measurements, setMeasurements] = useState([]);

  // Selected IDs for navigation and relations
  const [selectedFacilityId, setSelectedFacilityId] = useState(null);
  const [selectedDatasetId, setSelectedDatasetId] = useState(null);

  // --- Loaders ---

  const loadFacilities = useCallback(async () => {
    try {
      const data = await fetchFacilities();
      setFacilities(data);
      if (!selectedFacilityId && data.length > 0) {
        setSelectedFacilityId(data[0].id);
      }
    } catch {
      // message.error('Failed to load facilities'); // Move to components if needed
    }
  }, [selectedFacilityId]);

  const loadMeasurementNames = useCallback(async () => {
    try {
      const data = await fetchMeasurementNames();
      setMeasurementNames(data);
    } catch {
      // message.error('Failed to load measurement names');
    }
  }, []);

  const loadDatasets = useCallback(async (facilityId) => {
    if (!facilityId) {
      setDatasets([]);
      return;
    }
    try {
      const data = await fetchDatasets(facilityId);
      setDatasets(data);
    } catch {
      // message.error('Failed to load datasets');
    }
  }, []);

  const loadMeasurements = useCallback(async (datasetId) => {
    if (!datasetId) {
      setMeasurements([]);
      return;
    }
    try {
      const data = await fetchMeasurements(datasetId);
      setMeasurements(data);
    } catch {
      // message.error('Failed to load measurements');
    }
  }, []);

  // --- Effects ---

  useEffect(() => {
    loadFacilities();
  }, [loadFacilities]);

  useEffect(() => {
    if (selectedFacilityId) {
      loadDatasets(selectedFacilityId);
      loadMeasurementNames();
      setSelectedDatasetId(null);
      setMeasurements([]);
    } else {
      setDatasets([]);
      setMeasurementNames([]);
      setSelectedDatasetId(null);
      setMeasurements([]);
    }
  }, [selectedFacilityId, loadDatasets, loadMeasurementNames]);

  useEffect(() => {
    if (selectedDatasetId) {
      loadMeasurements(selectedDatasetId);
    } else {
      setMeasurements([]);
    }
  }, [selectedDatasetId, loadMeasurements]);

  // --- Content components with props ---

  const contentMap = {
    facilities: (
      <Facilities
        facilities={facilities}
        selectedFacilityId={selectedFacilityId}
        onSelectFacility={setSelectedFacilityId}
        onRefreshFacilities={loadFacilities}
      />
    ),
    measurementNames: (
      <CustomFields
        measurementNames={measurementNames}
        onRefreshMeasurementNames={loadMeasurementNames}
      />
    ),
    datasets: (
      <Datasets
        datasets={datasets}
        selectedFacilityId={selectedFacilityId}
        selectedDatasetId={selectedDatasetId}
        onSelectDataset={setSelectedDatasetId}
        onRefreshDatasets={() => loadDatasets(selectedFacilityId)}
      />
    ),
    measurements: (
      <Measurements
        measurements={measurements}
        measurementNames={measurementNames}
        selectedDatasetId={selectedDatasetId}
        onRefreshMeasurements={() => loadMeasurements(selectedDatasetId)}
      />
    ),
    ml: (
    <MLDetection selectedDatasetId={selectedDatasetId} measurements={measurements} />
),
  };

  // --- Main Layout ---
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
        onClick={(e) => setSelectedKey(e.key)}
        style={{ height: '100%', borderRight: 0 }}
      >
        <Menu.SubMenu
          key="data"
          icon={<DatabaseOutlined />}
          title="Data Service"
        >
          <Menu.Item key="facilities" icon={<HomeOutlined />}>
            Facilities
          </Menu.Item>

          <Menu.Item key="measurementNames" icon={<ProfileOutlined />}>
            Custom Fields
          </Menu.Item>

          <Menu.Item
            key="datasets"
            icon={<DatabaseOutlined />}
            disabled={!selectedFacilityId}
          >
            Datasets
          </Menu.Item>

          <Menu.Item
            key="measurements"
            icon={<BarChartOutlined />}
            disabled={!selectedDatasetId}
          >
            Measurements
          </Menu.Item>
        </Menu.SubMenu>

        <Menu.SubMenu
          key="analytics"
          icon={<BarChartOutlined />}
          title="Analytics"
        >
          <Menu.Item
            key="ml"
            icon={<SettingOutlined />}
            disabled={!selectedDatasetId}
          >
            ML Detection
          </Menu.Item>

          <Menu.Item key="visualization" disabled>
            Visualization
          </Menu.Item>
        </Menu.SubMenu>
      </Menu>
        </Sider>
        <Layout style={{ padding: '24px', backgroundColor: '#e6f7ff' }}>
          <Content
            style={{
              padding: 24,
              margin: 0,
              minHeight: 280,
              backgroundColor: '#fff',
              borderRadius: 8,
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            }}
          >
            <Title level={2} style={{ color: '#004080', marginBottom: 24 }}>
              {selectedKey === 'facilities'
                ? 'Your Facilities'
                : selectedKey === 'measurementNames'
                ? 'Custom Measurement Fields'
                : selectedKey.charAt(0).toUpperCase() + selectedKey.slice(1)
                ? 'ML Detection'
                : selectedKey === 'ml'}
            </Title>
            {contentMap[selectedKey]}
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default Dashboard;
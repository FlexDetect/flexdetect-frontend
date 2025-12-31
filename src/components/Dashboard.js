import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Layout,
  Menu,
  Typography,
  Button,
  Modal,
  Form,
  Input,
  Row,
  Col,
  Card,
  Table,
  Select,
  message,
  DatePicker,
  Radio,
  Upload,
} from 'antd';
import {
  HomeOutlined,
  ProfileOutlined,
  DatabaseOutlined,
  BarChartOutlined,
  SettingOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import {
  fetchFacilities,
  createFacility,
  updateFacility,
  deleteFacility,
  fetchMeasurementNames,
  createMeasurementName,
  updateMeasurementName,
  deleteMeasurementName,
  fetchDatasets,
  createDataset,
  updateDataset,
  deleteDataset,
  fetchMeasurements,
  createMeasurement,
  deleteMeasurement,
} from '../services/dataServiceClient';

import Navbar from './Navbar';
import dayjs from 'dayjs';

const { Header, Sider, Content } = Layout;
const { Title } = Typography;
const { Option } = Select;

const facilityTypes = ['Office', 'Retail', 'Industrial', 'Mixed-use'];
const dataTypes = ['FLOAT', 'INT', 'BOOL'];

const BUTTON_STYLE = {
  backgroundColor: '#1890ff',
  borderColor: '#1890ff',
  color: '#fff',
};

const Dashboard = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedKey, setSelectedKey] = useState('facilities');

  // Shared data states
  const [facilities, setFacilities] = useState([]);
  const [measurementNames, setMeasurementNames] = useState([]);
  const [datasets, setDatasets] = useState([]);
  const [measurements, setMeasurements] = useState([]);

  // Modal states and editing objects
  const [facilityModalVisible, setFacilityModalVisible] = useState(false);
  const [editingFacility, setEditingFacility] = useState(null);

  const [measurementNameModalVisible, setMeasurementNameModalVisible] = useState(false);
  const [editingMeasurementName, setEditingMeasurementName] = useState(null);

  const [datasetModalVisible, setDatasetModalVisible] = useState(false);
  const [editingDataset, setEditingDataset] = useState(null);

  const [measurementModalVisible, setMeasurementModalVisible] = useState(false);
  const [editingMeasurement, setEditingMeasurement] = useState(null);

  // Forms
  const [facilityForm] = Form.useForm();
  const [measurementNameForm] = Form.useForm();
  const [datasetForm] = Form.useForm();
  const [measurementForm] = Form.useForm();

  // Selected IDs for navigation and relations
  const [selectedFacilityId, setSelectedFacilityId] = useState(null);
  const [selectedDatasetId, setSelectedDatasetId] = useState(null);

  // --- Loaders and API calls ---

  const loadFacilities = useCallback(async () => {
    try {
      const data = await fetchFacilities();
      setFacilities(data);
      if (!selectedFacilityId && data.length > 0) {
        setSelectedFacilityId(data[0].id);
      }
    } catch {
      message.error('Failed to load facilities');
    }
  }, [selectedFacilityId]);

  const loadMeasurementNames = useCallback(async () => {
    try {
      const data = await fetchMeasurementNames();
      setMeasurementNames(data);
    } catch {
      message.error('Failed to load measurement names');
    }
  }, []);

  const loadDatasets = useCallback(
    async (facilityId) => {
      if (!facilityId) {
        setDatasets([]);
        return;
      }
      try {
        const data = await fetchDatasets(facilityId);
        setDatasets(data);
      } catch {
        message.error('Failed to load datasets');
      }
    },
    []
  );

  const loadMeasurements = useCallback(
    async (datasetId) => {
      if (!datasetId) {
        setMeasurements([]);
        return;
      }
      try {
        const data = await fetchMeasurements(datasetId);
        setMeasurements(data);
      } catch {
        message.error('Failed to load measurements');
      }
    },
    []
  );

  // --- CRUD operations ---

  // Facilities
  const saveFacility = async (facility) => {
    console.log('SAVE FACILITY FIRED', facility);
    try {
      if (facility.id) {
        await updateFacility(facility.id, facility);
        message.success('Facility updated');
      } else {
        await createFacility(facility);
        message.success('Facility created');
      }
      await loadFacilities();
      setSelectedKey('facilities');
      setFacilityModalVisible(false);
      setEditingFacility(null);
      facilityForm.resetFields();
    } catch {
      message.error('Failed to save facility');
    }
  };

  const removeFacility = async (id) => {
    try {
      await deleteFacility(id);
      message.success('Facility deleted');
      if (selectedFacilityId === id) {
        setSelectedFacilityId(null);
        setDatasets([]);
        setSelectedDatasetId(null);
        setMeasurements([]);
      }
      await loadFacilities();
    } catch {
      message.error('Failed to delete facility');
    }
  };

  // Measurement Names (Custom Fields)
  const saveMeasurementName = async (mn) => {
    console.log('SAVE MEASUREMENT NAME FIRED', mn); 
    try {
      if (mn.id) {
        await updateMeasurementName(mn.id, mn);
        message.success('Measurement name updated');
      } else {
        await createMeasurementName(mn);
        message.success('Measurement name created');
      }
      await loadMeasurementNames();
      setMeasurementNameModalVisible(false);
      setEditingMeasurementName(null);
      measurementNameForm.resetFields();
    } catch {
      message.error('Failed to save measurement name');
    }
  };

  const removeMeasurementName = async (id) => {
    try {
      await deleteMeasurementName(id);
      message.success('Measurement name deleted');
      await loadMeasurementNames();
    } catch {
      message.error('Failed to delete measurement name');
    }
  };

  // Datasets
  const saveDataset = async (dataset) => {
    console.log('SAVE DATASET FIRED', dataset);
    try {
      const payload = {
        ...dataset,
        createdAt: dataset.createdAt?.toISOString(),
      };
      if (dataset.id) {
        await updateDataset(selectedFacilityId, dataset.id, payload);
        message.success('Dataset updated');
      } else {
        await createDataset(selectedFacilityId, payload);
        message.success('Dataset created');
      }
      await loadDatasets(selectedFacilityId);
      setDatasetModalVisible(false);
      setEditingDataset(null);
      datasetForm.resetFields();
    } catch {
      message.error('Failed to save dataset');
    }
  };

  const removeDataset = async (id) => {
    try {
      await deleteDataset(selectedFacilityId, id);
      message.success('Dataset deleted');
      if (selectedDatasetId === id) {
        setSelectedDatasetId(null);
        setMeasurements([]);
      }
      await loadDatasets(selectedFacilityId);
    } catch {
      message.error('Failed to delete dataset');
    }
  };

  // Measurements
const saveMeasurement = async (formValues) => {
  console.log('SAVE MEASUREMENT FIRED', formValues);
  if (!selectedDatasetId) {
    message.error('No dataset selected');
    return;
  }

  try {
    const payload = {
      measurementNameId: formValues.measurementNameId,
      timestamp: formValues.timestamp.toISOString(),
    };

    switch (formValues.valueType) {
      case 'FLOAT':
        payload.valueFloat = parseFloat(formValues.valueFloat);
        break;
      case 'INT':
        payload.valueInt = parseInt(formValues.valueInt, 10);
        break;
      case 'BOOL':
        payload.valueBool = Number(formValues.valueBool);
        break;
      default:
        throw new Error('Invalid valueType');
    }

    await createMeasurement(selectedDatasetId, payload);
    message.success('Measurement created');
    
    await loadMeasurements(selectedDatasetId);
    setMeasurementModalVisible(false);
    setEditingMeasurement(null);
    measurementForm.resetFields();
  } catch (error) {
    console.error(error);
    message.error('Failed to save measurement');
  }
};


  const removeMeasurement = async (id) => {
    try {
      await deleteMeasurement(selectedDatasetId, id);
      message.success('Measurement deleted');
      await loadMeasurements(selectedDatasetId);
    } catch {
      message.error('Failed to delete measurement');
    }
  };

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

  // --- Modal openers ---

  const openFacilityModal = (facility = null) => {
    setEditingFacility(facility);
    if (facility) facilityForm.setFieldsValue(facility);
    else facilityForm.resetFields();
    setFacilityModalVisible(true);
  };

  const openMeasurementNameModal = (mn = null) => {
    setEditingMeasurementName(mn);
    if (mn) measurementNameForm.setFieldsValue(mn);
    else measurementNameForm.resetFields();
    setMeasurementNameModalVisible(true);
  };

  const openDatasetModal = (dataset = null) => {
    setEditingDataset(dataset);
    if (dataset) {
      datasetForm.setFieldsValue({
        ...dataset,
        createdAt: dataset.createdAt ? dayjs(dataset.createdAt) : null,
      });
    } else {
      datasetForm.resetFields();
    }
    setDatasetModalVisible(true);
  };

  const openMeasurementModal = (measurement = null) => {
    setEditingMeasurement(measurement);
    if (measurement) {
      measurementForm.setFieldsValue({
        ...measurement,
        timestamp: dayjs(measurement.timestamp),
        measurementNameId: measurement.measurementNameId?.id,
        valueType: (() => {
          if (measurement.valueFloat !== null && measurement.valueFloat !== undefined) return 'FLOAT';
          if (measurement.valueInt !== null && measurement.valueInt !== undefined) return 'INT';
          if (measurement.valueBool !== null && measurement.valueBool !== undefined) return 'BOOL';
          return 'FLOAT';
        })(),
      });
    } else {
      measurementForm.resetFields();
    }
    setMeasurementModalVisible(true);
  };

  // --- Drag and Drop CSV upload for measurements ---

const [csvUploading, setCsvUploading] = useState(false);

const handleCSVUpload = ({ file }) => {
  if (!file || !selectedDatasetId) return;

  const reader = new FileReader();

  reader.onload = async (e) => {
    setCsvUploading(true);

    try {
      const text = e.target.result;

      // normalize line endings
      const lines = text
        .replace(/\r\n/g, '\n')
        .split('\n')
        .map(l => l.trim())
        .filter(Boolean);

      if (lines.length < 2) {
        message.error('CSV must have header and at least one data row');
        return;
      }

      const headers = lines[0].split(',').map(h => h.trim());

      const timestampIdx = headers.indexOf('Timestamp_Local');
      if (timestampIdx === -1) {
        message.error('CSV must contain "Timestamp_Local" column exactly');
        return;
      }

      // map CSV column → measurementName
      const columnMap = {};
      headers.forEach((h, idx) => {
        if (idx === timestampIdx) return;
        const mn = measurementNames.find(m => m.name === h);
        if (mn) columnMap[idx] = mn;
      });

      if (Object.keys(columnMap).length === 0) {
        message.error('No CSV columns match measurement names exactly');
        return;
      }

      const BATCH_SIZE = 500;
      let batch = [];
      let created = 0;

      const flushBatch = async () => {
        if (batch.length === 0) return;
        await Promise.all(batch);
        created += batch.length;
        batch = [];
      };

      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim());
        if (values.length !== headers.length) continue;

        const tsRaw = values[timestampIdx];
        if (!tsRaw) continue;

        const timestamp = dayjs(tsRaw).toISOString();

        for (const [idxStr, mn] of Object.entries(columnMap)) {
          const idx = Number(idxStr);
          const raw = values[idx];
          if (raw === '' || raw == null) continue;

          const payload = {
            measurementNameId: mn.id,
            timestamp,
            valueInt: null,
            valueFloat: null,
            valueBool: null,
          };

          if (mn.dataType === 'FLOAT') {
            const v = Number(raw);
            if (!Number.isNaN(v)) payload.valueFloat = v;
          } else if (mn.dataType === 'INT') {
            const v = Number(raw);
            if (!Number.isNaN(v)) payload.valueInt = v;
          } else if (mn.dataType === 'BOOL') {
            // STRICT boolean parsing
            if (raw === '1' || raw.toLowerCase() === 'true') payload.valueBool = 1;
            else if (raw === '0' || raw.toLowerCase() === 'false') payload.valueBool = 0;
            else continue;
          }

          batch.push(createMeasurement(selectedDatasetId, payload));

          if (batch.length >= BATCH_SIZE) {
            await flushBatch();
          }
        }
      }

      await flushBatch();

      message.success(`Uploaded ${created} measurements`);
      await loadMeasurements(selectedDatasetId);

    } catch (err) {
      console.error(err);
      message.error('CSV upload failed');
    } finally {
      setCsvUploading(false);
    }
  };

  reader.readAsText(file);
};



  // --- UI components ---

  // Facilities list with blue buttons, improved UI
  const facilitiesContent = (
    <>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={() => openFacilityModal()}
        style={{ ...BUTTON_STYLE, marginBottom: 16 }}  // Add marginBottom here
      >
        Add New Facility
      </Button>


      <Row gutter={[24, 24]}>
        {facilities.length === 0 ? (
          <Col span={24} style={{ textAlign: 'center', color: '#888' }}>
            No facilities added yet.
          </Col>
        ) : (
          facilities.map((facility) => (
            <Col key={facility.id} xs={24} sm={12} md={8} lg={6}>
              <Card
                hoverable
                title={facility.name}
                extra={
                  <>
                    <Button
                      type="primary"
                      icon={<EditOutlined />}
                      onClick={() => openFacilityModal(facility)}
                      style={{ marginRight: 8, ...BUTTON_STYLE }}
                    />
                    <Button
                      type="default"
                      icon={<DeleteOutlined />}
                      onClick={() => removeFacility(facility.id)}
                      danger={false}
                      style={{ color: '#ff4d4f', borderColor: '#ff4d4f' }}
                    />
                  </>
                }
                style={{ borderColor: '#1890ff', cursor: 'pointer' }}
                headStyle={{ backgroundColor: '#1890ff', color: '#fff' }}
                onClick={() => setSelectedFacilityId(facility.id)}
                bordered={selectedFacilityId === facility.id}
              >
                <p><strong>Address:</strong> {facility.address}</p>
                <p><strong>Type:</strong> {facility.type}</p>
                <p><strong>Size:</strong> {facility.size} sqm, {facility.floors} floors</p>
                <p><strong>Contact:</strong> {facility.contactName} ({facility.contactPhone}, {facility.contactEmail})</p>
              </Card>
            </Col>
          ))
        )}
      </Row>

      <Modal
        title={editingFacility ? 'Edit Facility' : 'Add New Facility'}
        open={facilityModalVisible}
        onCancel={() => setFacilityModalVisible(false)}
        okText={editingFacility ? 'Save' : 'Add'}
        onOk={() => facilityForm.submit()}
        okButtonProps={{ style: BUTTON_STYLE }}
        width={700}
      >
        <Form form={facilityForm} layout="vertical" onFinish={saveFacility} initialValues={{ type: 'Office' }}>
          <Form.Item name="id" style={{ display: 'none' }}>
            <Input type="hidden" />
          </Form.Item>

          <Form.Item
            label="Facility Name"
            name="name"
            rules={[{ required: true, message: 'Please input the facility name!' }]}
          >
            <Input placeholder="Enter facility name" />
          </Form.Item>
          <Form.Item
            label="Address"
            name="address"
            rules={[{ required: true, message: 'Please input the address!' }]}
          >
            <Input placeholder="Enter address" />
          </Form.Item>
          <Form.Item
            label="Facility Type"
            name="type"
            rules={[{ required: true, message: 'Please select facility type!' }]}
          >
            <Select>
              {facilityTypes.map((type) => (
                <Option key={type} value={type}>{type}</Option>
              ))}
            </Select>
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Size (sqm)"
                name="size"
                rules={[{ required: true, message: 'Please input size in sqm!' }]}
              >
                <Input type="number" min={0} placeholder="Square meters" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Floors"
                name="floors"
                rules={[{ required: true, message: 'Please input number of floors!' }]}
              >
                <Input type="number" min={1} placeholder="Floors" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            label="Contact Person Name"
            name="contactName"
            rules={[{ required: true, message: 'Please input contact person name!' }]}
          >
            <Input placeholder="Contact person name" />
          </Form.Item>
          <Form.Item
            label="Contact Phone"
            name="contactPhone"
            rules={[{ required: true, message: 'Please input contact phone!' }]}
          >
            <Input placeholder="Phone number" />
          </Form.Item>
          <Form.Item
            label="Contact Email"
            name="contactEmail"
            rules={[
              { required: true, message: 'Please input contact email!' },
              { type: 'email', message: 'Please enter a valid email!' },
            ]}
          >
            <Input placeholder="Email address" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );

  // Measurement Names with unified blue theme and delete visible
  const measurementNamesContent = (
    <>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={() => openMeasurementNameModal()}
        style={{ ...BUTTON_STYLE, marginBottom: 16 }} 
      >
        Add Measurement Name
      </Button>

      <Row gutter={[24, 24]}>
        {measurementNames.length === 0 ? (
          <Col span={24} style={{ textAlign: 'center', color: '#888' }}>
            No measurement names added yet.
          </Col>
        ) : (
          measurementNames.map((mn) => (
            <Col key={mn.id} xs={24} sm={12} md={8} lg={6}>
              <Card
                hoverable
                title={mn.name}
                extra={
                  <>
                    <Button
                      type="primary"
                      icon={<EditOutlined />}
                      onClick={() => openMeasurementNameModal(mn)}
                      style={{ marginRight: 8, ...BUTTON_STYLE }}
                    />
                    <Button
                      type="default"
                      icon={<DeleteOutlined />}
                      onClick={() => removeMeasurementName(mn.id)}
                      danger={false}
                      style={{ color: '#ff4d4f', borderColor: '#ff4d4f' }}
                    />
                  </>
                }
                style={{ borderColor: '#1890ff', cursor: 'pointer' }}
                headStyle={{ backgroundColor: '#1890ff', color: '#fff' }}
              >
                <p><strong>Unit:</strong> {mn.unit}</p>
                <p><strong>Data Type:</strong> {mn.dataType}</p>
              </Card>
            </Col>
          ))
        )}
      </Row>

      <Modal
        title={editingMeasurementName ? 'Edit Measurement Name' : 'Add Measurement Name'}
        open={measurementNameModalVisible}
        onCancel={() => setMeasurementNameModalVisible(false)}
        okText={editingMeasurementName ? 'Save' : 'Add'}
        onOk={() => measurementNameForm.submit()}
        okButtonProps={{ style: BUTTON_STYLE }}
        width={600}
      >
        <Form form={measurementNameForm} layout="vertical" onFinish={saveMeasurementName}>
          <Form.Item name="id" style={{ display: 'none' }}>
          <Input type="hidden" />
        </Form.Item>
          <Form.Item
            label="Measurement Name"
            name="name"
            rules={[{ required: true, message: 'Please input measurement name!' }]}
          >
            <Input placeholder="e.g. Temperature" />
          </Form.Item>
          <Form.Item
            label="Unit"
            name="unit"
            rules={[{ required: true, message: 'Please input unit!' }]}
          >
            <Input placeholder="e.g. °C" />
          </Form.Item>
          <Form.Item
            label="Data Type"
            name="dataType"
            rules={[{ required: true, message: 'Please select data type!' }]}
          >
            <Radio.Group>
              {dataTypes.map((type) => (
                <Radio key={type} value={type}>{type}</Radio>
              ))}
            </Radio.Group>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );

  // Datasets with blue theme and clean UI
  const datasetsContent = (
    <>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        disabled={!selectedFacilityId}
        onClick={() => openDatasetModal()}
        style={{ ...BUTTON_STYLE, marginBottom: 16 }}
      >
        Add Dataset
      </Button>

      <Row gutter={[24, 24]}>
        {datasets.length === 0 ? (
          <Col span={24} style={{ textAlign: 'center', color: '#888' }}>
            No datasets added yet.
          </Col>
        ) : (
          datasets.map((ds) => (
            <Col key={ds.id} xs={24} sm={12} md={8} lg={6}>
              <Card
                hoverable
                title={ds.source || 'Unnamed Dataset'}
                extra={
                  <>
                    <Button
                      type="primary"
                      icon={<EditOutlined />}
                      onClick={() => openDatasetModal(ds)}
                      style={{ marginRight: 8, ...BUTTON_STYLE }}
                    />
                    <Button
                      type="default"
                      icon={<DeleteOutlined />}
                      onClick={() => removeDataset(ds.id)}
                      danger={false}
                      style={{ color: '#ff4d4f', borderColor: '#ff4d4f' }}
                    />
                  </>
                }
                style={{ borderColor: '#1890ff', cursor: 'pointer' }}
                headStyle={{ backgroundColor: '#1890ff', color: '#fff' }}
                onClick={() => setSelectedDatasetId(ds.id)}
                bordered={selectedDatasetId === ds.id}
              >
                <p><strong>Created At:</strong> {dayjs(ds.createdAt).format('YYYY-MM-DD HH:mm')}</p>
              </Card>
            </Col>
          ))
        )}
      </Row>

      <Modal
        title={editingDataset ? 'Edit Dataset' : 'Add Dataset'}
        open={datasetModalVisible}
        onCancel={() => setDatasetModalVisible(false)}
        okText={editingDataset ? 'Save' : 'Add'}
        onOk={() => datasetForm.submit()}
        okButtonProps={{ style: BUTTON_STYLE }}
        width={600}
      >
        <Form form={datasetForm} layout="vertical" onFinish={saveDataset}  onFinishFailed={(errorInfo) => console.log('Validation Failed:', errorInfo)}>
          <Form.Item name="id" style={{ display: 'none' }}>
            <Input type="hidden" />
          </Form.Item>
          <Form.Item
            label="Source"
            name="source"
            rules={[{ required: true, message: 'Please input source!' }]}
          >
            <Input placeholder="Source name or description" />
          </Form.Item>
          <Form.Item
            label="Created At"
            name="createdAt"
            rules={[{ required: true, message: 'Please select created date!' }]}
          >
            <DatePicker showTime format="YYYY-MM-DD HH:mm" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );

  // Measurements with drag & drop CSV upload and virtualized table for performance
// Assume you have measurementNames array from your fetch:
const measurementNameMap = useMemo(() => {
  const map = {};
  measurementNames.forEach(mn => {
    map[mn.id] = mn;
  });
  return map;
}, [measurementNames]);

const measurementsColumns = [
  {
    title: 'Measurement Name',
    dataIndex: ['measurementNameIdMeasurementName', 'name'],
    key: 'name',
    sorter: (a, b) => a.measurementNameIdMeasurementName.name.localeCompare(b.measurementNameIdMeasurementName.name),
  },
  {
    title: 'Timestamp',
    dataIndex: 'timestamp',
    key: 'timestamp',
    render: (val) => dayjs(val).format('YYYY-MM-DD HH:mm:ss'),
    sorter: (a, b) => dayjs(a.timestamp).unix() - dayjs(b.timestamp).unix(),
    defaultSortOrder: 'descend',
  },
  {
    title: 'Value',
    dataIndex: '',
    key: 'value',
    render: (_, record) => {
      if (record.valueFloat !== null && record.valueFloat !== undefined) return record.valueFloat;
      if (record.valueInt !== null && record.valueInt !== undefined) return record.valueInt;
      if (record.valueBool !== null && record.valueBool !== undefined)
        return record.valueBool === 1 ? 'True' : 'False';
      return 'N/A';
    },
    sorter: (a, b) => {
      const valA = a.valueFloat ?? a.valueInt ?? (a.valueBool === 1 ? 1 : 0);
      const valB = b.valueFloat ?? b.valueInt ?? (b.valueBool === 1 ? 1 : 0);
      return valA - valB;
    },
  },
  {
    title: 'Actions',
    key: 'actions',
    fixed: 'right',
    width: 120,
    render: (_, record) => (
      <>
        <Button
          type="default"
          icon={<DeleteOutlined />}
          size="small"
          danger={false}
          style={{ color: '#ff4d4f', borderColor: '#ff4d4f' }}
          onClick={() => removeMeasurement(record.id)}
        />
      </>
    ),
  },
];


  const measurementsContent = (
    <>
      <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
        <Col>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            disabled={!selectedDatasetId || measurementNames.length === 0}
            onClick={() => openMeasurementModal()}
            style={BUTTON_STYLE}
          >
            Add Measurement
          </Button>
        </Col>
        <Col>
          <Upload
            accept=".csv,text/csv"
            beforeUpload={(file) => {
              setCsvUploading(true);
              handleCSVUpload({ file });
              return false;
            }}
            showUploadList={false}
            disabled={!selectedDatasetId}
          >
            <Button icon={<UploadOutlined />} loading={csvUploading} style={BUTTON_STYLE}>
              Upload CSV
            </Button>
          </Upload>
        </Col>
      </Row>

      <Table
        columns={measurementsColumns}
        dataSource={measurements}
        rowKey="id"
        pagination={{
          pageSize: 1000, // large number to show many rows per page (adjust as needed)
          showSizeChanger: false,
        }}
        scroll={{ y: 550 }} // fixed height for vertical scrollbar inside table
        size="small" // smaller row height to fit more rows
      />

      <Modal
        title={editingMeasurement ? 'Edit Measurement' : 'Add Measurement'}
        open={measurementModalVisible}
        onCancel={() => setMeasurementModalVisible(false)}
        okText={editingMeasurement ? 'Save' : 'Add'}
        onOk={() => measurementForm.submit()}
        okButtonProps={{ style: BUTTON_STYLE }}
        width={600}
      >
        <Form form={measurementForm} layout="vertical" onFinish={saveMeasurement} initialValues={{ valueType: 'FLOAT' }}>
          <Form.Item name="id" style={{ display: 'none' }}>
            <Input type="hidden" />
          </Form.Item>
          <Form.Item
            label="Measurement Name"
            name="measurementNameId"
            rules={[{ required: true, message: 'Please select measurement name!' }]}
          >
            <Select placeholder="Select measurement name" showSearch optionFilterProp="children" filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }>
              {measurementNames.map((mn) => (
                <Option key={mn.id} value={mn.id}>{mn.name}</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Timestamp"
            name="timestamp"
            rules={[{ required: true, message: 'Please select timestamp!' }]}
          >
            <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            label="Value Type"
            name="valueType"
            rules={[{ required: true, message: 'Please select value type!' }]}
          >
            <Radio.Group
              onChange={(e) => {
                measurementForm.setFieldsValue({
                  valueFloat: null,
                  valueInt: null,
                  valueBool: null,
                });
              }}
              optionType="button"
              buttonStyle="solid"
            >
              <Radio value="FLOAT">Float</Radio>
              <Radio value="INT">Integer</Radio>
              <Radio value="BOOL">Boolean</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item noStyle shouldUpdate={(prev, curr) => prev.valueType !== curr.valueType}>
            {({ getFieldValue }) => {
              const valType = getFieldValue('valueType');
              if (valType === 'FLOAT') {
                return (
                  <Form.Item
                    label="Float Value"
                    name="valueFloat"
                    rules={[{ required: true, message: 'Please input float value!' }]}
                  >
                    <Input type="number" step="any" />
                  </Form.Item>
                );
              }
              if (valType === 'INT') {
                return (
                  <Form.Item
                    label="Integer Value"
                    name="valueInt"
                    rules={[{ required: true, message: 'Please input integer value!' }]}
                  >
                    <Input type="number" step="1" />
                  </Form.Item>
                );
              }
              if (valType === 'BOOL') {
                return (
                  <Form.Item
                    label="Boolean Value"
                    name="valueBool"
                    rules={[{ required: true, message: 'Please select boolean value!' }]}
                  >
                    <Radio.Group>
                      <Radio value={1}>True</Radio>
                      <Radio value={0}>False</Radio>
                    </Radio.Group>
                  </Form.Item>
                );  
              }
              return null;
            }}
          </Form.Item>
        </Form>
      </Modal>
    </>
  );

  // --- Content map for sidebar selection ---
  const contentMap = {
    facilities: facilitiesContent,
    measurementNames: measurementNamesContent,
    datasets: datasetsContent,
    measurements: measurementsContent,
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
            <Menu.Item key="settings" icon={<SettingOutlined />} disabled>
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
                : selectedKey.charAt(0).toUpperCase() + selectedKey.slice(1)}
            </Title>
            {contentMap[selectedKey]}
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default Dashboard;


// src/components/Measurements.js
import React, { useState, useMemo } from 'react';
import {
  Button,
  Modal,
  Form,
  Input,
  Row,
  Col,
  Table,
  Select,
  message,
  DatePicker,
  Radio,
  Upload,
} from 'antd';
import {
  PlusOutlined,
  DeleteOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import {
  createMeasurement,
  deleteMeasurement,
  bulkInsertMeasurements,
  deleteAllMeasurementsForDataset,
  bulkDeleteMeasurements,
} from '../services/dataServiceClient';
import dayjs from 'dayjs';

const { Option } = Select;

const BUTTON_STYLE = {
  backgroundColor: '#1890ff',
  borderColor: '#1890ff',
  color: '#fff',
};

const Measurements = ({ measurements, measurementNames, selectedDatasetId, onRefreshMeasurements }) => {
  const [measurementModalVisible, setMeasurementModalVisible] = useState(false);
  const [editingMeasurement, setEditingMeasurement] = useState(null);
  const [measurementForm] = Form.useForm();
  const [csvUploading, setCsvUploading] = useState(false);
  const [deletingAll, setDeletingAll] = useState(false);

  const measurementNameMap = useMemo(() => {
    const map = {};
    measurementNames.forEach(mn => {
      map[mn.id] = mn;
    });
    return map;
  }, [measurementNames]);

  // Save single measurement unchanged (for manual add)
  const saveMeasurement = async (formValues) => {
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
      onRefreshMeasurements();
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
      onRefreshMeasurements();
    } catch {
      message.error('Failed to delete measurement');
    }
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

  // NEW: Bulk Delete Handler
  const handleDeleteAll = async () => {
    if (!selectedDatasetId) {
      message.error('No dataset selected');
      return;
    }

    try {
      setDeletingAll(true);
      await bulkDeleteMeasurements(selectedDatasetId);
      message.success('All measurements deleted for dataset');
      onRefreshMeasurements();
    } catch (err) {
      console.error(err);
      message.error('Failed to delete all measurements');
    } finally {
      setDeletingAll(false);
    }
  };

  // UPDATED: CSV Upload uses bulk API now
  const handleCSVUpload = ({ file }) => {
    if (!file || !selectedDatasetId) return;

    const reader = new FileReader();

    reader.onload = async (e) => {
      setCsvUploading(true);

      try {
        const text = e.target.result;

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

        // Map CSV columns to measurement names
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

        const rows = [];

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

            const row = {
              measurementNameId: mn.id,
              timestamp,
              valueInt: null,
              valueFloat: null,
              valueBool: null,
            };

            if (mn.dataType === 'FLOAT') {
              const v = Number(raw);
              if (!Number.isNaN(v)) row.valueFloat = v;
            } else if (mn.dataType === 'INT') {
              const v = Number(raw);
              if (!Number.isNaN(v)) row.valueInt = v;
            } else if (mn.dataType === 'BOOL') {
              if (raw === '1' || raw.toLowerCase() === 'true') row.valueBool = 1;
              else if (raw === '0' || raw.toLowerCase() === 'false') row.valueBool = 0;
              else continue;
            }

            rows.push(row);
          }
        }

        if (rows.length === 0) {
          message.error('No valid measurement rows to upload');
          return;
        }

        await bulkInsertMeasurements(selectedDatasetId, { rows });

        message.success(`Uploaded ${rows.length} measurements`);
        onRefreshMeasurements();

      } catch (err) {
        console.error(err);
        message.error('CSV upload failed');
      } finally {
        setCsvUploading(false);
      }
    };

    reader.readAsText(file);
  };

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
        <Button
          type="default"
          icon={<DeleteOutlined />}
          size="small"
          danger={false}
          style={{ color: '#ff4d4f', borderColor: '#ff4d4f' }}
          onClick={() => removeMeasurement(record.id)}
        />
      ),
    },
  ];

  return (
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

        <Col style={{ display: 'flex', gap: 8 }}>
          <Upload
            accept=".csv,text/csv"
            beforeUpload={(file) => {
              setCsvUploading(true);
              handleCSVUpload({ file });
              return false;
            }}
            showUploadList={false}
            disabled={!selectedDatasetId || csvUploading}
          >
            <Button icon={<UploadOutlined />} loading={csvUploading} style={BUTTON_STYLE}>
              Upload CSV
            </Button>
          </Upload>

          <Button
            type="default"
            danger
            loading={deletingAll}
            disabled={!selectedDatasetId || deletingAll}
            onClick={handleDeleteAll}
          >
            Delete All
          </Button>
        </Col>
      </Row>

      <Table
        columns={measurementsColumns}
        dataSource={measurements}
        rowKey="id"
        pagination={{
          pageSize: 1000,
          showSizeChanger: false,
        }}
        scroll={{ y: 550 }}
        size="small"
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
};

export default Measurements;

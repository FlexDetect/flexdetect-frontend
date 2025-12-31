// src/components/CustomFields.js
import React, { useState } from 'react';
import {
  Button,
  Modal,
  Form,
  Input,
  Row,
  Col,
  Card,
  Radio,
  message,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import {
  createMeasurementName,
  updateMeasurementName,
  deleteMeasurementName,
} from '../services/dataServiceClient';

const dataTypes = ['FLOAT', 'INT', 'BOOL'];
const BUTTON_STYLE = {
  backgroundColor: '#1890ff',
  borderColor: '#1890ff',
  color: '#fff',
};

const CustomFields = ({ measurementNames, onRefreshMeasurementNames }) => {
  const [measurementNameModalVisible, setMeasurementNameModalVisible] = useState(false);
  const [editingMeasurementName, setEditingMeasurementName] = useState(null);
  const [measurementNameForm] = Form.useForm();

  const saveMeasurementName = async (values) => {
    try {
      if (editingMeasurementName) {
        await updateMeasurementName(editingMeasurementName.id, values);
        message.success('Measurement name updated');
      } else {
        await createMeasurementName(values);
        message.success('Measurement name created');
      }
      onRefreshMeasurementNames();
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
      onRefreshMeasurementNames();
    } catch {
      message.error('Failed to delete measurement name');
    }
  };

  const openMeasurementNameModal = (mn = null) => {
    setEditingMeasurementName(mn);
    if (mn) measurementNameForm.setFieldsValue(mn);
    else measurementNameForm.resetFields();
    setMeasurementNameModalVisible(true);
  };

  return (
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
};

export default CustomFields;
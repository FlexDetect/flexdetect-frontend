// src/components/Facilities.js
import React, { useState } from 'react';
import {
  Button,
  Modal,
  Form,
  Input,
  Row,
  Col,
  Card,
  Select,
  message,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import {
  createFacility,
  updateFacility,
  deleteFacility,
} from '../services/dataServiceClient';

const { Option } = Select;

const facilityTypes = ['Office', 'Retail', 'Industrial', 'Mixed-use'];
const BUTTON_STYLE = {
  backgroundColor: '#1890ff',
  borderColor: '#1890ff',
  color: '#fff',
};

const Facilities = ({ facilities, selectedFacilityId, onSelectFacility, onRefreshFacilities }) => {
  const [facilityModalVisible, setFacilityModalVisible] = useState(false);
  const [editingFacility, setEditingFacility] = useState(null);
  const [facilityForm] = Form.useForm();

  const saveFacility = async (values) => {
    try {
      if (editingFacility) {
        await updateFacility(editingFacility.id, values);
        message.success('Facility updated');
      } else {
        await createFacility(values);
        message.success('Facility created');
      }
      onRefreshFacilities();
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
        onSelectFacility(null);
      }
      onRefreshFacilities();
    } catch {
      message.error('Failed to delete facility');
    }
  };

  const openFacilityModal = (facility = null) => {
    setEditingFacility(facility);
    if (facility) facilityForm.setFieldsValue(facility);
    else facilityForm.resetFields();
    setFacilityModalVisible(true);
  };

  return (
    <>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={() => openFacilityModal()}
        style={{ ...BUTTON_STYLE, marginBottom: 16 }}
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
                onClick={() => onSelectFacility(facility.id)}
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
};

export default Facilities;
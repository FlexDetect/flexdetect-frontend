// src/components/Datasets.js
import React, { useState } from 'react';
import {
  Button,
  Modal,
  Form,
  Input,
  Row,
  Col,
  Card,
  DatePicker,
  message,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import {
  createDataset,
  updateDataset,
  deleteDataset,
} from '../services/dataServiceClient';
import dayjs from 'dayjs';

const BUTTON_STYLE = {
  backgroundColor: '#1890ff',
  borderColor: '#1890ff',
  color: '#fff',
};

const Datasets = ({ datasets, selectedFacilityId, selectedDatasetId, onSelectDataset, onRefreshDatasets }) => {
  const [datasetModalVisible, setDatasetModalVisible] = useState(false);
  const [editingDataset, setEditingDataset] = useState(null);
  const [datasetForm] = Form.useForm();

  const saveDataset = async (values) => {
    try {
      const payload = {
        ...values,
        createdAt: values.createdAt?.toISOString(),
      };
      if (editingDataset) {
        await updateDataset(selectedFacilityId, editingDataset.id, payload);
        message.success('Dataset updated');
      } else {
        await createDataset(selectedFacilityId, payload);
        message.success('Dataset created');
      }
      onRefreshDatasets();
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
        onSelectDataset(null);
      }
      onRefreshDatasets();
    } catch {
      message.error('Failed to delete dataset');
    }
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

  return (
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
                onClick={() => onSelectDataset(ds.id)}
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
        <Form form={datasetForm} layout="vertical" onFinish={saveDataset}>
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
};

export default Datasets;
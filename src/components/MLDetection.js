import React, { useState, useMemo } from 'react';
import { Card, Select, Checkbox, Button, Typography, Divider, message } from 'antd';
import { runMLDetection } from '../services/mlServiceClient';

const { Title, Text } = Typography;
const { Option } = Select;

/**
 * MLDetection
 *
 * Props:
 * - selectedDatasetId: number | null
 * - measurements: array of Measurement rows from
 *   GET /datasets/{datasetId}/measurements
 */
const MLDetection = ({ selectedDatasetId, measurements = [] }) => {
  const [powerMeasurementId, setPowerMeasurementId] = useState(null);
  const [featureMeasurementIds, setFeatureMeasurementIds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  /**
   * 1) Derive unique measurement "signals" (columns)
   *    from row-level measurements
   */
const datasetSignals = useMemo(() => {
  const map = new Map();

  measurements.forEach(row => {
    const mn = row.measurementNameIdMeasurementName;
    if (mn && !map.has(mn.id)) {
      map.set(mn.id, mn);
    }
  });

  return Array.from(map.values());
}, [measurements]);

const numericSignals = useMemo(
  () =>
    datasetSignals.filter(s =>
      ['FLOAT', 'INT', 'BOOL'].includes(s.dataType)
    ),
  [datasetSignals]
);


  /**
   * 3) Reset selections if dataset changes implicitly
   */
  React.useEffect(() => {
    setPowerMeasurementId(null);
    setFeatureMeasurementIds([]);
    setResult(null);
  }, [selectedDatasetId]);

  const runDetection = async () => {
    if (!selectedDatasetId) {
      message.error('No dataset selected');
      return;
    }

    if (!powerMeasurementId) {
      message.error('Power measurement is required');
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const res = await runMLDetection({
        datasetId: selectedDatasetId,
        powerMeasurementId,
        featureMeasurementIds,
      });


      setResult(res);
      message.success('Detection completed');
    } catch (err) {
      message.error('Detection failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <Title level={3}>Demand Response Detection</Title>

      <Divider />

      <Text strong>Power measurement (required)</Text>
      <Select
        style={{ width: '100%', marginTop: 8 }}
        placeholder={
          numericSignals.length === 0
            ? 'No numeric signals in dataset'
            : 'Select power signal'
        }
        onChange={setPowerMeasurementId}
        value={powerMeasurementId}
        disabled={numericSignals.length === 0}
      >
        {numericSignals.map(s => (
          <Option key={s.id} value={s.id}>
            {s.name} ({s.unit})
          </Option>
        ))}
      </Select>

      <Divider />

      <Text strong>Optional explanatory features</Text>
      <Text type="secondary" style={{ display: 'block', marginBottom: 8 }}>
        Any numeric or boolean signals (temperature, radiation, occupancy, etc.)
      </Text>

      <Checkbox.Group
        style={{ width: '100%' }}
        options={numericSignals
          .filter(s => s.id !== powerMeasurementId)
          .map(s => ({
            label: `${s.name} (${s.unit})`,
            value: s.id
          }))}
        value={featureMeasurementIds}
        onChange={setFeatureMeasurementIds}
        disabled={numericSignals.length === 0}
      />

      <Divider />

      <Button
        type="primary"
        block
        loading={loading}
        onClick={runDetection}
        disabled={!powerMeasurementId}
      >
        Run Detection
      </Button>

      {result && (
        <>
          <Divider />
          <Title level={4}>Results</Title>
          <Text>Events detected: {result.events.length}</Text>
          <br />
          <Text>
            Total DR energy:{' '}
            {Number(result.total_energy_kwh).toFixed(2)} kWh
          </Text>
        </>
      )}
    </Card>
  );
};

export default MLDetection;

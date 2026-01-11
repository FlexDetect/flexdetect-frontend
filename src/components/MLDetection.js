import React, { useState, useMemo, useEffect } from 'react';
import {
  Card,
  Select,
  Checkbox,
  Button,
  Typography,
  Divider,
  message,
  Space,
} from 'antd';
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
   * 1) Derive unique measurement "signals"
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
   * 2) Reset when dataset changes
   */
  useEffect(() => {
    setPowerMeasurementId(null);
    setFeatureMeasurementIds([]);
    setResult(null);
  }, [selectedDatasetId]);

  /**
   * 3) Run ML detection
   */
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
      console.error(err);
      message.error('Detection failed');
    } finally {
      setLoading(false);
    }
  };

  /**
   * 4) Download helpers
   */
  const downloadJSON = () => {
    const blob = new Blob([JSON.stringify(result, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'flexdetect_results.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadCSV = () => {
    if (!result) return;

    const rows = [];

    // ---- timeseries ----
    if (result.timeseries?.length) {
      rows.push('timeseries');
      const cols = Object.keys(result.timeseries[0]);
      rows.push(cols.join(','));

      result.timeseries.forEach(r => {
        rows.push(
          cols
            .map(c =>
              r[c] === null || r[c] === undefined
                ? ''
                : `"${String(r[c]).replace(/"/g, '""')}"`
            )
            .join(',')
        );
      });
    }

    // ---- events ----
    if (result.events?.length) {
      rows.push('');
      rows.push('events');
      const cols = Object.keys(result.events[0]);
      rows.push(cols.join(','));

      result.events.forEach(e => {
        rows.push(
          cols
            .map(c =>
              e[c] === null || e[c] === undefined
                ? ''
                : `"${String(e[c]).replace(/"/g, '""')}"`
            )
            .join(',')
        );
      });
    }

    const blob = new Blob([rows.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'flexdetect_results.csv';
    a.click();
    URL.revokeObjectURL(url);
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
        Any numeric or boolean signals (temperature, occupancy, etc.)
      </Text>

      <Checkbox.Group
        style={{ width: '100%' }}
        options={numericSignals
          .filter(s => s.id !== powerMeasurementId)
          .map(s => ({
            label: `${s.name} (${s.unit})`,
            value: s.id,
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

          <Text>
            Events detected:{' '}
            <strong>{result.metadata?.num_events ?? 0}</strong>
          </Text>
          <br />
          <Text>
            Total DR energy:{' '}
            <strong>
              {(result.summary?.total_dr_energy_kwh ?? 0).toFixed(2)} kWh
            </strong>
          </Text>

          <Divider />

          <Space>
            <Button onClick={downloadJSON}>Download JSON</Button>
            <Button onClick={downloadCSV}>Download CSV</Button>
          </Space>
        </>
      )}
    </Card>
  );
};

export default MLDetection;

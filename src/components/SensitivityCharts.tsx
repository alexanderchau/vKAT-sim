import { useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import {
  generateStakeRateChartData,
  formatPercent,
} from '../lib/calculations';
import type { SimulatorInputs, SimulatorOutputs } from '../types';

interface SensitivityChartsProps {
  inputs: SimulatorInputs;
  outputs: SimulatorOutputs;
}

const COLORS = {
  line: '#4a90d9',
  reference: '#d9534f',
  grid: '#252a35',
  axis: '#7a818c',
};

export function SensitivityCharts({ inputs }: SensitivityChartsProps) {
  const stakeRateData = useMemo(() => generateStakeRateChartData(inputs), [inputs]);

  const tooltipStyle = {
    backgroundColor: '#181b22',
    border: '1px solid #2a2f3a',
    borderRadius: '6px',
    fontSize: '13px',
    color: '#e8eaed',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
  };

  return (
    <div className="card">
      <h3 className="section-title">APY vs Staking Participation</h3>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={stakeRateData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={COLORS.grid} />
            <XAxis
              dataKey="stakeRate"
              tick={{ fontSize: 12, fill: COLORS.axis }}
              tickFormatter={(v) => `${Math.round(v)}%`}
              stroke={COLORS.grid}
            />
            <YAxis
              tick={{ fontSize: 12, fill: COLORS.axis }}
              tickFormatter={(v) => `${Math.round(v)}%`}
              stroke={COLORS.grid}
            />
            <Tooltip
              formatter={(value) => [formatPercent(Number(value), 1), 'APY']}
              labelFormatter={(label) => `Participation: ${Math.round(Number(label))}%`}
              contentStyle={tooltipStyle}
            />
            <ReferenceLine
              x={inputs.stakeRate * 100}
              stroke={COLORS.reference}
              strokeDasharray="5 5"
              label={{ value: 'Current', position: 'top', fontSize: 11, fill: COLORS.reference }}
            />
            <Line
              type="monotone"
              dataKey="apy"
              stroke={COLORS.line}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: COLORS.line }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <p className="mt-4 text-sm" style={{ color: 'var(--text-muted)' }}>
        Lower staking participation results in higher per-staker returns.
      </p>
    </div>
  );
}

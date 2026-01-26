import { useMemo, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
  ReferenceLine,
} from 'recharts';
import {
  generateStakeRateChartData,
  generateBribeChartData,
  generateVolumeChartData,
  generateCompositionData,
  formatPercent,
  formatCurrency,
} from '../lib/calculations';
import type { SimulatorInputs, SimulatorOutputs } from '../types';

interface SensitivityChartsProps {
  inputs: SimulatorInputs;
  outputs: SimulatorOutputs;
}

type ChartTab = 'stake' | 'bribes' | 'volume' | 'composition';

const COLORS = {
  fees: '#6366f1',
  bribes: '#10b981',
  exitFees: '#f59e0b',
  line: '#8b5cf6',
  reference: '#ef4444',
  grid: '#2a2a4a',
  axis: '#6b6b8a',
};

export function SensitivityCharts({ inputs, outputs }: SensitivityChartsProps) {
  const [activeTab, setActiveTab] = useState<ChartTab>('stake');

  const stakeRateData = useMemo(() => generateStakeRateChartData(inputs), [inputs]);
  const bribeData = useMemo(() => generateBribeChartData(inputs), [inputs]);
  const volumeData = useMemo(() => generateVolumeChartData(inputs), [inputs]);
  const compositionData = useMemo(() => generateCompositionData(outputs), [outputs]);

  const tabs: { id: ChartTab; label: string }[] = [
    { id: 'stake', label: 'APY vs Stake Rate' },
    { id: 'bribes', label: 'APY vs Bribes' },
    { id: 'volume', label: 'APY vs Volume' },
    { id: 'composition', label: 'APY Composition' },
  ];

  const tooltipStyle = {
    backgroundColor: '#1a1a2e',
    border: '1px solid #2a2a4a',
    borderRadius: '8px',
    fontSize: '12px',
    color: '#ffffff',
  };

  return (
    <div className="rounded-xl p-5" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
      <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Sensitivity Analysis</h3>

      {/* Tab Navigation */}
      <div className="flex gap-1 p-1 rounded-lg mb-4 overflow-x-auto" style={{ background: 'var(--bg-secondary)' }}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="flex-1 px-3 py-2 text-xs font-medium rounded-md transition-all whitespace-nowrap"
            style={{
              background: activeTab === tab.id ? 'var(--bg-card)' : 'transparent',
              color: activeTab === tab.id ? 'var(--text-primary)' : 'var(--text-muted)',
              boxShadow: activeTab === tab.id ? '0 2px 4px rgba(0,0,0,0.2)' : 'none',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Chart Container */}
      <div className="h-64">
        {activeTab === 'stake' && (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={stakeRateData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={COLORS.grid} />
              <XAxis
                dataKey="stakeRate"
                tick={{ fontSize: 11, fill: COLORS.axis }}
                tickFormatter={(v) => `${v}%`}
                stroke={COLORS.grid}
              />
              <YAxis
                tick={{ fontSize: 11, fill: COLORS.axis }}
                tickFormatter={(v) => `${v.toFixed(0)}%`}
                stroke={COLORS.grid}
              />
              <Tooltip
                formatter={(value) => [formatPercent(Number(value)), 'APY']}
                labelFormatter={(label) => `Stake Rate: ${label}%`}
                contentStyle={tooltipStyle}
              />
              <ReferenceLine
                x={inputs.stakeRate * 100}
                stroke={COLORS.reference}
                strokeDasharray="5 5"
                label={{ value: 'Current', position: 'top', fontSize: 10, fill: COLORS.reference }}
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
        )}

        {activeTab === 'bribes' && (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={bribeData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={COLORS.grid} />
              <XAxis
                dataKey="bribesPerEpoch"
                tick={{ fontSize: 11, fill: COLORS.axis }}
                tickFormatter={(v) => formatCurrency(v, 0)}
                stroke={COLORS.grid}
              />
              <YAxis
                tick={{ fontSize: 11, fill: COLORS.axis }}
                tickFormatter={(v) => `${v.toFixed(0)}%`}
                stroke={COLORS.grid}
              />
              <Tooltip
                formatter={(value) => [formatPercent(Number(value)), 'APY']}
                labelFormatter={(label) => `Bribes/Epoch: ${formatCurrency(Number(label))}`}
                contentStyle={tooltipStyle}
              />
              <ReferenceLine
                x={inputs.bribesPerEpoch}
                stroke={COLORS.reference}
                strokeDasharray="5 5"
              />
              <Line
                type="monotone"
                dataKey="apy"
                stroke={COLORS.bribes}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, fill: COLORS.bribes }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}

        {activeTab === 'volume' && (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={volumeData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={COLORS.grid} />
              <XAxis
                dataKey="annualVolume"
                tick={{ fontSize: 11, fill: COLORS.axis }}
                tickFormatter={(v) => `$${v}B`}
                stroke={COLORS.grid}
              />
              <YAxis
                tick={{ fontSize: 11, fill: COLORS.axis }}
                tickFormatter={(v) => `${v.toFixed(0)}%`}
                stroke={COLORS.grid}
              />
              <Tooltip
                formatter={(value) => [formatPercent(Number(value)), 'APY']}
                labelFormatter={(label) => `Annual Volume: $${label}B`}
                contentStyle={tooltipStyle}
              />
              <ReferenceLine
                x={inputs.annualVolume / 1_000_000_000}
                stroke={COLORS.reference}
                strokeDasharray="5 5"
              />
              <Line
                type="monotone"
                dataKey="apy"
                stroke={COLORS.fees}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, fill: COLORS.fees }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}

        {activeTab === 'composition' && (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={[{ name: 'APY', ...Object.fromEntries(compositionData.map((d) => [d.name, d.value])) }]}
              layout="vertical"
              margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke={COLORS.grid} />
              <XAxis
                type="number"
                tick={{ fontSize: 11, fill: COLORS.axis }}
                tickFormatter={(v) => `${v.toFixed(1)}%`}
                stroke={COLORS.grid}
              />
              <YAxis type="category" dataKey="name" tick={false} width={0} />
              <Tooltip
                formatter={(value, name) => [formatPercent(Number(value)), String(name)]}
                contentStyle={tooltipStyle}
              />
              <Legend
                verticalAlign="bottom"
                height={36}
                iconType="circle"
                iconSize={8}
                wrapperStyle={{ fontSize: '11px', color: 'var(--text-secondary)' }}
              />
              <Bar dataKey="Trading Fees" stackId="a" fill={COLORS.fees} />
              <Bar dataKey="Bribes" stackId="a" fill={COLORS.bribes} />
              <Bar dataKey="Exit Fees" stackId="a" fill={COLORS.exitFees} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Chart Description */}
      <div className="mt-4 text-xs" style={{ color: 'var(--text-muted)' }}>
        {activeTab === 'stake' && (
          <p>Shows the inverse relationship between participation rate and APY. Lower stake rates mean higher yields for stakers.</p>
        )}
        {activeTab === 'bribes' && (
          <p>Shows the linear relationship between bribe market size and APY. Larger bribe markets directly increase staker returns.</p>
        )}
        {activeTab === 'volume' && (
          <p>Shows the linear relationship between DEX trading volume and APY. More trading activity generates more protocol fees.</p>
        )}
        {activeTab === 'composition' && (
          <p>Shows the breakdown of APY sources: trading fees, bribes, and exit fee redistribution.</p>
        )}
      </div>
    </div>
  );
}

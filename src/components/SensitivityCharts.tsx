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
  bribes: '#22c55e',
  exitFees: '#f59e0b',
  line: '#8b5cf6',
  reference: '#ef4444',
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

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <h3 className="text-sm font-semibold text-gray-700 mb-4">Sensitivity Analysis</h3>

      {/* Tab Navigation */}
      <div className="flex gap-1 p-1 bg-gray-100 rounded-lg mb-4 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`
              flex-1 px-3 py-2 text-xs font-medium rounded-md transition-all whitespace-nowrap
              ${activeTab === tab.id
                ? 'bg-white text-gray-800 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
              }
            `}
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
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="stakeRate"
                tick={{ fontSize: 11 }}
                tickFormatter={(v) => `${v}%`}
                stroke="#9ca3af"
              />
              <YAxis
                tick={{ fontSize: 11 }}
                tickFormatter={(v) => `${v.toFixed(0)}%`}
                stroke="#9ca3af"
              />
              <Tooltip
                formatter={(value) => [formatPercent(Number(value)), 'APY']}
                labelFormatter={(label) => `Stake Rate: ${label}%`}
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '12px',
                }}
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
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="bribesPerEpoch"
                tick={{ fontSize: 11 }}
                tickFormatter={(v) => formatCurrency(v, 0)}
                stroke="#9ca3af"
              />
              <YAxis
                tick={{ fontSize: 11 }}
                tickFormatter={(v) => `${v.toFixed(0)}%`}
                stroke="#9ca3af"
              />
              <Tooltip
                formatter={(value) => [formatPercent(Number(value)), 'APY']}
                labelFormatter={(label) => `Bribes/Epoch: ${formatCurrency(Number(label))}`}
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '12px',
                }}
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
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="annualVolume"
                tick={{ fontSize: 11 }}
                tickFormatter={(v) => `$${v}B`}
                stroke="#9ca3af"
              />
              <YAxis
                tick={{ fontSize: 11 }}
                tickFormatter={(v) => `${v.toFixed(0)}%`}
                stroke="#9ca3af"
              />
              <Tooltip
                formatter={(value) => [formatPercent(Number(value)), 'APY']}
                labelFormatter={(label) => `Annual Volume: $${label}B`}
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '12px',
                }}
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
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                type="number"
                tick={{ fontSize: 11 }}
                tickFormatter={(v) => `${v.toFixed(1)}%`}
                stroke="#9ca3af"
              />
              <YAxis type="category" dataKey="name" tick={false} width={0} />
              <Tooltip
                formatter={(value, name) => [formatPercent(Number(value)), String(name)]}
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '12px',
                }}
              />
              <Legend
                verticalAlign="bottom"
                height={36}
                iconType="circle"
                iconSize={8}
                wrapperStyle={{ fontSize: '11px' }}
              />
              <Bar dataKey="Trading Fees" stackId="a" fill={COLORS.fees} />
              <Bar dataKey="Bribes" stackId="a" fill={COLORS.bribes} />
              <Bar dataKey="Exit Fees" stackId="a" fill={COLORS.exitFees} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Chart Description */}
      <div className="mt-4 text-xs text-gray-500">
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

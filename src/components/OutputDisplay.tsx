import type { SimulatorOutputs } from '../types';
import { formatCurrency, formatPercent, formatNumber, CONSTANTS } from '../lib/calculations';

interface OutputDisplayProps {
  outputs: SimulatorOutputs;
  userVkat: number;
  katPrice: number;
}

export function OutputDisplay({ outputs, userVkat, katPrice }: OutputDisplayProps) {
  const userPositionValue = userVkat * katPrice;

  return (
    <div className="space-y-5">
      {/* Primary APY Display */}
      <div className="metric-panel">
        <div className="stat-label mb-1">Projected Annual Percentage Yield</div>
        <div className="stat-value-lg metric-highlight mb-3">{formatPercent(outputs.totalApy)}</div>
        <div className="text-sm" style={{ color: 'var(--text-muted)' }}>
          Based on <span className="font-mono font-medium" style={{ color: 'var(--text-secondary)' }}>{formatNumber(outputs.totalVkatStaked / 1_000_000)}M</span> vKAT total staked
        </div>
      </div>

      {/* APY Breakdown */}
      <div className="card">
        <h3 className="section-title">Yield Composition</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full" style={{ background: 'var(--chart-blue)' }}></div>
              <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Protocol Fee Revenue</span>
            </div>
            <span className="font-mono font-semibold" style={{ color: 'var(--text-primary)' }}>{formatPercent(outputs.apyFromFees)}</span>
          </div>
          <div className="flex items-center justify-between py-2" style={{ borderTop: '1px solid var(--border-subtle)' }}>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full" style={{ background: 'var(--chart-green)' }}></div>
              <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Bribe Distributions</span>
            </div>
            <span className="font-mono font-semibold" style={{ color: 'var(--text-primary)' }}>{formatPercent(outputs.apyFromBribes)}</span>
          </div>
          <div className="flex items-center justify-between py-2" style={{ borderTop: '1px solid var(--border-subtle)' }}>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full" style={{ background: 'var(--chart-amber)' }}></div>
              <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Exit Fee Redistribution</span>
            </div>
            <span className="font-mono font-semibold" style={{ color: 'var(--text-primary)' }}>{formatPercent(outputs.apyFromExitFees)}</span>
          </div>
        </div>

        {/* Visual bar breakdown */}
        <div className="mt-4 h-1.5 rounded-full overflow-hidden flex" style={{ background: 'var(--bg-elevated)' }}>
          <div
            className="transition-all duration-300"
            style={{ width: `${(outputs.apyFromFees / outputs.totalApy) * 100}%`, background: 'var(--chart-blue)' }}
          />
          <div
            className="transition-all duration-300"
            style={{ width: `${(outputs.apyFromBribes / outputs.totalApy) * 100}%`, background: 'var(--chart-green)' }}
          />
          <div
            className="transition-all duration-300"
            style={{ width: `${(outputs.apyFromExitFees / outputs.totalApy) * 100}%`, background: 'var(--chart-amber)' }}
          />
        </div>
      </div>

      {/* Your Position */}
      <div className="card">
        <h3 className="section-title">Position Summary</h3>
        <div className="grid grid-cols-2 gap-5">
          <div>
            <div className="stat-label">Position Value</div>
            <div className="stat-value">{formatCurrency(userPositionValue)}</div>
          </div>
          <div>
            <div className="stat-label">vKAT Holdings</div>
            <div className="stat-value">{formatNumber(userVkat)}</div>
          </div>
          <div>
            <div className="stat-label">Projected Annual Return</div>
            <div className="stat-value" style={{ color: 'var(--success)' }}>+{formatCurrency(outputs.userAnnualYieldUsd)}</div>
          </div>
          <div>
            <div className="stat-label">Per Epoch ({CONSTANTS.EPOCH_DURATION_DAYS}d)</div>
            <div className="stat-value" style={{ color: 'var(--success)' }}>+{formatCurrency(outputs.userEpochYieldUsd)}</div>
          </div>
        </div>
      </div>

      {/* Protocol Revenue */}
      <div className="card">
        <h3 className="section-title">Aggregate Protocol Revenue (Annualized)</h3>
        <div className="space-y-0">
          <div className="data-row">
            <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Trading Fee Revenue</span>
            <span className="font-mono font-medium" style={{ color: 'var(--text-primary)' }}>{formatCurrency(outputs.feeRevenue)}</span>
          </div>
          <div className="data-row">
            <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Bribe Revenue</span>
            <span className="font-mono font-medium" style={{ color: 'var(--text-primary)' }}>{formatCurrency(outputs.bribeRevenue)}</span>
          </div>
          <div className="data-row">
            <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Exit Fee Revenue</span>
            <span className="font-mono font-medium" style={{ color: 'var(--text-primary)' }}>{formatCurrency(outputs.exitFeeRevenue)}</span>
          </div>
          <div className="data-row" style={{ marginTop: '8px', paddingTop: '12px', borderTop: '1px solid var(--border-color)' }}>
            <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Total Yield Pool</span>
            <span className="font-mono font-bold text-lg" style={{ color: 'var(--accent-primary)' }}>{formatCurrency(outputs.totalYieldUsd)}</span>
          </div>
        </div>
      </div>

      {/* Break-even Analysis */}
      <div className="notice-panel">
        <h3 className="text-sm font-semibold mb-2" style={{ color: 'var(--warning)' }}>Exit Cost Recovery Analysis</h3>
        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          Assuming immediate exit at the maximum 25% fee, the estimated time to recover exit costs through staking rewards is{' '}
          <span className="font-mono font-semibold" style={{ color: 'var(--text-primary)' }}>{outputs.breakEvenDays === Infinity ? '—' : formatNumber(outputs.breakEvenDays)} days</span>.
        </p>
        <p className="text-xs mt-3" style={{ color: 'var(--text-muted)' }}>
          The {CONSTANTS.COOLDOWN_DAYS}-day cooldown period reduces the exit fee to 2.5%.
        </p>
      </div>

      {/* Yield per vKAT */}
      <div className="info-panel">
        <div className="flex justify-between items-center">
          <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Annualized Yield per vKAT</span>
          <span className="font-mono text-base font-semibold" style={{ color: 'var(--accent-primary)' }}>
            ${outputs.yieldPerVkatUsd.toFixed(6)}
          </span>
        </div>
      </div>
    </div>
  );
}

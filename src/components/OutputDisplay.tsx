import type { SimulatorOutputs } from '../types';
import { formatCurrency, formatPercent, formatNumber, CONSTANTS } from '../lib/calculations';

interface OutputDisplayProps {
  outputs: SimulatorOutputs;
  userVkat: number;
  katPrice: number;
}

// Format with high precision for tooltips
function formatPrecise(value: number, decimals = 6): string {
  return value.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

export function OutputDisplay({ outputs, userVkat, katPrice }: OutputDisplayProps) {
  const userPositionValue = userVkat * katPrice;
  const monthlyYield = outputs.userAnnualYieldUsd / 12;
  const dailyYield = outputs.userAnnualYieldUsd / 365;
  const roiPercent = userPositionValue > 0 ? (outputs.userAnnualYieldUsd / userPositionValue) * 100 : 0;

  return (
    <div className="space-y-5">
      {/* Key Metrics Summary */}
      <div
        className="grid grid-cols-3 gap-4 p-4 rounded-lg"
        style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)' }}
      >
        <div className="text-center">
          <div className="stat-label">Projected APY</div>
          <div className="text-2xl font-mono font-bold" style={{ color: 'var(--accent-primary)' }}>
            {formatPercent(outputs.totalApy)}
          </div>
        </div>
        <div className="text-center" style={{ borderLeft: '1px solid var(--border-subtle)', borderRight: '1px solid var(--border-subtle)' }}>
          <div className="stat-label">Annual Return</div>
          <div className="text-2xl font-mono font-bold" style={{ color: 'var(--success)' }}>
            +{formatCurrency(outputs.userAnnualYieldUsd)}
          </div>
        </div>
        <div className="text-center">
          <div className="stat-label">Monthly Return</div>
          <div className="text-2xl font-mono font-bold" style={{ color: 'var(--success)' }}>
            +{formatCurrency(monthlyYield)}
          </div>
        </div>
      </div>

      {/* Primary APY Display */}
      <div className="metric-panel">
        <div className="flex items-start justify-between">
          <div>
            <div className="stat-label mb-1">Projected Annual Percentage Yield</div>
            <div
              className="stat-value-lg metric-highlight cursor-help"
              title={`Precise: ${formatPrecise(outputs.totalApy, 4)}%`}
            >
              {formatPercent(outputs.totalApy)}
            </div>
          </div>
          <div className="text-right">
            <div className="stat-label mb-1">Effective ROI</div>
            <div
              className="text-lg font-mono font-semibold cursor-help"
              style={{ color: 'var(--success)' }}
              title={`Based on ${formatCurrency(userPositionValue)} position value`}
            >
              {formatPercent(roiPercent)}
            </div>
          </div>
        </div>
        <div className="mt-4 pt-4" style={{ borderTop: '1px solid rgba(74, 144, 217, 0.2)' }}>
          <div className="flex items-center justify-between text-sm">
            <span style={{ color: 'var(--text-muted)' }}>
              Based on <span className="font-mono font-medium" style={{ color: 'var(--text-secondary)' }}>{formatNumber(outputs.totalVkatStaked / 1_000_000)}M</span> vKAT total staked
            </span>
            <span
              className="font-mono cursor-help"
              style={{ color: 'var(--text-secondary)' }}
              title={`Daily yield: ${formatCurrency(dailyYield)}`}
            >
              ≈ {formatCurrency(dailyYield)}/day
            </span>
          </div>
        </div>
      </div>

      {/* APY Breakdown */}
      <div className="card">
        <h3 className="section-title">Yield Composition</h3>
        <div className="space-y-0">
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full" style={{ background: 'var(--chart-blue)' }}></div>
              <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Protocol Fee Revenue</span>
            </div>
            <div className="text-right">
              <span
                className="font-mono font-semibold cursor-help"
                style={{ color: 'var(--text-primary)' }}
                title={`${formatPrecise(outputs.apyFromFees, 4)}% | ${formatCurrency(outputs.feeRevenue)} annually`}
              >
                {formatPercent(outputs.apyFromFees)}
              </span>
              <span className="text-xs font-mono ml-2" style={{ color: 'var(--text-muted)' }}>
                ({((outputs.apyFromFees / outputs.totalApy) * 100).toFixed(0)}%)
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between py-3" style={{ borderTop: '1px solid var(--border-subtle)' }}>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full" style={{ background: 'var(--chart-green)' }}></div>
              <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Bribe Distributions</span>
            </div>
            <div className="text-right">
              <span
                className="font-mono font-semibold cursor-help"
                style={{ color: 'var(--text-primary)' }}
                title={`${formatPrecise(outputs.apyFromBribes, 4)}% | ${formatCurrency(outputs.bribeRevenue)} annually`}
              >
                {formatPercent(outputs.apyFromBribes)}
              </span>
              <span className="text-xs font-mono ml-2" style={{ color: 'var(--text-muted)' }}>
                ({((outputs.apyFromBribes / outputs.totalApy) * 100).toFixed(0)}%)
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between py-3" style={{ borderTop: '1px solid var(--border-subtle)' }}>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full" style={{ background: 'var(--chart-amber)' }}></div>
              <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Exit Fee Redistribution</span>
            </div>
            <div className="text-right">
              <span
                className="font-mono font-semibold cursor-help"
                style={{ color: 'var(--text-primary)' }}
                title={`${formatPrecise(outputs.apyFromExitFees, 4)}% | ${formatCurrency(outputs.exitFeeRevenue)} annually`}
              >
                {formatPercent(outputs.apyFromExitFees)}
              </span>
              <span className="text-xs font-mono ml-2" style={{ color: 'var(--text-muted)' }}>
                ({((outputs.apyFromExitFees / outputs.totalApy) * 100).toFixed(0)}%)
              </span>
            </div>
          </div>
        </div>

        {/* Visual bar breakdown */}
        <div className="mt-4 h-2 rounded-full overflow-hidden flex" style={{ background: 'var(--bg-elevated)' }}>
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

      {/* Position Summary */}
      <div className="card">
        <h3 className="section-title">Position Summary</h3>
        <div className="grid grid-cols-2 gap-5">
          <div>
            <div className="stat-label">Position Value</div>
            <div
              className="stat-value cursor-help"
              title={`${formatNumber(userVkat)} vKAT × $${katPrice.toFixed(2)}`}
            >
              {formatCurrency(userPositionValue)}
            </div>
          </div>
          <div>
            <div className="stat-label">vKAT Holdings</div>
            <div
              className="stat-value cursor-help"
              title={`Precise: ${formatPrecise(userVkat, 0)}`}
            >
              {formatNumber(userVkat)}
            </div>
          </div>
          <div>
            <div className="stat-label">Projected Annual Return</div>
            <div
              className="stat-value cursor-help"
              style={{ color: 'var(--success)' }}
              title={`Precise: $${formatPrecise(outputs.userAnnualYieldUsd, 2)}`}
            >
              +{formatCurrency(outputs.userAnnualYieldUsd)}
            </div>
          </div>
          <div>
            <div className="stat-label">Per Epoch ({CONSTANTS.EPOCH_DURATION_DAYS}d)</div>
            <div
              className="stat-value cursor-help"
              style={{ color: 'var(--success)' }}
              title={`${CONSTANTS.EPOCHS_PER_YEAR} epochs per year`}
            >
              +{formatCurrency(outputs.userEpochYieldUsd)}
            </div>
          </div>
        </div>
      </div>

      {/* Protocol Revenue */}
      <div className="card">
        <h3 className="section-title">Aggregate Protocol Revenue (Annualized)</h3>
        <div className="space-y-0">
          <div className="data-row">
            <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Trading Fee Revenue</span>
            <span
              className="font-mono font-medium cursor-help"
              style={{ color: 'var(--text-primary)' }}
              title={`0.05% of ${formatCurrency(outputs.feeRevenue / 0.0005)} trading volume`}
            >
              {formatCurrency(outputs.feeRevenue)}
            </span>
          </div>
          <div className="data-row">
            <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Bribe Revenue</span>
            <span
              className="font-mono font-medium cursor-help"
              style={{ color: 'var(--text-primary)' }}
              title={`${CONSTANTS.EPOCHS_PER_YEAR} epochs × bribe pool`}
            >
              {formatCurrency(outputs.bribeRevenue)}
            </span>
          </div>
          <div className="data-row">
            <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Exit Fee Revenue</span>
            <span
              className="font-mono font-medium cursor-help"
              style={{ color: 'var(--text-primary)' }}
              title="Redistributed to remaining stakers"
            >
              {formatCurrency(outputs.exitFeeRevenue)}
            </span>
          </div>
          <div className="data-row" style={{ marginTop: '8px', paddingTop: '12px', borderTop: '1px solid var(--border-color)' }}>
            <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Total Yield Pool</span>
            <span className="font-mono font-bold text-lg" style={{ color: 'var(--accent-primary)' }}>{formatCurrency(outputs.totalYieldUsd)}</span>
          </div>
        </div>
      </div>

      {/* Yield per vKAT */}
      <div className="info-panel">
        <div className="flex justify-between items-center">
          <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Annualized Yield per vKAT</span>
          <span
            className="font-mono text-base font-semibold cursor-help"
            style={{ color: 'var(--accent-primary)' }}
            title={`Precise: $${formatPrecise(outputs.yieldPerVkatUsd, 8)}`}
          >
            ${outputs.yieldPerVkatUsd.toFixed(6)}
          </span>
        </div>
      </div>
    </div>
  );
}

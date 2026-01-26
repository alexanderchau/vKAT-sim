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
      <div
        className="rounded-2xl p-8 glow-primary"
        style={{
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(6, 182, 212, 0.1) 100%)',
          border: '1px solid rgba(99, 102, 241, 0.25)',
        }}
      >
        <div className="stat-label mb-2">vKAT Staking APY</div>
        <div className="stat-value-lg gradient-text mb-3">{formatPercent(outputs.totalApy)}</div>
        <div className="text-sm" style={{ color: 'var(--text-muted)' }}>
          Based on <span className="font-mono font-medium" style={{ color: 'var(--text-secondary)' }}>{formatNumber(outputs.totalVkatStaked / 1_000_000)}M</span> vKAT staked
        </div>
      </div>

      {/* APY Breakdown */}
      <div className="card">
        <h3 className="section-title">APY Breakdown</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: 'var(--accent-primary)' }}></div>
              <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Trading Fees</span>
            </div>
            <span className="font-mono font-semibold" style={{ color: 'var(--text-primary)' }}>{formatPercent(outputs.apyFromFees)}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: 'var(--success)' }}></div>
              <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Bribes</span>
            </div>
            <span className="font-mono font-semibold" style={{ color: 'var(--text-primary)' }}>{formatPercent(outputs.apyFromBribes)}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: 'var(--warning)' }}></div>
              <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Exit Fees</span>
            </div>
            <span className="font-mono font-semibold" style={{ color: 'var(--text-primary)' }}>{formatPercent(outputs.apyFromExitFees)}</span>
          </div>
        </div>

        {/* Visual bar breakdown */}
        <div className="mt-5 h-2 rounded-full overflow-hidden flex" style={{ background: 'var(--bg-secondary)' }}>
          <div
            className="transition-all duration-300"
            style={{ width: `${(outputs.apyFromFees / outputs.totalApy) * 100}%`, background: 'var(--accent-primary)' }}
          />
          <div
            className="transition-all duration-300"
            style={{ width: `${(outputs.apyFromBribes / outputs.totalApy) * 100}%`, background: 'var(--success)' }}
          />
          <div
            className="transition-all duration-300"
            style={{ width: `${(outputs.apyFromExitFees / outputs.totalApy) * 100}%`, background: 'var(--warning)' }}
          />
        </div>
      </div>

      {/* Your Position */}
      <div className="card">
        <h3 className="section-title">Your Position</h3>
        <div className="grid grid-cols-2 gap-5">
          <div>
            <div className="stat-label">Position Value</div>
            <div className="stat-value">{formatCurrency(userPositionValue)}</div>
          </div>
          <div>
            <div className="stat-label">vKAT Amount</div>
            <div className="stat-value">{formatNumber(userVkat)}</div>
          </div>
          <div>
            <div className="stat-label">Annual Yield</div>
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
        <h3 className="section-title">Protocol Revenue (Annual)</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Fee Revenue</span>
            <span className="font-mono font-medium" style={{ color: 'var(--text-primary)' }}>{formatCurrency(outputs.feeRevenue)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Bribe Revenue</span>
            <span className="font-mono font-medium" style={{ color: 'var(--text-primary)' }}>{formatCurrency(outputs.bribeRevenue)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Exit Fee Revenue</span>
            <span className="font-mono font-medium" style={{ color: 'var(--text-primary)' }}>{formatCurrency(outputs.exitFeeRevenue)}</span>
          </div>
          <div className="divider"></div>
          <div className="flex justify-between items-center">
            <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Total Yield Pool</span>
            <span className="font-mono font-bold text-lg" style={{ color: 'var(--accent-primary)' }}>{formatCurrency(outputs.totalYieldUsd)}</span>
          </div>
        </div>
      </div>

      {/* Break-even Analysis */}
      <div
        className="rounded-2xl p-5"
        style={{
          background: 'rgba(245, 158, 11, 0.08)',
          border: '1px solid rgba(245, 158, 11, 0.2)',
        }}
      >
        <h3 className="text-sm font-semibold mb-2" style={{ color: 'var(--warning)' }}>Break-even Analysis</h3>
        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          If you exit instantly (25% fee), it takes approximately{' '}
          <span className="font-mono font-bold" style={{ color: 'var(--text-primary)' }}>{outputs.breakEvenDays === Infinity ? '∞' : formatNumber(outputs.breakEvenDays)} days</span>{' '}
          to recover the exit cost through staking rewards.
        </p>
        <p className="text-xs mt-3" style={{ color: 'var(--text-muted)' }}>
          Tip: Use the {CONSTANTS.COOLDOWN_DAYS}-day cooldown to reduce exit fee to 2.5%
        </p>
      </div>

      {/* Yield per vKAT */}
      <div className="rounded-2xl p-5" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}>
        <div className="flex justify-between items-center">
          <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Yield per vKAT</span>
          <span className="font-mono text-lg font-semibold" style={{ color: 'var(--accent-cyan)' }}>
            {outputs.yieldPerVkatUsd.toFixed(6)} USD
          </span>
        </div>
      </div>
    </div>
  );
}

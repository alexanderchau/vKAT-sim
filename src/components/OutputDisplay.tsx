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
    <div className="space-y-6">
      {/* Primary APY Display */}
      <div
        className="rounded-xl p-6 glow-primary"
        style={{
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(139, 92, 246, 0.2) 100%)',
          border: '1px solid rgba(99, 102, 241, 0.3)',
        }}
      >
        <div className="text-sm font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>vKAT Staking APY</div>
        <div className="text-5xl font-bold mb-2 gradient-text">{formatPercent(outputs.totalApy)}</div>
        <div className="text-sm" style={{ color: 'var(--text-muted)' }}>
          Based on {formatNumber(outputs.totalVkatStaked / 1_000_000)}M vKAT staked
        </div>
      </div>

      {/* APY Breakdown */}
      <div className="rounded-xl p-5" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
        <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>APY Breakdown</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ background: 'var(--accent-primary)' }}></div>
              <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Trading Fees</span>
            </div>
            <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>{formatPercent(outputs.apyFromFees)}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ background: 'var(--success)' }}></div>
              <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Bribes</span>
            </div>
            <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>{formatPercent(outputs.apyFromBribes)}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ background: 'var(--warning)' }}></div>
              <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Exit Fees</span>
            </div>
            <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>{formatPercent(outputs.apyFromExitFees)}</span>
          </div>
        </div>

        {/* Visual bar breakdown */}
        <div className="mt-4 h-3 rounded-full overflow-hidden flex" style={{ background: 'var(--bg-secondary)' }}>
          <div
            className="transition-all"
            style={{ width: `${(outputs.apyFromFees / outputs.totalApy) * 100}%`, background: 'var(--accent-primary)' }}
          />
          <div
            className="transition-all"
            style={{ width: `${(outputs.apyFromBribes / outputs.totalApy) * 100}%`, background: 'var(--success)' }}
          />
          <div
            className="transition-all"
            style={{ width: `${(outputs.apyFromExitFees / outputs.totalApy) * 100}%`, background: 'var(--warning)' }}
          />
        </div>
      </div>

      {/* Your Position */}
      <div className="rounded-xl p-5" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
        <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Your Position</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>Position Value</div>
            <div className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
              {formatCurrency(userPositionValue)}
            </div>
          </div>
          <div>
            <div className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>vKAT Amount</div>
            <div className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
              {formatNumber(userVkat)}
            </div>
          </div>
          <div>
            <div className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>Annual Yield</div>
            <div className="text-lg font-semibold" style={{ color: 'var(--success)' }}>
              +{formatCurrency(outputs.userAnnualYieldUsd)}
            </div>
          </div>
          <div>
            <div className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>Per Epoch ({CONSTANTS.EPOCH_DURATION_DAYS}d)</div>
            <div className="text-lg font-semibold" style={{ color: 'var(--success)' }}>
              +{formatCurrency(outputs.userEpochYieldUsd)}
            </div>
          </div>
        </div>
      </div>

      {/* Protocol Revenue */}
      <div className="rounded-xl p-5" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
        <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Protocol Revenue (Annual)</h3>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Fee Revenue</span>
            <span className="font-medium" style={{ color: 'var(--text-primary)' }}>{formatCurrency(outputs.feeRevenue)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Bribe Revenue</span>
            <span className="font-medium" style={{ color: 'var(--text-primary)' }}>{formatCurrency(outputs.bribeRevenue)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Exit Fee Revenue</span>
            <span className="font-medium" style={{ color: 'var(--text-primary)' }}>{formatCurrency(outputs.exitFeeRevenue)}</span>
          </div>
          <div className="pt-3 flex justify-between" style={{ borderTop: '1px solid var(--border-color)' }}>
            <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Total Yield Pool</span>
            <span className="font-bold" style={{ color: 'var(--accent-primary)' }}>{formatCurrency(outputs.totalYieldUsd)}</span>
          </div>
        </div>
      </div>

      {/* Break-even Analysis */}
      <div
        className="rounded-xl p-5"
        style={{
          background: 'rgba(245, 158, 11, 0.1)',
          border: '1px solid rgba(245, 158, 11, 0.3)',
        }}
      >
        <h3 className="text-sm font-semibold mb-2" style={{ color: 'var(--warning)' }}>Break-even Analysis</h3>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          If you exit instantly (25% fee), it takes approximately{' '}
          <span className="font-bold" style={{ color: 'var(--text-primary)' }}>{outputs.breakEvenDays === Infinity ? '∞' : formatNumber(outputs.breakEvenDays)} days</span>{' '}
          to recover the exit cost through staking rewards.
        </p>
        <p className="text-xs mt-2" style={{ color: 'var(--text-muted)' }}>
          Tip: Use the {CONSTANTS.COOLDOWN_DAYS}-day cooldown to reduce exit fee to 2.5%
        </p>
      </div>

      {/* Yield per vKAT */}
      <div className="rounded-xl p-5" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}>
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

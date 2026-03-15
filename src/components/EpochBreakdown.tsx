import type { MultiEpochOutputs } from '../types';
import { formatCurrency, formatPercent, CONSTANTS } from '../lib/calculations';

interface EpochBreakdownProps {
  multiEpoch: MultiEpochOutputs;
  katPrice: number;
  userVkat: number;
}

export function EpochBreakdown({ multiEpoch, katPrice, userVkat }: EpochBreakdownProps) {
  const positionValue = userVkat * katPrice;

  return (
    <div className="card">
      <h3 className="section-title">Epoch-by-Epoch Returns (Boost Period)</h3>

      {/* Summary bar */}
      <div
        className="flex items-center justify-between p-3 rounded-lg mb-4"
        style={{ background: 'var(--accent-subtle)', border: '1px solid rgba(201, 180, 78, 0.2)' }}
      >
        <div>
          <div className="text-xs font-medium" style={{ color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            56-Day Boosted Return
          </div>
          <div className="font-mono font-bold text-lg" style={{ color: 'var(--accent-primary)' }}>
            +{formatCurrency(multiEpoch.totalYield56Days)}
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs font-medium" style={{ color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Blended APY
          </div>
          <div className="font-mono font-bold text-lg" style={{ color: 'var(--accent-primary)' }}>
            {formatPercent(multiEpoch.blendedApy, 1)}
          </div>
        </div>
      </div>

      {/* Epoch table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
              <th className="text-left py-2 text-xs font-medium" style={{ color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Epoch
              </th>
              <th className="text-center py-2 text-xs font-medium" style={{ color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Boost
              </th>
              <th className="text-center py-2 text-xs font-medium" style={{ color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Exit Fee
              </th>
              <th className="text-right py-2 text-xs font-medium" style={{ color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Epoch Yield
              </th>
              <th className="text-right py-2 text-xs font-medium" style={{ color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Cumulative
              </th>
              <th className="text-right py-2 text-xs font-medium" style={{ color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                APY
              </th>
            </tr>
          </thead>
          <tbody>
            {multiEpoch.epochs.map((epoch, i) => (
              <tr
                key={epoch.epoch}
                style={{
                  borderBottom: i < multiEpoch.epochs.length - 1 ? '1px solid var(--border-subtle)' : undefined,
                  opacity: epoch.boost > 1.0 ? 1 : 0.6,
                }}
              >
                <td className="py-2.5 text-xs" style={{ color: 'var(--text-secondary)' }}>
                  {epoch.label}
                </td>
                <td className="py-2.5 text-center font-mono font-medium" style={{ color: epoch.boost > 1.0 ? 'var(--accent-primary)' : 'var(--text-muted)' }}>
                  {epoch.boost.toFixed(1)}x
                </td>
                <td className="py-2.5 text-center font-mono" style={{ color: 'var(--text-secondary)' }}>
                  {(epoch.exitFee * 100).toFixed(epoch.exitFee * 100 % 1 === 0 ? 0 : 1)}%
                </td>
                <td className="py-2.5 text-right font-mono font-medium" style={{ color: 'var(--success)' }}>
                  +{formatCurrency(epoch.userEpochYieldUsd)}
                </td>
                <td className="py-2.5 text-right font-mono" style={{ color: 'var(--text-primary)' }}>
                  {formatCurrency(epoch.cumulativeYieldUsd)}
                </td>
                <td className="py-2.5 text-right font-mono font-medium" style={{ color: 'var(--text-primary)' }}>
                  {formatPercent(epoch.epochApy, 1)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ROI note */}
      <div className="mt-3 text-xs" style={{ color: 'var(--text-muted)' }}>
        Position: {formatCurrency(positionValue)} &middot; {CONSTANTS.EPOCH_DURATION_DAYS}d epochs &middot; Boost period return on position: {positionValue > 0 ? formatPercent((multiEpoch.totalYield56Days / positionValue) * 100, 2) : '0%'}
      </div>
    </div>
  );
}

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
      <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-xl p-6 text-white">
        <div className="text-sm font-medium opacity-80 mb-1">vKAT Staking APY</div>
        <div className="text-5xl font-bold mb-2">{formatPercent(outputs.totalApy)}</div>
        <div className="text-sm opacity-80">
          Based on {formatNumber(outputs.totalVkatStaked / 1_000_000)}M vKAT staked
        </div>
      </div>

      {/* APY Breakdown */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">APY Breakdown</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
              <span className="text-sm text-gray-600">Trading Fees</span>
            </div>
            <span className="font-semibold text-gray-800">{formatPercent(outputs.apyFromFees)}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="text-sm text-gray-600">Bribes</span>
            </div>
            <span className="font-semibold text-gray-800">{formatPercent(outputs.apyFromBribes)}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-amber-500"></div>
              <span className="text-sm text-gray-600">Exit Fees</span>
            </div>
            <span className="font-semibold text-gray-800">{formatPercent(outputs.apyFromExitFees)}</span>
          </div>
        </div>

        {/* Visual bar breakdown */}
        <div className="mt-4 h-3 rounded-full overflow-hidden flex bg-gray-100">
          <div
            className="bg-indigo-500 transition-all"
            style={{ width: `${(outputs.apyFromFees / outputs.totalApy) * 100}%` }}
          />
          <div
            className="bg-green-500 transition-all"
            style={{ width: `${(outputs.apyFromBribes / outputs.totalApy) * 100}%` }}
          />
          <div
            className="bg-amber-500 transition-all"
            style={{ width: `${(outputs.apyFromExitFees / outputs.totalApy) * 100}%` }}
          />
        </div>
      </div>

      {/* Your Position */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">Your Position</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-xs text-gray-500 mb-1">Position Value</div>
            <div className="text-lg font-semibold text-gray-800">
              {formatCurrency(userPositionValue)}
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-500 mb-1">vKAT Amount</div>
            <div className="text-lg font-semibold text-gray-800">
              {formatNumber(userVkat)}
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-500 mb-1">Annual Yield</div>
            <div className="text-lg font-semibold text-green-600">
              +{formatCurrency(outputs.userAnnualYieldUsd)}
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-500 mb-1">Per Epoch ({CONSTANTS.EPOCH_DURATION_DAYS}d)</div>
            <div className="text-lg font-semibold text-green-600">
              +{formatCurrency(outputs.userEpochYieldUsd)}
            </div>
          </div>
        </div>
      </div>

      {/* Protocol Revenue */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">Protocol Revenue (Annual)</h3>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Fee Revenue</span>
            <span className="font-medium text-gray-800">{formatCurrency(outputs.feeRevenue)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Bribe Revenue</span>
            <span className="font-medium text-gray-800">{formatCurrency(outputs.bribeRevenue)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Exit Fee Revenue</span>
            <span className="font-medium text-gray-800">{formatCurrency(outputs.exitFeeRevenue)}</span>
          </div>
          <div className="border-t pt-3 flex justify-between">
            <span className="text-sm font-semibold text-gray-700">Total Yield Pool</span>
            <span className="font-bold text-indigo-600">{formatCurrency(outputs.totalYieldUsd)}</span>
          </div>
        </div>
      </div>

      {/* Break-even Analysis */}
      <div className="bg-amber-50 rounded-xl border border-amber-200 p-5">
        <h3 className="text-sm font-semibold text-amber-800 mb-2">Break-even Analysis</h3>
        <p className="text-sm text-amber-700">
          If you exit instantly (25% fee), it takes approximately{' '}
          <span className="font-bold">{outputs.breakEvenDays === Infinity ? '∞' : formatNumber(outputs.breakEvenDays)} days</span>{' '}
          to recover the exit cost through staking rewards.
        </p>
        <p className="text-xs text-amber-600 mt-2">
          Tip: Use the {CONSTANTS.COOLDOWN_DAYS}-day cooldown to reduce exit fee to 2.5%
        </p>
      </div>

      {/* Yield per vKAT */}
      <div className="bg-gray-50 rounded-xl border border-gray-200 p-5">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Yield per vKAT</span>
          <span className="font-mono text-lg font-semibold text-gray-800">
            {outputs.yieldPerVkatUsd.toFixed(6)} USD
          </span>
        </div>
      </div>
    </div>
  );
}

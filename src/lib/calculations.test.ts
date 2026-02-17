/**
 * Test calculations against examples from the brief
 * Run: npx tsx src/lib/calculations.test.ts
 */

import { calculateOutputs, DEFAULT_INPUTS } from './calculations';
import type { SimulatorInputs } from '../types';

function assertClose(actual: number, expected: number, tolerance = 0.01, label: string) {
  const diff = Math.abs(actual - expected);
  const relDiff = diff / expected;
  const passed = relDiff <= tolerance;
  console.log(
    `${passed ? '✓' : '✗'} ${label}: ${actual.toFixed(4)} (expected ${expected.toFixed(4)}, diff ${(relDiff * 100).toFixed(2)}%)`
  );
  return passed;
}

console.log('\n=== Base Case Test ===');
console.log('Inputs: 2B circulating, 30% staked, $4.8B volume, $100K bribes/epoch, $0.10 KAT price\n');

const baseCase: SimulatorInputs = {
  ...DEFAULT_INPUTS,
  circulatingSupply: 2_000_000_000,
  stakeRate: 0.30,
  annualVolume: 4_800_000_000,
  avgFeeRate: 0.0005,
  bribesPerEpoch: 100_000,
  katPrice: 0.10,
  churnRate: 0.15,
  avgExitFee: 0.08,
};

const baseOutputs = calculateOutputs(baseCase);

// From brief:
// Total vKAT Staked = 2B × 30% = 600M vKAT
assertClose(baseOutputs.totalVkatStaked, 600_000_000, 0.001, 'Total vKAT Staked');

// Fee Revenue = $4.8B × 0.05% = $2.4M
assertClose(baseOutputs.feeRevenue, 2_400_000, 0.001, 'Fee Revenue');

// Bribe Revenue = $100K × 26 = $2.6M
assertClose(baseOutputs.bribeRevenue, 2_600_000, 0.001, 'Bribe Revenue');

// Exit Fee Revenue = 600M × $0.10 × 15% × 8% = $720K
assertClose(baseOutputs.exitFeeRevenue, 720_000, 0.001, 'Exit Fee Revenue');

// Total Yield = $2.4M + $2.6M + $0.72M = $5.72M
assertClose(baseOutputs.totalYieldUsd, 5_720_000, 0.001, 'Total Yield');

// Yield per vKAT = $5.72M / 600M = $0.00953
assertClose(baseOutputs.yieldPerVkatUsd, 0.00953333, 0.01, 'Yield per vKAT');

// APY = $0.00953 / $0.10 = 9.53%
assertClose(baseOutputs.totalApy, 9.53, 0.02, 'Total APY');

// Breakdown:
// Fees: 4.0% APY
assertClose(baseOutputs.apyFromFees, 4.0, 0.01, 'APY from Fees');
// Bribes: 4.3% APY
assertClose(baseOutputs.apyFromBribes, 4.33, 0.01, 'APY from Bribes');
// Exit Fees: 1.2% APY
assertClose(baseOutputs.apyFromExitFees, 1.2, 0.01, 'APY from Exit Fees');

console.log('\n=== Bull Case Test ===');
console.log('Inputs: 20% staked, $10B volume, $250K bribes/epoch\n');

const bullCase: SimulatorInputs = {
  ...baseCase,
  stakeRate: 0.20,
  annualVolume: 10_000_000_000,
  bribesPerEpoch: 250_000,
};

const bullOutputs = calculateOutputs(bullCase);

// Total vKAT Staked = 400M
assertClose(bullOutputs.totalVkatStaked, 400_000_000, 0.001, 'Total vKAT Staked');

// Fee Revenue = $5M
assertClose(bullOutputs.feeRevenue, 5_000_000, 0.001, 'Fee Revenue');

// Bribe Revenue = $6.5M
assertClose(bullOutputs.bribeRevenue, 6_500_000, 0.001, 'Bribe Revenue');

// Exit Fee Revenue = 400M × $0.10 × 15% × 8% = $480K
assertClose(bullOutputs.exitFeeRevenue, 480_000, 0.001, 'Exit Fee Revenue');

// Total Yield = $11.98M
assertClose(bullOutputs.totalYieldUsd, 11_980_000, 0.001, 'Total Yield');

// Yield per vKAT = $0.02995
assertClose(bullOutputs.yieldPerVkatUsd, 0.02995, 0.01, 'Yield per vKAT');

// APY = 29.95%
assertClose(bullOutputs.totalApy, 29.95, 0.01, 'Total APY');

console.log('\n=== Bear Case Test ===');
console.log('Inputs: 50% staked, $2B volume, $25K bribes/epoch\n');

const bearCase: SimulatorInputs = {
  ...baseCase,
  stakeRate: 0.50,
  annualVolume: 2_000_000_000,
  bribesPerEpoch: 25_000,
};

const bearOutputs = calculateOutputs(bearCase);

// Total vKAT Staked = 1B
assertClose(bearOutputs.totalVkatStaked, 1_000_000_000, 0.001, 'Total vKAT Staked');

// Fee Revenue = $1M
assertClose(bearOutputs.feeRevenue, 1_000_000, 0.001, 'Fee Revenue');

// Bribe Revenue = $650K
assertClose(bearOutputs.bribeRevenue, 650_000, 0.001, 'Bribe Revenue');

// Exit Fee Revenue = 1B × $0.10 × 15% × 8% = $1.2M
assertClose(bearOutputs.exitFeeRevenue, 1_200_000, 0.001, 'Exit Fee Revenue');

// Total Yield = $2.85M
assertClose(bearOutputs.totalYieldUsd, 2_850_000, 0.001, 'Total Yield');

// Yield per vKAT = $0.00285
assertClose(bearOutputs.yieldPerVkatUsd, 0.00285, 0.01, 'Yield per vKAT');

// APY = 2.85%
assertClose(bearOutputs.totalApy, 2.85, 0.01, 'Total APY');

console.log('\n=== All tests completed ===\n');

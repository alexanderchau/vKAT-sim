import type { SimulatorInputs, SimulatorOutputs, ScenarioPreset } from '../types';

// Fixed constants from the brief
export const CONSTANTS = {
  EPOCHS_PER_YEAR: 26,
  EPOCH_DURATION_DAYS: 14,
  PROTOCOL_FEE_RATE: 0.0005, // 0.05%
  TOTAL_KAT_SUPPLY: 10_000_000_000,
  MIN_EXIT_FEE: 0.025, // 2.5% with full cooldown
  MAX_EXIT_FEE: 0.25, // 25% instant exit
  COOLDOWN_DAYS: 45,
} as const;

// Default input values
export const DEFAULT_INPUTS: SimulatorInputs = {
  userVkat: 100_000,
  circulatingSupply: 2_000_000_000,
  stakeRate: 0.30,
  annualVolume: 6_000_000_000,
  bribesPerEpoch: 100_000,
  katPrice: 0.10,
  churnRate: 0.15,
  avgExitFee: 0.08,
};

// Input constraints
export const INPUT_CONSTRAINTS = {
  userVkat: { min: 1, max: 100_000_000, step: 1000 },
  circulatingSupply: { min: 1_000_000_000, max: 10_000_000_000, step: 100_000_000 },
  stakeRate: { min: 0.10, max: 0.70, step: 0.01 },
  annualVolume: { min: 6_000_000_000, max: 100_000_000_000, step: 100_000_000 },
  bribesPerEpoch: { min: 100_000, max: 2_000_000, step: 10_000 },
  katPrice: { min: 0.01, max: 1.00, step: 0.01 },
  churnRate: { min: 0.05, max: 0.30, step: 0.01 },
  avgExitFee: { min: 0.025, max: 0.25, step: 0.005 },
} as const;

/**
 * Core calculation function implementing the formulas from the brief
 */
export function calculateOutputs(inputs: SimulatorInputs): SimulatorOutputs {
  const {
    userVkat,
    circulatingSupply,
    stakeRate,
    annualVolume,
    bribesPerEpoch,
    katPrice,
    churnRate,
    avgExitFee,
  } = inputs;

  // Derived values
  const totalVkatStaked = circulatingSupply * stakeRate;
  const totalVkatStakedValue = totalVkatStaked * katPrice;

  // Revenue streams (USD)
  const feeRevenue = annualVolume * CONSTANTS.PROTOCOL_FEE_RATE;
  const bribeRevenue = bribesPerEpoch * CONSTANTS.EPOCHS_PER_YEAR;
  const exitFeeRevenue = totalVkatStakedValue * churnRate * avgExitFee;

  const totalYieldUsd = feeRevenue + bribeRevenue + exitFeeRevenue;

  // Per-vKAT metrics
  const yieldPerVkatUsd = totalYieldUsd / totalVkatStaked;

  // APY calculations
  const totalApy = (yieldPerVkatUsd / katPrice) * 100;
  const apyFromFees = (feeRevenue / totalVkatStaked / katPrice) * 100;
  const apyFromBribes = (bribeRevenue / totalVkatStaked / katPrice) * 100;
  const apyFromExitFees = (exitFeeRevenue / totalVkatStaked / katPrice) * 100;

  // User-specific returns
  const userAnnualYieldUsd = userVkat * yieldPerVkatUsd;
  const userEpochYieldUsd = userAnnualYieldUsd / CONSTANTS.EPOCHS_PER_YEAR;

  // Break-even analysis: days to recover if user exits with instant fee
  // Assuming worst case instant exit fee of 25%
  const userPositionValue = userVkat * katPrice;
  const instantExitCost = userPositionValue * CONSTANTS.MAX_EXIT_FEE;
  const dailyYield = userAnnualYieldUsd / 365;
  const breakEvenDays = dailyYield > 0 ? Math.ceil(instantExitCost / dailyYield) : Infinity;

  return {
    totalVkatStaked,
    feeRevenue,
    bribeRevenue,
    exitFeeRevenue,
    totalYieldUsd,
    yieldPerVkatUsd,
    totalApy,
    apyFromFees,
    apyFromBribes,
    apyFromExitFees,
    userAnnualYieldUsd,
    userEpochYieldUsd,
    breakEvenDays,
  };
}

/**
 * Generate data for APY vs Stake Rate chart
 */
export function generateStakeRateChartData(
  inputs: SimulatorInputs,
  minRate = 0.10,
  maxRate = 0.70,
  steps = 25
): { stakeRate: number; apy: number }[] {
  const data: { stakeRate: number; apy: number }[] = [];
  const stepSize = (maxRate - minRate) / steps;

  for (let rate = minRate; rate <= maxRate; rate += stepSize) {
    const outputs = calculateOutputs({ ...inputs, stakeRate: rate });
    data.push({
      stakeRate: rate * 100,
      apy: outputs.totalApy,
    });
  }

  return data;
}

/**
 * Generate data for APY vs Bribe Market Size chart
 */
export function generateBribeChartData(
  inputs: SimulatorInputs,
  minBribe = 0,
  maxBribe = 500_000,
  steps = 25
): { bribesPerEpoch: number; apy: number }[] {
  const data: { bribesPerEpoch: number; apy: number }[] = [];
  const stepSize = (maxBribe - minBribe) / steps;

  for (let bribe = minBribe; bribe <= maxBribe; bribe += stepSize) {
    const outputs = calculateOutputs({ ...inputs, bribesPerEpoch: bribe });
    data.push({
      bribesPerEpoch: bribe,
      apy: outputs.totalApy,
    });
  }

  return data;
}

/**
 * Generate data for APY vs Trading Volume chart
 */
export function generateVolumeChartData(
  inputs: SimulatorInputs,
  minVolume = 1_000_000_000,
  maxVolume = 15_000_000_000,
  steps = 25
): { annualVolume: number; apy: number }[] {
  const data: { annualVolume: number; apy: number }[] = [];
  const stepSize = (maxVolume - minVolume) / steps;

  for (let vol = minVolume; vol <= maxVolume; vol += stepSize) {
    const outputs = calculateOutputs({ ...inputs, annualVolume: vol });
    data.push({
      annualVolume: vol / 1_000_000_000,
      apy: outputs.totalApy,
    });
  }

  return data;
}

/**
 * Generate data for APY composition stacked chart
 */
export function generateCompositionData(outputs: SimulatorOutputs): {
  name: string;
  value: number;
  color: string;
}[] {
  return [
    { name: 'Trading Fees', value: outputs.apyFromFees, color: '#6366f1' },
    { name: 'Bribes', value: outputs.apyFromBribes, color: '#22c55e' },
    { name: 'Exit Fees', value: outputs.apyFromExitFees, color: '#f59e0b' },
  ];
}

// Scenario presets
export const SCENARIO_PRESETS: ScenarioPreset[] = [
  {
    name: 'Bear',
    description: 'Lower volume, higher stake rate, minimal bribes',
    inputs: {
      stakeRate: 0.50,
      annualVolume: 6_000_000_000,
      bribesPerEpoch: 100_000,
    },
  },
  {
    name: 'Base',
    description: 'Current market conditions',
    inputs: {
      stakeRate: 0.30,
      annualVolume: 10_000_000_000,
      bribesPerEpoch: 250_000,
    },
  },
  {
    name: 'Bull',
    description: 'Higher volume, lower stake rate, strong bribes',
    inputs: {
      stakeRate: 0.20,
      annualVolume: 25_000_000_000,
      bribesPerEpoch: 500_000,
    },
  },
];

/**
 * Format number as currency
 */
export function formatCurrency(value: number, decimals = 2): string {
  if (value >= 1_000_000_000) {
    return `$${(value / 1_000_000_000).toFixed(decimals)}B`;
  }
  if (value >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(decimals)}M`;
  }
  if (value >= 1_000) {
    return `$${(value / 1_000).toFixed(decimals)}K`;
  }
  return `$${value.toFixed(decimals)}`;
}

/**
 * Format number with commas
 */
export function formatNumber(value: number, decimals = 0): string {
  return value.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

/**
 * Format percentage
 */
export function formatPercent(value: number, decimals = 2): string {
  return `${value.toFixed(decimals)}%`;
}

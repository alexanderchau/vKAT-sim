import type { SimulatorInputs, SimulatorOutputs, ScenarioPreset, EpochResult, MultiEpochOutputs } from '../types';

// Fixed constants from the brief
export const CONSTANTS = {
  EPOCHS_PER_YEAR: 26,
  EPOCH_DURATION_DAYS: 14,
  TOTAL_KAT_SUPPLY: 10_000_000_000,
  MIN_EXIT_FEE: 0.025, // 2.5% with full cooldown
  MAX_EXIT_FEE: 0.80, // 80% instant exit
  COOLDOWN_DAYS: 60,
  STABILIZATION_DAYS: 60,
} as const;

// Pre-staking vote boost schedule (4 epochs = 8 weeks)
export const BOOST_SCHEDULE = [
  { label: 'Day 1\u201314', boost: 3.0, days: 14 },
  { label: 'Day 15\u201328', boost: 2.5, days: 14 },
  { label: 'Day 29\u201342', boost: 2.0, days: 14 },
  { label: 'Day 43\u201356', boost: 1.5, days: 14 },
  { label: 'Day 57+', boost: 1.0, days: 14 },
] as const;

// Exit fee taper (80% → 25% over 60-day stabilization, per blog)
export const EXIT_FEE_SCHEDULE = [
  { label: 'Day 1\u201314', fee: 0.80 },
  { label: 'Day 15\u201328', fee: 0.6625 },
  { label: 'Day 29\u201342', fee: 0.525 },
  { label: 'Day 43\u201356', fee: 0.3875 },
  { label: 'Day 57+', fee: 0.25 },
] as const;

// Guaranteed yield parameters (per blog)
export const GUARANTEED_YIELD = {
  rate: 0.35, // 35% over 60 days
  capKat: 350_000_000, // 350M KAT cap
  maxPayoutKat: 123_000_000, // 123M KAT max treasury payout
  periodDays: 60,
} as const;

// Default input values
export const DEFAULT_INPUTS: SimulatorInputs = {
  userVkat: 100_000,
  circulatingSupply: 2_000_000_000,
  stakeRate: 0.30,
  annualVolume: 3_600_000_000,
  avgFeeRate: 0.0005,
  bribesPerEpoch: 100_000,
  katPrice: 0.10,
  churnRate: 0.15,
  avgExitFee: 0.80,
  voteBoost: 3.0,
};

// Input constraints
export const INPUT_CONSTRAINTS = {
  userVkat: { min: 1, max: 100_000_000, step: 1000 },
  circulatingSupply: { min: 1_000_000_000, max: 10_000_000_000, step: 100_000_000 },
  stakeRate: { min: 0.01, max: 0.70, step: 0.01 },
  annualVolume: { min: 500_000_000, max: 5_000_000_000, step: 100_000_000 },
  avgFeeRate: { min: 0.0001, max: 0.003, step: 0.0001 },
  bribesPerEpoch: { min: 10_000, max: 500_000, step: 10_000 },
  katPrice: { min: 0.001, max: 0.50, step: 0.001 },
  churnRate: { min: 0.05, max: 0.50, step: 0.01 },
  avgExitFee: { min: 0.025, max: 0.80, step: 0.005 },
  voteBoost: { min: 1.0, max: 3.0, step: 0.5 },
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
    avgFeeRate,
    bribesPerEpoch,
    katPrice,
    churnRate,
    avgExitFee,
    voteBoost,
  } = inputs;

  // Derived values
  const totalVkatStaked = circulatingSupply * stakeRate;
  const totalVkatStakedValue = totalVkatStaked * katPrice;

  // Revenue streams (USD)
  const feeRevenue = annualVolume * avgFeeRate;
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

  // User-specific returns (with vote boost)
  // Boost increases user's effective votes, redistributing their share of total yield
  const userEffectiveVkat = userVkat * voteBoost;
  const adjustedTotalVkat = (totalVkatStaked - userVkat) + userEffectiveVkat;
  const userShare = userEffectiveVkat / adjustedTotalVkat;
  const userAnnualYieldUsd = totalYieldUsd * userShare;
  const userEpochYieldUsd = userAnnualYieldUsd / CONSTANTS.EPOCHS_PER_YEAR;

  // Break-even analysis: days to recover if user exits with instant fee
  // Assuming worst case instant exit fee of 80%
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
 * Calculate returns across the 60-day stabilization period + steady state
 * Uses the boost and exit fee schedules with variable period lengths
 */
export function calculateMultiEpochOutputs(inputs: SimulatorInputs): MultiEpochOutputs {
  const epochs: EpochResult[] = [];
  let cumulativeYield = 0;

  for (let i = 0; i < BOOST_SCHEDULE.length; i++) {
    const epochInputs: SimulatorInputs = {
      ...inputs,
      voteBoost: BOOST_SCHEDULE[i].boost,
      avgExitFee: EXIT_FEE_SCHEDULE[i].fee,
    };
    const epochOutputs = calculateOutputs(epochInputs);

    // Scale yield by actual period length (some periods are not 14 days)
    const periodDays = BOOST_SCHEDULE[i].days;
    const dailyYield = epochOutputs.userAnnualYieldUsd / 365;
    const periodYield = dailyYield * periodDays;

    cumulativeYield += periodYield;

    epochs.push({
      epoch: i + 1,
      label: BOOST_SCHEDULE[i].label,
      boost: BOOST_SCHEDULE[i].boost,
      exitFee: EXIT_FEE_SCHEDULE[i].fee,
      userEpochYieldUsd: periodYield,
      cumulativeYieldUsd: cumulativeYield,
      epochApy: (dailyYield * 365) / (inputs.userVkat * inputs.katPrice) * 100,
    });
  }

  // Blended APY: annualize the 60-day stabilization return
  const boostedYield = epochs.slice(0, 4).reduce((sum, e) => sum + e.userEpochYieldUsd, 0);
  const boostedDays = BOOST_SCHEDULE.slice(0, 4).reduce((sum, s) => sum + s.days, 0);
  const positionValue = inputs.userVkat * inputs.katPrice;
  const blendedApy = positionValue > 0 ? (boostedYield / positionValue) * (365 / boostedDays) * 100 : 0;

  // Guaranteed yield: 35% over 60 days, capped at 350M KAT staked
  const guaranteedYieldKat = inputs.userVkat * GUARANTEED_YIELD.rate;
  const guaranteedYieldUsd = guaranteedYieldKat * inputs.katPrice;
  const organicYieldUsd = boostedYield;
  const isGuaranteeActive = inputs.userVkat <= GUARANTEED_YIELD.capKat &&
    (inputs.circulatingSupply * inputs.stakeRate) <= GUARANTEED_YIELD.capKat;
  const treasuryTopUpUsd = isGuaranteeActive ? Math.max(0, guaranteedYieldUsd - organicYieldUsd) : 0;
  const effectiveYieldUsd = isGuaranteeActive ? Math.max(guaranteedYieldUsd, organicYieldUsd) : organicYieldUsd;

  return {
    epochs,
    totalYield56Days: boostedYield,
    blendedApy,
    guaranteedYieldUsd,
    guaranteedYieldKat,
    organicYieldUsd,
    treasuryTopUpUsd,
    effectiveYieldUsd,
    isGuaranteeActive,
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
    description: 'Conservative assumptions',
    inputs: {
      annualVolume: 3_600_000_000,
      bribesPerEpoch: 100_000,
    },
  },
  {
    name: 'Base',
    description: 'Baseline projection',
    inputs: {
      annualVolume: 10_000_000_000,
      bribesPerEpoch: 250_000,
    },
  },
  {
    name: 'Bull',
    description: 'Optimistic scenario',
    inputs: {
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

export interface SimulatorInputs {
  userVkat: number;
  circulatingSupply: number;
  stakeRate: number;
  annualVolume: number;
  avgFeeRate: number;
  bribesPerEpoch: number;
  katPrice: number;
  churnRate: number;
  avgExitFee: number;
  voteBoost: number;
}

export interface SimulatorOutputs {
  // Core metrics
  totalVkatStaked: number;

  // Revenue streams (USD)
  feeRevenue: number;
  bribeRevenue: number;
  exitFeeRevenue: number;
  totalYieldUsd: number;

  // Per-vKAT metrics
  yieldPerVkatUsd: number;

  // APY breakdown
  totalApy: number;
  apyFromFees: number;
  apyFromBribes: number;
  apyFromExitFees: number;

  // User-specific returns
  userAnnualYieldUsd: number;
  userEpochYieldUsd: number;

  // Break-even analysis
  breakEvenDays: number;
}

export interface ScenarioPreset {
  name: string;
  description: string;
  inputs: Partial<SimulatorInputs>;
}

export interface EpochResult {
  epoch: number;
  label: string;
  boost: number;
  exitFee: number;
  userEpochYieldUsd: number;
  cumulativeYieldUsd: number;
  epochApy: number; // annualized APY for this epoch
}

export interface MultiEpochOutputs {
  epochs: EpochResult[];
  totalYield56Days: number;
  blendedApy: number; // annualized from the 56-day period
}

export type ChartDataPoint = {
  x: number;
  y: number;
  label?: string;
};

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

export type ChartDataPoint = {
  x: number;
  y: number;
  label?: string;
};

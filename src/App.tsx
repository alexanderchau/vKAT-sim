import { useState, useMemo, useCallback } from 'react';
import {
  SliderInput,
  OutputDisplay,
  Disclaimers,
  EpochBreakdown,
} from './components';
import {
  calculateOutputs,
  calculateMultiEpochOutputs,
  DEFAULT_INPUTS,
  INPUT_CONSTRAINTS,
  CONSTANTS,
  BOOST_SCHEDULE,
  EXIT_FEE_SCHEDULE,
  formatCurrency,
} from './lib/calculations';
import type { SimulatorInputs } from './types';

const MODEL_VERSION = '1.4';

function App() {
  const [inputs, setInputs] = useState<SimulatorInputs>(DEFAULT_INPUTS);

  const outputs = useMemo(() => calculateOutputs(inputs), [inputs]);
  const multiEpoch = useMemo(() => calculateMultiEpochOutputs(inputs), [inputs]);

  const updateInput = useCallback((key: keyof SimulatorInputs, value: number) => {
    setInputs((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleReset = useCallback(() => {
    setInputs(DEFAULT_INPUTS);
  }, []);

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      {/* Header */}
      <header style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-subtle)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>
                  vKAT Staking Yield Model
                </h1>
                <span
                  className="text-xs font-mono px-2 py-0.5 rounded"
                  style={{
                    background: 'var(--bg-elevated)',
                    color: 'var(--text-muted)',
                    border: '1px solid var(--border-subtle)'
                  }}
                >
                  v{MODEL_VERSION}
                </span>
              </div>
              <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
                Projected returns for Katana Armory participation
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleReset}
                className="btn text-sm"
              >
                Reset Parameters
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Inputs */}
          <div className="lg:col-span-1 space-y-5">
            {/* Your Position */}
            <div className="card">
              <h3 className="section-title">Position Parameters</h3>
              <SliderInput
                label="vKAT Holdings"
                value={inputs.userVkat}
                onChange={(v) => updateInput('userVkat', v)}
                {...INPUT_CONSTRAINTS.userVkat}
                format="number"
                tooltip="Quantity of KAT to be locked as vKAT"
              />
              <SliderInput
                label="KAT Price (USD)"
                value={inputs.katPrice}
                onChange={(v) => updateInput('katPrice', v)}
                {...INPUT_CONSTRAINTS.katPrice}
                format="currency"
                tooltip="Assumed KAT token price for calculations"
              />
            </div>

            {/* Market Parameters */}
            <div className="card">
              <h3 className="section-title">Market Assumptions</h3>
              <SliderInput
                label="Circulating Supply"
                value={inputs.circulatingSupply}
                onChange={(v) => updateInput('circulatingSupply', v)}
                {...INPUT_CONSTRAINTS.circulatingSupply}
                format="token"
                tooltip="Total KAT tokens currently in circulation"
              />
              <SliderInput
                label="Staking Participation"
                value={inputs.stakeRate}
                onChange={(v) => updateInput('stakeRate', v)}
                {...INPUT_CONSTRAINTS.stakeRate}
                format="percent"
                tooltip="Percentage of circulating supply locked as vKAT"
              />
              <SliderInput
                label="Annual Trading Volume"
                value={inputs.annualVolume}
                onChange={(v) => updateInput('annualVolume', v)}
                {...INPUT_CONSTRAINTS.annualVolume}
                format="volume"
                tooltip="Projected annual trading volume on Katana DEX"
              />
              <SliderInput
                label="Avg Fee Rate"
                value={inputs.avgFeeRate}
                onChange={(v) => updateInput('avgFeeRate', v)}
                {...INPUT_CONSTRAINTS.avgFeeRate}
                format="bps"
                tooltip="Volume-weighted average protocol fee across all pools"
              />
              <SliderInput
                label="Epoch Bribe Pool"
                value={inputs.bribesPerEpoch}
                onChange={(v) => updateInput('bribesPerEpoch', v)}
                {...INPUT_CONSTRAINTS.bribesPerEpoch}
                format="currency"
                tooltip="Aggregate bribe incentives per 14-day epoch"
              />
            </div>

            {/* Advanced Parameters */}
            <div className="card">
              <h3 className="section-title">Advanced Assumptions</h3>
              <SliderInput
                label="Annual Churn Rate"
                value={inputs.churnRate}
                onChange={(v) => updateInput('churnRate', v)}
                {...INPUT_CONSTRAINTS.churnRate}
                format="percent"
                tooltip="Estimated percentage of vKAT exiting annually"
              />
            </div>

            {/* Fixed Parameters Info */}
            <div className="info-panel">
              <h4 className="text-xs font-medium mb-3" style={{ color: 'var(--text-secondary)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                Protocol Constants
              </h4>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
                <div>Epoch Duration: {CONSTANTS.EPOCH_DURATION_DAYS}d</div>
                <div>Epochs per Year: {CONSTANTS.EPOCHS_PER_YEAR}</div>
                <div>Cooldown Period: {CONSTANTS.COOLDOWN_DAYS}d</div>
                <div>Max Exit Fee: {CONSTANTS.MAX_EXIT_FEE * 100}%</div>
              </div>
            </div>

            {/* Boost Schedule */}
            <div className="info-panel">
              <h4 className="text-xs font-medium mb-3" style={{ color: 'var(--text-secondary)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                Vote Boost Schedule — 4 Epochs, 56 Days
              </h4>
              <div className="grid grid-cols-5 gap-1 text-xs font-mono text-center">
                {BOOST_SCHEDULE.map((s) => (
                  <div key={s.label} className="px-1 py-1.5 rounded" style={{ background: 'var(--bg-elevated)', color: 'var(--text-muted)' }}>
                    {s.label}
                  </div>
                ))}
                {BOOST_SCHEDULE.map((s) => (
                  <div key={s.label + '-v'} className="px-1 py-1.5 font-medium" style={{ color: 'var(--text-primary)' }}>
                    {s.boost.toFixed(1)}x
                  </div>
                ))}
              </div>
            </div>

            {/* Exit Fee Taper Schedule */}
            <div className="info-panel">
              <h4 className="text-xs font-medium mb-3" style={{ color: 'var(--text-secondary)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                Exit Fee Taper — 4 Epochs, 56 Days
              </h4>
              <div className="grid grid-cols-5 gap-1 text-xs font-mono text-center">
                {EXIT_FEE_SCHEDULE.map((s) => (
                  <div key={s.label} className="px-1 py-1.5 rounded" style={{ background: 'var(--bg-elevated)', color: 'var(--text-muted)' }}>
                    {s.label}
                  </div>
                ))}
                {EXIT_FEE_SCHEDULE.map((s) => (
                  <div key={s.label + '-v'} className="px-1 py-1.5 font-medium" style={{ color: 'var(--text-primary)' }}>
                    {(s.fee * 100).toFixed(s.fee * 100 % 1 === 0 ? 0 : 1)}%
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Outputs */}
          <div className="lg:col-span-2 space-y-5">
            <OutputDisplay
              outputs={outputs}
              userVkat={inputs.userVkat}
              katPrice={inputs.katPrice}
            />

            <EpochBreakdown
              multiEpoch={multiEpoch}
              katPrice={inputs.katPrice}
              userVkat={inputs.userVkat}
            />

            {/* Protocol Revenue */}
            <div className="card">
              <h3 className="section-title">Aggregate Protocol Revenue (Annualized)</h3>
              <div className="space-y-0">
                <div className="data-row">
                  <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Trading Fee Revenue</span>
                  <span className="font-mono font-medium" style={{ color: 'var(--text-primary)' }}>{formatCurrency(outputs.feeRevenue)}</span>
                </div>
                <div className="data-row">
                  <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Bribe Revenue</span>
                  <span className="font-mono font-medium" style={{ color: 'var(--text-primary)' }}>{formatCurrency(outputs.bribeRevenue)}</span>
                </div>
                <div className="data-row">
                  <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Exit Fee Revenue</span>
                  <span className="font-mono font-medium" style={{ color: 'var(--text-primary)' }}>{formatCurrency(outputs.exitFeeRevenue)}</span>
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
                <span className="font-mono text-base font-semibold" style={{ color: 'var(--accent-primary)' }}>${outputs.yieldPerVkatUsd.toFixed(4)}</span>
              </div>
            </div>

            <Disclaimers />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border-subtle)', marginTop: '48px' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                vKAT Staking Yield Model
              </span>
              <span className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
                v{MODEL_VERSION}
              </span>
            </div>
            <div className="flex items-center gap-6 text-xs" style={{ color: 'var(--text-muted)' }}>
              <span>Based on confirmed vKAT Armory mechanics</span>
              <span style={{ color: 'var(--border-color)' }}>|</span>
              <span>For illustrative purposes only</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;

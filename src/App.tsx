import { useState, useMemo, useCallback } from 'react';
import {
  SliderInput,
  OutputDisplay,
  ScenarioPresets,
  SensitivityCharts,
  Disclaimers,
} from './components';
import {
  calculateOutputs,
  DEFAULT_INPUTS,
  INPUT_CONSTRAINTS,
  SCENARIO_PRESETS,
  CONSTANTS,
} from './lib/calculations';
import type { SimulatorInputs } from './types';

function App() {
  const [inputs, setInputs] = useState<SimulatorInputs>(DEFAULT_INPUTS);
  const [activeScenario, setActiveScenario] = useState<string | null>('Base');

  const outputs = useMemo(() => calculateOutputs(inputs), [inputs]);

  const updateInput = useCallback((key: keyof SimulatorInputs, value: number) => {
    setInputs((prev) => ({ ...prev, [key]: value }));
    setActiveScenario(null);
  }, []);

  const handleScenarioSelect = useCallback((scenarioInputs: Partial<SimulatorInputs>) => {
    setInputs((prev) => ({ ...prev, ...scenarioInputs }));
    const scenario = SCENARIO_PRESETS.find(
      (s) => JSON.stringify(s.inputs) === JSON.stringify(scenarioInputs)
    );
    setActiveScenario(scenario?.name || null);
  }, []);

  const handleReset = useCallback(() => {
    setInputs(DEFAULT_INPUTS);
    setActiveScenario('Base');
  }, []);

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      {/* Header */}
      <header style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-subtle)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>
                vKAT Staking Yield Model
              </h1>
              <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
                Projected returns for Katana Armory participation
              </p>
            </div>
            <button
              onClick={handleReset}
              className="btn text-sm"
            >
              Reset Parameters
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Inputs */}
          <div className="lg:col-span-1 space-y-5">
            {/* Scenario Presets */}
            <div className="card">
              <ScenarioPresets onSelect={handleScenarioSelect} activeScenario={activeScenario} />
            </div>

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
                format="volume"
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
              <SliderInput
                label="Blended Exit Fee"
                value={inputs.avgExitFee}
                onChange={(v) => updateInput('avgExitFee', v)}
                {...INPUT_CONSTRAINTS.avgExitFee}
                format="percent"
                tooltip="Weighted average exit fee (2.5% cooldown to 25% instant)"
              />
            </div>

            {/* Fixed Parameters Info */}
            <div className="info-panel">
              <h4 className="text-xs font-medium mb-3" style={{ color: 'var(--text-secondary)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                Protocol Constants
              </h4>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
                <div>Protocol Fee: 0.05%</div>
                <div>LP Fee: 0.25%</div>
                <div>Epoch Duration: {CONSTANTS.EPOCH_DURATION_DAYS}d</div>
                <div>Epochs per Year: {CONSTANTS.EPOCHS_PER_YEAR}</div>
                <div>Cooldown Period: {CONSTANTS.COOLDOWN_DAYS}d</div>
                <div>Max Exit Fee: {CONSTANTS.MAX_EXIT_FEE * 100}%</div>
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

            <SensitivityCharts inputs={inputs} outputs={outputs} />

            <Disclaimers />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border-subtle)', marginTop: '48px' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
              vKAT Staking Yield Model
            </div>
            <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
              Based on confirmed vKAT Armory mechanics. For illustrative purposes only.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;

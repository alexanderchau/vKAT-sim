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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">vKAT Staking APY Simulator</h1>
              <p className="text-sm text-gray-500 mt-1">
                Calculate expected yields for voting in the Katana Armory
              </p>
            </div>
            <button
              onClick={handleReset}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Reset to Defaults
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Inputs */}
          <div className="lg:col-span-1 space-y-6">
            {/* Scenario Presets */}
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <ScenarioPresets onSelect={handleScenarioSelect} activeScenario={activeScenario} />
            </div>

            {/* Your Position */}
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="text-sm font-semibold text-gray-700 mb-4">Your Position</h3>
              <SliderInput
                label="Your vKAT Amount"
                value={inputs.userVkat}
                onChange={(v) => updateInput('userVkat', v)}
                {...INPUT_CONSTRAINTS.userVkat}
                format="number"
                tooltip="Amount of KAT you plan to lock as vKAT"
              />
              <SliderInput
                label="KAT Price"
                value={inputs.katPrice}
                onChange={(v) => updateInput('katPrice', v)}
                {...INPUT_CONSTRAINTS.katPrice}
                format="currency"
                tooltip="Current or expected KAT token price"
              />
            </div>

            {/* Market Parameters */}
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="text-sm font-semibold text-gray-700 mb-4">Market Parameters</h3>
              <SliderInput
                label="Circulating Supply"
                value={inputs.circulatingSupply}
                onChange={(v) => updateInput('circulatingSupply', v)}
                {...INPUT_CONSTRAINTS.circulatingSupply}
                format="volume"
                tooltip="Total KAT tokens in circulation"
              />
              <SliderInput
                label="% of KAT Staked"
                value={inputs.stakeRate}
                onChange={(v) => updateInput('stakeRate', v)}
                {...INPUT_CONSTRAINTS.stakeRate}
                format="percent"
                tooltip="Percentage of circulating supply locked as vKAT"
              />
              <SliderInput
                label="Annual DEX Volume"
                value={inputs.annualVolume}
                onChange={(v) => updateInput('annualVolume', v)}
                {...INPUT_CONSTRAINTS.annualVolume}
                format="volume"
                tooltip="Expected annual trading volume on Katana"
              />
              <SliderInput
                label="Bribes per Epoch"
                value={inputs.bribesPerEpoch}
                onChange={(v) => updateInput('bribesPerEpoch', v)}
                {...INPUT_CONSTRAINTS.bribesPerEpoch}
                format="currency"
                tooltip="Total bribe incentives per 14-day epoch"
              />
            </div>

            {/* Advanced Parameters */}
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <details className="group">
                <summary className="text-sm font-semibold text-gray-700 cursor-pointer flex items-center justify-between">
                  <span>Advanced Parameters</span>
                  <span className="text-gray-400 group-open:rotate-180 transition-transform">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                      <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="2" fill="none" />
                    </svg>
                  </span>
                </summary>
                <div className="mt-4 space-y-4">
                  <SliderInput
                    label="Annual Churn Rate"
                    value={inputs.churnRate}
                    onChange={(v) => updateInput('churnRate', v)}
                    {...INPUT_CONSTRAINTS.churnRate}
                    format="percent"
                    tooltip="% of vKAT that exits annually"
                  />
                  <SliderInput
                    label="Average Exit Fee"
                    value={inputs.avgExitFee}
                    onChange={(v) => updateInput('avgExitFee', v)}
                    {...INPUT_CONSTRAINTS.avgExitFee}
                    format="percent"
                    tooltip="Blended exit fee (2.5% cooldown to 25% instant)"
                  />
                </div>
              </details>
            </div>

            {/* Fixed Parameters Info */}
            <div className="bg-gray-100 rounded-xl p-4">
              <h4 className="text-xs font-semibold text-gray-600 mb-2">Fixed Parameters</h4>
              <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
                <div>Protocol Fee: 0.05%</div>
                <div>LP Fee: 0.25%</div>
                <div>Epoch Duration: {CONSTANTS.EPOCH_DURATION_DAYS} days</div>
                <div>Epochs/Year: {CONSTANTS.EPOCHS_PER_YEAR}</div>
                <div>Cooldown: {CONSTANTS.COOLDOWN_DAYS} days</div>
                <div>Max Exit Fee: {CONSTANTS.MAX_EXIT_FEE * 100}%</div>
              </div>
            </div>
          </div>

          {/* Right Column - Outputs */}
          <div className="lg:col-span-2 space-y-6">
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
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-gray-500">
              vKAT Staking APY Simulator | Katana Tokenomics Tool
            </div>
            <div className="text-xs text-gray-400">
              Model assumptions based on confirmed vKAT Armory mechanics.
              Actual returns may vary.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;

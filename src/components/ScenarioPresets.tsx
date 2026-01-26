import { SCENARIO_PRESETS } from '../lib/calculations';
import type { SimulatorInputs } from '../types';

interface ScenarioPresetsProps {
  onSelect: (inputs: Partial<SimulatorInputs>) => void;
  activeScenario: string | null;
}

const scenarioStyles: Record<string, { bg: string; border: string; text: string; active: string }> = {
  Bear: {
    bg: 'bg-red-50 hover:bg-red-100',
    border: 'border-red-200',
    text: 'text-red-700',
    active: 'ring-2 ring-red-500 bg-red-100',
  },
  Base: {
    bg: 'bg-blue-50 hover:bg-blue-100',
    border: 'border-blue-200',
    text: 'text-blue-700',
    active: 'ring-2 ring-blue-500 bg-blue-100',
  },
  Bull: {
    bg: 'bg-green-50 hover:bg-green-100',
    border: 'border-green-200',
    text: 'text-green-700',
    active: 'ring-2 ring-green-500 bg-green-100',
  },
};

export function ScenarioPresets({ onSelect, activeScenario }: ScenarioPresetsProps) {
  return (
    <div className="mb-6">
      <h3 className="text-sm font-semibold text-gray-700 mb-3">Market Scenarios</h3>
      <div className="grid grid-cols-3 gap-3">
        {SCENARIO_PRESETS.map((scenario) => {
          const styles = scenarioStyles[scenario.name];
          const isActive = activeScenario === scenario.name;

          return (
            <button
              key={scenario.name}
              onClick={() => onSelect(scenario.inputs)}
              className={`
                p-3 rounded-lg border transition-all cursor-pointer
                ${styles.border} ${isActive ? styles.active : styles.bg}
              `}
            >
              <div className={`text-sm font-semibold ${styles.text}`}>
                {scenario.name}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {scenario.description}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

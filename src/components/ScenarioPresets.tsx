import { SCENARIO_PRESETS } from '../lib/calculations';
import type { SimulatorInputs } from '../types';

interface ScenarioPresetsProps {
  onSelect: (inputs: Partial<SimulatorInputs>) => void;
  activeScenario: string | null;
}

const scenarioStyles: Record<string, { bg: string; border: string; text: string; activeBg: string; activeBorder: string }> = {
  Bear: {
    bg: 'rgba(217, 83, 79, 0.08)',
    border: 'rgba(217, 83, 79, 0.15)',
    text: '#d9534f',
    activeBg: 'rgba(217, 83, 79, 0.12)',
    activeBorder: 'rgba(217, 83, 79, 0.4)',
  },
  Base: {
    bg: 'rgba(74, 144, 217, 0.08)',
    border: 'rgba(74, 144, 217, 0.15)',
    text: '#4a90d9',
    activeBg: 'rgba(74, 144, 217, 0.12)',
    activeBorder: 'rgba(74, 144, 217, 0.4)',
  },
  Bull: {
    bg: 'rgba(52, 167, 127, 0.08)',
    border: 'rgba(52, 167, 127, 0.15)',
    text: '#34a77f',
    activeBg: 'rgba(52, 167, 127, 0.12)',
    activeBorder: 'rgba(52, 167, 127, 0.4)',
  },
};

export function ScenarioPresets({ onSelect, activeScenario }: ScenarioPresetsProps) {
  return (
    <div>
      <h3 className="section-title">Market Scenarios</h3>
      <div className="grid grid-cols-3 gap-2">
        {SCENARIO_PRESETS.map((scenario) => {
          const styles = scenarioStyles[scenario.name];
          const isActive = activeScenario === scenario.name;

          return (
            <button
              key={scenario.name}
              onClick={() => onSelect(scenario.inputs)}
              className="p-3 rounded-md transition-all cursor-pointer"
              style={{
                background: isActive ? styles.activeBg : styles.bg,
                border: `1px solid ${isActive ? styles.activeBorder : styles.border}`,
              }}
            >
              <div className="text-sm font-semibold" style={{ color: styles.text }}>
                {scenario.name}
              </div>
              <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                {scenario.description}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

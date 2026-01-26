import { SCENARIO_PRESETS } from '../lib/calculations';
import type { SimulatorInputs } from '../types';

interface ScenarioPresetsProps {
  onSelect: (inputs: Partial<SimulatorInputs>) => void;
  activeScenario: string | null;
}

const scenarioStyles: Record<string, { bg: string; border: string; text: string; activeBg: string; activeBorder: string }> = {
  Bear: {
    bg: 'rgba(239, 68, 68, 0.1)',
    border: 'rgba(239, 68, 68, 0.2)',
    text: '#ef4444',
    activeBg: 'rgba(239, 68, 68, 0.2)',
    activeBorder: '#ef4444',
  },
  Base: {
    bg: 'rgba(59, 130, 246, 0.1)',
    border: 'rgba(59, 130, 246, 0.2)',
    text: '#3b82f6',
    activeBg: 'rgba(59, 130, 246, 0.2)',
    activeBorder: '#3b82f6',
  },
  Bull: {
    bg: 'rgba(16, 185, 129, 0.1)',
    border: 'rgba(16, 185, 129, 0.2)',
    text: '#10b981',
    activeBg: 'rgba(16, 185, 129, 0.2)',
    activeBorder: '#10b981',
  },
};

export function ScenarioPresets({ onSelect, activeScenario }: ScenarioPresetsProps) {
  return (
    <div className="mb-2">
      <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>Market Scenarios</h3>
      <div className="grid grid-cols-3 gap-3">
        {SCENARIO_PRESETS.map((scenario) => {
          const styles = scenarioStyles[scenario.name];
          const isActive = activeScenario === scenario.name;

          return (
            <button
              key={scenario.name}
              onClick={() => onSelect(scenario.inputs)}
              className="p-3 rounded-lg transition-all cursor-pointer hover:scale-105"
              style={{
                background: isActive ? styles.activeBg : styles.bg,
                border: `1px solid ${isActive ? styles.activeBorder : styles.border}`,
                boxShadow: isActive ? `0 0 15px ${styles.border}` : 'none',
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

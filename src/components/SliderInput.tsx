import { formatNumber, formatCurrency, formatPercent } from '../lib/calculations';

interface SliderInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step: number;
  format?: 'number' | 'currency' | 'percent' | 'volume';
  tooltip?: string;
}

export function SliderInput({
  label,
  value,
  onChange,
  min,
  max,
  step,
  format = 'number',
  tooltip,
}: SliderInputProps) {
  const formatValue = (val: number): string => {
    switch (format) {
      case 'currency':
        return formatCurrency(val, 2);
      case 'percent':
        return formatPercent(val * 100, 1);
      case 'volume':
        return formatCurrency(val, 2);
      default:
        return formatNumber(val, 0);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/[^0-9.-]/g, '');
    let numValue = parseFloat(rawValue);

    if (format === 'percent') {
      numValue = numValue / 100;
    }

    if (!isNaN(numValue)) {
      onChange(Math.max(min, Math.min(max, numValue)));
    }
  };

  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-1">
        <label className="text-sm font-medium flex items-center gap-1" style={{ color: 'var(--text-secondary)' }}>
          {label}
          {tooltip && (
            <span className="group relative">
              <span className="cursor-help text-xs" style={{ color: 'var(--text-muted)' }}>(?)</span>
              <span
                className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10"
                style={{ background: 'var(--accent-primary)', color: 'white' }}
              >
                {tooltip}
              </span>
            </span>
          )}
        </label>
        <input
          type="text"
          value={formatValue(value)}
          onChange={handleInputChange}
          className="w-28 text-right text-sm font-mono px-2 py-1 rounded"
          style={{
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-color)',
            color: 'var(--text-primary)',
          }}
        />
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full"
      />
      <div className="flex justify-between text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
        <span>{formatValue(min)}</span>
        <span>{formatValue(max)}</span>
      </div>
    </div>
  );
}

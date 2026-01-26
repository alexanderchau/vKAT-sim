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
    <div className="mb-5 last:mb-0">
      <div className="flex justify-between items-center mb-2">
        <label className="text-sm font-medium flex items-center gap-1.5" style={{ color: 'var(--text-secondary)' }}>
          {label}
          {tooltip && (
            <span className="group relative">
              <span
                className="cursor-help text-xs w-4 h-4 inline-flex items-center justify-center rounded-full"
                style={{ background: 'var(--bg-elevated)', color: 'var(--text-muted)', fontSize: '10px' }}
              >
                ?
              </span>
              <span
                className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none"
                style={{
                  background: 'var(--bg-elevated)',
                  color: 'var(--text-primary)',
                  border: '1px solid var(--border-color)',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.25)'
                }}
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
          className="w-28 text-right text-sm font-mono px-2 py-1.5 rounded-md"
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
      <div className="flex justify-between text-xs mt-1.5 font-mono" style={{ color: 'var(--text-muted)' }}>
        <span>{formatValue(min)}</span>
        <span>{formatValue(max)}</span>
      </div>
    </div>
  );
}

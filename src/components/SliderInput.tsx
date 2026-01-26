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
        return formatCurrency(val, 0);
      case 'percent':
        return formatPercent(val * 100, 0);
      case 'volume':
        return formatCurrency(val, 1);
      default:
        return formatNumber(val);
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
        <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
          {label}
          {tooltip && (
            <span className="group relative">
              <span className="text-gray-400 cursor-help text-xs">(?)</span>
              <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                {tooltip}
              </span>
            </span>
          )}
        </label>
        <input
          type="text"
          value={formatValue(value)}
          onChange={handleInputChange}
          className="w-28 text-right text-sm font-mono px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
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
      <div className="flex justify-between text-xs text-gray-500 mt-1">
        <span>{formatValue(min)}</span>
        <span>{formatValue(max)}</span>
      </div>
    </div>
  );
}

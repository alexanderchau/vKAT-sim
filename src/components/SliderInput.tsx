import { useState, useEffect, useRef } from 'react';
import { formatNumber, formatCurrency, formatPercent } from '../lib/calculations';

interface SliderInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step: number;
  format?: 'number' | 'currency' | 'percent' | 'volume' | 'token' | 'bps';
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
  const [showTooltip, setShowTooltip] = useState(false);
  const tooltipRef = useRef<HTMLSpanElement>(null);

  const formatValue = (val: number): string => {
    switch (format) {
      case 'currency':
        return formatCurrency(val, 2);
      case 'percent':
        return formatPercent(val * 100, 1);
      case 'volume':
        return formatCurrency(val, 2);
      case 'bps':
        return `${(val * 10000).toFixed(1)} bps`;
      case 'token':
        // Format large token amounts without $ sign
        if (val >= 1_000_000_000) {
          return `${(val / 1_000_000_000).toFixed(1)}B`;
        }
        if (val >= 1_000_000) {
          return `${(val / 1_000_000).toFixed(1)}M`;
        }
        return formatNumber(val, 0);
      default:
        return formatNumber(val, 0);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/[^0-9.-]/g, '');
    let numValue = parseFloat(rawValue);

    if (format === 'percent') {
      numValue = numValue / 100;
    } else if (format === 'bps') {
      numValue = numValue / 10000;
    }

    if (!isNaN(numValue)) {
      onChange(Math.max(min, Math.min(max, numValue)));
    }
  };

  const handleTooltipToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowTooltip(!showTooltip);
  };

  // Close tooltip when clicking outside
  useEffect(() => {
    if (!showTooltip) return;

    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (tooltipRef.current && !tooltipRef.current.contains(e.target as Node)) {
        setShowTooltip(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [showTooltip]);

  return (
    <div className="mb-6 last:mb-0">
      <div className="flex justify-between items-center mb-2">
        <label className="text-sm font-medium flex items-center gap-2" style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>
          {label}
          {tooltip && (
            <span className="relative" ref={tooltipRef}>
              <button
                type="button"
                onClick={handleTooltipToggle}
                className="text-xs w-4 h-4 inline-flex items-center justify-center rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1"
                style={{
                  background: 'var(--bg-elevated)',
                  color: 'var(--text-muted)',
                  fontSize: '10px',
                  cursor: 'help'
                }}
                aria-label={`Info: ${tooltip}`}
              >
                ?
              </button>
              <span
                className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 text-xs rounded-md transition-opacity whitespace-nowrap z-20"
                style={{
                  background: 'var(--bg-elevated)',
                  color: 'var(--text-primary)',
                  border: '1px solid var(--border-color)',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.25)',
                  opacity: showTooltip ? 1 : 0,
                  pointerEvents: showTooltip ? 'auto' : 'none',
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

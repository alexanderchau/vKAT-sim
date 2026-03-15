export function Disclaimers() {
  return (
    <div className="info-panel">
      <h3 className="text-xs font-medium mb-4" style={{ color: 'var(--text-secondary)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
        Model Assumptions & Limitations
      </h3>
      <ul className="space-y-3 text-xs" style={{ color: 'var(--text-secondary)' }}>
        <li className="flex gap-3">
          <span className="font-mono font-medium" style={{ color: 'var(--text-muted)' }}>1.</span>
          <span><strong style={{ color: 'var(--text-primary)', fontWeight: 500 }}>Variable yield</strong> — Projected returns are subject to fluctuations in trading volume, bribe activity, participation rates, and token price.</span>
        </li>
        <li className="flex gap-3">
          <span className="font-mono font-medium" style={{ color: 'var(--text-muted)' }}>2.</span>
          <span><strong style={{ color: 'var(--text-primary)', fontWeight: 500 }}>Equilibrium assumption</strong> — Model assumes rational vote allocation across pools; actual per-pool yields may deviate.</span>
        </li>
        <li className="flex gap-3">
          <span className="font-mono font-medium" style={{ color: 'var(--text-muted)' }}>3.</span>
          <span><strong style={{ color: 'var(--text-primary)', fontWeight: 500 }}>Bribe market maturity</strong> — Initial epochs may exhibit lower bribe activity as the market develops.</span>
        </li>
        <li className="flex gap-3">
          <span className="font-mono font-medium" style={{ color: 'var(--text-muted)' }}>4.</span>
          <span><strong style={{ color: 'var(--text-primary)', fontWeight: 500 }}>Exit cost considerations</strong> — The 45-day cooldown period or up to 80% instant exit fee materially impacts realized returns.</span>
        </li>
        <li className="flex gap-3">
          <span className="font-mono font-medium" style={{ color: 'var(--text-muted)' }}>5.</span>
          <span><strong style={{ color: 'var(--text-primary)', fontWeight: 500 }}>Illustrative only</strong> — This model is provided for informational purposes and does not constitute financial advice.</span>
        </li>
      </ul>
    </div>
  );
}

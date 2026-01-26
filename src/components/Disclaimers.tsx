export function Disclaimers() {
  return (
    <div className="info-panel">
      <h3 className="text-xs font-medium mb-4" style={{ color: 'var(--text-secondary)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
        Important Disclaimers
      </h3>
      <ul className="space-y-3 text-xs" style={{ color: 'var(--text-secondary)' }}>
        <li className="flex gap-3">
          <span className="font-mono font-medium" style={{ color: 'var(--text-muted)' }}>1.</span>
          <span><strong style={{ color: 'var(--text-primary)', fontWeight: 500 }}>APY is variable</strong> — depends on trading volume, bribes, participation rate, and KAT price</span>
        </li>
        <li className="flex gap-3">
          <span className="font-mono font-medium" style={{ color: 'var(--text-muted)' }}>2.</span>
          <span><strong style={{ color: 'var(--text-primary)', fontWeight: 500 }}>Equilibrium assumption</strong> — model assumes rational vote allocation; actual yields may vary by pool</span>
        </li>
        <li className="flex gap-3">
          <span className="font-mono font-medium" style={{ color: 'var(--text-muted)' }}>3.</span>
          <span><strong style={{ color: 'var(--text-primary)', fontWeight: 500 }}>Bribe market is nascent</strong> — early epochs may have lower bribe activity</span>
        </li>
        <li className="flex gap-3">
          <span className="font-mono font-medium" style={{ color: 'var(--text-muted)' }}>4.</span>
          <span><strong style={{ color: 'var(--text-primary)', fontWeight: 500 }}>Exit costs matter</strong> — 45-day cooldown or up to 25% instant fee affects realized returns</span>
        </li>
        <li className="flex gap-3">
          <span className="font-mono font-medium" style={{ color: 'var(--text-muted)' }}>5.</span>
          <span><strong style={{ color: 'var(--text-primary)', fontWeight: 500 }}>Not financial advice</strong> — this model is for illustrative purposes only</span>
        </li>
      </ul>
    </div>
  );
}

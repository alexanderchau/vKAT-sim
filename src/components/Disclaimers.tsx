export function Disclaimers() {
  return (
    <div className="rounded-xl p-5" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}>
      <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>Important Disclaimers</h3>
      <ul className="space-y-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
        <li className="flex gap-2">
          <span style={{ color: 'var(--warning)' }}>1.</span>
          <span><strong style={{ color: 'var(--text-primary)' }}>APY is variable</strong> — depends on trading volume, bribes, participation rate, and KAT price</span>
        </li>
        <li className="flex gap-2">
          <span style={{ color: 'var(--warning)' }}>2.</span>
          <span><strong style={{ color: 'var(--text-primary)' }}>Equilibrium assumption</strong> — model assumes rational vote allocation; actual yields may vary by pool</span>
        </li>
        <li className="flex gap-2">
          <span style={{ color: 'var(--warning)' }}>3.</span>
          <span><strong style={{ color: 'var(--text-primary)' }}>Bribe market is nascent</strong> — early epochs may have lower bribe activity</span>
        </li>
        <li className="flex gap-2">
          <span style={{ color: 'var(--warning)' }}>4.</span>
          <span><strong style={{ color: 'var(--text-primary)' }}>Exit costs matter</strong> — 45-day cooldown or up to 25% instant fee affects realized returns</span>
        </li>
        <li className="flex gap-2">
          <span style={{ color: 'var(--warning)' }}>5.</span>
          <span><strong style={{ color: 'var(--text-primary)' }}>Not financial advice</strong> — this model is illustrative only</span>
        </li>
      </ul>
    </div>
  );
}

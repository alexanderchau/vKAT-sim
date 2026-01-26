export function Disclaimers() {
  return (
    <div className="bg-gray-50 rounded-xl border border-gray-200 p-5">
      <h3 className="text-sm font-semibold text-gray-700 mb-3">Important Disclaimers</h3>
      <ul className="space-y-2 text-xs text-gray-600">
        <li className="flex gap-2">
          <span className="text-amber-500">1.</span>
          <span><strong>APY is variable</strong> — depends on trading volume, bribes, participation rate, and KAT price</span>
        </li>
        <li className="flex gap-2">
          <span className="text-amber-500">2.</span>
          <span><strong>Equilibrium assumption</strong> — model assumes rational vote allocation; actual yields may vary by pool</span>
        </li>
        <li className="flex gap-2">
          <span className="text-amber-500">3.</span>
          <span><strong>Bribe market is nascent</strong> — early epochs may have lower bribe activity</span>
        </li>
        <li className="flex gap-2">
          <span className="text-amber-500">4.</span>
          <span><strong>Exit costs matter</strong> — 45-day cooldown or up to 25% instant fee affects realized returns</span>
        </li>
        <li className="flex gap-2">
          <span className="text-amber-500">5.</span>
          <span><strong>Not financial advice</strong> — this model is illustrative only</span>
        </li>
      </ul>
    </div>
  );
}

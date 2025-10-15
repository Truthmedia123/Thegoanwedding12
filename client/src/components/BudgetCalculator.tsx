import React, { useMemo, useState } from 'react';

const BudgetCalculator: React.FC = () => {
  // Goan wedding preset categories (approximate INR values)
  const goanPreset = {
    venue_hall: 120000,
    church_decor: 15000,
    reception_decor_lighting: 90000,
    catering_food: 350000,
    beverages_bar: 120000,
    band_or_dj: 70000,
    photo_video: 150000,
    outfits_attire: 80000,
    makeup_mehndi: 25000,
    transport: 20000,
    invitations_stationery: 15000,
    church_choir: 10000,
    mc_anchor: 15000,
    priest_donation: 10000,
    miscellaneous_contingency: 30000,
  } as const;

  type Budget = Record<keyof typeof goanPreset, number>;

  const [budget, setBudget] = useState<Budget>({ ...goanPreset });

  const total = useMemo(
    () => Object.values(budget).reduce((sum, value) => sum + (Number.isFinite(value) ? value : 0), 0),
    [budget]
  );

  const formatINR = (n: number) => `₹${(n || 0).toLocaleString('en-IN')}`;

  const handleChange = (field: keyof Budget, value: string) => {
    const parsed = parseInt(value.replace(/[^0-9]/g, ''), 10);
    setBudget(prev => ({
      ...prev,
      [field]: isNaN(parsed) ? 0 : parsed,
    }));
  };

  const applyPreset = () => setBudget({ ...goanPreset });
  const resetAll = () =>
    setBudget(Object.fromEntries(Object.keys(goanPreset).map(k => [k, 0])) as Budget);

  const prettyLabel = (key: string) =>
    key
      .replace(/_/g, ' ')
      .replace(/\b(\w)/g, (m) => m.toUpperCase());

  return (
    <div className="p-6 md:p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl md:text-3xl font-serif" style={{ fontFamily: "'Playfair Display', serif" }}>
            Wedding Budget Calculator (Goan Preset)
          </h2>
          <div className="flex gap-2">
            <button
              onClick={applyPreset}
              className="px-4 py-2 rounded-md border bg-white hover:bg-gray-50"
            >
              Apply Goan Preset
            </button>
            <button
              onClick={resetAll}
              className="px-4 py-2 rounded-md border border-red-200 text-red-700 bg-white hover:bg-red-50"
            >
              Reset All
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Inputs */}
          <div className="lg:col-span-2 space-y-4">
            {Object.entries(budget).map(([key, value]) => {
              const pct = total > 0 ? Math.round((value / total) * 100) : 0;
              return (
                <div key={key} className="rounded-lg border bg-white px-4 py-3">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <div className="text-sm text-gray-500">Category</div>
                      <div className="font-medium">{prettyLabel(key)}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500 hidden sm:inline">Amount</span>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                        <input
                          inputMode="numeric"
                          pattern="[0-9]*"
                          value={value || ''}
                          onChange={(e) => handleChange(key as keyof Budget, e.target.value)}
                          className="w-36 sm:w-44 pl-7 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-400"
                          placeholder="0"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-sm text-gray-600">
                    <div className="h-2 flex-1 bg-gray-100 rounded-full mr-3">
                      <div
                        className="h-2 rounded-full bg-amber-400"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span>{pct}%</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 space-y-4">
              <div className="rounded-xl border bg-white p-5">
                <div className="text-sm text-gray-500">Estimated Total</div>
                <div className="text-3xl font-bold mt-1">{formatINR(total)}</div>
                <div className="mt-3 space-y-2">
                  {Object.entries(budget)
                    .sort((a, b) => b[1] - a[1])
                    .slice(0, 5)
                    .map(([key, value]) => {
                      const pct = total > 0 ? Math.round((value / total) * 100) : 0;
                      return (
                        <div key={key} className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">{prettyLabel(key)}</span>
                          <span className="tabular-nums">{formatINR(value)} · {pct}%</span>
                        </div>
                      );
                    })}
                </div>
              </div>

              <div className="rounded-xl border bg-amber-50 p-4 text-amber-900">
                <div className="font-medium mb-1">Tip</div>
                <p className="text-sm leading-relaxed">
                  These are typical Goan wedding estimates for 200–300 guests. Adjust based
                  on venue, guest count, and preferences. Consider a 10% contingency in
                  <span className="font-medium"> Miscellaneous/Contingency</span>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BudgetCalculator;
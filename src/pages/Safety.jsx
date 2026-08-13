import React, { useState } from 'react';
import { ShieldCheck, Thermometer, AlertOctagon, Archive, ClipboardList } from 'lucide-react';

export default function Safety() {
  const [activeTab, setActiveTab] = useState('storage');

  const storageItems = [
    { name: "Cooked Rice / Pasta", fridge: "3 - 4 Days", freezer: "1 - 2 Months", tip: "Bacillus cereus spores can survive cooking. Cool rapidly and refrigerate within 1 hour." },
    { name: "Raw Poultry (Chicken, Turkey)", fridge: "1 - 2 Days", freezer: "9 - 12 Months", tip: "Keep on the bottom shelf of the fridge to prevent juice from dripping on other food." },
    { name: "Raw Red Meat (Beef, Pork)", fridge: "3 - 5 Days", freezer: "4 - 12 Months", tip: "Store in original packaging or airtight wraps. Freeze if not using within 3 days." },
    { name: "Ground Meat (Beef, Turkey)", fridge: "1 - 2 Days", freezer: "3 - 4 Months", tip: "Higher bacterial risk due to surface area. Cook thoroughly." },
    { name: "Fresh Eggs (in shell)", fridge: "3 - 5 Weeks", freezer: "Do not freeze in shell", tip: "Keep in their original carton on an inside shelf, not in the fridge door." },
    { name: "Cooked Leftovers (General)", fridge: "3 - 4 Days", freezer: "2 - 3 Months", tip: "Cool completely before sealing, but put in fridge within 2 hours of cooking." }
  ];

  const tempItems = [
    { food: "Poultry (Whole or Ground Chicken, Turkey)", temp: "165°F (74°C)", desc: "All parts must reach this temp to kill Salmonella." },
    { food: "Ground Meats (Beef, Pork, Lamb)", temp: "160°F (71°C)", desc: "Grinding mixes surface bacteria throughout the meat." },
    { food: "Whole Cut Red Meat (Steak, Pork, Lamb)", temp: "145°F (63°C)", desc: "Let rest for 3 minutes after removing from heat source." },
    { food: "Fish & Seafood", temp: "145°F (63°C)", desc: "Cook until flesh is opaque and flakes easily with a fork." },
    { food: "Reheating Leftovers", temp: "165°F (74°C)", desc: "Leftovers must be reheated to steaming hot throughout." }
  ];

  const spoilageItems = [
    { food: "Raw Meat & Chicken", signs: "Sour or ammonia-like smell, slimy texture, grey or greenish color change.", action: "Throw out immediately. Do not taste test." },
    { food: "Milk & Cream", signs: "Sour odor, lumpy or curdled texture, yellowish color change.", action: "Discard if sour or chunky. Safe if just past date but smells fresh." },
    { food: "Leafy Greens / Salad", signs: "Soggy, slimy leaves, brown spots, foul fermented odor.", action: "Discard slimy parts. Slightly wilted greens can be revived in ice water." },
    { food: "Cooked Rice", signs: "Hard, dry texture or soft, slimy layers, sour or musty smell.", action: "Bacterial toxin Bacillus cereus is odorless; discard if stored >4 days." },
    { food: "Canned Goods", signs: "Bulging lids, dented seams, rust, leaking, fizzing or foul odor on opening.", action: "Danger of Botulism (potentially fatal). Throw away immediately without tasting." }
  ];

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8 sm:py-12 sm:px-6 lg:px-8 space-y-8 sm:space-y-10 overflow-x-hidden">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3 sm:space-y-4">
        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-500 rounded-2xl w-fit mx-auto border border-emerald-100/30">
          <ShieldCheck className="h-7 w-7 sm:h-8 sm:w-8" />
        </div>
        <h1 className="font-display font-black text-2xl sm:text-3xl text-slate-900 dark:text-white">
          Food Safety & Health Guides
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed px-2">
          Zero waste does not mean compromising your health. Learn how to store food safely, check for spoilage, and cook meals to safe temperatures.
        </p>
      </div>

      {/* Responsive Tabs Switcher Bar */}
      <div className="w-full max-w-full overflow-x-auto pb-2 scrollbar-none">
        <div className="flex sm:justify-center gap-1.5 p-1.5 bg-slate-100 dark:bg-slate-900 rounded-2xl border border-slate-200/50 dark:border-slate-800 min-w-max mx-auto sm:w-fit">
          <button
            onClick={() => setActiveTab('storage')}
            className={`flex items-center space-x-2 px-3.5 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 ${
              activeTab === 'storage'
                ? 'bg-white dark:bg-slate-800 text-primary-600 dark:text-primary-400 shadow-sm border border-slate-200/30 dark:border-slate-700'
                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            <Archive className="h-4 w-4" />
            <span>Food Storage</span>
          </button>
          <button
            onClick={() => setActiveTab('temps')}
            className={`flex items-center space-x-2 px-3.5 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 ${
              activeTab === 'temps'
                ? 'bg-white dark:bg-slate-800 text-primary-600 dark:text-primary-400 shadow-sm border border-slate-200/30 dark:border-slate-700'
                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            <Thermometer className="h-4 w-4" />
            <span>Cooking Temps</span>
          </button>
          <button
            onClick={() => setActiveTab('spoilage')}
            className={`flex items-center space-x-2 px-3.5 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 ${
              activeTab === 'spoilage'
                ? 'bg-white dark:bg-slate-800 text-primary-600 dark:text-primary-400 shadow-sm border border-slate-200/30 dark:border-slate-700'
                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            <AlertOctagon className="h-4 w-4" />
            <span>Spoilage Signs</span>
          </button>
        </div>
      </div>

      {/* Tab Contents Container */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-3xl p-4 sm:p-8 shadow-sm w-full max-w-full overflow-hidden">
        
        {/* Storage Tab */}
        {activeTab === 'storage' && (
          <div className="space-y-6">
            <div className="space-y-1 sm:space-y-2">
              <h3 className="font-display font-bold text-lg sm:text-xl text-slate-850 dark:text-white">Fridge & Freezer Storage Guide</h3>
              <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm font-medium">
                Keep track of how long common pantry items remain safe to consume when stored properly.
              </p>
            </div>

            {/* Mobile Card View (< 640px) */}
            <div className="block sm:hidden space-y-3">
              {storageItems.map((item, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800 space-y-3">
                  <h4 className="font-display font-bold text-sm text-slate-900 dark:text-white capitalize">{item.name}</h4>
                  <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
                    <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200/40 dark:border-emerald-900/40">
                      <span className="block text-[10px] font-bold uppercase text-slate-400">Fridge</span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold">{item.fridge}</span>
                    </div>
                    <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200/40 dark:border-blue-900/40">
                      <span className="block text-[10px] font-bold uppercase text-slate-400">Freezer</span>
                      <span className="text-blue-600 dark:text-blue-400 font-bold">{item.freezer}</span>
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium leading-relaxed pt-1 border-t border-slate-200/40 dark:border-slate-850">
                    💡 {item.tip}
                  </p>
                </div>
              ))}
            </div>

            {/* Desktop Table View (>= 640px) */}
            <div className="hidden sm:block w-full max-w-full overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
              <table className="w-full text-sm text-left divide-y divide-slate-200 dark:divide-slate-800">
                <thead className="bg-slate-50 dark:bg-slate-950 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  <tr>
                    <th scope="col" className="px-5 py-3.5 whitespace-nowrap">Food Item</th>
                    <th scope="col" className="px-5 py-3.5 whitespace-nowrap">Refrigerator (40°F / 4°C)</th>
                    <th scope="col" className="px-5 py-3.5 whitespace-nowrap">Freezer (0°F / -18°C)</th>
                    <th scope="col" className="px-5 py-3.5 hidden md:table-cell">Storage Tip</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800 font-semibold text-slate-700 dark:text-slate-300">
                  {storageItems.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-850/55 transition-colors">
                      <td className="px-5 py-3.5 font-bold text-slate-900 dark:text-white capitalize whitespace-nowrap">{item.name}</td>
                      <td className="px-5 py-3.5 text-emerald-600 dark:text-emerald-400 whitespace-nowrap">{item.fridge}</td>
                      <td className="px-5 py-3.5 text-blue-600 dark:text-blue-400 whitespace-nowrap">{item.freezer}</td>
                      <td className="px-5 py-3.5 text-slate-500 dark:text-slate-400 text-xs font-medium max-w-xs leading-relaxed hidden md:table-cell">{item.tip}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Temperatures Tab */}
        {activeTab === 'temps' && (
          <div className="space-y-6">
            <div className="space-y-1 sm:space-y-2">
              <h3 className="font-display font-bold text-lg sm:text-xl text-slate-850 dark:text-white">Safe Internal Cooking Temperatures</h3>
              <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm font-medium">
                Using a food thermometer is the only reliable way to ensure bacteria are destroyed during cooking.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              {/* Mobile Card View (< 640px) */}
              <div className="block sm:hidden space-y-2.5">
                {tempItems.map((item, idx) => (
                  <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800 flex items-center justify-between gap-3">
                    <span className="font-bold text-xs text-slate-900 dark:text-white">{item.food}</span>
                    <span className="px-3 py-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 font-extrabold text-xs flex-shrink-0 border border-rose-200/40 dark:border-rose-900/40">
                      {item.temp}
                    </span>
                  </div>
                ))}
              </div>

              {/* Desktop Table View (>= 640px) */}
              <div className="hidden sm:block w-full max-w-full overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
                <table className="w-full text-sm text-left divide-y divide-slate-200 dark:divide-slate-800">
                  <thead className="bg-slate-50 dark:bg-slate-950 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    <tr>
                      <th scope="col" className="px-5 py-3.5">Food Category</th>
                      <th scope="col" className="px-5 py-3.5 whitespace-nowrap">Min Temperature</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800 font-semibold text-slate-700 dark:text-slate-350">
                    {tempItems.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-850/55 transition-colors">
                        <td className="px-5 py-3.5 font-bold text-slate-900 dark:text-white">{item.food}</td>
                        <td className="px-5 py-3.5 text-rose-600 dark:text-rose-400 font-extrabold whitespace-nowrap">{item.temp}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Explanatory graphic box */}
              <div className="p-5 sm:p-6 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-850 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <h4 className="font-display font-bold text-sm text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <ClipboardList className="h-4.5 w-4.5 text-primary-600" />
                    <span>How to Measure Temperature</span>
                  </h4>
                  <ul className="text-xs text-slate-500 dark:text-slate-400 list-decimal pl-4 space-y-2 font-semibold leading-relaxed">
                    <li>Insert the food thermometer probe into the **thickest part** of the meat (avoid fat, bone, or gristle).</li>
                    <li>Wait for the thermometer reading to stabilize (about 15-20 seconds).</li>
                    <li>Clean and sanitize your thermometer probe between uses with warm, soapy water or sanitizing wipes.</li>
                    <li>Always reheat leftover dishes to a minimum of **165°F (74°C)**.</li>
                  </ul>
                </div>
                <div className="p-3.5 bg-rose-50/50 dark:bg-rose-950/20 rounded-xl border border-rose-200/35 text-xs text-rose-800 dark:text-rose-400 font-semibold leading-relaxed">
                  ⚠️ **Note:** Color is NOT a reliable indicator of doneness. Ground beef can turn brown before it reaches a safe temperature, and chicken can remain pink even when fully cooked.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Spoilage Tab */}
        {activeTab === 'spoilage' && (
          <div className="space-y-6">
            <div className="space-y-1 sm:space-y-2">
              <h3 className="font-display font-bold text-lg sm:text-xl text-slate-850 dark:text-white">Signs of Food Spoilage</h3>
              <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm font-medium">
                Learn how to detect expired or dangerous foods using your senses, and prevent food-borne illnesses.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {spoilageItems.map((item, idx) => (
                <div key={idx} className="p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 space-y-3 hover:shadow-sm transition-shadow">
                  <h4 className="font-display font-bold text-sm sm:text-base text-slate-900 dark:text-white capitalize flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-rose-500 flex-shrink-0"></span>
                    <span>{item.food}</span>
                  </h4>
                  <div className="space-y-1">
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Spoilage Signs:</span>
                    <p className="text-xs font-semibold text-slate-600 dark:text-slate-350 leading-relaxed">
                      {item.signs}
                    </p>
                  </div>
                  <div className="pt-2 border-t border-slate-200/50 dark:border-slate-800">
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Action Required:</span>
                    <p className="text-xs font-semibold text-rose-600 dark:text-rose-400">
                      {item.action}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

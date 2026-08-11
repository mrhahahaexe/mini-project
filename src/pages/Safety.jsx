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
    <div className="max-w-6xl mx-auto px-4 py-12 sm:px-6 lg:px-8 space-y-10">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-500 rounded-2xl w-fit mx-auto border border-emerald-100/30">
          <ShieldCheck className="h-8 w-8" />
        </div>
        <h1 className="font-display font-black text-3xl text-slate-905 dark:text-white">
          Food Safety & Health Guides
        </h1>
        <p className="text-slate-500 dark:text-slate-400 font-medium">
          Zero waste does not mean compromising your health. Learn how to store food safely, check for spoilage, and cook meals to safe temperatures.
        </p>
      </div>

      {/* Tabs Switcher */}
      <div className="flex justify-center border-b border-slate-200 dark:border-slate-800">
        <div className="flex space-x-2 p-1 bg-slate-100 dark:bg-slate-900 rounded-2xl border border-slate-200/50 dark:border-slate-800 mb-6">
          <button
            onClick={() => setActiveTab('storage')}
            className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 ${
              activeTab === 'storage'
                ? 'bg-white dark:bg-slate-805 text-primary-650 dark:text-primary-400 shadow-sm border border-slate-200/30 dark:border-slate-800'
                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            <Archive className="h-4.5 w-4.5" />
            <span>Food Storage Limits</span>
          </button>
          <button
            onClick={() => setActiveTab('temps')}
            className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 ${
              activeTab === 'temps'
                ? 'bg-white dark:bg-slate-805 text-primary-650 dark:text-primary-400 shadow-sm border border-slate-200/30 dark:border-slate-800'
                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            <Thermometer className="h-4.5 w-4.5" />
            <span>Cooking Temperatures</span>
          </button>
          <button
            onClick={() => setActiveTab('spoilage')}
            className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 ${
              activeTab === 'spoilage'
                ? 'bg-white dark:bg-slate-805 text-primary-650 dark:text-primary-400 shadow-sm border border-slate-200/30 dark:border-slate-800'
                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            <AlertOctagon className="h-4.5 w-4.5" />
            <span>Spoilage & Toxins</span>
          </button>
        </div>
      </div>

      {/* Tab Contents */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-3xl p-6 sm:p-8 shadow-sm">
        
        {/* Storage Tab */}
        {activeTab === 'storage' && (
          <div className="space-y-6">
            <div className="space-y-2">
              <h3 className="font-display font-bold text-xl text-slate-850 dark:text-white">Fridge and Freezer Storage Guide</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
                Keep track of how long common pantry items remain safe to consume when stored properly.
              </p>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
              <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800 text-sm text-left">
                <thead className="bg-slate-50 dark:bg-slate-950 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  <tr>
                    <th scope="col" className="px-6 py-4">Food Item</th>
                    <th scope="col" className="px-6 py-4">Refrigerator (40°F / 4°C)</th>
                    <th scope="col" className="px-6 py-4">Freezer (0°F / -18°C)</th>
                    <th scope="col" className="px-6 py-4 hidden md:table-cell">Storage Tip</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800 font-semibold text-slate-700 dark:text-slate-300">
                  {storageItems.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-850/55 transition-colors">
                      <td className="px-6 py-4 font-bold text-slate-900 dark:text-white capitalize">{item.name}</td>
                      <td className="px-6 py-4 text-emerald-650 dark:text-emerald-400">{item.fridge}</td>
                      <td className="px-6 py-4 text-blue-600 dark:text-blue-400">{item.freezer}</td>
                      <td className="px-6 py-4 text-slate-500 dark:text-slate-400 text-xs font-medium max-w-xs leading-relaxed hidden md:table-cell">{item.tip}</td>
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
            <div className="space-y-2">
              <h3 className="font-display font-bold text-xl text-slate-850 dark:text-white">Safe Internal Cooking Temperatures</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
                Using a food thermometer is the only reliable way to ensure bacteria are destroyed during cooking.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
                <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800 text-sm text-left">
                  <thead className="bg-slate-50 dark:bg-slate-950 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    <tr>
                      <th scope="col" className="px-6 py-4">Food Category</th>
                      <th scope="col" className="px-6 py-4">Min Temperature</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800 font-semibold text-slate-700 dark:text-slate-350">
                    {tempItems.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-850/55 transition-colors">
                        <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">{item.food}</td>
                        <td className="px-6 py-4 text-rose-600 dark:text-rose-400 font-extrabold">{item.temp}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Explanatory graphic box */}
              <div className="p-6 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-850 flex flex-col justify-between space-y-4">
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
                <div className="p-4 bg-rose-50/50 dark:bg-rose-950/20 rounded-xl border border-rose-200/35 text-xs text-rose-800 dark:text-rose-400 font-semibold leading-relaxed">
                  ⚠️ **Note:** Color is NOT a reliable indicator of doneness. Ground beef can turn brown before it reaches a safe temperature, and chicken can remain pink even when fully cooked.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Spoilage Tab */}
        {activeTab === 'spoilage' && (
          <div className="space-y-6">
            <div className="space-y-2">
              <h3 className="font-display font-bold text-xl text-slate-850 dark:text-white">Signs of Food Spoilage</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
                Learn how to detect expired or dangerous foods using your senses, and prevent food-borne illnesses.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {spoilageItems.map((item, idx) => (
                <div key={idx} className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 space-y-3 hover:shadow-sm transition-shadow">
                  <h4 className="font-display font-bold text-base text-slate-900 dark:text-white capitalize flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-rose-500"></span>
                    {item.food}
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

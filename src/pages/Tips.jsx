import React from 'react';
import { BookOpen, Droplet, Heart, Sparkles, Scale } from 'lucide-react';

export default function Tips() {
  const categories = [
    {
      title: "Optimized Hydration",
      icon: Droplet,
      color: "text-blue-500 bg-blue-50 dark:bg-blue-950/20",
      tips: [
        { title: "Target intake", text: "Aim for 2-3 liters of water per day, or about 8 glasses, adjusted for activity level and climate." },
        { title: "Limit liquid calories", text: "Fruit juices, sodas, and energy drinks are packed with simple sugars that cause insulin spikes." },
        { title: "Natural infusion", text: "If you dislike plain water, infuse it with cucumber, lemon slices, mint, or strawberries for taste." }
      ]
    },
    {
      title: "Reducing Sugar Intake",
      icon: Scale,
      color: "text-amber-500 bg-amber-50 dark:bg-amber-950/20",
      tips: [
        { title: "Check nutrition labels", text: "Avoid packaged products containing hidden sugars (corn syrup, maltose, sucrose) in the top ingredients." },
        { title: "Whole fruit over juice", text: "Eating whole fruit provides essential fiber, slowing sugar absorption and keeping you full longer." },
        { title: "Gradual reduction", text: "If you add sugar to tea or coffee, reduce it by half every week until your tastebuds adapt." }
      ]
    },
    {
      title: "Balanced Diet Plate Model",
      icon: Heart,
      color: "text-rose-500 bg-rose-50 dark:bg-rose-950/20",
      tips: [
        { title: "Vegetables (1/2 Plate)", text: "Fill half your plate with colorful non-starchy vegetables (spinach, carrots, broccoli, cabbage)." },
        { title: "Lean Protein (1/4 Plate)", text: "Dedicate a quarter of your plate to lean protein like chicken, tofu, fish, eggs, or legumes." },
        { title: "Complex Carbs (1/4 Plate)", text: "Dedicate the final quarter to whole grains or starchy veggies (brown rice, oats, sweet potatoes)." }
      ]
    },
    {
      title: "Sustainable Meal Prep",
      icon: Sparkles,
      color: "text-emerald-500 bg-emerald-50 dark:bg-emerald-950/20",
      tips: [
        { title: "Sunday planning", text: "Spend 30 minutes on Sunday mapping meals to coordinate grocery shopping and minimize leftovers." },
        { title: "Batch cook and freeze", text: "Prepare larger portions of staples (rice, beans, grilled chicken) and freeze them in portions." },
        { title: "First In, First Out (FIFO)", text: "Organize your fridge so older items are in the front, ensuring they get consumed before spoiling." }
      ]
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 sm:px-6 lg:px-8 space-y-12">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <div className="p-3 bg-primary-50 dark:bg-primary-950/20 text-primary-500 rounded-2xl w-fit mx-auto border border-primary-100/30">
          <BookOpen className="h-8 w-8" />
        </div>
        <h1 className="font-display font-black text-3xl text-slate-905 dark:text-white">
          Healthy Eating Guidelines
        </h1>
        <p className="text-slate-500 dark:text-slate-400 font-medium">
          Simple, actionable nutritional tips to help you build balanced meals, reduce processed foods, and maintain a sustainable healthy lifestyle.
        </p>
      </div>

      {/* Grid of Tip Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {categories.map((cat, idx) => {
          const Icon = cat.icon;
          return (
            <div
              key={idx}
              className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 flex flex-col"
            >
              {/* Category Title Header */}
              <div className="flex items-center space-x-3.5 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className={`p-2.5 rounded-xl ${cat.color}`}>
                  <Icon className="h-5.5 w-5.5" />
                </div>
                <h2 className="font-display font-bold text-lg text-slate-850 dark:text-white">
                  {cat.title}
                </h2>
              </div>

              {/* Tips list */}
              <div className="space-y-5 flex-1 flex flex-col justify-between">
                {cat.tips.map((tip, tIdx) => (
                  <div key={tIdx} className="space-y-1.5">
                    <h3 className="font-display font-bold text-sm text-slate-800 dark:text-slate-250 flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary-500"></span>
                      {tip.title}
                    </h3>
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 leading-relaxed pl-3.5">
                      {tip.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Zero Waste Challenge Highlight */}
      <div className="bg-gradient-to-r from-emerald-500/10 to-primary-500/5 dark:from-slate-900 dark:to-slate-900 border border-emerald-500/20 dark:border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center sm:text-left max-w-xl">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Weekly Motivation</span>
          <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white">The Zero-Waste Kitchen Challenge</h3>
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 leading-relaxed">
            Can you go an entire week without throwing away any edible food? Check your fridge every 3 days, plan recipe matches for wilted greens, and freeze raw meat before it goes bad. Start saving money and eat fresh!
          </p>
        </div>
        <div className="flex-shrink-0 p-4 bg-emerald-500 text-white rounded-2xl font-bold text-sm shadow-md shadow-emerald-500/20">
          🌱 Zero Waste Champion
        </div>
      </div>
    </div>
  );
}

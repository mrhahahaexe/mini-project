import React from 'react';
import {
  X, Clock, Flame, Check, HelpCircle, Coffee, Heart, ShieldAlert
} from 'lucide-react';

/**
 * Shared recipe detail modal used by the Recipes page and the Profile favorites.
 * Props:
 *  - recipe: the selected recipe object
 *  - onClose: () => void
 *  - searchIngredients: array of the user's pantry ingredients (for the checklist)
 *  - isFavorite / onToggleFavorite: for the favorite button
 *  - onAddFoodLog?: logs the meal (Profile may pass a no-op if not desired)
 */
export default function RecipeDetailModal({
  recipe,
  onClose,
  searchIngredients = [],
  isFavorite = false,
  onToggleFavorite,
  onAddFoodLog,
}) {
  const hasIngredient = (name) =>
    searchIngredients.some(
      (uIng) => name.toLowerCase().includes(uIng) || uIng.includes(name.toLowerCase())
    );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
      <div className="relative bg-white dark:bg-slate-900 w-full max-w-4xl max-h-[85vh] overflow-y-auto rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 animate-scale-up">

        {/* Modal Header/Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full glass bg-white/80 dark:bg-slate-950/80 hover:bg-white dark:hover:bg-slate-900 text-slate-500 dark:text-slate-400 border border-slate-200/50 dark:border-slate-800/80 hover:scale-105 active:scale-95 transition-all"
          aria-label="Close details"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Banner Image */}
        <div className="relative aspect-video sm:aspect-[2.5/1] w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
          <img
            src={recipe.image}
            alt={recipe.name}
            className="object-cover w-full h-full"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent flex items-end p-6 sm:p-8">
            <div className="text-white space-y-2">
              <div className="flex flex-wrap gap-1.5">
                {recipe.diet.map((t) => (
                  <span key={t} className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-primary-600 text-white">
                    {t}
                  </span>
                ))}
              </div>
              <h2 className="font-display font-black text-2xl sm:text-3xl leading-tight">
                {recipe.name}
              </h2>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Left Column: Ingredients & Instructions */}
          <div className="md:col-span-8 space-y-6">
            {/* Ingredients Check List */}
            <div className="space-y-3">
              <h3 className="font-display font-bold text-lg text-slate-850 dark:text-slate-100 border-b pb-2 border-slate-100 dark:border-slate-800">
                Ingredients Checklist
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {recipe.ingredients.map((ing, idx) => {
                  const have = hasIngredient(ing.name);
                  return (
                    <div
                      key={idx}
                      className={`flex items-center space-x-3 p-3 rounded-xl border text-sm font-semibold transition-all ${
                        have
                          ? 'bg-emerald-50/50 dark:bg-emerald-950/15 border-emerald-200/50 text-emerald-800 dark:text-emerald-450'
                          : 'bg-rose-50/30 dark:bg-rose-950/10 border-rose-200/30 text-slate-650 dark:text-slate-350'
                      }`}
                    >
                      <div className={`flex-shrink-0 flex items-center justify-center h-5 w-5 rounded-full border ${
                        have ? 'bg-emerald-500 border-emerald-500 text-white' : 'bg-white dark:bg-slate-900 border-rose-250 text-rose-500'
                      }`}>
                        {have ? <Check className="h-3 w-3 stroke-[3]" /> : <X className="h-3 w-3 stroke-[3]" />}
                      </div>
                      <div>
                        <span className="capitalize block">{ing.name}</span>
                        <span className="text-xs text-slate-400 font-medium">{ing.quantity}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Substitutions Tips */}
            {recipe.substitutions && Object.keys(recipe.substitutions).length > 0 && (
              <div className="p-5 rounded-2xl bg-amber-50/50 dark:bg-amber-950/10 border border-amber-200/55 dark:border-amber-900/20 space-y-2">
                <h4 className="font-display font-bold text-sm text-amber-800 dark:text-amber-400 flex items-center gap-1.5">
                  <HelpCircle className="h-4.5 w-4.5 text-amber-600 dark:text-amber-500" />
                  <span>Zero-Waste Substitution Engine</span>
                </h4>
                <ul className="text-xs font-semibold text-slate-600 dark:text-slate-350 space-y-1.5 list-disc pl-4 leading-relaxed">
                  {Object.entries(recipe.substitutions).map(([orig, sub]) => (
                    <li key={orig}>
                      If you don't have <strong className="text-slate-800 dark:text-white capitalize">{orig}</strong>, substitute with <strong className="text-primary-650 dark:text-primary-400 font-bold">{sub}</strong>.
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Cooking Instructions */}
            <div className="space-y-4">
              <h3 className="font-display font-bold text-lg text-slate-850 dark:text-slate-100 border-b pb-2 border-slate-100 dark:border-slate-800">
                Step-by-Step Directions
              </h3>
              <ol className="space-y-4">
                {recipe.instructions.map((step, idx) => (
                  <li key={idx} className="flex gap-4">
                    <div className="flex-shrink-0 flex items-center justify-center h-6 w-6 rounded-full bg-primary-100 dark:bg-primary-950 text-primary-700 dark:text-primary-400 font-display font-bold text-xs">
                      {idx + 1}
                    </div>
                    <p className="text-sm font-semibold text-slate-600 dark:text-slate-350 leading-relaxed">
                      {step}
                    </p>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          {/* Right Column: Nutrition Cards & CTA Actions */}
          <div className="md:col-span-4 space-y-6">
            {/* Recipe Overview Stats Card */}
            <div className="bg-slate-50 dark:bg-slate-950 p-5 rounded-2xl border border-slate-200 dark:border-slate-850 space-y-4">
              <h4 className="font-display font-bold text-sm text-slate-700 dark:text-slate-300">
                Recipe Overview
              </h4>
              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200/50 dark:border-slate-800/80 shadow-sm">
                  <Clock className="h-5 w-5 text-slate-400 mx-auto mb-1" />
                  <span className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Prep Time</span>
                  <strong className="text-sm font-extrabold text-slate-800 dark:text-white">
                    {recipe.prepTime != null ? `${recipe.prepTime}m` : 'N/A'}
                  </strong>
                </div>
                <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200/50 dark:border-slate-800/80 shadow-sm">
                  <Flame className="h-5 w-5 text-slate-400 mx-auto mb-1" />
                  <span className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Calories</span>
                  <strong className="text-sm font-extrabold text-slate-850 dark:text-white">
                    {recipe.calories != null ? `${recipe.calories}kcal` : 'N/A'}
                  </strong>
                </div>
              </div>
            </div>

            {/* Macros Breakdown Card — only if data available */}
            {recipe.macros ? (
              <div className="bg-slate-50 dark:bg-slate-950 p-5 rounded-2xl border border-slate-200 dark:border-slate-850 space-y-3">
                <h4 className="font-display font-bold text-sm text-slate-750 dark:text-slate-300">
                  Macronutrients
                </h4>

                {/* Custom Progress Bar for Protein */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-500 dark:text-slate-450">Protein</span>
                    <span className="text-slate-800 dark:text-slate-200">{recipe.macros.protein}g</span>
                  </div>
                  <div className="h-2 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${Math.min(100, (recipe.macros.protein / 50) * 100)}%` }}></div>
                  </div>
                </div>

                {/* Carbs */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-500 dark:text-slate-450">Carbohydrates</span>
                    <span className="text-slate-800 dark:text-slate-200">{recipe.macros.carbs}g</span>
                  </div>
                  <div className="h-2 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500 rounded-full" style={{ width: `${Math.min(100, (recipe.macros.carbs / 150) * 100)}%` }}></div>
                  </div>
                </div>

                {/* Fat */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-500 dark:text-slate-450">Fats</span>
                    <span className="text-slate-800 dark:text-slate-200">{recipe.macros.fat}g</span>
                  </div>
                  <div className="h-2 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-rose-500 rounded-full" style={{ width: `${Math.min(100, (recipe.macros.fat / 65) * 100)}%` }}></div>
                  </div>
                </div>
              </div>
            ) : null}

            {/* Favorite & Cook Buttons */}
            <div className="space-y-2">
              {onAddFoodLog && (
                <button
                  onClick={() => onAddFoodLog(recipe)}
                  className="w-full flex items-center justify-center space-x-2 py-3.5 rounded-xl font-bold bg-primary-600 hover:bg-primary-750 text-white shadow-lg shadow-primary-500/10 transition-all hover:scale-[1.01]"
                >
                  <Coffee className="h-5 w-5" />
                  <span>Mark as Cooked</span>
                </button>
              )}
              {onToggleFavorite && (
                <button
                  onClick={() => onToggleFavorite(recipe.id)}
                  className={`w-full flex items-center justify-center space-x-2 py-3 rounded-xl font-bold border transition-all ${
                    isFavorite
                      ? 'border-rose-500 bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400'
                      : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <Heart className={`h-5 w-5 ${isFavorite ? 'fill-rose-500 text-rose-500' : ''}`} />
                  <span>{isFavorite ? 'Saved' : 'Save to Favorites'}</span>
                </button>
              )}
              {recipe.youtube && (
                <a
                  href={recipe.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center space-x-2 py-3 rounded-xl font-bold border border-rose-200 dark:border-rose-900/50 bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-950/40 transition-all"
                >
                  <span>▶ Watch on YouTube</span>
                </a>
              )}
            </div>

            {/* Allergy note for transparency */}
            {recipe.allergies && recipe.allergies.length > 0 && (
              <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/20 border border-rose-200/35 dark:border-rose-900/40 flex items-start gap-2 text-xs font-semibold text-rose-700 dark:text-rose-400 leading-relaxed">
                <ShieldAlert className="h-4 w-4 flex-shrink-0 mt-0.5" />
                <span>Contains: {recipe.allergies.join(', ')}. Check your exclusions before cooking.</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

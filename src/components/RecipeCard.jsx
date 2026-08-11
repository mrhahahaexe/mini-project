import React from 'react';
import { Clock, Flame, CheckCircle, ChevronRight, Bookmark, BookmarkCheck } from 'lucide-react';

export default function RecipeCard({ recipe, matchScore, missingCount, onSelect, isFavorite, onToggleFavorite }) {
  return (
    <div className="group flex flex-col bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      {/* Recipe Image */}
      <div className="relative aspect-video w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
        <img
          src={recipe.image || "https://images.unsplash.com/photo-1495521821757-a1efb6729352?auto=format&fit=crop&q=80&w=600"}
          alt={recipe.name}
          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        
        {/* Match Badge */}
        {matchScore !== undefined && (
          <div className="absolute top-3 left-3 px-3 py-1 text-xs font-bold rounded-full text-white bg-gradient-to-r from-emerald-500 to-primary-600 shadow-md">
            {matchScore}% Match
          </div>
        )}

        {/* Favorite Button */}
        {onToggleFavorite && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(recipe.id);
            }}
            className="absolute top-3 right-3 p-2 rounded-full glass bg-white/80 dark:bg-slate-900/80 hover:bg-white dark:hover:bg-slate-950 text-rose-500 shadow-sm transition-all duration-200 hover:scale-110"
            aria-label="Save Recipe"
          >
            {isFavorite ? (
              <BookmarkCheck className="h-5 w-5 fill-rose-500 text-rose-500" />
            ) : (
              <Bookmark className="h-5 w-5 text-slate-500 dark:text-slate-400 group-hover:text-rose-500" />
            )}
          </button>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col p-5">
        {/* Diet Labels */}
        <div className="flex flex-wrap gap-1.5 mb-2.5">
          {recipe.diet && recipe.diet.map((tag) => (
            <span
              key={tag}
              className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-primary-50 dark:bg-primary-950/40 text-primary-600 dark:text-primary-400 border border-primary-100/30 dark:border-primary-900/20"
            >
              {tag}
            </span>
          ))}
          {recipe.allergies && recipe.allergies.length === 0 && (
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-100/30 dark:border-indigo-900/20">
              Allergy Free
            </span>
          )}
        </div>

        {/* Name */}
        <h3 className="font-display font-bold text-lg text-slate-800 dark:text-slate-100 line-clamp-1 mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-200">
          {recipe.name}
        </h3>

        {/* Details Row */}
        <div className="flex items-center gap-4 text-xs font-semibold text-slate-500 dark:text-slate-400 mb-4">
          {recipe.prepTime != null && (
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4 text-slate-400" />
              <span>{recipe.prepTime} mins</span>
            </div>
          )}
          {recipe.calories != null && (
            <div className="flex items-center space-x-1">
              <Flame className="h-4 w-4 text-slate-400" />
              <span>{recipe.calories} kcal</span>
            </div>
          )}
          {recipe.area && (
            <div className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px] uppercase font-bold text-slate-600 dark:text-slate-300">
              {recipe.area}
            </div>
          )}
          {!recipe.area && (
            <div className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px] uppercase font-bold text-slate-600 dark:text-slate-300">
              {recipe.difficulty}
            </div>
          )}
        </div>

        {/* Ingredients Summary */}
        {missingCount !== undefined && (
          <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-auto pt-4 border-t border-slate-100 dark:border-slate-800/80 mb-4">
            {missingCount === 0 ? (
              <span className="flex items-center text-emerald-600 dark:text-emerald-400 font-semibold gap-1">
                <CheckCircle className="h-4 w-4" /> Ready to cook!
              </span>
            ) : (
              <span>
                Missing: <strong className="text-slate-700 dark:text-slate-200 font-semibold">{missingCount}</strong> ingredient{missingCount > 1 ? 's' : ''}
              </span>
            )}
          </div>
        )}

        {/* Action Button */}
        <button
          onClick={() => onSelect(recipe)}
          className="w-full mt-auto flex items-center justify-center gap-1 py-2.5 px-4 rounded-xl font-semibold text-sm bg-slate-50 dark:bg-slate-850 hover:bg-primary-600 dark:hover:bg-primary-600 text-slate-700 dark:text-slate-200 hover:text-white dark:hover:text-white border border-slate-200 dark:border-slate-800 hover:border-primary-600 dark:hover:border-primary-600 shadow-sm transition-all duration-200"
        >
          <span>View Recipe</span>
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

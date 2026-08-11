import React, { useState, useEffect, useRef } from 'react';
import RecipeCard from '../components/RecipeCard';
import RecipeDetailModal from '../components/RecipeDetailModal';
import { fetchRecipesByIngredients } from '../api/mealdb';
import { Sparkles, ArrowLeft, AlertTriangle, Wifi, Check } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Recipes({ searchState, favorites, onToggleFavorite, onAddFoodLog }) {
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [cookedSuccess, setCookedSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  // Bump to re-run the search effect (retry button)
  const [refreshKey, setRefreshKey] = useState(0);

  // Keep a ref to the current "cooked" toast timer so it can be cleared on unmount
  const cookedTimerRef = useRef(null);
  useEffect(() => () => clearTimeout(cookedTimerRef.current), []);

  useEffect(() => {
    const { ingredients, allergies, customAllergies = [], diet, maxCalories, maxTime } = searchState;
    if (ingredients.length === 0) return;

    let cancelled = false;

    const loadRecipes = async () => {
      setIsLoading(true);
      setError(null);
      setFilteredRecipes([]);
      try {
        const { recipes, networkError } = await fetchRecipesByIngredients({
          ingredients,
          allergies,
          customAllergies,
          diet,
          maxCalories,
          maxTime,
          maxResults: 12,
        });
        if (cancelled) return;
        setFilteredRecipes(recipes);
        if (networkError) {
          setError('Could not load recipes from the server. Please check your internet connection and try again.');
        }
      } catch (err) {
        if (!cancelled) setError(`Unexpected error: ${err?.message || 'unknown'}`);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    loadRecipes();
    return () => { cancelled = true; };
  }, [searchState, refreshKey]);

  const handleCookRecipe = (recipe) => {
    onAddFoodLog(recipe);
    setCookedSuccess(true);
    clearTimeout(cookedTimerRef.current);
    cookedTimerRef.current = setTimeout(() => {
      setCookedSuccess(false);
    }, 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      {/* Back Button */}
      <div className="mb-6">
        <Link to="/search" className="inline-flex items-center space-x-2 text-sm font-semibold text-slate-500 hover:text-primary-600 dark:text-slate-400 dark:hover:text-primary-400 transition-colors">
          <ArrowLeft className="h-4 w-4" />
          <span>Modify Ingredients & Filters</span>
        </Link>
      </div>

      {/* Header */}
      <div className="space-y-2 mb-10 text-center lg:text-left">
        <h1 className="font-display font-black text-3xl text-slate-905 dark:text-white">
          Recommended Recipes
        </h1>
        <p className="text-slate-500 dark:text-slate-400 font-medium">
          Based on: <strong className="text-slate-700 dark:text-slate-350 capitalize font-semibold">{searchState.ingredients.join(', ')}</strong>
        </p>
      </div>

      {/* Success Cook Toast */}
      {cookedSuccess && (
        <div className="fixed bottom-5 right-5 z-55 flex items-center space-x-2 bg-gradient-to-r from-emerald-500 to-primary-600 text-white px-6 py-4 rounded-2xl shadow-xl animate-bounce">
          <Check className="h-5 w-5 stroke-[3]" />
          <span className="font-semibold text-sm">Meal added to daily Nutrition Log! Check it out in Dashboard.</span>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-24 space-y-4">
          <div className="relative">
            <div className="h-16 w-16 rounded-full border-4 border-primary-100 dark:border-primary-950/40 border-t-primary-600 dark:border-t-primary-500 animate-spin" />
            <Sparkles className="absolute inset-0 m-auto h-6 w-6 text-primary-600 dark:text-primary-400 animate-pulse" />
          </div>
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Searching thousands of recipes…</p>
        </div>
      )}

      {/* Error State */}
      {!isLoading && error && (
        <div className="text-center p-12 bg-white dark:bg-slate-900 border border-rose-200 dark:border-rose-900/40 rounded-3xl space-y-4 max-w-xl mx-auto shadow-sm">
          <div className="p-4 bg-rose-50 dark:bg-rose-950/20 text-rose-500 rounded-full w-fit mx-auto">
            <Wifi className="h-8 w-8" />
          </div>
          <h3 className="font-display font-bold text-xl text-slate-800 dark:text-slate-100">Connection Error</h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{error}</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => setRefreshKey((k) => k + 1)}
              className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-primary-600 hover:bg-primary-750 text-white font-semibold text-sm transition-all"
            >
              <span>Try Again</span>
            </button>
            <Link to="/search" className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold text-sm transition-all">
              <span>Go Back to Search</span>
            </Link>
          </div>
        </div>
      )}

      {/* Results Grid */}
      {!isLoading && !error && filteredRecipes.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredRecipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              matchScore={recipe.matchScore}
              missingCount={recipe.missingCount}
              onSelect={setSelectedRecipe}
              isFavorite={favorites.includes(recipe.id)}
              onToggleFavorite={onToggleFavorite}
            />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && filteredRecipes.length === 0 && searchState.ingredients.length > 0 && (
        <div className="text-center p-12 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-6 max-w-xl mx-auto shadow-sm">
          <div className="p-4 bg-amber-50 dark:bg-amber-950/20 text-amber-500 rounded-full w-fit mx-auto">
            <AlertTriangle className="h-8 w-8" />
          </div>
          <div className="space-y-2">
            <h3 className="font-display font-bold text-xl text-slate-800 dark:text-slate-100">No Matching Recipes</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
              We couldn't find recipes matching your ingredients in our database. Try using more common ingredients like <strong>chicken, rice, pasta, beef</strong> or <strong>tomato</strong>.
            </p>
          </div>
          <Link
            to="/search"
            className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-primary-600 hover:bg-primary-750 text-white font-semibold text-sm transition-all"
          >
            <span>Go Back to Search</span>
          </Link>
        </div>
      )}


      {/* Recipe Detail Modal */}
      {selectedRecipe && (
        <RecipeDetailModal
          recipe={selectedRecipe}
          onClose={() => setSelectedRecipe(null)}
          searchIngredients={searchState.ingredients}
          isFavorite={favorites.includes(selectedRecipe.id)}
          onToggleFavorite={onToggleFavorite}
          onAddFoodLog={handleCookRecipe}
        />
      )}
    </div>
  );
}

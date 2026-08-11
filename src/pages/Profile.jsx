import React, { useState } from 'react';
import { recipesDb } from '../data/recipesDb';
import RecipeCard from '../components/RecipeCard';
import RecipeDetailModal from '../components/RecipeDetailModal';
import { User, ShieldAlert, Heart, Check, Save, Settings, Plus, X } from 'lucide-react';

const ALLERGIES = [
  { id: "nuts", name: "Nuts / Peanuts" },
  { id: "milk", name: "Milk / Dairy" },
  { id: "eggs", name: "Eggs" },
  { id: "gluten", name: "Gluten / Wheat" },
  { id: "seafood", name: "Seafood" },
  { id: "soy", name: "Soy / Soybeans" }
];

const DIET_TYPES = [
  "None", "Vegetarian", "Vegan", "Keto", "Low Carb", "High Protein", "Diabetic Friendly"
];

export default function Profile({ searchState, setSearchState, favorites, onToggleFavorite }) {
  const [profileSaved, setProfileSaved] = useState(false);
  const [customAllergyInput, setCustomAllergyInput] = useState("");
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [localState, setLocalState] = useState({
    diet: searchState.diet,
    allergies: searchState.allergies,
    customAllergies: searchState.customAllergies || [],
    maxCalories: searchState.maxCalories,
    maxTime: searchState.maxTime
  });

  // Get favorite recipe objects
  const favoriteRecipes = recipesDb.filter(r => favorites.includes(r.id));

  const handleAllergyToggle = (allergyId) => {
    const activeAllergies = localState.allergies.includes(allergyId)
      ? localState.allergies.filter(id => id !== allergyId)
      : [...localState.allergies, allergyId];
    setLocalState({ ...localState, allergies: activeAllergies });
  };

  const handleAddCustomAllergy = (value) => {
    const clean = value.trim().toLowerCase();
    if (clean && !localState.customAllergies.includes(clean)) {
      setLocalState({ ...localState, customAllergies: [...localState.customAllergies, clean] });
    }
    setCustomAllergyInput("");
  };

  const handleRemoveCustomAllergy = (tag) => {
    setLocalState({
      ...localState,
      customAllergies: localState.customAllergies.filter(a => a !== tag)
    });
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setSearchState({
      ...searchState,
      diet: localState.diet,
      allergies: localState.allergies,
      customAllergies: localState.customAllergies,
      maxCalories: localState.maxCalories,
      maxTime: localState.maxTime
    });
    
    // Save to localStorage
    localStorage.setItem('leftover_chef_diet', localState.diet);
    localStorage.setItem('leftover_chef_allergies', JSON.stringify(localState.allergies));
    localStorage.setItem('leftover_chef_custom_allergies', JSON.stringify(localState.customAllergies));
    localStorage.setItem('leftover_chef_max_cal', localState.maxCalories.toString());
    localStorage.setItem('leftover_chef_max_time', localState.maxTime.toString());

    setProfileSaved(true);
    clearTimeout(savedTimerRef.current);
    savedTimerRef.current = setTimeout(() => setProfileSaved(false), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8 space-y-10">
      
      {/* Page Header */}
      <div className="flex items-center space-x-3 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div className="p-2.5 bg-gradient-to-tr from-primary-600 to-emerald-500 rounded-2xl text-white shadow-md">
          <User className="h-6 w-6" />
        </div>
        <div>
          <h1 className="font-display font-black text-3xl text-slate-905 dark:text-white leading-tight">My Profile</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Manage your nutritional limits, food exclusions, and saved recipes.</p>
        </div>
      </div>

      {/* Success Save Toast */}
      {profileSaved && (
        <div className="fixed bottom-5 right-5 z-55 flex items-center space-x-2 bg-gradient-to-r from-emerald-500 to-primary-600 text-white px-6 py-4 rounded-2xl shadow-xl animate-bounce">
          <Check className="h-5 w-5 stroke-[3]" />
          <span className="font-semibold text-sm">Dietary preferences updated successfully!</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Preferences Form */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/60 dark:border-slate-800/80 shadow-sm p-6 sm:p-8 space-y-6">
          <h3 className="font-display font-bold text-lg text-slate-850 dark:text-white flex items-center gap-2">
            <Settings className="h-5 w-5 text-slate-450" />
            <span>Preferences Settings</span>
          </h3>

          <form onSubmit={handleSaveProfile} className="space-y-5">
            {/* Diet type */}
            <div className="space-y-2">
              <label htmlFor="profile-diet" className="block text-xs font-bold uppercase tracking-wider text-slate-400">Default Diet</label>
              <select
                id="profile-diet"
                value={localState.diet}
                onChange={(e) => setLocalState({ ...localState, diet: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-850 dark:text-slate-100 font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                {DIET_TYPES.map(diet => (
                  <option key={diet} value={diet}>{diet}</option>
                ))}
              </select>
            </div>

            {/* Max Calorie Goal */}
            <div className="space-y-2">
              <label htmlFor="profile-calories" className="block text-xs font-bold uppercase tracking-wider text-slate-400">Max Calorie Cap (kcal)</label>
              <input
                id="profile-calories"
                type="number"
                min="200"
                max="2500"
                value={localState.maxCalories}
                onChange={(e) => setLocalState({ ...localState, maxCalories: parseInt(e.target.value) || 2000 })}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-805 dark:text-slate-100 font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            {/* Max Cooking Time Goal */}
            <div className="space-y-2">
              <label htmlFor="profile-time" className="block text-xs font-bold uppercase tracking-wider text-slate-400">Max Prep Time (mins)</label>
              <input
                id="profile-time"
                type="number"
                min="10"
                max="180"
                value={localState.maxTime}
                onChange={(e) => setLocalState({ ...localState, maxTime: parseInt(e.target.value) || 45 })}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-805 dark:text-slate-100 font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            {/* Allergies list */}
            <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <span className="block text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <ShieldAlert className="h-4 w-4 text-slate-400" />
                <span>Allergies Exclusions</span>
              </span>
              <div className="grid grid-cols-1 gap-2">
                {ALLERGIES.map((allergy) => {
                  const checked = localState.allergies.includes(allergy.id);
                  return (
                    <button
                      key={allergy.id}
                      type="button"
                      onClick={() => handleAllergyToggle(allergy.id)}
                      className={`flex items-center space-x-3 p-3 rounded-xl border text-xs font-bold transition-all text-left ${
                        checked
                          ? 'border-rose-500 bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400'
                          : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-650 dark:text-slate-350 hover:bg-slate-100 dark:hover:bg-slate-850'
                      }`}
                    >
                      <div className={`flex items-center justify-center h-4 w-4 rounded-md border ${
                        checked ? 'bg-rose-500 border-rose-500 text-white' : 'border-slate-300 bg-white dark:bg-slate-900'
                      }`}>
                        {checked && <Check className="h-3 w-3 stroke-[3]" />}
                      </div>
                      <span>{allergy.name}</span>
                    </button>
                  );
                })}
              </div>

              {/* Custom / Free-text Allergy Input */}
              <div className="space-y-2 pt-1">
                <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Custom Exclusions</span>
                <div
                  className="flex gap-1.5"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddCustomAllergy(customAllergyInput);
                    }
                  }}
                >
                  <input
                    id="profile-custom-allergy-input"
                    type="text"
                    placeholder="e.g. mushroom, cinnamon…"
                    value={customAllergyInput}
                    onChange={(e) => setCustomAllergyInput(e.target.value)}
                    className="flex-1 min-w-0 px-3 py-2 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/40 dark:bg-rose-950/20 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-rose-400 text-xs font-semibold transition-shadow"
                  />
                  <button
                    type="button"
                    onClick={() => handleAddCustomAllergy(customAllergyInput)}
                    className="p-2 bg-rose-500 hover:bg-rose-600 text-white rounded-xl hover:scale-105 active:scale-95 transition-all flex-shrink-0"
                    aria-label="Add custom allergy"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>
                {localState.customAllergies.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {localState.customAllergies.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 pl-2.5 pr-1.5 py-1 text-[11px] font-bold rounded-lg text-rose-700 dark:text-rose-300 bg-rose-100 dark:bg-rose-950/40 border border-rose-300/50 dark:border-rose-800/60"
                      >
                        <span className="capitalize">{tag}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveCustomAllergy(tag)}
                          className="p-0.5 hover:bg-rose-200 dark:hover:bg-rose-900/50 rounded-md text-rose-500 hover:text-rose-700 dark:hover:text-rose-200 transition-colors"
                          aria-label={`Remove ${tag}`}
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Save Button */}
            <button
              type="submit"
              className="w-full flex items-center justify-center space-x-2 py-3 rounded-xl font-bold bg-primary-600 hover:bg-primary-750 text-white shadow-md shadow-primary-500/10 transition-all hover:scale-[1.01]"
            >
              <Save className="h-4.5 w-4.5" />
              <span>Save Preferences</span>
            </button>
          </form>
        </div>

        {/* Right: Saved Recipes Grid */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/60 dark:border-slate-800/80 shadow-sm p-6 sm:p-8 space-y-6">
          <h3 className="font-display font-bold text-lg text-slate-850 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <Heart className="h-5 w-5 text-rose-500 fill-rose-500 animate-pulse" />
            <span>Saved Favorite Recipes ({favoriteRecipes.length})</span>
          </h3>

          {favoriteRecipes.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {favoriteRecipes.map((recipe) => (
                <RecipeCard
                  key={recipe.id}
                  recipe={recipe}
                  matchScore={recipe.matchScore}
                  missingCount={recipe.missingCount}
                  isFavorite={true}
                  onToggleFavorite={onToggleFavorite}
                  onSelect={setSelectedRecipe}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl space-y-4">
              <span className="block text-3xl">❤️</span>
              <p className="text-sm font-semibold text-slate-450 dark:text-slate-400 max-w-xs mx-auto">
                You haven't saved any recipes yet. Browse recipes matching your pantry and bookmark them for quick access!
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Recipe Detail Modal (opens from saved favorites) */}
      {selectedRecipe && (
        <RecipeDetailModal
          recipe={selectedRecipe}
          onClose={() => setSelectedRecipe(null)}
          searchIngredients={searchState.ingredients}
          isFavorite={true}
          onToggleFavorite={onToggleFavorite}
        />
      )}
    </div>
  );
}

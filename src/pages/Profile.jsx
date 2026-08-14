import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { recipesDb } from '../data/recipesDb';
import RecipeCard from '../components/RecipeCard';
import RecipeDetailModal from '../components/RecipeDetailModal';
import { 
  User, ShieldAlert, Heart, Check, Save, Settings, Plus, X, LogOut, LogIn, 
  Sparkles, Flame, Clock, Sliders, Bot, Zap, ChefHat, Search, Filter, Award, 
  ChevronRight, CheckCircle2, ShieldCheck, Compass, Dumbbell, DollarSign, Timer, Utensils
} from 'lucide-react';

const ALLERGIES = [
  { id: "nuts", name: "Nuts / Peanuts", icon: "🥜" },
  { id: "milk", name: "Milk / Dairy", icon: "🥛" },
  { id: "eggs", name: "Eggs", icon: "🥚" },
  { id: "gluten", name: "Gluten / Wheat", icon: "🌾" },
  { id: "seafood", name: "Seafood & Shellfish", icon: "🦐" },
  { id: "soy", name: "Soy / Soybeans", icon: "🫛" }
];

const DIET_TYPES = [
  { id: "None", label: "Standard Diet", desc: "No restrictions, all culinary creations allowed", icon: Utensils },
  { id: "Vegetarian", label: "Vegetarian", desc: "Plant-based focus excluding meat & seafood", icon: Compass },
  { id: "Vegan", label: "Vegan", desc: "Strictly plant-based without animal byproducts", icon: Compass },
  { id: "Keto", label: "Keto", desc: "High healthy fats, ultra-low carbohydrates", icon: Flame },
  { id: "Low Carb", label: "Low Carb", desc: "Reduced carbohydrates for lean energy", icon: Sliders },
  { id: "High Protein", label: "High Protein", desc: "Maximized protein content for fitness goals", icon: Dumbbell },
  { id: "Diabetic Friendly", label: "Diabetic Friendly", desc: "Low glycemic index and balanced sugar", icon: ShieldCheck }
];

const AI_STYLES = [
  { id: "Quick & Easy", label: "Quick & Easy Chef", desc: "Focuses on 15-30 minute meals with minimal cleanup", icon: Timer },
  { id: "Gourmet Flavors", label: "Gourmet Flavorist", desc: "Elevates leftover ingredients into restaurant-quality dishes", icon: Sparkles },
  { id: "Budget Saver", label: "Zero-Waste Budgeting", desc: "Maximizes pantry usage to save grocery spending", icon: DollarSign },
  { id: "High Protein Fitness", label: "Fitness & Macro Coach", desc: "Optimizes meals for high protein and exact caloric targets", icon: Dumbbell }
];

const AI_TONES = [
  { id: "Encouraging & Friendly", label: "Encouraging & Warm", desc: "Friendly culinary companion offering helpful tips" },
  { id: "Expert Chef", label: "Master Culinary Expert", desc: "Professional, precise techniques and flavor profiles" },
  { id: "Concise & Direct", label: "Minimalist & Direct", desc: "Bullet-pointed instructions without extra commentary" }
];

export default function Profile({ user, onLogout, searchState, setSearchState, favorites, onToggleFavorite }) {
  const [activeTab, setActiveTab] = useState('favorites'); // 'favorites' | 'preferences' | 'ai_persona'
  const [profileSaved, setProfileSaved] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [customAllergyInput, setCustomAllergyInput] = useState('');
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [favoriteSearch, setFavoriteSearch] = useState('');

  const savedTimerRef = useRef(null);

  // Local preferences state
  const [localState, setLocalState] = useState({
    diet: searchState.diet || 'None',
    allergies: searchState.allergies || [],
    customAllergies: searchState.customAllergies || [],
    maxCalories: searchState.maxCalories || 800,
    maxTime: searchState.maxTime || 45
  });

  // Local AI Persona state
  const [aiStyle, setAiStyle] = useState(() => {
    return localStorage.getItem('leftover_chef_ai_style') || 'Quick & Easy';
  });
  const [aiTone, setAiTone] = useState(() => {
    return localStorage.getItem('leftover_chef_ai_tone') || 'Encouraging & Friendly';
  });
  const [prioritizeExpiring, setPrioritizeExpiring] = useState(() => {
    return localStorage.getItem('leftover_chef_ai_expiring') !== 'false';
  });

  // Get favorite recipe objects
  const favoriteRecipes = recipesDb.filter(r => favorites.includes(r.id));
  const filteredFavorites = favoriteRecipes.filter(r => 
    r.name.toLowerCase().includes(favoriteSearch.toLowerCase()) ||
    r.category.toLowerCase().includes(favoriteSearch.toLowerCase())
  );

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

  const showToast = (msg) => {
    setToastMessage(msg);
    setProfileSaved(true);
    if (savedTimerRef.current) clearTimeout(savedTimerRef.current);
    savedTimerRef.current = setTimeout(() => {
      setProfileSaved(false);
    }, 3000);
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
    
    localStorage.setItem('leftover_chef_diet', localState.diet);
    localStorage.setItem('leftover_chef_allergies', JSON.stringify(localState.allergies));
    localStorage.setItem('leftover_chef_custom_allergies', JSON.stringify(localState.customAllergies));
    localStorage.setItem('leftover_chef_max_cal', localState.maxCalories.toString());
    localStorage.setItem('leftover_chef_max_time', localState.maxTime.toString());

    showToast("Dietary preferences updated successfully!");
  };

  const handleSaveAiPersona = () => {
    localStorage.setItem('leftover_chef_ai_style', aiStyle);
    localStorage.setItem('leftover_chef_ai_tone', aiTone);
    localStorage.setItem('leftover_chef_ai_expiring', prioritizeExpiring.toString());
    showToast("AI Cooking Persona saved!");
  };

  return (
    <div className="relative min-h-full pb-16 pt-6 sm:pt-10 overflow-hidden">
      
      {/* Dispersing Ambient Green Gradient Ripple Waves (Positioned Top Right - Subtle Opacity) */}
      <div className="absolute top-10 right-10 sm:right-16 w-96 h-96 rounded-full bg-gradient-to-tr from-emerald-500/10 via-primary-500/08 to-teal-400/04 blur-3xl -z-10 animate-[disperse-ripple_8s_cubic-bezier(0.16,1,0.3,1)_infinite] pointer-events-none"></div>
      <div className="absolute top-10 right-10 sm:right-16 w-96 h-96 rounded-full bg-gradient-to-tr from-primary-500/10 via-emerald-400/08 to-green-300/04 blur-3xl -z-10 animate-[disperse-ripple_8s_cubic-bezier(0.16,1,0.3,1)_infinite] pointer-events-none" style={{ animationDelay: '4s' }}></div>

      {/* Floating Success Toast */}
      {profileSaved && (
        <div className="fixed bottom-6 right-6 z-55 flex items-center space-x-2.5 bg-gradient-to-r from-emerald-500 to-primary-600 text-white px-5 py-3.5 rounded-2xl shadow-xl animate-scale-up">
          <CheckCircle2 className="h-5 w-5 stroke-[2.5]" />
          <span className="font-semibold text-xs sm:text-sm">{toastMessage}</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* HERO COMMAND BANNER */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white/90 via-slate-50/80 to-emerald-50/40 dark:from-slate-900/90 dark:via-slate-900/80 dark:to-emerald-950/20 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 shadow-xl shadow-slate-900/5">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            
            {/* User Identity Info */}
            <div className="flex items-center space-x-4">
              {user ? (
                <div className="relative">
                  <img 
                    src={user.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${user.name}`} 
                    alt="Avatar" 
                    className="h-16 w-16 sm:h-20 sm:w-20 rounded-2xl bg-gradient-to-tr from-primary-100 to-emerald-100 dark:from-primary-950/60 dark:to-emerald-950/60 p-1 border-2 border-primary-500/30 shadow-md object-cover" 
                  />
                  <span className="absolute -bottom-1 -right-1 p-1 bg-primary-500 text-white rounded-lg shadow-sm" title="Active Chef">
                    <Sparkles className="h-3.5 w-3.5" />
                  </span>
                </div>
              ) : (
                <div className="p-4 bg-gradient-to-tr from-primary-600 to-emerald-500 rounded-2xl text-white shadow-lg shadow-primary-500/20">
                  <ChefHat className="h-8 w-8" />
                </div>
              )}

              <div className="space-y-1">
                <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                  <h1 className="font-display font-black text-2xl sm:text-3xl text-slate-900 dark:text-white tracking-tight">
                    {user ? user.name : 'Culinary Dashboard'}
                  </h1>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-primary-100/80 dark:bg-primary-950/60 border border-primary-200 dark:border-primary-900 text-primary-700 dark:text-primary-400 text-[10px] font-bold uppercase tracking-wider">
                    <Award className="h-3 w-3" /> Master Chef
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
                  {user ? user.email : 'Personalize your dietary limits, safety exclusions, and AI persona.'}
                </p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center space-x-3 self-start lg:self-auto">
              {user ? (
                <button
                  onClick={onLogout}
                  className="flex items-center space-x-2 px-4 py-2.5 rounded-2xl border border-rose-200/80 dark:border-rose-900/60 bg-rose-50/60 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 hover:bg-rose-100/80 dark:hover:bg-rose-900/40 font-bold text-xs transition-all shadow-sm hover:scale-[1.02]"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sign Out</span>
                </button>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center space-x-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-primary-600 to-emerald-600 hover:from-primary-700 hover:to-emerald-700 text-white font-bold text-xs shadow-md shadow-primary-500/20 hover:scale-105 transition-all"
                >
                  <LogIn className="h-4 w-4" />
                  <span>Sign In / Register</span>
                </Link>
              )}
            </div>
          </div>

          {/* Quick Stat Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-6 pt-6 border-t border-slate-200/60 dark:border-slate-800/80">
            
            {/* Stat 1 */}
            <div className="p-3.5 sm:p-4 rounded-2xl bg-white/60 dark:bg-slate-950/40 border border-slate-200/50 dark:border-slate-800/60 flex items-center space-x-3">
              <div className="p-2.5 rounded-xl bg-rose-100/70 dark:bg-rose-950/50 text-rose-500">
                <Heart className="h-4 w-4 fill-rose-500" />
              </div>
              <div>
                <span className="block font-display font-black text-lg text-slate-900 dark:text-white leading-none">
                  {favorites.length}
                </span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Saved Recipes</span>
              </div>
            </div>

            {/* Stat 2 */}
            <div className="p-3.5 sm:p-4 rounded-2xl bg-white/60 dark:bg-slate-950/40 border border-slate-200/50 dark:border-slate-800/60 flex items-center space-x-3">
              <div className="p-2.5 rounded-xl bg-emerald-100/70 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400">
                <Compass className="h-4 w-4" />
              </div>
              <div>
                <span className="block font-display font-black text-xs sm:text-sm text-slate-900 dark:text-white leading-tight truncate max-w-[100px]">
                  {localState.diet}
                </span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Diet Goal</span>
              </div>
            </div>

            {/* Stat 3 */}
            <div className="p-3.5 sm:p-4 rounded-2xl bg-white/60 dark:bg-slate-950/40 border border-slate-200/50 dark:border-slate-800/60 flex items-center space-x-3">
              <div className="p-2.5 rounded-xl bg-amber-100/70 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400">
                <ShieldAlert className="h-4 w-4" />
              </div>
              <div>
                <span className="block font-display font-black text-lg text-slate-900 dark:text-white leading-none">
                  {localState.allergies.length + localState.customAllergies.length}
                </span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Exclusions</span>
              </div>
            </div>

            {/* Stat 4 */}
            <div className="p-3.5 sm:p-4 rounded-2xl bg-white/60 dark:bg-slate-950/40 border border-slate-200/50 dark:border-slate-800/60 flex items-center space-x-3">
              <div className="p-2.5 rounded-xl bg-primary-100/70 dark:bg-primary-950/50 text-primary-600 dark:text-primary-400">
                <Bot className="h-4 w-4" />
              </div>
              <div>
                <span className="block font-display font-black text-xs sm:text-sm text-slate-900 dark:text-white leading-tight truncate max-w-[100px]">
                  {aiStyle}
                </span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">AI Persona</span>
              </div>
            </div>

          </div>
        </div>

        {/* SAAS DASHBOARD TAB NAVIGATION BAR */}
        <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-1 overflow-x-auto scrollbar-none">
          <div className="flex items-center space-x-2 min-w-max">
            
            {/* Tab 1: Favorites */}
            <button
              type="button"
              onClick={() => setActiveTab('favorites')}
              className={`flex items-center space-x-2 px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all duration-200 ${
                activeTab === 'favorites'
                  ? 'bg-white dark:bg-slate-900 text-primary-600 dark:text-primary-400 shadow-md border border-slate-200/80 dark:border-slate-800'
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100/50 dark:hover:bg-slate-900/40'
              }`}
            >
              <Heart className={`h-4 w-4 ${activeTab === 'favorites' ? 'fill-primary-500 text-primary-500' : ''}`} />
              <span>Saved Favorites</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                activeTab === 'favorites' 
                  ? 'bg-primary-100 dark:bg-primary-950 text-primary-700 dark:text-primary-300' 
                  : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}>
                {favoriteRecipes.length}
              </span>
            </button>

            {/* Tab 2: Preferences */}
            <button
              type="button"
              onClick={() => setActiveTab('preferences')}
              className={`flex items-center space-x-2 px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all duration-200 ${
                activeTab === 'preferences'
                  ? 'bg-white dark:bg-slate-900 text-primary-600 dark:text-primary-400 shadow-md border border-slate-200/80 dark:border-slate-800'
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100/50 dark:hover:bg-slate-900/40'
              }`}
            >
              <Sliders className="h-4 w-4" />
              <span>Dietary & Safety Profile</span>
            </button>

            {/* Tab 3: AI Persona */}
            <button
              type="button"
              onClick={() => setActiveTab('ai_persona')}
              className={`flex items-center space-x-2 px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all duration-200 ${
                activeTab === 'ai_persona'
                  ? 'bg-white dark:bg-slate-900 text-primary-600 dark:text-primary-400 shadow-md border border-slate-200/80 dark:border-slate-800'
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100/50 dark:hover:bg-slate-900/40'
              }`}
            >
              <Bot className="h-4 w-4 text-emerald-500" />
              <span>AI Cooking Persona</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
                AI Mode
              </span>
            </button>

          </div>
        </div>

        {/* TAB 1 CONTENT: SAVED FAVORITES */}
        {activeTab === 'favorites' && (
          <div className="space-y-6 animate-fade-in">
            
            {/* Header Filter Bar inside Favorites */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/60 dark:border-slate-800/80 backdrop-blur-md shadow-sm">
              <div className="flex items-center space-x-2">
                <Heart className="h-5 w-5 text-rose-500 fill-rose-500" />
                <h2 className="font-display font-bold text-base text-slate-850 dark:text-white">
                  Your Bookmarked Recipes ({favoriteRecipes.length})
                </h2>
              </div>

              {favoriteRecipes.length > 0 && (
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search saved recipes…"
                    value={favoriteSearch}
                    onChange={(e) => setFavoriteSearch(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 text-xs font-medium"
                  />
                  {favoriteSearch && (
                    <button 
                      onClick={() => setFavoriteSearch('')}
                      className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Recipes Grid */}
            {filteredFavorites.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredFavorites.map((recipe) => (
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
            ) : favoriteRecipes.length > 0 ? (
              <div className="text-center py-16 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-3">
                <Filter className="h-8 w-8 text-slate-400 mx-auto" />
                <p className="text-sm font-bold text-slate-600 dark:text-slate-300">
                  No recipes match "{favoriteSearch}"
                </p>
                <button
                  onClick={() => setFavoriteSearch('')}
                  className="text-xs font-bold text-primary-600 hover:underline"
                >
                  Clear search filter
                </button>
              </div>
            ) : (
              <div className="text-center py-16 sm:py-20 bg-white/80 dark:bg-slate-900/80 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl space-y-4 max-w-lg mx-auto p-6">
                <div className="p-4 bg-rose-50 dark:bg-rose-950/40 rounded-full w-fit mx-auto text-rose-500">
                  <Heart className="h-8 w-8" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white">
                    No Saved Recipes Yet
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto font-medium">
                    Bookmark your favorite zero-waste dishes while browsing to build your personal cookbook!
                  </p>
                </div>
                <Link
                  to="/search"
                  className="inline-flex items-center space-x-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-primary-600 to-emerald-600 hover:from-primary-700 hover:to-emerald-700 text-white font-bold text-xs shadow-md shadow-primary-500/20 hover:scale-105 transition-all"
                >
                  <Sparkles className="h-4 w-4" />
                  <span>Discover Pantry Recipes</span>
                </Link>
              </div>
            )}
          </div>
        )}

        {/* TAB 2 CONTENT: DIETARY & SAFETY PROFILE */}
        {activeTab === 'preferences' && (
          <form onSubmit={handleSaveProfile} className="space-y-8 animate-fade-in">
            
            {/* Section 1: Diet Goal Selector Cards */}
            <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-5 shadow-sm">
              <div>
                <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                  <Compass className="h-5 w-5 text-primary-500" />
                  <span>Primary Dietary Preference</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Select your baseline dietary restriction for AI recipe recommendations.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {DIET_TYPES.map((diet) => {
                  const Icon = diet.icon;
                  const isSelected = localState.diet === diet.id;
                  return (
                    <button
                      key={diet.id}
                      type="button"
                      onClick={() => setLocalState({ ...localState, diet: diet.id })}
                      className={`p-4 rounded-2xl border text-left transition-all duration-200 relative flex flex-col justify-between space-y-2 ${
                        isSelected
                          ? 'border-primary-500 bg-primary-50/70 dark:bg-primary-950/40 shadow-md shadow-primary-500/10'
                          : 'border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 hover:bg-slate-100/60 dark:hover:bg-slate-850'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <div className={`p-2 rounded-xl ${isSelected ? 'bg-primary-600 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}>
                          <Icon className="h-4 w-4" />
                        </div>
                        {isSelected && (
                          <span className="p-1 bg-primary-500 text-white rounded-full">
                            <Check className="h-3 w-3 stroke-[3]" />
                          </span>
                        )}
                      </div>
                      <div>
                        <span className={`block font-bold text-sm ${isSelected ? 'text-primary-700 dark:text-primary-300' : 'text-slate-850 dark:text-slate-200'}`}>
                          {diet.label}
                        </span>
                        <span className="block text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                          {diet.desc}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Section 2: Macro Caps & Sliders */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Max Calories Card */}
              <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 space-y-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="p-2 rounded-xl bg-orange-100 dark:bg-orange-950/50 text-orange-500">
                      <Flame className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-display font-bold text-sm text-slate-900 dark:text-white">Max Calorie Cap</h4>
                      <p className="text-[11px] text-slate-400">Upper calorie threshold per recipe serving</p>
                    </div>
                  </div>
                  <span className="font-display font-black text-xl text-primary-600 dark:text-primary-400">
                    {localState.maxCalories} <span className="text-xs font-normal text-slate-400">kcal</span>
                  </span>
                </div>

                <input
                  type="range"
                  min="200"
                  max="2000"
                  step="50"
                  value={localState.maxCalories}
                  onChange={(e) => setLocalState({ ...localState, maxCalories: parseInt(e.target.value) })}
                  className="w-full accent-primary-600 h-2 bg-slate-200 dark:bg-slate-800 rounded-lg cursor-pointer"
                />

                <div className="flex gap-2 pt-1">
                  {[400, 650, 850, 1200].map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setLocalState({ ...localState, maxCalories: val })}
                      className={`px-2.5 py-1 rounded-xl text-[11px] font-bold border transition-all ${
                        localState.maxCalories === val
                          ? 'border-primary-500 bg-primary-100 dark:bg-primary-950 text-primary-700 dark:text-primary-300'
                          : 'border-slate-200 dark:border-slate-800 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      {val} kcal
                    </button>
                  ))}
                </div>
              </div>

              {/* Max Prep Time Card */}
              <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 space-y-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="p-2 rounded-xl bg-blue-100 dark:bg-blue-950/50 text-blue-500">
                      <Clock className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-display font-bold text-sm text-slate-900 dark:text-white">Max Preparation Time</h4>
                      <p className="text-[11px] text-slate-400">Maximum cooking duration in minutes</p>
                    </div>
                  </div>
                  <span className="font-display font-black text-xl text-primary-600 dark:text-primary-400">
                    {localState.maxTime} <span className="text-xs font-normal text-slate-400">mins</span>
                  </span>
                </div>

                <input
                  type="range"
                  min="10"
                  max="120"
                  step="5"
                  value={localState.maxTime}
                  onChange={(e) => setLocalState({ ...localState, maxTime: parseInt(e.target.value) })}
                  className="w-full accent-primary-600 h-2 bg-slate-200 dark:bg-slate-800 rounded-lg cursor-pointer"
                />

                <div className="flex gap-2 pt-1">
                  {[15, 30, 45, 60].map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setLocalState({ ...localState, maxTime: val })}
                      className={`px-2.5 py-1 rounded-xl text-[11px] font-bold border transition-all ${
                        localState.maxTime === val
                          ? 'border-primary-500 bg-primary-100 dark:bg-primary-950 text-primary-700 dark:text-primary-300'
                          : 'border-slate-200 dark:border-slate-800 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      {val} mins
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* Section 3: Safety & Allergy Exclusions */}
            <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
              <div>
                <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                  <ShieldAlert className="h-5 w-5 text-rose-500" />
                  <span>Allergen & Health Safety Exclusions</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Recipes containing these ingredients will automatically be filtered out of search results.
                </p>
              </div>

              {/* Standard Allergies Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {ALLERGIES.map((allergy) => {
                  const checked = localState.allergies.includes(allergy.id);
                  return (
                    <button
                      key={allergy.id}
                      type="button"
                      onClick={() => handleAllergyToggle(allergy.id)}
                      className={`flex items-center space-x-3 p-3.5 rounded-2xl border text-xs font-bold transition-all text-left ${
                        checked
                          ? 'border-rose-500 bg-rose-50/80 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 shadow-sm'
                          : 'border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 text-slate-650 dark:text-slate-350 hover:bg-slate-100 dark:hover:bg-slate-850'
                      }`}
                    >
                      <span className="text-base">{allergy.icon}</span>
                      <span className="flex-1 min-w-0 truncate">{allergy.name}</span>
                      <div className={`flex items-center justify-center h-4 w-4 rounded-md border flex-shrink-0 ${
                        checked ? 'bg-rose-500 border-rose-500 text-white' : 'border-slate-300 bg-white dark:bg-slate-900'
                      }`}>
                        {checked && <Check className="h-3 w-3 stroke-[3]" />}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Custom Exclusions Input */}
              <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <span className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Custom Ingredient Exclusions
                </span>
                
                <div 
                  className="flex gap-2 max-w-md"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddCustomAllergy(customAllergyInput);
                    }
                  }}
                >
                  <input
                    type="text"
                    placeholder="e.g. mushroom, cinnamon, cilantro…"
                    value={customAllergyInput}
                    onChange={(e) => setCustomAllergyInput(e.target.value)}
                    className="flex-1 px-4 py-2.5 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/40 dark:bg-rose-950/20 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-rose-400 text-xs font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => handleAddCustomAllergy(customAllergyInput)}
                    className="flex items-center space-x-1.5 px-4 py-2.5 bg-rose-500 hover:bg-rose-600 text-white rounded-xl font-bold text-xs hover:scale-105 active:scale-95 transition-all flex-shrink-0 shadow-md shadow-rose-500/20"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add Exclusion</span>
                  </button>
                </div>

                {localState.customAllergies.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {localState.customAllergies.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl text-rose-700 dark:text-rose-300 bg-rose-100/80 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800/80 shadow-sm"
                      >
                        <span className="capitalize">{tag}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveCustomAllergy(tag)}
                          className="p-0.5 hover:bg-rose-200 dark:hover:bg-rose-900/60 rounded-md text-rose-500 hover:text-rose-700 dark:hover:text-rose-200 transition-colors"
                          aria-label={`Remove ${tag}`}
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Save Preferences Button */}
            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="flex items-center justify-center space-x-2 px-8 py-4 rounded-2xl font-bold bg-gradient-to-r from-primary-600 to-emerald-600 hover:from-primary-700 hover:to-emerald-700 text-white shadow-lg shadow-primary-500/25 hover:shadow-xl hover:shadow-primary-500/35 hover:scale-[1.01] active:scale-[0.99] transition-all text-sm"
              >
                <Save className="h-5 w-5" />
                <span>Save Dietary Preferences</span>
              </button>
            </div>

          </form>
        )}

        {/* TAB 3 CONTENT: AI COOKING PERSONA */}
        {activeTab === 'ai_persona' && (
          <div className="space-y-8 animate-fade-in">
            
            {/* AI Style Selection Grid */}
            <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
              <div>
                <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                  <Bot className="h-5 w-5 text-emerald-500" />
                  <span>AI Culinary Assistant Style</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Customize how the AI Chef shapes recipes and responds in the AI Kitchen Chat.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {AI_STYLES.map((style) => {
                  const Icon = style.icon;
                  const isSelected = aiStyle === style.id;
                  return (
                    <button
                      key={style.id}
                      type="button"
                      onClick={() => setAiStyle(style.id)}
                      className={`p-5 rounded-2xl border text-left transition-all duration-200 relative flex items-start space-x-4 ${
                        isSelected
                          ? 'border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/40 shadow-md shadow-emerald-500/10'
                          : 'border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 hover:bg-slate-100/60 dark:hover:bg-slate-850'
                      }`}
                    >
                      <div className={`p-3 rounded-2xl ${isSelected ? 'bg-emerald-600 text-white shadow-md' : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <div className="space-y-1 flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className={`font-bold text-sm ${isSelected ? 'text-emerald-700 dark:text-emerald-300' : 'text-slate-850 dark:text-slate-200'}`}>
                            {style.label}
                          </span>
                          {isSelected && (
                            <span className="p-1 bg-emerald-500 text-white rounded-full">
                              <Check className="h-3 w-3 stroke-[3]" />
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                          {style.desc}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* AI Communication Tone Selector */}
            <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-5 shadow-sm">
              <div>
                <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-amber-400" />
                  <span>AI Communication Tone</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Choose how detailed or encouraging the AI assistant sounds during culinary advice.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                {AI_TONES.map((tone) => {
                  const isSelected = aiTone === tone.id;
                  return (
                    <button
                      key={tone.id}
                      type="button"
                      onClick={() => setAiTone(tone.id)}
                      className={`p-4 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between space-y-2 ${
                        isSelected
                          ? 'border-amber-500 bg-amber-50/70 dark:bg-amber-950/30 shadow-md shadow-amber-500/10'
                          : 'border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 hover:bg-slate-100/60 dark:hover:bg-slate-850'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className={`font-bold text-sm ${isSelected ? 'text-amber-700 dark:text-amber-300' : 'text-slate-850 dark:text-slate-200'}`}>
                          {tone.label}
                        </span>
                        {isSelected && (
                          <span className="p-1 bg-amber-500 text-white rounded-full">
                            <Check className="h-3 w-3 stroke-[3]" />
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-snug">
                        {tone.desc}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Smart AI Feature Toggles */}
            <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-5 shadow-sm">
              <div>
                <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                  <Zap className="h-5 w-5 text-primary-500" />
                  <span>Smart AI Automation Features</span>
                </h3>
              </div>

              <div className="space-y-3">
                <label className="flex items-center justify-between p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 cursor-pointer hover:bg-slate-100/50 dark:hover:bg-slate-850 transition-all">
                  <div className="space-y-0.5">
                    <span className="block font-bold text-sm text-slate-900 dark:text-white">
                      Prioritize Expiring Ingredients First
                    </span>
                    <span className="block text-xs text-slate-500 dark:text-slate-400">
                      Boost recipes that consume highly perishable items in your pantry.
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={prioritizeExpiring}
                    onChange={(e) => setPrioritizeExpiring(e.target.checked)}
                    className="h-5 w-5 accent-primary-600 rounded cursor-pointer"
                  />
                </label>
              </div>
            </div>

            {/* Save AI Persona Button */}
            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={handleSaveAiPersona}
                className="flex items-center justify-center space-x-2 px-8 py-4 rounded-2xl font-bold bg-gradient-to-r from-emerald-600 to-primary-600 hover:from-emerald-700 hover:to-primary-700 text-white shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/35 hover:scale-[1.01] active:scale-[0.99] transition-all text-sm"
              >
                <Bot className="h-5 w-5" />
                <span>Save AI Persona Settings</span>
              </button>
            </div>

          </div>
        )}

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

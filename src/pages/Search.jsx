import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, X, Sparkles, Filter, ShieldAlert, ChevronDown, Check, Camera, Image, RefreshCw } from 'lucide-react';
import { scanIngredientsFromPhoto } from '../api/groqClient';

const SUGGESTED_INGREDIENTS = [
  "rice", "chicken", "tomato", "onion", "garlic", "eggs", "tofu", "broccoli", 
  "beef", "bananas", "oats", "pasta", "mushrooms", "avocado", "milk", "butter"
];

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

export default function Search({ searchState, setSearchState }) {
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState("");
  const [customAllergyInput, setCustomAllergyInput] = useState("");
  const [formError, setFormError] = useState("");

  const handleAddIngredient = (ing) => {
    const cleanIng = ing.trim().toLowerCase();
    if (cleanIng && cleanIng.length > 50) {
      setFormError("Ingredient name is too long (max 50 characters).");
      return;
    }
    if (cleanIng && searchState.ingredients.includes(cleanIng)) {
      setFormError(`"${cleanIng}" is already in your list.`);
      return;
    }
    if (cleanIng) {
      setFormError("");
      setSearchState({
        ...searchState,
        ingredients: [...searchState.ingredients, cleanIng]
      });
    }
    setInputValue("");
  };

  const handleRemoveIngredient = (ing) => {
    setSearchState({
      ...searchState,
      ingredients: searchState.ingredients.filter(i => i !== ing)
    });
  };

  const handleAllergyToggle = (allergyId) => {
    const activeAllergies = searchState.allergies.includes(allergyId)
      ? searchState.allergies.filter(id => id !== allergyId)
      : [...searchState.allergies, allergyId];
    setSearchState({ ...searchState, allergies: activeAllergies });
  };

  const handleAddCustomAllergy = (value) => {
    const clean = value.trim().toLowerCase();
    if (clean && !(searchState.customAllergies || []).includes(clean)) {
      const updated = [...(searchState.customAllergies || []), clean];
      setSearchState({ ...searchState, customAllergies: updated });
    }
    setCustomAllergyInput("");
  };

  const handleRemoveCustomAllergy = (tag) => {
    setSearchState({
      ...searchState,
      customAllergies: (searchState.customAllergies || []).filter(a => a !== tag)
    });
  };

  const handleSliderChange = (field, value) => {
    setSearchState({ ...searchState, [field]: parseInt(value) });
  };

  const fileInputRef = useRef(null);
  const scanTimerRef = useRef(null);

  // Clear the scan-result toast timer on unmount
  useEffect(() => () => clearTimeout(scanTimerRef.current), []);

  // Read the selected image as a data URL, then ask Groq vision to detect ingredients
  const handleFileSelected = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // Reset input so the same file can be re-selected later
    e.target.value = '';

    if (!file.type.startsWith('image/')) {
      setScanResult("Please choose an image file.");
      return;
    }

    const reader = new FileReader();
    reader.onload = async () => {
      const dataUrl = reader.result;
      setIsScanning(true);
      setScanResult("Analyzing image...");
      try {
        const detected = await scanIngredientsFromPhoto(dataUrl);
        if (detected.length > 0) {
          const newIngredients = [...new Set([...searchState.ingredients, ...detected])];
          setSearchState({ ...searchState, ingredients: newIngredients });
          setScanResult(`Detected: ${detected.join(', ')}`);
        } else {
          setScanResult("No ingredients detected. Try a clearer photo or add ingredients manually.");
        }
      } catch (err) {
        setScanResult(`Scan failed: ${err.message}. Add ingredients manually instead.`);
      } finally {
        setIsScanning(false);
        clearTimeout(scanTimerRef.current);
        scanTimerRef.current = setTimeout(() => setScanResult(""), 5000);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSearchTrigger = (e) => {
    e.preventDefault();
    if (searchState.ingredients.length === 0) {
      setFormError("Please add at least one ingredient to search!");
      return;
    }
    setFormError("");
    navigate('/recipes');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      {/* Page Header */}
      <div className="text-center space-y-4 mb-10">
        <h1 className="font-display font-black text-3xl sm:text-4xl text-slate-900 dark:text-white">
          What Ingredients Do You Have?
        </h1>
        <p className="text-slate-500 dark:text-slate-400 font-medium">
          Enter what's in your pantry and set your preferences. We'll search our database for matching recipes.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Ingredient Entry Box */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/60 dark:border-slate-800/80 shadow-sm p-6 sm:p-8 space-y-6">
          <form onSubmit={(e) => { e.preventDefault(); handleAddIngredient(inputValue); }}>
            <label htmlFor="ingredient-input" className="block text-sm font-bold text-slate-700 dark:text-slate-350 mb-2">
              Add Pantry Ingredients
            </label>
            <div className="flex gap-2">
              <input
                id="ingredient-input"
                type="text"
                placeholder="e.g. Rice, Chicken, Tomato..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                maxLength={50}
                className="flex-1 px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-shadow text-sm"
              />
              <button
                type="submit"
                className="p-3.5 bg-primary-600 hover:bg-primary-750 text-white rounded-2xl shadow-md shadow-primary-500/10 hover:scale-105 active:scale-95 transition-all"
              >
                <Plus className="h-5 w-5" />
              </button>
            </div>
          </form>

          {/* Active Chips */}
          {searchState.ingredients.length > 0 && (
            <div className="space-y-2">
              <span className="block text-xs font-bold uppercase tracking-wider text-slate-400">Your Ingredients</span>
              <div className="flex flex-wrap gap-2">
                {searchState.ingredients.map((ing) => (
                  <span
                    key={ing}
                    className="inline-flex items-center gap-1.5 pl-3.5 pr-2 py-1.5 text-sm font-bold rounded-xl text-primary-700 dark:text-primary-400 bg-primary-50 dark:bg-primary-950/40 border border-primary-200/20"
                  >
                    <span className="capitalize">{ing}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveIngredient(ing)}
                      className="p-0.5 hover:bg-primary-200/50 dark:hover:bg-primary-900/50 rounded-lg text-primary-500 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Suggested Autocomplete Helpers */}
          <div className="space-y-2">
            <span className="block text-xs font-bold uppercase tracking-wider text-slate-400">Popular items</span>
            <div className="flex flex-wrap gap-1.5">
              {SUGGESTED_INGREDIENTS.filter(item => !searchState.ingredients.includes(item)).map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => handleAddIngredient(item)}
                  className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-950 dark:hover:bg-slate-850 text-slate-600 dark:text-slate-350 border border-slate-200 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700 transition-all capitalize"
                >
                  + {item}
                </button>
              ))}
            </div>
          </div>

          {/* Image Scanning Section */}
          <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-primary-50 to-emerald-50/50 dark:from-slate-850 dark:to-slate-850/50 border border-primary-100/30 dark:border-slate-800">
              <div className="space-y-1 text-center sm:text-left">
                <h3 className="font-display font-bold text-sm text-slate-850 dark:text-slate-100 flex items-center justify-center sm:justify-start gap-1.5">
                  <Camera className="h-4 w-4 text-primary-600 dark:text-primary-400" />
                  <span>Scan Pantry Ingredients</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Take a photo of your ingredients — AI vision detects them automatically.
                </p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileSelected}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isScanning}
                className="w-full sm:w-auto flex items-center justify-center space-x-2 px-5 py-2.5 rounded-xl font-bold text-sm bg-white dark:bg-slate-900 text-primary-750 dark:text-primary-400 border border-primary-100 dark:border-slate-800 hover:bg-primary-50 dark:hover:bg-slate-850 shadow-sm disabled:opacity-75 transition-all"
              >
                {isScanning ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin text-primary-500" />
                    <span>Analyzing Image...</span>
                  </>
                ) : (
                  <>
                    <Image className="h-4 w-4" />
                    <span>Scan a Photo</span>
                  </>
                )}
              </button>
            </div>
            {scanResult && (
              <span className="block text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-2 text-center">
                {scanResult}
              </span>
            )}
          </div>

          {/* Search Trigger */}
          {formError && (
            <span className="block text-center text-sm font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/50 rounded-xl px-4 py-2.5">
              {formError}
            </span>
          )}
          <button
            onClick={handleSearchTrigger}
            className="w-full flex items-center justify-center space-x-2 py-4 rounded-2xl font-bold bg-primary-600 hover:bg-primary-750 text-white shadow-lg shadow-primary-500/10 hover:scale-[1.01] transition-all duration-200"
          >
            <Sparkles className="h-5 w-5" />
            <span>Generate Recipes ({searchState.ingredients.length} item{searchState.ingredients.length !== 1 ? 's' : ''})</span>
          </button>
        </div>

        {/* Filters Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          {/* Header Toggle */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/60 dark:border-slate-800/80 shadow-sm p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-bold text-lg text-slate-850 dark:text-slate-100 flex items-center gap-2">
                <Filter className="h-5 w-5 text-slate-400" />
                <span>Search Preferences</span>
              </h3>
            </div>

            {/* Diet type */}
            <div className="space-y-2">
              <label htmlFor="diet-select" className="block text-xs font-bold uppercase tracking-wider text-slate-400">Diet Type</label>
              <div className="relative">
                <select
                  id="diet-select"
                  value={searchState.diet}
                  onChange={(e) => setSearchState({ ...searchState, diet: e.target.value })}
                  className="w-full appearance-none px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-805 dark:text-slate-100 font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  {DIET_TYPES.map(diet => (
                    <option key={diet} value={diet}>{diet}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3.5 top-3.5 h-4 w-4 text-slate-400 pointer-events-none" />
              </div>
            </div>

            {/* Cooking time slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider">
                <span className="text-slate-400">Max Time</span>
                <span className="text-primary-600 dark:text-primary-400">{searchState.maxTime} mins</span>
              </div>
              <input
                type="range"
                min="10"
                max="60"
                step="5"
                value={searchState.maxTime}
                onChange={(e) => handleSliderChange("maxTime", e.target.value)}
                className="w-full accent-primary-600 cursor-pointer"
              />
            </div>

            {/* Calorie slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider">
                <span className="text-slate-400">Max Calories</span>
                <span className="text-primary-600 dark:text-primary-400">{searchState.maxCalories} kcal</span>
              </div>
              <input
                type="range"
                min="200"
                max="1200"
                step="50"
                value={searchState.maxCalories}
                onChange={(e) => handleSliderChange("maxCalories", e.target.value)}
                className="w-full accent-primary-600 cursor-pointer"
              />
            </div>

            {/* Allergies list */}
            <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              <span className="block text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <ShieldAlert className="h-4 w-4 text-slate-400" />
                <span>Exclusions (Allergies)</span>
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {ALLERGIES.map((allergy) => {
                  const checked = searchState.allergies.includes(allergy.id);
                  return (
                    <button
                      key={allergy.id}
                      type="button"
                      onClick={() => handleAllergyToggle(allergy.id)}
                      className={`flex items-center space-x-2 p-2.5 rounded-xl border text-xs font-bold transition-all text-left ${
                        checked
                          ? 'border-rose-500 bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400'
                          : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-350 hover:bg-slate-100 dark:hover:bg-slate-850'
                      }`}
                    >
                      <div className={`flex items-center justify-center h-4 w-4 rounded-md border ${
                        checked ? 'bg-rose-500 border-rose-500 text-white' : 'border-slate-350 bg-white dark:bg-slate-900'
                      }`}>
                        {checked && <Check className="h-3 w-3 stroke-[3]" />}
                      </div>
                      <span className="truncate">{allergy.name}</span>
                    </button>
                  );
                })}
              </div>

              {/* Custom / Free-text Allergy Input */}
              <div className="space-y-2 pt-2">
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
                    id="custom-allergy-input"
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
                {(searchState.customAllergies || []).length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {(searchState.customAllergies || []).map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 pl-2.5 pr-1.5 py-1 text-[11px] font-bold rounded-lg text-rose-700 dark:text-rose-300 bg-rose-100 dark:bg-rose-950/40 border border-rose-300/50 dark:border-rose-800/60"
                      >
                        <span className="capitalize">{tag}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveCustomAllergy(tag)}
                          className="p-0.5 hover:bg-rose-200 dark:hover:bg-rose-900/50 rounded-md text-rose-500 hover:text-rose-700 dark:hover:text-rose-200 transition-colors"
                          aria-label={`Remove ${tag} allergy`}
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

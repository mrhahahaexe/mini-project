import React, { useState } from 'react';
import ProgressRing from '../components/ProgressRing';
import { Flame, Droplet, Plus, Minus, Trash2, Calendar, Award, Pencil, Check, X } from 'lucide-react';

export default function Dashboard({ foodLog, onRemoveFoodLog, onUpdateFoodLog, waterLog, onUpdateWaterLog }) {
  // Which meal is currently being edited (matched by identity)
  const [editingMeal, setEditingMeal] = useState(null);
  const [editName, setEditName] = useState("");
  const [editCalories, setEditCalories] = useState(0);
  // Goal constants
  const GOALS = {
    calories: 2000,
    protein: 100, // in grams
    carbs: 220,
    fat: 65,
    water: 2000 // in ml
  };

  // Handlers: start editing a meal, save edits, cancel
  const startEdit = (meal) => {
    setEditingMeal(meal);
    setEditName(meal.name);
    setEditCalories(meal.calories);
  };

  const cancelEdit = () => {
    setEditingMeal(null);
  };

  const saveEdit = (meal) => {
    onUpdateFoodLog(meal, { name: editName.trim() || meal.name, calories: Math.max(0, parseInt(editCalories, 10) || 0) });
    setEditingMeal(null);
  };

  const today = new Date().toISOString().slice(0, 10);
  // Only meals logged today count toward the daily totals
  const todaysMeals = foodLog.filter((meal) => !meal.date || meal.date === today);

  // Calculate daily totals from today's meals
  const totals = todaysMeals.reduce(
    (acc, meal) => {
      acc.calories += meal.calories || 0;
      acc.protein += meal.macros?.protein || 0;
      acc.carbs += meal.macros?.carbs || 0;
      acc.fat += meal.macros?.fat || 0;
      return acc;
    },
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

  const getPercentage = (value, goal) => {
    return Math.min(100, (value / goal) * 100);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8 space-y-10">
      
      {/* Header and Welcome */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div className="space-y-1">
          <h1 className="font-display font-black text-3xl text-slate-900 dark:text-white leading-tight">
            Nutrition Dashboard
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium">
            Track your calories, macronutrients, and hydration levels throughout the day.
          </p>
        </div>
        <div className="flex items-center space-x-2 bg-slate-100 dark:bg-slate-900 px-4 py-2.5 rounded-2xl border border-slate-250/20 w-fit">
          <Calendar className="h-5 w-5 text-slate-500" />
          <span className="text-sm font-bold text-slate-700 dark:text-slate-300">
            Today: {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}
          </span>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Calories Progress Card */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/60 dark:border-slate-800/80 shadow-sm p-6 flex flex-col justify-between space-y-6">
          <div className="space-y-2">
            <span className="block text-xs font-bold uppercase tracking-wider text-slate-400">Calories Summary</span>
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-rose-50 dark:bg-rose-950/20 text-rose-500 rounded-2xl">
                <Flame className="h-6 w-6" />
              </div>
              <div>
                <strong className="text-3xl font-black font-display text-slate-850 dark:text-white">
                  {totals.calories} <span className="text-sm font-semibold text-slate-500">/ {GOALS.calories} kcal</span>
                </strong>
              </div>
            </div>
          </div>

          {/* Simple Linear Progress for Calories */}
          <div className="space-y-2">
            <div className="h-4 w-full bg-slate-100 dark:bg-slate-950 border border-slate-200/50 dark:border-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-rose-500 to-orange-400 rounded-full transition-all duration-500"
                style={{ width: `${getPercentage(totals.calories, GOALS.calories)}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-xs font-bold text-slate-500 dark:text-slate-400">
              <span>{Math.round(getPercentage(totals.calories, GOALS.calories))}% Target</span>
              <span>{Math.max(0, GOALS.calories - totals.calories)} kcal remaining</span>
            </div>
          </div>

          {/* Streak indicator / Health goal badges */}
          <div className="p-4 bg-primary-50/50 dark:bg-primary-950/20 border border-primary-200/30 rounded-2xl flex items-center space-x-3">
            <Award className="h-5 w-5 text-primary-600 dark:text-primary-400 flex-shrink-0" />
            <p className="text-xs font-semibold text-primary-800 dark:text-primary-450 leading-relaxed">
              {totals.calories > GOALS.calories 
                ? "You've exceeded your daily calorie target. Try doing some active exercises!" 
                : "Good job! You are on track to stay within your calorie limit."}
            </p>
          </div>
        </div>

        {/* Macros Ring Charts Grid */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/60 dark:border-slate-800/80 shadow-sm p-6 space-y-6">
          <span className="block text-xs font-bold uppercase tracking-wider text-slate-400">Macronutrients Breakdown</span>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <ProgressRing
              radius={80}
              stroke={8}
              progress={getPercentage(totals.protein, GOALS.protein)}
              color="#10B981" // emerald
              title="Protein"
              subtitle={`${totals.protein}g / ${GOALS.protein}g`}
            />
            <ProgressRing
              radius={80}
              stroke={8}
              progress={getPercentage(totals.carbs, GOALS.carbs)}
              color="#F59E0B" // amber
              title="Carbs"
              subtitle={`${totals.carbs}g / ${GOALS.carbs}g`}
            />
            <ProgressRing
              radius={80}
              stroke={8}
              progress={getPercentage(totals.fat, GOALS.fat)}
              color="#EF4444" // red
              title="Fats"
              subtitle={`${totals.fat}g / ${GOALS.fat}g`}
            />
          </div>
        </div>
      </div>

      {/* Water Tracker & Food Log Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Water Tracker */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/60 dark:border-slate-800/80 shadow-sm p-6 space-y-6 flex flex-col justify-between">
          <div className="space-y-1">
            <span className="block text-xs font-bold uppercase tracking-wider text-slate-400">Hydration Logger</span>
            <h3 className="font-display font-bold text-xl text-slate-850 dark:text-white flex items-center gap-1.5">
              <Droplet className="h-5 w-5 text-blue-500 fill-blue-500" />
              <span>Water Tracker</span>
            </h3>
          </div>

          {/* Cup/Visual Hydration Progress */}
          <div className="relative flex items-center justify-center py-6">
            <div className="w-24 h-36 border-4 border-slate-300 dark:border-slate-700 rounded-b-2xl relative overflow-hidden bg-slate-50 dark:bg-slate-950 shadow-inner flex items-end">
              <div
                className="w-full bg-gradient-to-t from-blue-600 to-blue-400 transition-all duration-700"
                style={{ height: `${getPercentage(waterLog, GOALS.water)}%` }}
              ></div>
              <div className="absolute inset-0 flex items-center justify-center text-center">
                <span className="block text-lg font-black font-display text-slate-800 dark:text-white bg-white/70 dark:bg-slate-900/70 px-2 py-1 rounded-lg glass">
                  {waterLog} ml
                </span>
              </div>
            </div>
          </div>

          {/* Plus/Minus Log buttons */}
          <div className="space-y-3">
            <div className="flex justify-between items-center text-xs font-bold text-slate-500 dark:text-slate-400">
              <span>Goal: 2000 ml (8 glasses)</span>
              <span>{Math.round(getPercentage(waterLog, GOALS.water))}% Complete</span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => onUpdateWaterLog(-250)}
                disabled={waterLog <= 0}
                className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-850 dark:hover:bg-slate-800 text-slate-750 dark:text-slate-200 rounded-xl font-bold flex items-center justify-center gap-1 border border-slate-200/50 dark:border-slate-800 disabled:opacity-50 transition-all"
              >
                <Minus className="h-4 w-4" />
                <span>-250 ml</span>
              </button>
              <button
                onClick={() => onUpdateWaterLog(250)}
                className="flex-1 py-3 bg-blue-600 hover:bg-blue-750 text-white rounded-xl font-bold flex items-center justify-center gap-1 shadow-md shadow-blue-500/10 hover:scale-[1.01] transition-all"
              >
                <Plus className="h-4 w-4" />
                <span>+250 ml</span>
              </button>
            </div>
          </div>
        </div>

        {/* Daily Food Log Table */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/60 dark:border-slate-800/80 shadow-sm p-6 space-y-6">
          <span className="block text-xs font-bold uppercase tracking-wider text-slate-400">Meals Consumed Today</span>
          
          {todaysMeals.length > 0 ? (
            <div className="space-y-3">
              {todaysMeals.map((meal, index) => (
                <div
                  key={`${meal.date}-${meal.name}-${index}`}
                  className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/30 dark:border-slate-800/80 transition-all group"
                >
                  {editingMeal &&
                  editingMeal.name === meal.name &&
                  editingMeal.date === meal.date &&
                  editingMeal.calories === meal.calories ? (
                    <div className="flex-1 flex flex-col sm:flex-row gap-2 items-stretch sm:items-center">
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        maxLength={60}
                        className="flex-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm font-semibold text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="Meal name"
                      />
                      <input
                        type="number"
                        min="0"
                        value={editCalories}
                        onChange={(e) => setEditCalories(e.target.value)}
                        className="w-24 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm font-semibold text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="kcal"
                      />
                      <div className="flex gap-1.5">
                        <button
                          onClick={() => saveEdit(meal)}
                          className="p-2 text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 rounded-xl transition-all"
                          title="Save changes"
                        >
                          <Check className="h-4 w-4" />
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all"
                          title="Cancel"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                  <div className="space-y-1">
                    <span className="block font-bold text-sm text-slate-805 dark:text-white capitalize">{meal.name}</span>
                    <div className="flex flex-wrap items-center gap-2 text-[10px] uppercase font-bold text-slate-400">
                      <span className="text-rose-500">{meal.calories} kcal</span>
                      <span>&bull;</span>
                      <span>P: {meal.macros?.protein}g</span>
                      <span>&bull;</span>
                      <span>C: {meal.macros?.carbs}g</span>
                      <span>&bull;</span>
                      <span>F: {meal.macros?.fat}g</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                  <button
                    onClick={() => startEdit(meal)}
                    className="p-2 text-slate-400 hover:text-primary-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                    title="Edit Meal"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => onRemoveFoodLog(meal)}
                    className="p-2 text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                    title="Remove Meal"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                  </div>
                  </>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl space-y-4">
              <span className="block text-2xl">🍽️</span>
              <p className="text-xs text-slate-450 dark:text-slate-400 font-medium max-w-xs mx-auto">
                No food logged yet today. Cook a recipe from your available ingredients to log calories automatically!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

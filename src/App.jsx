import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Search from './pages/Search';
import Recipes from './pages/Recipes';
import Chat from './pages/Chat';
import Dashboard from './pages/Dashboard';
import Safety from './pages/Safety';
import Tips from './pages/Tips';
import Profile from './pages/Profile';
import Login from './pages/Login';
import VerifyEmail from './pages/VerifyEmail';

export default function App() {
  const location = useLocation();

  // Helper to enforce authentication & verification
  const renderProtected = (element) => {
    if (!user) return <Navigate to="/login" replace />;
    if (user.isVerified === false) return <Navigate to="/verify-email" replace />;
    return element;
  };

  // 0. User Authentication State
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('leftover_chef_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // 1. Search Criteria State
  const [searchState, setSearchState] = useState(() => {
    const savedDiet = localStorage.getItem('leftover_chef_diet') || 'None';
    const savedAllergies = JSON.parse(localStorage.getItem('leftover_chef_allergies')) || [];
    const savedCustomAllergies = JSON.parse(localStorage.getItem('leftover_chef_custom_allergies')) || [];
    const savedMaxCal = parseInt(localStorage.getItem('leftover_chef_max_cal')) || 800;
    const savedMaxTime = parseInt(localStorage.getItem('leftover_chef_max_time')) || 45;
    
    return {
      ingredients: [], // start empty
      allergies: savedAllergies,
      customAllergies: savedCustomAllergies, // free-text custom allergy exclusions
      diet: savedDiet,
      maxCalories: savedMaxCal,
      maxTime: savedMaxTime
    };
  });

  // 2. Favorites List
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('leftover_chef_favorites');
    return saved ? JSON.parse(saved) : [];
  });

  // 3. Nutrition Food Log
  const [foodLog, setFoodLog] = useState(() => {
    const saved = localStorage.getItem('leftover_chef_food_log');
    // Start empty — meals are logged when the user cooks a recipe
    return saved ? JSON.parse(saved) : [];
  });

  // 4. Hydration Water Log (ml)
  const [waterLog, setWaterLog] = useState(() => {
    const saved = localStorage.getItem('leftover_chef_water_log');
    // Start at 0 — water intake is recorded when the user logs a glass
    return saved ? parseInt(saved) : 0;
  });

  // Save changes to LocalStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem('leftover_chef_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('leftover_chef_user');
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('leftover_chef_favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('leftover_chef_food_log', JSON.stringify(foodLog));
  }, [foodLog]);

  useEffect(() => {
    localStorage.setItem('leftover_chef_water_log', waterLog.toString());
  }, [waterLog]);

  // Auth Handlers
  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  // Recipe & Log Handlers
  const handleToggleFavorite = (recipeId) => {
    setFavorites((prev) => 
      prev.includes(recipeId) ? prev.filter(id => id !== recipeId) : [...prev, recipeId]
    );
  };

  const handleAddFoodLog = (recipe) => {
    const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
    const newMeal = {
      name: recipe.name,
      calories: recipe.calories,
      macros: { ...recipe.macros },
      date: today
    };
    setFoodLog((prev) => {
      const exists = prev.some(
        (m) => m.name === newMeal.name && m.date === today
      );
      if (exists) return prev;
      return [newMeal, ...prev];
    });
  };

  const handleRemoveFoodLog = (meal) => {
    setFoodLog((prev) =>
      prev.filter(
        (m) => !(m.name === meal.name && m.date === meal.date && m.calories === meal.calories)
      )
    );
  };

  const handleUpdateFoodLog = (meal, updates) => {
    setFoodLog((prev) =>
      prev.map((m) =>
        m.name === meal.name && m.date === meal.date && m.calories === meal.calories
          ? { ...m, ...updates }
          : m
      )
    );
  };

  const handleUpdateWaterLog = (amount) => {
    setWaterLog((prev) => Math.min(2000, Math.max(0, prev + amount)));
  };

  return (
    <div className="flex flex-col h-dvh bg-slate-50 text-slate-800 dark:bg-slate-950 dark:text-slate-100 transition-colors duration-300 overflow-hidden">
      <Navbar user={user} onLogout={handleLogout} />
      
      {/* Route Router Container — single scroll container for all pages */}
      <main className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden w-full max-w-full">
        <div key={location.pathname} className="animate-page-scale-fade h-full flex flex-col w-full max-w-full">
          <Routes location={location}>
            <Route path="/" element={<Home user={user} />} />
            <Route 
              path="/search" 
              element={
                renderProtected(
                  <Search 
                    searchState={searchState} 
                    setSearchState={setSearchState} 
                  />
                )
              } 
            />
            <Route 
              path="/recipes" 
              element={
                renderProtected(
                  <Recipes 
                    searchState={searchState} 
                    favorites={favorites} 
                    onToggleFavorite={handleToggleFavorite} 
                    onAddFoodLog={handleAddFoodLog}
                  />
                )
              } 
            />
            <Route 
              path="/chat" 
              element={renderProtected(<Chat />)} 
            />
            <Route 
              path="/dashboard" 
              element={
                renderProtected(
                  <Dashboard
                    foodLog={foodLog}
                    onRemoveFoodLog={handleRemoveFoodLog}
                    onUpdateFoodLog={handleUpdateFoodLog}
                    waterLog={waterLog}
                    onUpdateWaterLog={handleUpdateWaterLog}
                  />
                )
              } 
            />
            <Route path="/safety" element={<Safety />} />
            <Route path="/tips" element={<Tips />} />
            <Route 
              path="/profile" 
              element={
                renderProtected(
                  <Profile 
                    user={user}
                    onLogout={handleLogout}
                    searchState={searchState} 
                    setSearchState={setSearchState} 
                    favorites={favorites} 
                    onToggleFavorite={handleToggleFavorite} 
                  />
                )
              } 
            />
            <Route path="/verify-email" element={<VerifyEmail user={user} onLogin={handleLogin} />} />
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

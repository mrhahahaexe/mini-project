const BASE = 'https://www.themealdb.com/api/json/v1/1';

import { recipesDb } from '../data/recipesDb';

// Allergy keyword maps for predefined allergy IDs
const ALLERGY_KEYWORDS = {
  nuts:    ['nut', 'peanut', 'almond', 'cashew', 'walnut', 'pecan', 'pistachio', 'hazelnut', 'macadamia', 'pine nut'],
  milk:    ['milk', 'cream', 'cheese', 'butter', 'yogurt', 'yoghurt', 'dairy', 'ghee', 'whey', 'lactose'],
  eggs:    ['egg'],
  gluten:  ['wheat', 'flour', 'bread', 'pasta', 'gluten', 'barley', 'rye', 'semolina', 'couscous', 'noodle'],
  seafood: ['fish', 'shrimp', 'prawn', 'crab', 'lobster', 'salmon', 'tuna', 'cod', 'seafood', 'anchovy', 'squid', 'mussel', 'clam', 'oyster', 'scallop'],
  soy:     ['soy', 'tofu', 'tempeh', 'miso', 'edamame', 'soya'],
};

// Diet category mappings from TheMealDB categories
const DIET_CATEGORY_MAP = {
  Vegetarian: ['Vegetarian'],
  Vegan:      ['Vegetarian', 'Vegan'],
};

/**
 * Get a list of meals that use a specific ingredient.
 * Returns array of { idMeal, strMeal, strMealThumb }
 */
async function getMealIdsByIngredient(ingredient) {
  try {
    const res = await fetch(`${BASE}/filter.php?i=${encodeURIComponent(ingredient)}`);
    if (!res.ok) return [];
    const data = await res.json();
    return data.meals || [];
  } catch {
    return [];
  }
}

/**
 * Fetch full meal details by ID.
 * Returns the raw TheMealDB meal object or null.
 */
async function getMealById(id) {
  try {
    const res = await fetch(`${BASE}/lookup.php?i=${id}`);
    if (!res.ok) return null;
    const data = await res.json();
    return data.meals?.[0] || null;
  } catch {
    return null;
  }
}/**
 * Transform a raw TheMealDB meal object into the app's internal recipe shape.
 */
export function transformMeal(meal) {
  // Extract ingredients & measures (TheMealDB stores up to 20 as strIngredient1..20)
  const ingredients = [];
  for (let i = 1; i <= 20; i++) {
    const name = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];
    if (name && name.trim()) {
      ingredients.push({
        name: name.toLowerCase().trim(),
        quantity: measure?.trim() || '',
      });
    }
  }

  // Parse instructions into steps (split on newlines and numbered steps)
  const rawInstructions = meal.strInstructions || '';
  const steps = rawInstructions
    .split(/\r?\n/)
    .map(s => s.replace(/^\s*\d+[.)]\s*/, '').trim())
    .filter(s => s.length > 10)
    .slice(0, 15);

  const category = meal.strCategory || '';
  const area = meal.strArea || '';

  // Build diet tags from category
  const diet = [];
  if (category === 'Vegetarian') diet.push('Vegetarian');
  if (category === 'Vegan') diet.push('Vegan');
  if (category) diet.push(category);
  if (area) diet.push(area);

  return {
    id: meal.idMeal,
    name: meal.strMeal,
    image: meal.strMealThumb,
    prepTime: null,      // TheMealDB doesn't provide prep time
    calories: null,      // TheMealDB doesn't provide calorie data
    difficulty: 'Intermediate',
    macros: null,
    diet: [...new Set(diet)],
    allergies: [],       // will be evaluated dynamically from ingredient names
    ingredients,
    substitutions: {},
    instructions: steps,
    youtube: meal.strYoutube || null,
    category,
    area,
  };
}

/**
 * Check if a recipe's ingredients contain any of the user's selected/custom allergies.
 */
function hasAllergyConflict(recipe, selectedAllergyIds, customAllergies) {
  const ingNames = recipe.ingredients.map(i => i.name);

  // Check predefined allergy IDs against ingredient keyword maps
  for (const allergyId of selectedAllergyIds) {
    const keywords = ALLERGY_KEYWORDS[allergyId] || [];
    if (keywords.some(kw => ingNames.some(ing => ing.includes(kw)))) return true;
  }

  // Check custom free-text allergies against ingredient names
  for (const customTag of customAllergies) {
    if (ingNames.some(ing => ing.includes(customTag) || customTag.includes(ing))) return true;
  }

  return false;
}

/**
 * Check if a recipe matches the selected diet preference.
 */
function matchesDiet(recipe, diet) {
  if (!diet || diet === 'None') return true;
  const cats = DIET_CATEGORY_MAP[diet];
  if (cats) return cats.some(c => recipe.category === c);
  // For other diets (Keto, Low Carb, etc.) TheMealDB has no tag — skip filter
  return true;
}

/**
 * Main function: given user's pantry ingredients + filters, return scored & filtered recipes.
 *
 * Strategy:
 *  1. For each ingredient, fetch the list of meal IDs from TheMealDB.
 *  2. Score each meal by how many ingredient searches it appears in.
 *  3. Take the top candidates, fetch their full details in parallel.
 *  4. Apply allergy & diet filters.
 *  5. Return sorted by score descending.
 */
export async function fetchRecipesByIngredients({
  ingredients,
  allergies = [],
  customAllergies = [],
  diet = 'None',
  maxCalories = null,
  maxTime = null,
  maxResults = 12,
}) {
  if (!ingredients || ingredients.length === 0) return { recipes: [], networkError: false };

  // Step 1: Prepare search terms – include each full ingredient and each word within it (up to a safe limit)
  const rawTerms = ingredients.slice(0, 5);
  const searchTerms = [];
  rawTerms.forEach(term => {
    // Add the whole term
    searchTerms.push(term);
    // Also add each word token (lowercased) to catch partial matches
    term.split(/\s+/).forEach(word => {
      if (word && !searchTerms.includes(word)) {
        searchTerms.push(word);
      }
    });
  });

  // Remove duplicates
  const uniqueTerms = Array.from(new Set(searchTerms));

  // Detect total network failure early so the UI can show a real connection error
  let results;
  try {
    // Fetch meal ID lists for each term in parallel
    results = await Promise.all(uniqueTerms.map(ing => getMealIdsByIngredient(ing)));
  } catch {
    return { recipes: [], networkError: true };
  }

  // Score meals by occurrence count across ingredient searches
  const mealScoreMap = new Map(); // idMeal -> { count, strMeal, strMealThumb }
  results.forEach((meals) => {
    meals.forEach(meal => {
      if (!mealScoreMap.has(meal.idMeal)) {
        mealScoreMap.set(meal.idMeal, { count: 0, thumb: meal.strMealThumb, name: meal.strMeal });
      }
      mealScoreMap.get(meal.idMeal).count += 1;
    });
  });

  if (mealScoreMap.size === 0) return { recipes: [], networkError: false };

  // Step 3: Sort by count descending, take top candidates for full detail fetch
  const topCandidates = [...mealScoreMap.entries()]
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, maxResults * 2) // fetch more than needed to account for filtered-out items
    .map(([id]) => id);

  // Step 4: Fetch full details in parallel
  let fullMeals;
  try {
    fullMeals = await Promise.all(topCandidates.map(id => getMealById(id)));
  } catch {
    return { recipes: [], networkError: true };
  }

  // Filter helper shared by live + fallback recipes
  const applyFilters = (recipe) => {
    if (recipe.matchCount <= 0) return false;                       // must share ≥1 ingredient
    if (hasAllergyConflict(recipe, allergies, customAllergies)) return false;
    if (!matchesDiet(recipe, diet)) return false;
    if (maxCalories != null && recipe.calories != null && recipe.calories > maxCalories) return false;
    if (maxTime != null && recipe.prepTime != null && recipe.prepTime > maxTime) return false;
    return true;
  };

  // Step 5: Transform, score properly, filter, and sort
  const scored = fullMeals
    .filter(Boolean)
    .map(meal => {
      const recipe = transformMeal(meal);
      const recipeIngNames = recipe.ingredients.map(i => i.name);

      // Calculate how many of the user's ingredients appear in this recipe
      let matchCount = 0;
      recipeIngNames.forEach(rIng => {
        const matched = ingredients.some(uIng => rIng.includes(uIng) || uIng.includes(rIng));
        if (matched) matchCount++;
      });

      const totalIngs = recipe.ingredients.length;
      const matchScore = totalIngs > 0 ? Math.round((matchCount / totalIngs) * 100) : 0;
      const missingCount = totalIngs - matchCount;

      return { ...recipe, matchScore, matchCount, missingCount };
    })
    .filter(applyFilters)
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, maxResults);

  // After computing scored results, add fallback if empty using local static DB
  if (scored.length === 0 && typeof recipesDb !== 'undefined' && recipesDb.length) {
    const fallback = recipesDb
      .map(recipe => {
        const recipeIngNames = recipe.ingredients.map(i => i.name.toLowerCase());
        let matchCount = 0;
        recipeIngNames.forEach(rIng => {
          const matched = ingredients.some(uIng => rIng.includes(uIng) || uIng.includes(rIng));
          if (matched) matchCount++;
        });
        const totalIngs = recipe.ingredients.length;
        const matchScore = totalIngs > 0 ? Math.round((matchCount / totalIngs) * 100) : 0;
        const missingCount = totalIngs - matchCount;
        return { ...recipe, matchScore, matchCount, missingCount };
      })
      .filter(applyFilters)
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, maxResults);
    return { recipes: fallback, networkError: false };
  }

  return { recipes: scored, networkError: false };
}

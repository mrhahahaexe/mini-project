import React, { useState, useEffect, useRef } from 'react';
import { ChefHat, Send, User, Trash, Paperclip, PanelLeft, Plus, Pencil, Check, X, FileText } from 'lucide-react';
import { askChefAI, scanIngredientsFromPhoto, extractTextFromFile } from '../api/groqClient';

const SUGGESTED_PROMPTS = [
  "What can I cook with chicken and rice?",
  "How do I substitute eggs in baking?",
  "Is my food safe to eat after 3 days?",
  "How do I know if meat has gone bad?",
  "What's a good vegetarian protein source?",
  "How do I make rice less sticky?",
  "Can I freeze cooked pasta?",
  "How long can I store leftovers?"
];

// ─── Knowledge Base ────────────────────────────────────────────────────────────
// Each entry has: keywords (array), response (string)
const KNOWLEDGE_BASE = [
  {
    keywords: ["substitute", "replace", "instead of", "without", "egg", "eggs"],
    response: `**Egg Substitutes** (per 1 egg):\n\n🍌 **Mashed Banana** (1/4 cup) — Great for pancakes, muffins, and sweet baked goods. Adds natural sweetness.\n\n🍎 **Applesauce** (1/4 cup) — Neutral flavour, keeps baked goods moist. Best for cakes and bread.\n\n🌱 **Flax Egg** — Mix 1 tbsp ground flaxseeds + 3 tbsp water, let sit 5 mins until gel-like. Excellent binder for cookies and burgers.\n\n🥛 **Yoghurt / Buttermilk** (1/4 cup) — Adds moisture and slight tang. Works great in pancakes and muffins.\n\n💧 **Aquafaba** (3 tbsp) — The liquid from canned chickpeas. Can be *whipped* like egg whites for meringues.`
  },
  {
    keywords: ["substitute", "replace", "instead of", "without", "butter"],
    response: `**Butter Substitutes:**\n\n🫒 **Olive Oil** — Use 3/4 of the amount of butter. Best for savoury cooking and some baked goods.\n\n🥥 **Coconut Oil** — 1:1 swap. Great for baking; adds slight coconut flavour.\n\n🥑 **Mashed Avocado** — 1:1 swap for baking. Adds healthy fats, reduces calories significantly.\n\n🍌 **Mashed Banana** — Works well in muffins and quick breads (adds sweetness).\n\n🥛 **Greek Yoghurt** — Use 3/4 cup per cup of butter for baked goods. Reduces fat and adds protein.`
  },
  {
    keywords: ["substitute", "replace", "instead of", "without", "milk", "cream", "dairy"],
    response: `**Milk & Cream Substitutes:**\n\n🥥 **Coconut Milk** (full-fat) — Best all-round dairy-free swap. Rich and creamy for sauces, soups, and curries.\n\n🌰 **Oat Milk** — Mild flavour, great for cooking and baking. Slightly sweet.\n\n🥛 **Almond Milk** — Good for lighter dishes. Not ideal for heavy cream sauce (too thin).\n\n🫙 **Heavy Cream Hack** — Melt 1/3 cup butter into 2/3 cup whole milk and whisk. Excellent 1:1 heavy cream substitute for cooking (doesn't whip).`
  },
  {
    keywords: ["rice", "sticky", "mushy", "fluffy", "cook rice", "perfect rice"],
    response: `**How to Cook Perfect, Non-Sticky Rice:**\n\n1. **Rinse first** — Wash rice in cold water 2-3 times until water runs clear. This removes surface starch (the main cause of stickiness).\n\n2. **Ratio matters** — Use 1 cup rice : 1.75 cups water for long-grain white rice.\n\n3. **Don't lift the lid** — Once simmering, reduce heat to lowest, cover, and cook for 18 minutes without peeking.\n\n4. **Steam after** — Remove from heat, keep lid on, and rest for 5 minutes. The steam finishes cooking the top layer.\n\n5. **Fluff with a fork**, not a spoon — this separates grains without breaking them.\n\n💡 *Tip: Day-old refrigerated rice is the best for fried rice — it's drier and won't clump.*`
  },
  {
    keywords: ["leftovers", "leftover", "how long", "store", "keep", "fridge", "refrigerator", "days"],
    response: `**Leftover Storage Guide:**\n\n| Food | Fridge | Freezer |\n|---|---|---|\n| Cooked rice / pasta | 3–4 days | 2 months |\n| Cooked chicken / meat | 3–4 days | 4 months |\n| Soups & stews | 3–4 days | 3 months |\n| Cooked vegetables | 3–5 days | 1 month |\n| Pizza | 3–4 days | 2 months |\n\n⚠️ **Golden Rules:**\n- Refrigerate within **2 hours** of cooking (1 hour in hot weather)\n- Always reheat to **165°F / 74°C** (steaming hot throughout)\n- When in doubt, **throw it out** — food poisoning is not worth the risk.`
  },
  {
    keywords: ["rice", "leftover rice", "how long", "safe", "cooked rice"],
    response: `**Leftover Cooked Rice Safety:**\n\nCooked rice is safe for **3–4 days in the fridge** when stored properly.\n\n⚠️ **Important Warning:** Rice contains *Bacillus cereus* spores that survive cooking. At room temperature, these spores multiply and produce toxins that **reheating cannot destroy**.\n\n✅ **Safe Practices:**\n- Cool rice quickly (spread it on a tray) and refrigerate within 1 hour\n- Store in an airtight container\n- Reheat only **once** until steaming hot all the way through\n- Never leave cooked rice at room temperature for more than 2 hours`
  },
  {
    keywords: ["bad", "spoiled", "gone off", "rotten", "expired", "smell", "gone bad", "safe to eat"],
    response: `**Signs Food Has Gone Bad:**\n\n🥩 **Meat/Chicken** — Sour or ammonia smell, slimy texture, grey/greenish colour → **Throw out immediately**\n\n🥛 **Milk/Dairy** — Sour smell, lumpy texture, separation → **Discard**\n\n🍞 **Bread** — Visible mould (any colour) → **Discard the whole loaf** (mould spreads invisibly through soft foods)\n\n🥬 **Vegetables** — Sliminess, foul smell, brown mushy spots → Remove bad areas if minimal, otherwise discard\n\n🥫 **Canned goods** — Bulging lid, rust, fizzing/spurting when opened → **Danger of Botulism — discard without tasting**\n\n💡 **Golden Rule:** When in doubt, throw it out. Food poisoning can be serious.`
  },
  {
    keywords: ["meat", "gone bad", "smells", "bad smell", "off", "check", "tell"],
    response: `**How to Tell if Meat Has Gone Bad:**\n\n👃 **Smell** — Fresh meat has a faint, neutral odour. Bad meat smells sour, ammonia-like, or rotten. This is the most reliable test.\n\n👀 **Colour** — Beef turns brown with age (normal), but grey or green tint is bad. Chicken should be pink — greyish or green means spoilage.\n\n🤚 **Texture** — Slimy or tacky coating on the surface = spoilage bacteria. Fresh meat feels moist but not slimy.\n\n📅 **Date** — Trust the use-by date, but always also smell before cooking.\n\n⚠️ **Never taste-test raw meat to check if it's safe.**`
  },
  {
    keywords: ["chicken", "rice", "tomato", "cook", "recipe", "what can i make", "what can i cook"],
    response: `**Recipes You Can Make With Chicken, Rice & Tomato:**\n\n🍚 **Jollof Rice** — Fry onions and garlic, add blended tomatoes, simmer into a sauce, then cook rice in the sauce with chicken broth and seasoned chicken. A West African classic!\n\n🍛 **Chicken Tomato Stew with Rice** — Brown chicken pieces, sauté onions and garlic, add chopped tomatoes, broth, and simmer 25 mins. Serve over plain rice.\n\n🥘 **Simple Chicken Rice Soup** — Shred cooked chicken, simmer in broth with diced tomatoes, carrots, and cooked rice. Season with thyme and bay leaf.\n\nHead to the **Find Recipes** page and enter your ingredients for match scores and full step-by-step instructions!`
  },
  {
    keywords: ["vegetarian", "vegan", "protein", "no meat", "plant-based", "plant based"],
    response: `**High-Protein Vegetarian & Vegan Sources:**\n\n💪 **Legumes:**\n- Lentils: 18g protein per cooked cup\n- Chickpeas: 15g per cooked cup\n- Black beans: 15g per cooked cup\n\n🥚 **Eggs** (vegetarian) — 6g per egg, complete protein\n\n🧀 **Greek Yoghurt** (vegetarian) — 17-20g per cup\n\n🌱 **Tofu** — 10g per 100g. Press and marinate before cooking for best flavour.\n\n🫘 **Tempeh** — 19g per 100g. Fermented soy, great sliced and pan-fried.\n\n🌾 **Quinoa** — 8g per cooked cup. A complete protein grain — rare for plant sources.\n\n💡 *Combining rice + beans or bread + peanut butter provides all essential amino acids.*`
  },
  {
    keywords: ["freeze", "frozen", "can i freeze", "pasta", "cooked pasta"],
    response: `**Can You Freeze Cooked Pasta?**\n\nYes! Cooked pasta freezes well with a few tips:\n\n✅ **How to freeze it:**\n1. Cook pasta slightly *al dente* (undercook by 1-2 mins) — it softens during reheating\n2. Toss with a tiny bit of olive oil to prevent clumping\n3. Spread on a baking sheet to flash-freeze for 1 hour, then transfer to a zip-lock bag\n4. Label with the date — good for **2 months**\n\n🔄 **To reheat:**\n- Drop frozen pasta directly into boiling water for 30-60 seconds, OR\n- Microwave with a splash of water, covered, for 1-2 minutes\n\n⚠️ Cream-based pasta sauces can separate when frozen. Tomato and oil-based sauces freeze much better.`
  },
  {
    keywords: ["danger zone", "temperature", "bacteria", "food safety", "safe temperature"],
    response: `**The Food Safety Danger Zone:**\n\nThe temperature danger zone is **40°F – 140°F (4°C – 60°C)**.\n\nBacteria double every 20 minutes in this range!\n\n🔴 **Key Rules:**\n- Never leave cooked food out for more than **2 hours** (1 hour if room temp > 90°F/32°C)\n- Refrigerators should be set to **40°F / 4°C** or below\n- Hot food should be kept at **140°F / 60°C** or above\n- Reheat all leftovers to a minimum of **165°F / 74°C**\n- Use a food thermometer — colour alone is not a reliable safety indicator\n\n🧊 The "2-hour rule" is the most important one to remember.`
  },
  {
    keywords: ["avocado", "ripe", "ripen", "brown", "overripe"],
    response: `**Avocado Ripeness Guide:**\n\n🟢 **Hard & Unripe** — Dark green skin, very firm. Will ripen in 3-5 days at room temperature.\n\n🟡 **Ripening** — Yields slightly to pressure. Ready in 1-2 days.\n\n✅ **Perfectly Ripe** — Dark skin, gives gently under thumb pressure. Use within 1-2 days.\n\n⚠️ **Overripe** — Very soft, stringy brown flesh with off smell. Best mashed or discarded.\n\n**Speed up ripening:** Place unripe avocado in a paper bag with a banana. Bananas release ethylene gas which accelerates ripening.\n\n**Prevent browning after cutting:** Squeeze lemon or lime juice over the flesh and store cut side down in an airtight container. Best used within 1-2 days.`
  },
  {
    keywords: ["banana", "overripe", "brown banana", "ripe banana", "use up"],
    response: `**What to Do With Overripe Brown Bananas:**\n\nDon't throw them away — brown bananas are *sweeter* and perfect for:\n\n🥞 **Banana Pancakes** — Mash 2 bananas + 2 eggs + 1/2 cup oats. Fry like normal pancakes. No flour needed!\n\n🍞 **Banana Bread/Muffins** — The classic. Mash 3 bananas + mix into your batter.\n\n🧋 **Smoothies** — Peel, slice, and freeze in chunks. Blends into a creamy smoothie base.\n\n🍚 **Oatmeal sweetener** — Mash directly into hot oatmeal instead of adding sugar.\n\n🍦 **"Nice Cream"** — Blend frozen banana chunks alone until creamy. Tastes like ice cream, no dairy needed!`
  },
  {
    keywords: ["onion", "eyes", "cry", "crying", "cut onion", "without crying"],
    response: `**How to Cut Onions Without Crying:**\n\nOnions release syn-propanethial-S-oxide gas when cut, which irritates your eyes.\n\n🧅 **Tips That Work:**\n1. **Chill the onion first** — 30 minutes in the freezer before cutting slows gas release significantly\n2. **Sharp knife** — A dull knife crushes cells and releases more gas\n3. **Cut near ventilation** — Stand near an open window or under your kitchen fan\n4. **Cut the root last** — The root end contains the highest concentration of the irritant\n5. **Safety goggles** — Sounds silly, but works perfectly!\n\n❌ **Myths that don't work:** Bread in mouth, candle nearby.`
  },
  {
    keywords: ["garlic", "peel", "peeling", "fast", "quickly"],
    response: `**Fastest Ways to Peel Garlic:**\n\n🔪 **Knife Smash Method** — Place clove on cutting board, lay the flat side of a wide knife over it, press down firmly with your palm. The skin slips right off. Takes 2 seconds!\n\n🫙 **Jar Shake Method** — Put cloves in a mason jar, screw on lid, shake vigorously for 30 seconds. The skins separate from most cloves.\n\n🌊 **Soak Method** — Soak a whole head of garlic in warm water for 1 minute. The skins loosen easily.\n\n💡 *Pre-peeled garlic in jars is also fine for most recipes — just not for dishes where garlic is the star flavour.*`
  },
  {
    keywords: ["oil", "smoke", "smoking", "overheated", "burn", "burning"],
    response: `**Cooking Oils & Smoke Points:**\n\n| Oil | Smoke Point | Best For |\n|---|---|---|\n| Extra Virgin Olive Oil | 375°F (190°C) | Dressings, low-heat sautéing |\n| Vegetable/Canola Oil | 400°F (205°C) | Stir-frying, baking |\n| Coconut Oil | 350°F (177°C) | Medium heat sautéing |\n| Avocado Oil | 520°F (270°C) | High-heat searing |\n| Butter | 302°F (150°C) | Low-heat cooking, baking |\n| Ghee (clarified butter) | 450°F (232°C) | High-heat cooking |\n\n⚠️ When oil smokes, it's breaking down and producing harmful compounds. Use the right oil for your cooking temperature, or switch to a high-smoke-point oil for searing and frying.`
  },
  {
    keywords: ["pasta water", "starchy", "pasta water sauce", "why save", "save pasta water"],
    response: `**Why You Should Save Pasta Water:**\n\nPasta water is starchy, salty gold for sauces!\n\n**How it helps:**\n- The dissolved starch acts as an **emulsifier** — it binds fat (butter/oil) and water together into a silky, cohesive sauce\n- It **thins sauces** without diluting the flavour (unlike plain water)\n- It helps the sauce **cling to pasta** instead of pooling at the bottom of the bowl\n\n**How to use it:**\n1. Scoop out 1/2–1 cup of pasta water *before* draining\n2. Add 2–3 tablespoons at a time to your sauce while tossing the pasta\n3. Keep adding until the sauce reaches your desired consistency\n\nThis is the secret behind creamy restaurant-style pasta dishes like Carbonara and Cacio e Pepe.`
  },
  {
    keywords: ["salt", "over salted", "too salty", "fix", "too much salt"],
    response: `**How to Fix an Over-Salted Dish:**\n\n🥔 **Add a raw potato** — Peel and add a large potato to the dish, simmer 15 mins. The potato absorbs some salt. Remove before serving.\n\n💧 **Dilute it** — Add more unsalted liquid (water, unsalted stock, or cream) to soups and stews.\n\n🍋 **Add acid** — A squeeze of lemon juice or splash of vinegar can balance saltiness by distracting the palate.\n\n🍚 **Add bulk** — Add more unsalted ingredients: rice, potatoes, pasta, or vegetables to dilute the salt concentration.\n\n🥛 **Dairy** — A spoonful of cream, yoghurt, or coconut milk can mellow out saltiness in curries and soups.\n\n⚠️ There's no perfect fix — prevention is better. Always taste as you cook and add salt gradually.`
  },
  {
    keywords: ["hello", "hi", "hey", "help", "what can you do", "what do you know"],
    response: `Hello! I'm your **LeftOver Chef AI Assistant** 👨‍🍳\n\nI can help you with:\n\n🥘 **Recipe ideas** based on ingredients you have\n🔄 **Ingredient substitutions** (no eggs? no butter? I've got alternatives)\n🌡️ **Food safety questions** (storage times, safe temperatures, spoilage signs)\n🧂 **Cooking techniques** (how to fix over-salted food, perfect rice, etc.)\n🥗 **Nutrition tips** (vegetarian protein, healthy swaps)\n\nJust ask me anything — for example:\n- *"What can I make with chicken and tomatoes?"*\n- *"How do I substitute eggs in pancakes?"*\n- *"Is my cooked rice still safe after 4 days?"*`
  },
  {
    keywords: ["tea", "prepare", "make", "brew", "how to make tea", "steep"],
    response: `**How to Prepare Tea** (basic steps):

1. **Boil water** – Use fresh filtered water. For green tea, heat to ~175°F (80°C); for black tea, bring to a rolling boil (~212°F/100°C).
2. **Measure tea** – 1 tsp loose leaf tea (or 1 tea bag) per 8 oz cup. Adjust to taste.
3. **Steep** – Pour hot water over tea and steep:
   - Black tea: 3-5 min
   - Green tea: 2-3 min
   - Herbal/fruit teas: 5-7 min
4. **Remove leaves/bag** – Press gently to extract flavor, but avoid over-steeping which can cause bitterness.
5. **Serve** – Add milk, honey, lemon, or spices as desired. Enjoy!

💡 *Tip:* Pre-warm your teapot or cup to keep tea hotter longer.`,
  },
  {
    keywords: ["coffee", "brew", "make coffee", "espresso", "cappuccino", "latte"],
    response: `**Coffee Brewing Basics**:

- **Drip coffee** – Use 1 c ≈ 15 g coffee to 250 ml water, brew at 195-205°F (90-96°C).
- **French press** – 4 min steep, then press slowly.
- **Espresso** – 18-22 g coffee, 30 ml shot, 9-10 bar pressure, 92-96°C water.
- **Cold brew** – 1 : 8 coffee-to-water ratio, steep 12-24 h in fridge, filter, serve over ice.

💡 *Tip:* Freshly ground beans give the best flavor.`,
  },
  {
    keywords: ["health", "benefits", "nutrition", "diet", "weight loss", "immune", "vitamins", "minerals"],
    response: `**General Health & Nutrition Tips**:

- **Balanced plate** – Half vegetables, a quarter protein, a quarter whole grains.
- **Hydration** – Aim for 2-3 L water per day; herbal teas count.
- **Fiber** – 25-30 g daily from fruits, veggies, legumes, whole grains.
- **Protein** – 0.8-1 g per kg body weight; include legumes, meat, dairy, tofu.
- **Micronutrients** – Eat a rainbow of produce for vitamins A, C, K, and minerals.
- **Sleep & stress** – 7-9 h sleep and stress-management improve metabolism.

🩺 *Note:* For specific medical advice, consult a healthcare professional.`,
  },
   // New entry for cooking techniques
   {
     keywords: ["grill", "grilling", "roast", "roasting", "steam", "steaming", "sear", "searing", "sauté", "saute", "braise", "poach", "simmer", "bake", "broil", "stir-fry", "deep-fry", "fry"],
     response: `**Cooking Techniques Overview**:\n\n- **Grilling / Roasting** – High heat dry cooking. Preheat grill/pan, oil lightly, cook meat/veg until charred. Roast larger cuts in oven at 375‑425°F, turning occasionally.\n- **Steaming** – Gentle moist heat. Use a steamer basket over boiling water; vegetables retain nutrients and stay crisp.\n- **Searing** – Hot pan (240‑260°C), pat dry, add minimal oil, cook 1‑2 min per side for a crust; finish in oven if thick.\n- **Sauté / Saute** – Quick high‑heat cooking in a shallow pan with a little fat; toss ingredients continuously.\n- **Braising** – Brown then slow‑cook in liquid at low heat (275‑300°F) for tender results (e.g., short ribs, cabbage).\n- **Poaching** – Submerge in barely‑simmering liquid (water, broth, or stock) for delicate foods like eggs or fish.\n- **Simmer** – Gentle bubbles just below boiling; ideal for soups, sauces, and grains.\n- **Baking** – Oven dry heat, usually 350‑400°F; great for casseroles, breads, and pastries.\n- **Broiling** – Top‑heat element, high temperature; perfect for finishing, caramelizing, or crisping tops.\n- **Stir‑Fry** – High heat, thinly sliced ingredients tossed quickly in a wok with a splash of oil.\n- **Deep‑Fry** – Submerge food in hot oil (350‑375°F) for crunchy exterior. Ensure safe oil temperature and drain excess.\n\n💡 *Tip:* Match technique to food size and desired texture – thin cuts for quick sauté/stir‑fry, larger cuts for roasting or braising.`
   },
    // New entry for vitamins & minerals
    {
      keywords: ["vitamin", "vitamins", "mineral", "minerals", "supplement", "supplements", "dietary supplement"],
      response: `**Vitamins & Minerals Overview**:\n\n- **Vitamin A** – Supports vision, immune function, skin health. Sources: carrots, sweet potatoes, liver.\n- **Vitamin C** – Antioxidant, collagen synthesis, immune support. Sources: citrus, strawberries, bell peppers.\n- **Vitamin D** – Bone health, calcium absorption. Sources: sunlight, fortified milk, fatty fish.\n- **Calcium** – Bone and teeth strength. Sources: dairy, leafy greens, fortified plant milks.\n- **Iron** – Oxygen transport, energy. Sources: red meat, beans, lentils, spinach (enhance absorption with vitamin C).\n- **Omega-3 (EPA/DHA)** – Heart, brain health. Sources: fatty fish, flaxseed, walnuts.\n\n💡 *Tip:* Pair iron-rich plant foods with vitamin C to boost absorption.`
    },

    // New entry for food allergies & intolerances
    {
      keywords: ["allergy", "allergies", "intolerance", "gluten", "lactose", "nut allergy", "peanut", "shellfish"],
      response: `**Managing Food Allergies & Intolerances**:\n\n- **Identify** – Keep a symptom diary; get tested by an allergist if severe.\n- **Avoid** – Read labels for hidden sources (e.g., wheat flour in sauces, casein in processed foods).\n- **Cross‑contamination** – Use separate utensils and cookware; sanitize surfaces.\n- **Substitutes** – Use almond milk/soy milk for dairy, gluten‑free flour blends for wheat, seed‑butter for peanuts.\n- **Emergency** – Carry an epinephrine auto‑injector if prescribed; know how to use it.\n\n⚠️ Always consult a healthcare professional for personalized advice.`
    },

    // New entry for special diets (keto, paleo, vegan)
    {
      keywords: ["keto", "ketogenic", "paleo", "vegan", "vegetarian", "low carb", "low sugar", "diabetic", "diabetes"],
      response: `**Special Diet Guidance**:\n\n- **Keto** – Very low carb (<20 g net carbs/day), high fat, moderate protein. Emphasize fatty fish, avocados, nuts, non‑starchy veg.\n- **Paleo** – Focus on whole foods, lean meats, fish, fruits, veg, nuts; avoid grains, legumes, dairy, processed foods.\n- **Vegan/Vegetarian** – Ensure adequate B12 (supplement), iron, omega‑3, and complete proteins (combine legumes + grains).\n- **Low‑Carb/Low‑Sugar** – Swap refined carbs for fiber‑rich veggies, berries; use natural sweeteners sparingly.\n- **Diabetes** – Monitor carbohydrate intake, choose low‑glycemic index foods; pair carbs with protein/fat to blunt spikes.\n\n💡 *Tip:* Track macros with an app to stay within diet goals.`
    },
    // New entry for hydration
    {
      keywords: ["hydration", "water", "drink water", "dehydration", "dehydrated", "how much water", "fluids"],
      response: `**Hydration & Water Intake Guide**:\n\n💧 **Daily Target** – General guideline is 2–3 liters (approx. 8–12 cups) per day, but individual needs vary based on activity level and climate.\n🟢 **Benefits** – Regulates body temperature, lubricates joints, aids digestion, flushes toxins, and keeps skin healthy.\n🍋 **Tips to Drink More** – Keep a reusable water bottle handy, flavor water with lemon/cucumber/mint, or choose herbal teas.\n⚠️ **Dehydration Signs** – Dark urine, dry mouth, fatigue, headache, dizziness. Drink water steadily throughout the day rather than chugging all at once.`
    },

    // New entry for gut health
    {
      keywords: ["gut health", "digestion", "digestive", "bloat", "bloating", "probiotics", "prebiotics", "fermented"],
      response: `**Gut Health & Digestion Tips**:\n\n🦠 **Probiotics** – Introduce beneficial bacteria with fermented foods like yogurt, kefir, kimchi, sauerkraut, tempeh, and kombucha.\n🌾 **Prebiotics** – Feed good gut bacteria with high-fiber foods like garlic, onions, leeks, asparagus, bananas, oats, and apples.\n💧 **Fiber & Fluids** – Soluble and insoluble fiber are crucial for regular digestion. Always increase fiber intake gradually and drink plenty of water to prevent bloating.\n🧘 **Lifestyle** – Reduce stress, get 7–9 hours of sleep, and eat slowly. Digestion starts in the mouth, so chew your food thoroughly!`
    },

    // New entry for meal prep & batch cooking
    {
      keywords: ["meal prep", "batch cook", "meal planning", "prep tips", "planning", "weekly prep"],
      response: `**Meal Prep & Weekly Planning Guide**:\n\n📅 **Plan & Shop** – Pick one or two days a week to plan meals, check what ingredients you already have, and shop with a targeted list.\n🫙 **Storage Containers** – Invest in airtight glass or BPA-free plastic containers, mason jars, and reusable silicone bags to keep food fresh.\n🥦 **Smart Prep Techniques**:\n- Wash, chop, and store vegetables ahead of time.\n- Cook grains (rice, quinoa) and proteins (chicken, tofu) in large batches.\n- Portion meals individually for quick grab-and-go options.\n❄️ **Freeze Options** – Label and freeze portioned soups, stews, or pre-chopped ingredients for busy days.`
    },

    // New entry for healthy snacks & cravings
    {
      keywords: ["snack", "snacks", "healthy snack", "craving", "cravings", "junk food", "snacking"],
      response: `**Healthy Snacking & Managing Cravings**:\n\n🥜 **Nutrient-Dense Snacks**:\n- **Fruit & Nut Butter** – Apple slices with almond butter or banana with peanut butter.\n- **Greek Yogurt & Berries** – High protein and fiber to keep you full.\n- **Hummus & Veggie Sticks** – Carrots, cucumber, or bell peppers with hummus.\n- **Handful of Nuts/Seeds** – Almonds, walnuts, pumpkin seeds (watch portion sizes).\n🍬 **Cravings Hack**:\n- *Sweet craving?* Try sweet berries, a square of dark chocolate (>70%), or dates.\n- *Salty craving?* Go for lightly salted air-popped popcorn, roasted chickpeas, or seaweed snacks.\n💧 **Thirst vs. Hunger** – Mild dehydration often feels like hunger. Drink a glass of water and wait 10 minutes before snacking.`
    },

    // New entry for technical support & troubleshooting
    {
      keywords: ["crash", "crashed", "bug", "error", "slow", "loading", "stuck", "freeze", "frozen", "app problem"],
      response: `**App Troubleshooting & Support**:\n\n⚡ **Slow Loading / Stuck** – Try refreshing the browser tab. Since this app runs entirely in your browser using local storage, a simple reload solves most state delays.\n🐛 **Crashes / Errors** – Clear your browser cache or try private browsing mode. If the app state gets corrupted, you can reset it via the **Profile** page or clear the chat here.\n📥 **Save Data** – Ensure you have cookies/local storage enabled, as your recipes and logs are saved locally on your device.`
    },

    // New entry for camera & receipt scanning
    {
      keywords: ["camera", "scan", "photo", "upload", "receipt", "picture"],
      response: `**Ingredient Photo & Receipt Scanning**:\n\n📸 **How it works** – On the **Find Recipes** page, tap the **"Scan a Photo"** button.\n🖼️ **AI Vision** – Pick an image of your ingredients and our AI vision model identifies them, then automatically populates your ingredient chips.\n💡 *Tip:* You can manually add or remove chips after scanning if the AI misses any ingredients in your fridge.`
    },

    // New entry for recipe feedback / ratings
    {
      keywords: ["feedback", "report", "downvote", "terrible", "bad recipe", "wrong recipe", "dislike"],
      response: `**Recipe Feedback & Ratings**:\n\n👎 **Bad Recipe / Terribles** – You can remove saved recipes from your **Profile** page by clicking the heart icon.\n📝 **Submit Feedback** – We love to improve! Use the feedback form at the bottom of the **Profile** page to send suggestions directly to the chef team.\n🔄 **Regenerate** – If a recipe didn't turn out well, try altering your search parameters on the **Find Recipes** page to explore fresh culinary ideas.`
    },

    // New entry for accounts & sharing
    {
      keywords: ["password", "save recipe", "account", "login", "register", "share", "friend"],
      response: `**Accounts & Saving Recipes**:\n\n💾 **How to Save** – Open any recipe details modal and click **"Save to Favorites"** to store it. You can access it anytime on the **Profile** page.\n🔒 **No Password Required** – LeftOver Chef AI runs fully local. All data is saved on your device, meaning no sign-up or passwords are required to start cooking!`
    },

];

const DEFAULT_CHEF_RESPONSE = `Hello! I'm your **LeftOver Chef AI Assistant** 👨‍🍳\n\nAsk me anything about cooking techniques, ingredient substitutions, food safety, or recipe ideas based on what's in your pantry.\n\n*Try one of the suggested questions below to get started!*\n\n*(Powered by Groq AI — if the service is unavailable, I'll answer from my built-in knowledge base.)*`;

// ─── Matching Engine ────────────────────────────────────────────────────────────
function getBestResponse(query) {
  const lowerQuery = query.toLowerCase();

  // Score each knowledge base entry by how many keywords match
  let bestMatch = null;
  let bestScore = 0;

  for (const entry of KNOWLEDGE_BASE) {
    const score = entry.keywords.reduce((acc, keyword) => {
      return lowerQuery.includes(keyword.toLowerCase()) ? acc + 1 : acc;
    }, 0);

    if (score > bestScore) {
      bestScore = score;
      bestMatch = entry;
    }
  }

  // Only return a match if at least 1 keyword matched
  if (bestScore > 0 && bestMatch) {
    return bestMatch.response;
  }

  // Contextual fallback based on partial topic detection
  if (lowerQuery.includes("cook") || lowerQuery.includes("recipe") || lowerQuery.includes("make")) {
    return `Great cooking question! For recipes based on specific ingredients, head to the **Find Recipes** page and enter what you have — our recipe engine will match and score recipes for you.\n\nIf you're asking about a specific technique, try rephrasing with the ingredient name (e.g. *"how do I cook chicken"* or *"how to caramelise onions"*) and I'll do my best to help!`;
  }

  if (lowerQuery.includes("safe") || lowerQuery.includes("eat") || lowerQuery.includes("spoil") || lowerQuery.includes("bad")) {
    return `For food safety questions, the general rule is:\n\n✅ **2-Hour Rule** — Never leave cooked food out for more than 2 hours\n✅ **3–4 Days** — Most cooked leftovers are safe in the fridge for 3–4 days\n✅ **165°F / 74°C** — Always reheat leftovers to this temperature\n\nFor more detailed guidance, visit the **Food Safety** page in the navigation. If you have a more specific question, rephrase it with the food item and I'll give a detailed answer!`;
  }

  if (lowerQuery.includes("healthy") || lowerQuery.includes("diet") || lowerQuery.includes("nutrition") || lowerQuery.includes("weight")) {
    return `For healthy eating guidance, here are my top 3 tips:\n\n🥗 **Fill half your plate with vegetables** at every meal\n💪 **Get protein at every meal** — eggs, legumes, lean meat, or dairy\n💧 **Drink water, not calories** — cut sugary drinks and juices\n\nFor more structured tips, check the **Healthy Tips** page. Want specific advice on a particular food or diet type? Just ask!`;
  }

  // Truly unknown question fallback
  return `That's a great question! I'm best at answering questions about:\n\n- 🔄 Ingredient **substitutions** (e.g. "substitute for eggs")\n- 🌡️ **Food safety** and storage times\n- 🍳 **Cooking techniques** (e.g. "how to make rice fluffy")\n- 🥗 **Nutrition** and healthy eating\n- 🥘 **Recipe ideas** from ingredients you have\n\nCould you rephrase your question with a specific ingredient or topic? For example: *"Is chicken safe after 5 days?"* or *"How do I substitute butter?"*`;
}

export default function Chat() {
  // Sessions: [{ id, name, createdAt }]
  const [sessions, setSessions] = useState([]);
  // Active session id
  const [activeSessionId, setActiveSessionId] = useState(null);
  // Messages for the active session
  const [messages, setMessages] = useState([]);
  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  // Session manager drawer visibility
  const [isSessionDrawerOpen, setIsSessionDrawerOpen] = useState(false);
  // Rename state
  const [editingSessionId, setEditingSessionId] = useState(null);
  const [editingSessionName, setEditingSessionName] = useState('');
  // File upload state
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef(null);

  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  // Monotonic counter so a stale reply never overwrites a newer response
  const replySeqRef = useRef(0);
  const activeSessionIdRef = useRef(null);

  // Keep ref in sync so async handlers always read the current session
  useEffect(() => {
    activeSessionIdRef.current = activeSessionId;
  }, [activeSessionId]);

  // Load sessions on mount
  useEffect(() => {
    let loadedSessions = [];
    try {
      loadedSessions = JSON.parse(localStorage.getItem('chef_chat_sessions') || '[]');
    } catch { loadedSessions = []; }
    if (!Array.isArray(loadedSessions)) loadedSessions = [];

    // If none exist, create the first one
    if (loadedSessions.length === 0) {
      const first = { id: genId(), name: 'New Chat', createdAt: Date.now() };
      loadedSessions = [first];
      localStorage.setItem('chef_chat_sessions', JSON.stringify(loadedSessions));
    }
    setSessions(loadedSessions);

    const lastActive = localStorage.getItem('chef_chat_active_session');
    const target = loadedSessions.find((s) => s.id === lastActive) || loadedSessions[0];
    setActiveSessionId(target.id);
    loadSessionMessages(target.id);
  }, []);

  // Load messages for a given session
  const loadSessionMessages = (sessionId) => {
    const saved = localStorage.getItem(`chef_chat_messages_${sessionId}`);
    if (saved) {
      try {
        setMessages(JSON.parse(saved));
        return;
      } catch { /* fall through to init */ }
    }
    // Fresh session → default greeting
    const initialMsgs = [{
      sender: 'chef',
      text: DEFAULT_CHEF_RESPONSE,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }];
    setMessages(initialMsgs);
    localStorage.setItem(`chef_chat_messages_${sessionId}`, JSON.stringify(initialMsgs));
  };

  // Save messages for the active session
  const saveSessionMessages = (msgs) => {
    const sid = activeSessionIdRef.current;
    if (!sid) return;
    localStorage.setItem(`chef_chat_messages_${sid}`, JSON.stringify(msgs));
  };

  // Persist sessions list
  const persistSessions = (nextSessions) => {
    setSessions(nextSessions);
    localStorage.setItem('chef_chat_sessions', JSON.stringify(nextSessions));
  };

  useEffect(() => {
    // Scroll the messages container to the bottom without scrolling the whole page
    const container = messagesContainerRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, [messages, isTyping]);

  function genId() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  }

  // ─── Session actions ──────────────────────────────────────────────────────────
  const handleNewSession = () => {
    const session = { id: genId(), name: 'New Chat', createdAt: Date.now() };
    const next = [session, ...sessions];
    persistSessions(next);
    setActiveSessionId(session.id);
    localStorage.setItem('chef_chat_active_session', session.id);
    loadSessionMessages(session.id);
    setIsSessionDrawerOpen(false);
  };

  const handleSelectSession = (sessionId) => {
    setActiveSessionId(sessionId);
    localStorage.setItem('chef_chat_active_session', sessionId);
    loadSessionMessages(sessionId);
    setIsSessionDrawerOpen(false);
  };

  const handleRenameSession = (sessionId) => {
    const name = editingSessionName.trim();
    if (!name) return;
    persistSessions(
      sessions.map((s) => (s.id === sessionId ? { ...s, name } : s))
    );
    setEditingSessionId(null);
    setEditingSessionName('');
  };

  const handleDeleteSession = (sessionId) => {
    const remaining = sessions.filter((s) => s.id !== sessionId);
    // Clean up messages
    localStorage.removeItem(`chef_chat_messages_${sessionId}`);

    if (remaining.length === 0) {
      // Create a fresh session so there's always one
      const fresh = { id: genId(), name: 'New Chat', createdAt: Date.now() };
      remaining.push(fresh);
      persistSessions(remaining);
      setActiveSessionId(fresh.id);
      localStorage.setItem('chef_chat_active_session', fresh.id);
      loadSessionMessages(fresh.id);
    } else {
      persistSessions(remaining);
      if (activeSessionIdRef.current === sessionId) {
        const next = remaining[0];
        setActiveSessionId(next.id);
        localStorage.setItem('chef_chat_active_session', next.id);
        loadSessionMessages(next.id);
      }
    }
    setIsSessionDrawerOpen(false);
  };

  // ─── File upload ──────────────────────────────────────────────────────────────
  const handleFileSelected = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = ''; // allow re-selecting the same file
    if (!file) return;

    setIsUploading(true);
    setUploadError('');
    try {
      const isImage = file.type.startsWith('image/');
      let attachmentText = '';

      if (isImage) {
        // Read as data URL and use vision to detect ingredients
        const dataUrl = await readFileAsDataURL(file);
        const ingredients = await scanIngredientsFromPhoto(dataUrl);
        attachmentText = ingredients.length
          ? `[Uploaded image: ${file.name}] Detected ingredients: ${ingredients.join(', ')}`
          : `[Uploaded image: ${file.name}] No ingredients detected.`;
      } else {
        // PDF / text file → extract text
        const extracted = await extractTextFromFile(file);
        attachmentText = extracted
          ? `[Uploaded file: ${file.name}]\nContent:\n${extracted.slice(0, 6000)}`
          : `[Uploaded file: ${file.name}] No readable text found.`;
      }

      // Add a user message with the attachment summary
      const userTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const userMsg = { sender: 'user', text: attachmentText, time: userTime, attachment: true };
      const updated = [...messages, userMsg];
      setMessages(updated);
      saveSessionMessages(updated);
    } catch (err) {
      setUploadError(err.message || 'Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const readFileAsDataURL = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(new Error('Could not read the image.'));
      reader.readAsDataURL(file);
    });

  // ─── Chat logic ───────────────────────────────────────────────────────────────
  const handleSendMessage = async (text) => {
    if (!text.trim() || isTyping) return;

    const userTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg = { sender: 'user', text, time: userTime };
    const updatedMsgs = [...messages, userMsg];
    setMessages(updatedMsgs);
    saveSessionMessages(updatedMsgs);
    setInputVal('');
    setIsTyping(true);

    const seq = ++replySeqRef.current;
    const sessionAtSend = activeSessionIdRef.current;

    let chefText;
    try {
      const history = updatedMsgs
        .filter((m) => m.sender !== 'chef' || m.text !== DEFAULT_CHEF_RESPONSE)
        .slice(-12)
        .map((m) => ({ role: m.sender === 'user' ? 'user' : 'assistant', content: m.text }));
      chefText = await askChefAI(text, history);
    } catch {
      // Offline / no key: fall back to the local knowledge base so the chat still works
      chefText = getBestResponse(text);
    }

    // If another send happened, or the session changed, abandon this reply
    if (seq !== replySeqRef.current) return;
    if (sessionAtSend !== activeSessionIdRef.current) return;

    const chefTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const chefMsg = { sender: 'chef', text: chefText, time: chefTime };
    setMessages((prev) => {
      const finalMsgs = [...prev, chefMsg];
      saveSessionMessages(finalMsgs);
      return finalMsgs;
    });
    setIsTyping(false);
  };

  const handleClearChat = () => {
    if (window.confirm('Clear this chat session?')) {
      const sid = activeSessionIdRef.current;
      if (sid) {
        const initialMsgs = [{
          sender: 'chef',
          text: DEFAULT_CHEF_RESPONSE,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }];
        setMessages(initialMsgs);
        localStorage.setItem(`chef_chat_messages_${sid}`, JSON.stringify(initialMsgs));
      }
    }
  };

  // Render markdown-like bold text and newlines
  const renderText = (text) => {
    return text.split('\n').map((line, i) => {
      const parts = line.split(/(\*\*[^*]+\*\*)/g);
      return (
        <p key={i} className={i > 0 ? 'mt-1.5' : ''}>
          {parts.map((part, j) =>
            part.startsWith('**') && part.endsWith('**')
              ? <strong key={j}>{part.slice(2, -2)}</strong>
              : part
          )}
        </p>
      );
    });
  };

  const currentSessionName = sessions.find((s) => s.id === activeSessionId)?.name || 'Chat';

  return (
    <div className="h-full w-full flex flex-col">

      {/* Header */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/60 backdrop-blur-sm">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsSessionDrawerOpen(true)}
            className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
            title="Manage chat sessions"
          >
            <PanelLeft className="h-5 w-5" />
          </button>
          <div className="p-2 bg-gradient-to-tr from-primary-600 to-emerald-500 rounded-xl text-white shadow-sm">
            <ChefHat className="h-5 w-5" />
          </div>
          <div>
            <h1 className="font-display font-bold text-base text-slate-900 dark:text-white leading-tight">Chef AI</h1>
            <span className="block text-[11px] font-semibold text-slate-400 truncate max-w-[160px] sm:max-w-[240px]">{currentSessionName}</span>
          </div>
        </div>
        <button
          onClick={handleClearChat}
          className="p-2 text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all"
          title="Clear chat"
        >
          <Trash className="h-4.5 w-4.5" />
        </button>
      </div>

      {/* Messages */}
      <div ref={messagesContainerRef} className="flex-1 overflow-y-auto px-4 sm:px-6 py-5 space-y-4">
        {messages.map((msg, index) => {
          const isChef = msg.sender === 'chef';
          return (
            <div key={index} className={`flex items-end gap-2 ${isChef ? 'justify-start' : 'justify-end'}`}>
              {isChef && (
                <div className="w-7 h-7 rounded-full flex-shrink-0 bg-gradient-to-tr from-primary-600 to-emerald-500 text-white flex items-center justify-center">
                  <ChefHat className="h-4 w-4" />
                </div>
              )}
              <div className={`max-w-[78%] px-3.5 py-2.5 text-sm leading-relaxed shadow-sm ${isChef
                ? 'bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 rounded-2xl rounded-bl-sm text-slate-800 dark:text-slate-100'
                : 'bg-primary-600 text-white rounded-2xl rounded-br-sm'
              }`}>
                {isChef ? renderText(msg.text) : <p className="whitespace-pre-wrap">{msg.text}</p>}
                <span className={`block mt-1 text-[10px] font-semibold ${isChef ? 'text-slate-400' : 'text-primary-200'}`}>
                  {msg.time}
                </span>
              </div>
              {!isChef && (
                <div className="w-7 h-7 rounded-full flex-shrink-0 bg-gradient-to-tr from-slate-500 to-slate-700 text-white flex items-center justify-center">
                  <User className="h-4 w-4" />
                </div>
              )}
            </div>
          );
        })}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex items-end gap-2 justify-start">
            <div className="w-7 h-7 rounded-full flex-shrink-0 bg-gradient-to-tr from-primary-600 to-emerald-500 text-white flex items-center justify-center">
              <ChefHat className="h-4 w-4" />
            </div>
            <div className="px-3.5 py-3 bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 rounded-2xl rounded-bl-sm shadow-sm flex items-center gap-1.5">
              {[0, 150, 300].map((delay) => (
                <div
                  key={delay}
                  className="h-1.5 w-1.5 bg-slate-400 dark:bg-slate-500 rounded-full animate-bounce"
                  style={{ animationDelay: `${delay}ms` }}
                />
              ))}
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Upload error */}
      {uploadError && (
        <div className="px-4 sm:px-6 pb-2">
          <span className="block text-xs font-bold text-rose-500 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 rounded-lg px-3 py-2">
            {uploadError}
          </span>
        </div>
      )}

      {/* Suggested prompts */}
      <div className="px-4 sm:px-6 pt-2">
        <div className="flex flex-wrap gap-1.5">
          {SUGGESTED_PROMPTS.slice(0, 4).map((prompt, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSendMessage(prompt)}
              disabled={isTyping || isUploading}
              className="px-2.5 py-1.5 text-[11px] font-semibold rounded-lg bg-slate-50 dark:bg-slate-950 hover:bg-primary-50 dark:hover:bg-primary-950/40 text-slate-600 dark:text-slate-350 border border-slate-200 dark:border-slate-800 transition-all disabled:opacity-50"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <form
        onSubmit={(e) => { e.preventDefault(); handleSendMessage(inputVal); }}
        className="p-3 sm:p-4 border-t border-slate-200 dark:border-slate-800"
      >
        <div className="relative flex items-center gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,.pdf,.txt,.md,.csv,.json,.log"
            className="hidden"
            onChange={handleFileSelected}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isTyping || isUploading}
            className="flex-shrink-0 p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all disabled:opacity-50"
            title="Upload an image, PDF, or text file"
          >
            {isUploading ? (
              <span className="block h-5 w-5 animate-spin rounded-full border-2 border-slate-400 border-t-transparent" />
            ) : (
              <Paperclip className="h-5 w-5" />
            )}
          </button>
          <input
            type="text"
            placeholder="Ask about recipes, substitutions, food safety..."
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            disabled={isTyping || isUploading}
            className="w-full pl-4 pr-12 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 shadow-sm transition-all disabled:opacity-70"
          />
          <button
            type="submit"
            disabled={!inputVal.trim() || isTyping || isUploading}
            className="absolute right-1.5 p-2 rounded-lg bg-primary-600 hover:bg-primary-700 text-white disabled:opacity-50 disabled:bg-slate-300 dark:disabled:bg-slate-800 dark:disabled:text-slate-600 transition-all"
            aria-label="Send message"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </form>

      {/* Session Manager Drawer */}
      <div className={`fixed inset-0 z-50 ${isSessionDrawerOpen ? '' : 'pointer-events-none'}`}>
        <div
          className={`absolute inset-0 bg-slate-950/40 backdrop-blur-sm transition-opacity duration-300 ${isSessionDrawerOpen ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => setIsSessionDrawerOpen(false)}
        />
        <div className={`absolute left-0 top-0 h-full w-80 max-w-[85vw] bg-white dark:bg-slate-900 shadow-2xl border-r border-slate-200 dark:border-slate-800 transition-transform duration-300 ${isSessionDrawerOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="flex items-center justify-between px-4 h-16 border-b border-slate-200 dark:border-slate-800">
            <span className="font-display font-bold text-lg text-slate-900 dark:text-white">Chat Sessions</span>
            <button
              onClick={() => setIsSessionDrawerOpen(false)}
              className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label="Close sessions"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="px-3 pt-3">
            <button
              onClick={handleNewSession}
              className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl font-bold text-sm bg-primary-600 hover:bg-primary-700 text-white shadow-sm transition-all"
            >
              <Plus className="h-4 w-4" />
              New Chat
            </button>
          </div>

          <div className="px-2 py-3 space-y-1 overflow-y-auto max-h-[calc(100vh-10rem)]">
            {sessions.map((session) => {
              const active = session.id === activeSessionId;
              const isEditing = editingSessionId === session.id;
              return (
                <div
                  key={session.id}
                  className={`group flex items-center gap-2 px-3 py-2.5 rounded-xl transition-all cursor-pointer ${
                    active
                      ? 'bg-primary-50 dark:bg-primary-950/60 border border-primary-100/50 dark:border-primary-900/30'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                  onClick={() => handleSelectSession(session.id)}
                >
                  {isEditing ? (
                    <div className="flex-1 flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="text"
                        value={editingSessionName}
                        onChange={(e) => setEditingSessionName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleRenameSession(session.id);
                          if (e.key === 'Escape') { setEditingSessionId(null); setEditingSessionName(''); }
                        }}
                        autoFocus
                        className="flex-1 min-w-0 px-2 py-1 rounded-lg border border-primary-300 dark:border-primary-800 bg-white dark:bg-slate-950 text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="Session name"
                      />
                      <button
                        onClick={() => handleRenameSession(session.id)}
                        className="p-1.5 text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 rounded-lg"
                        title="Save"
                      >
                        <Check className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => { setEditingSessionId(null); setEditingSessionName(''); }}
                        className="p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
                        title="Cancel"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <FileText className="h-4 w-4 flex-shrink-0 text-slate-400" />
                      <span className="flex-1 min-w-0 truncate text-sm font-semibold text-slate-700 dark:text-slate-300">
                        {session.name}
                      </span>
                      <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingSessionId(session.id);
                            setEditingSessionName(session.name);
                          }}
                          className="p-1.5 text-slate-400 hover:text-primary-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
                          title="Rename"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (window.confirm(`Delete session "${session.name}"?`)) {
                              handleDeleteSession(session.id);
                            }
                          }}
                          className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
                          title="Delete"
                        >
                          <Trash className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export const recipesDb = [
  {
    id: "chicken-jollof-rice",
    name: "Ghanaian Chicken Jollof Rice",
    image: "https://images.unsplash.com/photo-1627308595229-7830a5c91f9f?auto=format&fit=crop&q=80&w=600",
    prepTime: 45, // in minutes
    calories: 620,
    difficulty: "Intermediate",
    macros: { protein: 35, carbs: 75, fat: 18 },
    diet: ["High Protein"],
    allergies: [], // Gluten-free if using gluten-free stock, dairy-free
    ingredients: [
      { name: "rice", quantity: "2 cups" },
      { name: "chicken", quantity: "500g" },
      { name: "tomato", quantity: "3 large" },
      { name: "onion", quantity: "2 medium" },
      { name: "vegetable oil", quantity: "3 tbsp" },
      { name: "garlic", quantity: "3 cloves" },
      { name: "ginger", quantity: "1 tbsp, grated" },
      { name: "chili pepper", quantity: "1 (scotch bonnet)" },
      { name: "chicken broth", quantity: "2 cups" }
    ],
    substitutions: {
      "chicken broth": "vegetable stock or water with bouillon cube",
      "chicken": "tofu or mushrooms for a vegetarian version",
      "vegetable oil": "olive oil or coconut oil"
    },
    instructions: [
      "Season the chicken with garlic, ginger, and salt, then fry or bake until golden and set aside.",
      "In the same pot, sauté chopped onions until translucent, then add minced garlic and ginger.",
      "Add blended tomatoes, chili peppers, and tomato paste. Simmer for 15 minutes until the oil separates.",
      "Pour in chicken broth and bring the sauce to a boil. Season with salt, pepper, and spices (curry, thyme).",
      "Rinse the rice and stir it into the tomato sauce. Cover tightly with foil and a lid.",
      "Cook on very low heat for 25-30 minutes, stirring occasionally, until the rice is tender and the liquid is absorbed.",
      "Serve hot with the cooked chicken."
    ]
  },
  {
    id: "chicken-fried-rice",
    name: "Classic Chicken Fried Rice",
    image: "https://images.unsplash.com/photo-1603133872878-685f58880637?auto=format&fit=crop&q=80&w=600",
    prepTime: 20,
    calories: 540,
    difficulty: "Beginner",
    macros: { protein: 32, carbs: 64, fat: 14 },
    diet: ["High Protein"],
    allergies: ["eggs", "soy"],
    ingredients: [
      { name: "rice", quantity: "3 cups, cooked & chilled" },
      { name: "chicken", quantity: "250g, diced" },
      { name: "eggs", quantity: "2 large" },
      { name: "onion", quantity: "1 small" },
      { name: "soy sauce", quantity: "3 tbsp" },
      { name: "peas", quantity: "1/2 cup" },
      { name: "carrots", quantity: "1/2 cup, diced" },
      { name: "sesame oil", quantity: "1 tbsp" }
    ],
    substitutions: {
      "soy sauce": "tamari (gluten-free) or coconut aminos (soy-free)",
      "chicken": "shrimp, beef, tofu, or extra vegetables",
      "peas": "edamame or green beans"
    },
    instructions: [
      "Heat sesame oil in a large skillet or wok over medium-high heat. Add chicken and cook until cooked through.",
      "Add diced onion, carrots, and peas. Sauté for 3-4 minutes until vegetables begin to soften.",
      "Push vegetables and chicken to one side of the wok. Pour beaten eggs into the empty space and scramble them.",
      "Add the chilled cooked rice and pour soy sauce over the top.",
      "Stir-fry everything together on high heat for 3-5 minutes, allowing the rice to fry and absorb the sauce evenly.",
      "Serve warm, optionally garnished with spring onions."
    ]
  },
  {
    id: "mushroom-pasta",
    name: "Creamy Mushroom Garlic Pasta",
    image: "https://images.unsplash.com/photo-1645112411341-6c4fd023714a?auto=format&fit=crop&q=80&w=600",
    prepTime: 25,
    calories: 580,
    difficulty: "Beginner",
    macros: { protein: 16, carbs: 78, fat: 22 },
    diet: ["Vegetarian"],
    allergies: ["gluten", "milk"],
    ingredients: [
      { name: "pasta", quantity: "250g" },
      { name: "mushrooms", quantity: "200g, sliced" },
      { name: "milk", quantity: "1/2 cup (or heavy cream)" },
      { name: "garlic", quantity: "4 cloves, minced" },
      { name: "butter", quantity: "2 tbsp" },
      { name: "parmesan cheese", quantity: "1/4 cup" },
      { name: "salt & pepper", quantity: "to taste" }
    ],
    substitutions: {
      "pasta": "gluten-free pasta or zucchini noodles",
      "milk": "coconut milk or oat cream for a dairy-free version",
      "butter": "olive oil",
      "parmesan cheese": "nutritional yeast (vegan)"
    },
    instructions: [
      "Cook pasta in a large pot of salted boiling water according to package directions. Reserve 1/2 cup of pasta water, then drain.",
      "Melt butter in a pan over medium heat. Add minced garlic and sauté for 1 minute until fragrant.",
      "Add sliced mushrooms and cook until browned and tender, about 5-6 minutes.",
      "Pour in the milk (or cream) and bring to a gentle simmer. Season with salt and pepper.",
      "Stir in parmesan cheese until melted and creamy. If the sauce is too thick, add a splash of reserved pasta water.",
      "Toss the cooked pasta in the creamy mushroom sauce until fully coated. Serve with fresh parsley."
    ]
  },
  {
    id: "vegan-tofu-stir-fry",
    name: "Zero-Waste Veggie Tofu Stir-Fry",
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=600",
    prepTime: 15,
    calories: 320,
    difficulty: "Beginner",
    macros: { protein: 18, carbs: 24, fat: 16 },
    diet: ["Vegan", "Vegetarian", "Low Carb"],
    allergies: ["soy"],
    ingredients: [
      { name: "tofu", quantity: "200g, cubed" },
      { name: "broccoli", quantity: "1 cup" },
      { name: "soy sauce", quantity: "2 tbsp" },
      { name: "garlic", quantity: "2 cloves, minced" },
      { name: "ginger", quantity: "1 tsp" },
      { name: "carrot", quantity: "1 medium, julienned" },
      { name: "onion", quantity: "1/2 medium" },
      { name: "olive oil", quantity: "1 tbsp" }
    ],
    substitutions: {
      "tofu": "tempeh, seitan, chicken, or cashews",
      "soy sauce": "coconut aminos or tamari",
      "broccoli": "cabbage, green beans, or snap peas"
    },
    instructions: [
      "Press the tofu with a paper towel to remove excess moisture, then cut into bite-sized cubes.",
      "Heat olive oil in a pan over high heat. Fry tofu cubes until crispy on all sides, then remove and set aside.",
      "In the same pan, add onions, broccoli, and carrots. Stir-fry for 3-4 minutes until crisp-tender.",
      "Add minced garlic and ginger, cooking for another minute.",
      "Return the crispy tofu to the pan, pour soy sauce over everything, and toss well for 2 minutes.",
      "Serve immediately, alone or over rice."
    ]
  },
  {
    id: "keto-avocado-salad",
    name: "Keto Avocado Chicken Salad",
    image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&q=80&w=600",
    prepTime: 10,
    calories: 450,
    difficulty: "Beginner",
    macros: { protein: 28, carbs: 8, fat: 34 },
    diet: ["Keto", "Low Carb", "High Protein"],
    allergies: [],
    ingredients: [
      { name: "chicken", quantity: "200g, cooked & shredded" },
      { name: "avocado", quantity: "1 ripe, diced" },
      { name: "mayonnaise", quantity: "2 tbsp" },
      { name: "lemon", quantity: "1 tbsp juice" },
      { name: "onion", quantity: "1/4 cup, finely chopped" },
      { name: "salt & pepper", quantity: "to taste" }
    ],
    substitutions: {
      "mayonnaise": "greek yogurt (adds protein, lower fat)",
      "chicken": "canned tuna, boiled eggs, or chickpeas",
      "lemon": "lime juice or apple cider vinegar"
    },
    instructions: [
      "In a bowl, mash the avocado slightly, leaving some chunks for texture.",
      "Add mayonnaise, lemon juice, salt, and pepper. Mix well to create a creamy dressing.",
      "Stir in shredded chicken and finely chopped onion until fully incorporated.",
      "Adjust seasoning to taste. Serve chilled over a bed of lettuce or inside low-carb wraps."
    ]
  },
  {
    id: "tomato-basil-soup",
    name: "Simple Tomato Basil Soup",
    image: "https://images.unsplash.com/photo-1547592165-e1d17fed6005?auto=format&fit=crop&q=80&w=600",
    prepTime: 30,
    calories: 190,
    difficulty: "Beginner",
    macros: { protein: 4, carbs: 18, fat: 12 },
    diet: ["Vegetarian", "Low Carb"],
    allergies: ["milk"],
    ingredients: [
      { name: "tomato", quantity: "5 large, chopped" },
      { name: "garlic", quantity: "4 cloves" },
      { name: "onion", quantity: "1 medium" },
      { name: "milk", quantity: "1/2 cup (or cream)" },
      { name: "olive oil", quantity: "2 tbsp" },
      { name: "water", quantity: "1 cup" }
    ],
    substitutions: {
      "milk": "coconut milk or almond milk for a dairy-free/vegan soup",
      "olive oil": "butter",
      "tomato": "canned crushed tomatoes"
    },
    instructions: [
      "Heat olive oil in a soup pot. Sauté chopped onions and minced garlic for 3 minutes.",
      "Add the chopped tomatoes and cook for 8-10 minutes until they break down and soften.",
      "Pour in water (or vegetable broth) and bring to a simmer. Cover and cook for 15 minutes.",
      "Remove from heat. Add fresh basil leaves, then use an immersion blender to puree the soup until smooth.",
      "Return to low heat, stir in the milk or cream, and season with salt and pepper.",
      "Serve warm with a side of bread."
    ]
  },
  {
    id: "beef-broccoli",
    name: "Stir-Fry Beef and Broccoli",
    image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&q=80&w=600",
    prepTime: 20,
    calories: 420,
    difficulty: "Intermediate",
    macros: { protein: 34, carbs: 12, fat: 26 },
    diet: ["Keto", "Low Carb", "High Protein"],
    allergies: ["soy", "gluten"],
    ingredients: [
      { name: "beef", quantity: "300g, thinly sliced" },
      { name: "broccoli", quantity: "2 cups, florets" },
      { name: "soy sauce", quantity: "3 tbsp" },
      { name: "garlic", quantity: "3 cloves, minced" },
      { name: "ginger", quantity: "1 tsp" },
      { name: "olive oil", quantity: "2 tbsp" },
      { name: "water", quantity: "1/4 cup" }
    ],
    substitutions: {
      "beef": "chicken, pork, tofu, or portobello mushrooms",
      "soy sauce": "tamari (gluten-free) or coconut aminos",
      "olive oil": "sesame oil"
    },
    instructions: [
      "In a bowl, marinate sliced beef with 1 tablespoon of soy sauce and a pinch of black pepper.",
      "Heat olive oil in a pan or wok over high heat. Sear the beef slices for 1-2 minutes until browned. Remove beef and set aside.",
      "Add another splash of oil to the same pan. Sauté minced garlic and ginger for 30 seconds.",
      "Add broccoli florets and stir-fry for 2 minutes. Pour in the water, cover, and let steam for 2 minutes until tender-crisp.",
      "Return the cooked beef to the pan. Pour in the remaining soy sauce.",
      "Toss everything together on high heat for 1-2 minutes until well coated and hot. Serve immediately."
    ]
  },
  {
    id: "banana-pancakes",
    name: "3-Ingredient Banana Pancakes",
    image: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&q=80&w=600",
    prepTime: 12,
    calories: 280,
    difficulty: "Beginner",
    macros: { protein: 12, carbs: 42, fat: 8 },
    diet: ["Vegetarian"],
    allergies: ["eggs"], // Gluten-free if using certified gluten-free oats
    ingredients: [
      { name: "bananas", quantity: "2 ripe" },
      { name: "eggs", quantity: "2 large" },
      { name: "oats", quantity: "1/2 cup" }
    ],
    substitutions: {
      "oats": "almond flour (for a lower-carb, keto version)",
      "eggs": "applesauce or flax eggs (vegan substitution, though texture will vary)"
    },
    instructions: [
      "In a medium bowl, mash the bananas thoroughly with a fork until smooth.",
      "Whisk in the eggs until fully combined.",
      "Stir in the rolled oats (or blended oat flour) to form a batter. Let rest for 2 minutes.",
      "Heat a non-stick skillet over medium-low heat and lightly grease with oil or butter.",
      "Pour small circles of batter into the pan. Cook for 2-3 minutes until bubbles form on the surface.",
      "Flip carefully and cook the other side for another 1-2 minutes until golden brown.",
      "Serve warm, topped with fresh fruit or honey."
    ]
  }
];

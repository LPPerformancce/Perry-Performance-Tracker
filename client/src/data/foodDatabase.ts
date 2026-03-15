export interface FoodItem {
  name: string;
  servingSize: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  category: string;
}

export const FOOD_DATABASE: FoodItem[] = [
  { name: "Chicken Breast (cooked)", servingSize: "100g", calories: 165, protein: 31, carbs: 0, fats: 3.6, category: "Protein" },
  { name: "Chicken Thigh (cooked)", servingSize: "100g", calories: 209, protein: 26, carbs: 0, fats: 10.9, category: "Protein" },
  { name: "Turkey Breast (cooked)", servingSize: "100g", calories: 135, protein: 30, carbs: 0, fats: 1, category: "Protein" },
  { name: "Salmon Fillet (cooked)", servingSize: "100g", calories: 208, protein: 20, carbs: 0, fats: 13, category: "Protein" },
  { name: "Tuna (canned in water)", servingSize: "100g", calories: 116, protein: 26, carbs: 0, fats: 0.8, category: "Protein" },
  { name: "Cod Fillet (cooked)", servingSize: "100g", calories: 82, protein: 18, carbs: 0, fats: 0.7, category: "Protein" },
  { name: "Prawns (cooked)", servingSize: "100g", calories: 99, protein: 24, carbs: 0, fats: 0.3, category: "Protein" },
  { name: "Lean Beef Mince (cooked)", servingSize: "100g", calories: 176, protein: 26, carbs: 0, fats: 8, category: "Protein" },
  { name: "Sirloin Steak (cooked)", servingSize: "100g", calories: 206, protein: 26, carbs: 0, fats: 11, category: "Protein" },
  { name: "Pork Tenderloin (cooked)", servingSize: "100g", calories: 143, protein: 26, carbs: 0, fats: 3.5, category: "Protein" },
  { name: "Lamb Chop (cooked)", servingSize: "100g", calories: 258, protein: 25, carbs: 0, fats: 17, category: "Protein" },
  { name: "Tofu (firm)", servingSize: "100g", calories: 76, protein: 8, carbs: 1.9, fats: 4.8, category: "Protein" },
  { name: "Tempeh", servingSize: "100g", calories: 192, protein: 20, carbs: 7.6, fats: 11, category: "Protein" },
  { name: "Eggs (1 large)", servingSize: "60g", calories: 70, protein: 6, carbs: 0.4, fats: 5, category: "Protein" },
  { name: "Egg Whites (1 large)", servingSize: "33g", calories: 17, protein: 3.6, carbs: 0.2, fats: 0.1, category: "Protein" },
  { name: "Turkey Bacon (1 rasher)", servingSize: "20g", calories: 30, protein: 4, carbs: 0.5, fats: 1.5, category: "Protein" },
  { name: "Ham (sliced)", servingSize: "100g", calories: 113, protein: 17, carbs: 2, fats: 4, category: "Protein" },
  { name: "Whey Protein Powder", servingSize: "30g (1 scoop)", calories: 120, protein: 24, carbs: 3, fats: 1.5, category: "Supplements" },
  { name: "Casein Protein Powder", servingSize: "30g (1 scoop)", calories: 115, protein: 22, carbs: 4, fats: 1, category: "Supplements" },
  { name: "Creatine Monohydrate", servingSize: "5g", calories: 0, protein: 0, carbs: 0, fats: 0, category: "Supplements" },
  { name: "White Rice (cooked)", servingSize: "100g", calories: 130, protein: 2.7, carbs: 28, fats: 0.3, category: "Carbs" },
  { name: "Brown Rice (cooked)", servingSize: "100g", calories: 112, protein: 2.6, carbs: 23, fats: 0.9, category: "Carbs" },
  { name: "Pasta (cooked)", servingSize: "100g", calories: 131, protein: 5, carbs: 25, fats: 1.1, category: "Carbs" },
  { name: "Wholemeal Bread (1 slice)", servingSize: "36g", calories: 80, protein: 4, carbs: 14, fats: 1, category: "Carbs" },
  { name: "Sourdough Bread (1 slice)", servingSize: "40g", calories: 90, protein: 3.5, carbs: 18, fats: 0.5, category: "Carbs" },
  { name: "Bagel (1 whole)", servingSize: "90g", calories: 245, protein: 10, carbs: 48, fats: 1.5, category: "Carbs" },
  { name: "Tortilla Wrap (1 large)", servingSize: "60g", calories: 180, protein: 5, carbs: 30, fats: 4, category: "Carbs" },
  { name: "Oats (dry)", servingSize: "40g", calories: 150, protein: 5, carbs: 27, fats: 2.5, category: "Carbs" },
  { name: "Quinoa (cooked)", servingSize: "100g", calories: 120, protein: 4.4, carbs: 21, fats: 1.9, category: "Carbs" },
  { name: "Sweet Potato (cooked)", servingSize: "100g", calories: 86, protein: 1.6, carbs: 20, fats: 0.1, category: "Carbs" },
  { name: "White Potato (cooked)", servingSize: "100g", calories: 77, protein: 2, carbs: 17, fats: 0.1, category: "Carbs" },
  { name: "Couscous (cooked)", servingSize: "100g", calories: 112, protein: 3.8, carbs: 23, fats: 0.2, category: "Carbs" },
  { name: "Noodles (egg, cooked)", servingSize: "100g", calories: 138, protein: 4.5, carbs: 25, fats: 2, category: "Carbs" },
  { name: "Rice Noodles (cooked)", servingSize: "100g", calories: 108, protein: 0.9, carbs: 24, fats: 0.2, category: "Carbs" },
  { name: "Banana (1 medium)", servingSize: "120g", calories: 105, protein: 1.3, carbs: 27, fats: 0.4, category: "Fruit" },
  { name: "Apple (1 medium)", servingSize: "180g", calories: 95, protein: 0.5, carbs: 25, fats: 0.3, category: "Fruit" },
  { name: "Blueberries", servingSize: "100g", calories: 57, protein: 0.7, carbs: 14, fats: 0.3, category: "Fruit" },
  { name: "Strawberries", servingSize: "100g", calories: 32, protein: 0.7, carbs: 7.7, fats: 0.3, category: "Fruit" },
  { name: "Mango", servingSize: "100g", calories: 60, protein: 0.8, carbs: 15, fats: 0.4, category: "Fruit" },
  { name: "Avocado (1/2)", servingSize: "80g", calories: 128, protein: 1.6, carbs: 6.8, fats: 12, category: "Fruit" },
  { name: "Orange (1 medium)", servingSize: "130g", calories: 62, protein: 1.2, carbs: 15, fats: 0.2, category: "Fruit" },
  { name: "Grapes", servingSize: "100g", calories: 69, protein: 0.7, carbs: 18, fats: 0.2, category: "Fruit" },
  { name: "Broccoli (cooked)", servingSize: "100g", calories: 35, protein: 2.4, carbs: 7.2, fats: 0.4, category: "Vegetables" },
  { name: "Spinach (raw)", servingSize: "100g", calories: 23, protein: 2.9, carbs: 3.6, fats: 0.4, category: "Vegetables" },
  { name: "Kale (raw)", servingSize: "100g", calories: 49, protein: 4.3, carbs: 9, fats: 0.9, category: "Vegetables" },
  { name: "Bell Pepper (1 medium)", servingSize: "120g", calories: 30, protein: 1, carbs: 7, fats: 0.2, category: "Vegetables" },
  { name: "Carrot (1 medium)", servingSize: "60g", calories: 25, protein: 0.6, carbs: 6, fats: 0.1, category: "Vegetables" },
  { name: "Tomato (1 medium)", servingSize: "120g", calories: 22, protein: 1.1, carbs: 4.8, fats: 0.2, category: "Vegetables" },
  { name: "Cucumber", servingSize: "100g", calories: 15, protein: 0.7, carbs: 3.6, fats: 0.1, category: "Vegetables" },
  { name: "Mushrooms (raw)", servingSize: "100g", calories: 22, protein: 3.1, carbs: 3.3, fats: 0.3, category: "Vegetables" },
  { name: "Asparagus (cooked)", servingSize: "100g", calories: 20, protein: 2.2, carbs: 3.9, fats: 0.1, category: "Vegetables" },
  { name: "Green Beans (cooked)", servingSize: "100g", calories: 31, protein: 1.8, carbs: 7, fats: 0.1, category: "Vegetables" },
  { name: "Cauliflower (cooked)", servingSize: "100g", calories: 23, protein: 1.8, carbs: 4.1, fats: 0.5, category: "Vegetables" },
  { name: "Courgette/Zucchini", servingSize: "100g", calories: 17, protein: 1.2, carbs: 3.1, fats: 0.3, category: "Vegetables" },
  { name: "Sweetcorn (canned)", servingSize: "100g", calories: 86, protein: 2.9, carbs: 19, fats: 1.2, category: "Vegetables" },
  { name: "Peanut Butter", servingSize: "1 tbsp (16g)", calories: 94, protein: 3.6, carbs: 3.4, fats: 8, category: "Fats" },
  { name: "Almond Butter", servingSize: "1 tbsp (16g)", calories: 98, protein: 3.4, carbs: 3, fats: 9, category: "Fats" },
  { name: "Olive Oil", servingSize: "1 tbsp (14g)", calories: 120, protein: 0, carbs: 0, fats: 14, category: "Fats" },
  { name: "Coconut Oil", servingSize: "1 tbsp (14g)", calories: 121, protein: 0, carbs: 0, fats: 13.5, category: "Fats" },
  { name: "Butter", servingSize: "10g", calories: 72, protein: 0.1, carbs: 0, fats: 8.1, category: "Fats" },
  { name: "Almonds", servingSize: "30g (handful)", calories: 173, protein: 6, carbs: 6, fats: 15, category: "Fats" },
  { name: "Walnuts", servingSize: "30g (handful)", calories: 196, protein: 4.6, carbs: 4, fats: 20, category: "Fats" },
  { name: "Cashews", servingSize: "30g (handful)", calories: 157, protein: 5.2, carbs: 9, fats: 12, category: "Fats" },
  { name: "Chia Seeds", servingSize: "1 tbsp (10g)", calories: 49, protein: 1.7, carbs: 4.2, fats: 3, category: "Fats" },
  { name: "Flax Seeds", servingSize: "1 tbsp (10g)", calories: 55, protein: 1.9, carbs: 3, fats: 4.3, category: "Fats" },
  { name: "Greek Yoghurt (0% fat)", servingSize: "100g", calories: 59, protein: 10, carbs: 3.6, fats: 0.7, category: "Dairy" },
  { name: "Greek Yoghurt (full fat)", servingSize: "100g", calories: 97, protein: 9, carbs: 3.5, fats: 5, category: "Dairy" },
  { name: "Cottage Cheese", servingSize: "100g", calories: 72, protein: 12, carbs: 2.7, fats: 1, category: "Dairy" },
  { name: "Cheddar Cheese", servingSize: "30g", calories: 120, protein: 7.5, carbs: 0.4, fats: 10, category: "Dairy" },
  { name: "Mozzarella", servingSize: "30g", calories: 85, protein: 6, carbs: 0.7, fats: 6.3, category: "Dairy" },
  { name: "Feta Cheese", servingSize: "30g", calories: 75, protein: 4, carbs: 1.2, fats: 6, category: "Dairy" },
  { name: "Parmesan", servingSize: "15g", calories: 60, protein: 5.5, carbs: 0, fats: 4, category: "Dairy" },
  { name: "Whole Milk", servingSize: "250ml", calories: 150, protein: 8, carbs: 12, fats: 8, category: "Dairy" },
  { name: "Semi-Skimmed Milk", servingSize: "250ml", calories: 125, protein: 8.5, carbs: 12, fats: 4.5, category: "Dairy" },
  { name: "Almond Milk (unsweetened)", servingSize: "250ml", calories: 30, protein: 1, carbs: 1.5, fats: 2.5, category: "Dairy" },
  { name: "Oat Milk", servingSize: "250ml", calories: 120, protein: 3, carbs: 16, fats: 5, category: "Dairy" },
  { name: "Chickpeas (canned)", servingSize: "100g", calories: 128, protein: 7, carbs: 20, fats: 2, category: "Legumes" },
  { name: "Black Beans (canned)", servingSize: "100g", calories: 130, protein: 8.5, carbs: 24, fats: 0.5, category: "Legumes" },
  { name: "Kidney Beans (canned)", servingSize: "100g", calories: 110, protein: 7.5, carbs: 20, fats: 0.5, category: "Legumes" },
  { name: "Lentils (cooked)", servingSize: "100g", calories: 116, protein: 9, carbs: 20, fats: 0.4, category: "Legumes" },
  { name: "Edamame", servingSize: "100g", calories: 122, protein: 11, carbs: 10, fats: 5, category: "Legumes" },
  { name: "Honey", servingSize: "1 tbsp (21g)", calories: 64, protein: 0, carbs: 17, fats: 0, category: "Condiments" },
  { name: "Maple Syrup", servingSize: "1 tbsp (20g)", calories: 52, protein: 0, carbs: 13, fats: 0, category: "Condiments" },
  { name: "Soy Sauce", servingSize: "1 tbsp (15ml)", calories: 8, protein: 1, carbs: 1, fats: 0, category: "Condiments" },
  { name: "Hummus", servingSize: "30g", calories: 50, protein: 2, carbs: 3.5, fats: 3, category: "Condiments" },
  { name: "Tahini", servingSize: "1 tbsp (15g)", calories: 89, protein: 2.6, carbs: 3.2, fats: 8, category: "Condiments" },
  { name: "Salsa", servingSize: "30g", calories: 10, protein: 0.3, carbs: 2, fats: 0, category: "Condiments" },
  { name: "Pesto", servingSize: "1 tbsp (15g)", calories: 60, protein: 1.5, carbs: 1, fats: 5.5, category: "Condiments" },
  { name: "BBQ Sauce", servingSize: "1 tbsp (17g)", calories: 29, protein: 0, carbs: 7, fats: 0, category: "Condiments" },
  { name: "Granola", servingSize: "40g", calories: 180, protein: 4, carbs: 26, fats: 7, category: "Carbs" },
  { name: "Rice Cakes (1)", servingSize: "9g", calories: 35, protein: 0.7, carbs: 7, fats: 0.3, category: "Carbs" },
  { name: "Dark Chocolate (85%)", servingSize: "30g", calories: 150, protein: 2.3, carbs: 13, fats: 12, category: "Snacks" },
  { name: "Popcorn (air-popped)", servingSize: "30g", calories: 93, protein: 3, carbs: 19, fats: 1, category: "Snacks" },
  { name: "Beef Jerky", servingSize: "30g", calories: 96, protein: 15, carbs: 4, fats: 2, category: "Snacks" },
];

export const searchFoods = (query: string): FoodItem[] => {
  if (!query || query.length < 2) return [];
  const q = query.toLowerCase();
  return FOOD_DATABASE.filter(f =>
    f.name.toLowerCase().includes(q) ||
    f.category.toLowerCase().includes(q)
  ).slice(0, 20);
};

export const getFoodsByCategory = (category: string): FoodItem[] =>
  FOOD_DATABASE.filter(f => f.category === category);

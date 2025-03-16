interface FoodItem {
  id: number;
  name: string;
  description: string;
  price: number;
  category: 'appetizer' | 'main' | 'dessert';
  image?: string;
}

export const foodItems: FoodItem[] = [
  {
    id: 1,
    name: "Classic Burger",
    description: "Juicy beef patty with fresh vegetables",
    price: 12.99,
    category: "main"
  },
  {
    id: 2,
    name: "Caesar Salad",
    description: "Fresh romaine lettuce with classic caesar dressing",
    price: 8.99,
    category: "appetizer"
  },
  {
    id: 3,
    name: "Chocolate Cake",
    description: "Rich chocolate cake with vanilla frosting",
    price: 6.99,
    category: "dessert"
  },
  // Add more items as needed
]; 
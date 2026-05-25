import { MenuItem } from "../types";

export const menuItems: MenuItem[] = [
  {
    id: "1",
    name: "Classic Chocolate Cake",
    category: "Cakes",
    description: "Rich chocolate layers with fudge frosting.",
    price: 45.0,
    image: "/images/cake-1.png",
    featured: true,
  },
  {
    id: "2",
    name: "Strawberry Shortcake",
    category: "Cakes",
    description: "Light sponge with fresh strawberries and cream.",
    price: 40.0,
    image: "/images/cake-2.png",
  },
  {
    id: "3",
    name: "Almond Croissant",
    category: "Pastries",
    description: "Flaky pastry filled with sweet almond paste.",
    price: 4.5,
    image: "/images/pastry-1.png",
    featured: true,
  },
  {
    id: "4",
    name: "Blueberry Muffin",
    category: "Pastries",
    description: "Freshly baked muffins loaded with wild blueberries.",
    price: 3.5,
    image: "/images/pastry-2.png",
  },
  {
    id: "5",
    name: "Caramel Macchiato",
    category: "Drinks",
    description: "Espresso with vanilla syrup, milk and caramel drizzle.",
    price: 5.0,
    image: "/images/drink-1.png",
  }
];

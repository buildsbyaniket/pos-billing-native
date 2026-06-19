export interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  image: string;
}

const productsData: Product[] = [
  {
    id: 1,
    name: "Coffee",
    price: 50,
    category: "Beverages",
    image:
      "https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg",
  },
  {
    id: 2,
    name: "Tea",
    price: 20,
    category: "Beverages",
    image:
      "https://images.pexels.com/photos/1417945/pexels-photo-1417945.jpeg",
  },
  {
    id: 3,
    name: "Burger",
    price: 120,
    category: "Fast Food",
    image:
      "https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg",
  },
  {
    id: 4,
    name: "Pizza",
    price: 250,
    category: "Fast Food",
    image:
      "https://images.pexels.com/photos/825661/pexels-photo-825661.jpeg",
  },
  {
    id: 5,
    name: "French Fries",
    price: 90,
    category: "Fast Food",
    image:
      "https://images.pexels.com/photos/1583884/pexels-photo-1583884.jpeg",
  },
  {
    id: 6,
    name: "Sandwich",
    price: 100,
    category: "Fast Food",
    image:
      "https://images.pexels.com/photos/1600711/pexels-photo-1600711.jpeg",
  },
  {
    id: 7,
    name: "Noodles",
    price: 140,
    category: "Chinese",
    image:
      "https://images.pexels.com/photos/2347311/pexels-photo-2347311.jpeg",
  },
  {
    id: 8,
    name: "Fried Rice",
    price: 150,
    category: "Chinese",
    image:
      "https://images.pexels.com/photos/723198/pexels-photo-723198.jpeg",
  },
  {
    id: 9,
    name: "Chocolate Cake",
    price: 350,
    category: "Bakery",
    image:
      "https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg",
  },
  {
    id: 10,
    name: "Donut",
    price: 70,
    category: "Bakery",
    image:
      "https://images.pexels.com/photos/4686960/pexels-photo-4686960.jpeg",
  },
  {
    id: 11,
    name: "Ice Cream",
    price: 70,
    category: "Desserts",
    image:
      "https://images.pexels.com/photos/1352278/pexels-photo-1352278.jpeg",
  },
  {
    id: 12,
    name: "Cheesecake",
    price: 180,
    category: "Desserts",
    image:
      "https://images.pexels.com/photos/1126359/pexels-photo-1126359.jpeg",
  },
];

export default productsData;

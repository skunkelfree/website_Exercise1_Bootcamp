export type Gender = "female" | "male";

export interface Model {
  id: string;
  name: string;
  gender: Gender;
  category: string;
  image: string;
}

export const models: Model[] = [
  {
    id: "1",
    name: "Amara Diallo",
    gender: "female",
    category: "Editorial",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&q=80",
  },
  {
    id: "2",
    name: "Léa Fontaine",
    gender: "female",
    category: "Commercial",
    image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=600&q=80",
  },
  {
    id: "3",
    name: "Yuki Tanaka",
    gender: "female",
    category: "Editorial",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&q=80",
  },
  {
    id: "4",
    name: "Sofia Marin",
    gender: "female",
    category: "Runway",
    image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600&q=80",
  },
  {
    id: "5",
    name: "Nadia Petrova",
    gender: "female",
    category: "Commercial",
    image: "https://images.unsplash.com/photo-1598550476439-6847785fcea6?w=600&q=80",
  },
  {
    id: "6",
    name: "Celeste Vega",
    gender: "female",
    category: "Editorial",
    image: "https://images.unsplash.com/photo-1542744094-3a31f272c490?w=600&q=80",
  },
  {
    id: "7",
    name: "Marcus Webb",
    gender: "male",
    category: "Editorial",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=600&q=80",
  },
  {
    id: "8",
    name: "Elias Strand",
    gender: "male",
    category: "Commercial",
    image: "https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?w=600&q=80",
  },
  {
    id: "9",
    name: "Julian Mercer",
    gender: "male",
    category: "Runway",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=600&q=80",
  },
  {
    id: "10",
    name: "Kai Nakamura",
    gender: "male",
    category: "Editorial",
    image: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=600&q=80",
  },
  {
    id: "11",
    name: "Theo Larsson",
    gender: "male",
    category: "Commercial",
    image: "https://images.unsplash.com/photo-1553484771-047a44eee27b?w=600&q=80",
  },
  {
    id: "12",
    name: "Dante Ricci",
    gender: "male",
    category: "Runway",
    image: "https://images.unsplash.com/photo-1471879832106-c7ab9e0cee23?w=600&q=80",
  },
];

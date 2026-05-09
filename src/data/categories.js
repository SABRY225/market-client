import {
  UtensilsCrossed,
  Pizza,
  Beef,
  Flame,
  Fish,
  CakeSlice,
  Coffee,
  BadgePercent,
  Salad, // أيقونة السلطة
  Soup   // أيقونة للمقبلات (أو استخدم Cookie)
} from 'lucide-react';

const iconMap = {
  fast_food: UtensilsCrossed,
  pizza: Pizza,
  burger: Beef,
  grill: Flame,
  seafood: Fish,
  desserts: CakeSlice,
  coffee: Coffee,
  appetizers: Soup, // للمقبلات
  salads: Salad,    // للسلطات
};

export const categories = [
  { key: 'fast_food', icon: iconMap['fast_food'] },
  { key: 'pizza', icon: iconMap['pizza'] },
  { key: 'burger', icon: iconMap['burger'] },
  { key: 'grill', icon: iconMap['grill'] },
  { key: 'appetizers', icon: iconMap['appetizers'] }, // إضافات جديدة
  { key: 'salads', icon: iconMap['salads'] },         // إضافات جديدة
  { key: 'seafood', icon: iconMap['seafood'] },
  { key: 'desserts', icon: iconMap['desserts'] },
  { key: 'coffee', icon: iconMap['coffee'] },
];
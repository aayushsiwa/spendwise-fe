import {
  Business,
  CardGiftcard,
  Checkroom,
  Coffee,
  Commute,
  Computer,
  Deck,
  Delete,
  DirectionsCar,
  FitnessCenter,
  Flight,
  Home,
  LocalHospital,
  Pets,
  PhoneAndroid,
  Restaurant,
  Savings,
  School,
  ShoppingCart,
  TheaterComedy,
} from '@mui/icons-material';

export const CATEGORY_ICONS = {
  restaurant: Restaurant,
  shopping_cart: ShoppingCart,
  directions_car: DirectionsCar,
  flight: Flight,
  home: Home,
  local_hospital: LocalHospital,
  school: School,
  fitness_center: FitnessCenter,
  theater_comedy: TheaterComedy,
  savings: Savings,
  business: Business,
  pets: Pets,
  phone_android: PhoneAndroid,
  computer: Computer,
  card_giftcard: CardGiftcard,
  checkroom: Checkroom,
  coffee: Coffee,
  commute: Commute,
  deck: Deck,
  delete: Delete,
} as const;

type Props = {
  name: string;
  size?: 'small' | 'medium' | 'large';
};

export function CategoryIcon({ name, size = 'medium' }: Props) {
  const Icon = CATEGORY_ICONS[name as keyof typeof CATEGORY_ICONS];

  if (!Icon) return null;

  return <Icon fontSize={size} />;
}

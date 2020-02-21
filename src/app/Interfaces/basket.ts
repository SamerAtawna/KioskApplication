import { Ingredient } from './ingredient';

export interface Basket {
  mealName: string;
  mealNumber: number;
  ingredients: Array<Ingredient>;
  empNumber: string;
  isTakeAway: boolean;
}

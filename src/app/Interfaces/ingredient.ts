import { Ingredient } from './ingredient';
export interface Ingredient {
  name: string;
  number: number;
  additions: Array<Ingredient>;
}

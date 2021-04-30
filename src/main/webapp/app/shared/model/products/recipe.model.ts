import { IRecipeIngredient } from '@/shared/model/products/recipe-ingredient.model';
import { IUser } from '@/shared/model/user.model';

export interface IRecipe {
  id?: number;
  name?: string;
  instructionsBody?: string;
  recipeIngredients?: IRecipeIngredient[] | null;
  user?: IUser | null;
}

export class Recipe implements IRecipe {
  constructor(
    public id?: number,
    public name?: string,
    public instructionsBody?: string,
    public recipeIngredients?: IRecipeIngredient[] | null,
    public user?: IUser | null
  ) {}
}

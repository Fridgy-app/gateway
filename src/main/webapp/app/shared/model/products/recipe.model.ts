import { IRecipeIngredient } from '@/shared/model/products/recipe-ingredient.model';

export interface IRecipe {
  id?: number;
  name?: string;
  instructionsBody?: string;
  recipeIngredients?: IRecipeIngredient[] | null;
}

export class Recipe implements IRecipe {
  constructor(
    public id?: number,
    public name?: string,
    public instructionsBody?: string,
    public recipeIngredients?: IRecipeIngredient[] | null
  ) {}
}

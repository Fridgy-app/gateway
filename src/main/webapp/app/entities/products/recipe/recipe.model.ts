import { IRecipeIngredient } from 'app/entities/products/recipe-ingredient/recipe-ingredient.model';

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

export function getRecipeIdentifier(recipe: IRecipe): number | undefined {
  return recipe.id;
}

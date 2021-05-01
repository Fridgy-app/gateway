import { IProduct } from 'app/entities/products/product/product.model';
import { IProductUnit } from 'app/entities/products/product-unit/product-unit.model';
import { IRecipe } from 'app/entities/products/recipe/recipe.model';

export interface IRecipeIngredient {
  id?: number;
  quantity?: number | null;
  product?: IProduct | null;
  productUnit?: IProductUnit | null;
  recipe?: IRecipe | null;
}

export class RecipeIngredient implements IRecipeIngredient {
  constructor(
    public id?: number,
    public quantity?: number | null,
    public product?: IProduct | null,
    public productUnit?: IProductUnit | null,
    public recipe?: IRecipe | null
  ) {}
}

export function getRecipeIngredientIdentifier(recipeIngredient: IRecipeIngredient): number | undefined {
  return recipeIngredient.id;
}

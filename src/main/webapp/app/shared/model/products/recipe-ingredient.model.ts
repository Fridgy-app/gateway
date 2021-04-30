import { IProduct } from '@/shared/model/products/product.model';
import { IProductUnit } from '@/shared/model/products/product-unit.model';
import { IRecipe } from '@/shared/model/products/recipe.model';

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

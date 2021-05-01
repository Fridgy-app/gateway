import { IUser } from 'app/entities/user/user.model';
import { IProduct } from 'app/entities/products/product/product.model';
import { IProductUnit } from 'app/entities/products/product-unit/product-unit.model';

export interface IGroceryItem {
  id?: number;
  quantity?: number | null;
  description?: string | null;
  user?: IUser | null;
  product?: IProduct | null;
  unit?: IProductUnit | null;
}

export class GroceryItem implements IGroceryItem {
  constructor(
    public id?: number,
    public quantity?: number | null,
    public description?: string | null,
    public user?: IUser | null,
    public product?: IProduct | null,
    public unit?: IProductUnit | null
  ) {}
}

export function getGroceryItemIdentifier(groceryItem: IGroceryItem): number | undefined {
  return groceryItem.id;
}

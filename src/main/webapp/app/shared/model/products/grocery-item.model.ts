import { IUser } from '@/shared/model/user.model';
import { IProduct } from '@/shared/model/products/product.model';
import { IProductUnit } from '@/shared/model/products/product-unit.model';

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

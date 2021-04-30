import { IProduct } from '@/shared/model/products/product.model';

export interface IProductCategory {
  id?: number;
  name?: string;
  products?: IProduct[] | null;
}

export class ProductCategory implements IProductCategory {
  constructor(public id?: number, public name?: string, public products?: IProduct[] | null) {}
}

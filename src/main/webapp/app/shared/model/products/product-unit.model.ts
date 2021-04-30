import { IProduct } from '@/shared/model/products/product.model';

export interface IProductUnit {
  id?: number;
  name?: string;
  products?: IProduct[] | null;
}

export class ProductUnit implements IProductUnit {
  constructor(public id?: number, public name?: string, public products?: IProduct[] | null) {}
}

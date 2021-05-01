import { IProduct } from 'app/entities/products/product/product.model';

export interface IProductUnit {
  id?: number;
  name?: string;
  products?: IProduct[] | null;
}

export class ProductUnit implements IProductUnit {
  constructor(public id?: number, public name?: string, public products?: IProduct[] | null) {}
}

export function getProductUnitIdentifier(productUnit: IProductUnit): number | undefined {
  return productUnit.id;
}

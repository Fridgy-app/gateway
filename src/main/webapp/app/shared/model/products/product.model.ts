import { IProductCategory } from '@/shared/model/products/product-category.model';
import { IProductUnit } from '@/shared/model/products/product-unit.model';

export interface IProduct {
  id?: number;
  name?: string;
  eanCode?: string | null;
  productCategory?: IProductCategory | null;
  productUnit?: IProductUnit | null;
}

export class Product implements IProduct {
  constructor(
    public id?: number,
    public name?: string,
    public eanCode?: string | null,
    public productCategory?: IProductCategory | null,
    public productUnit?: IProductUnit | null
  ) {}
}

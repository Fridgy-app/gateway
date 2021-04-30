import { IProductUnit } from '@/shared/model/products/product-unit.model';
import { IProductCategory } from '@/shared/model/products/product-category.model';

export interface IProduct {
  id?: number;
  name?: string;
  eanCode?: string | null;
  productUnits?: IProductUnit[] | null;
  productCategory?: IProductCategory | null;
}

export class Product implements IProduct {
  constructor(
    public id?: number,
    public name?: string,
    public eanCode?: string | null,
    public productUnits?: IProductUnit[] | null,
    public productCategory?: IProductCategory | null
  ) {}
}

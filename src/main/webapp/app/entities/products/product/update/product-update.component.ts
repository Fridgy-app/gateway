import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IProduct, Product } from '../product.model';
import { ProductService } from '../service/product.service';
import { IProductUnit } from 'app/entities/products/product-unit/product-unit.model';
import { ProductUnitService } from 'app/entities/products/product-unit/service/product-unit.service';
import { IProductCategory } from 'app/entities/products/product-category/product-category.model';
import { ProductCategoryService } from 'app/entities/products/product-category/service/product-category.service';

@Component({
  selector: 'jhi-product-update',
  templateUrl: './product-update.component.html',
})
export class ProductUpdateComponent implements OnInit {
  isSaving = false;

  productUnitsSharedCollection: IProductUnit[] = [];
  productCategoriesSharedCollection: IProductCategory[] = [];

  editForm = this.fb.group({
    id: [],
    name: [null, [Validators.required]],
    eanCode: [],
    productUnits: [],
    productCategory: [],
  });

  constructor(
    protected productService: ProductService,
    protected productUnitService: ProductUnitService,
    protected productCategoryService: ProductCategoryService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ product }) => {
      this.updateForm(product);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const product = this.createFromForm();
    if (product.id !== undefined) {
      this.subscribeToSaveResponse(this.productService.update(product));
    } else {
      this.subscribeToSaveResponse(this.productService.create(product));
    }
  }

  trackProductUnitById(index: number, item: IProductUnit): number {
    return item.id!;
  }

  trackProductCategoryById(index: number, item: IProductCategory): number {
    return item.id!;
  }

  getSelectedProductUnit(option: IProductUnit, selectedVals?: IProductUnit[]): IProductUnit {
    if (selectedVals) {
      for (const selectedVal of selectedVals) {
        if (option.id === selectedVal.id) {
          return selectedVal;
        }
      }
    }
    return option;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IProduct>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(product: IProduct): void {
    this.editForm.patchValue({
      id: product.id,
      name: product.name,
      eanCode: product.eanCode,
      productUnits: product.productUnits,
      productCategory: product.productCategory,
    });

    this.productUnitsSharedCollection = this.productUnitService.addProductUnitToCollectionIfMissing(
      this.productUnitsSharedCollection,
      ...(product.productUnits ?? [])
    );
    this.productCategoriesSharedCollection = this.productCategoryService.addProductCategoryToCollectionIfMissing(
      this.productCategoriesSharedCollection,
      product.productCategory
    );
  }

  protected loadRelationshipsOptions(): void {
    this.productUnitService
      .query()
      .pipe(map((res: HttpResponse<IProductUnit[]>) => res.body ?? []))
      .pipe(
        map((productUnits: IProductUnit[]) =>
          this.productUnitService.addProductUnitToCollectionIfMissing(productUnits, ...(this.editForm.get('productUnits')!.value ?? []))
        )
      )
      .subscribe((productUnits: IProductUnit[]) => (this.productUnitsSharedCollection = productUnits));

    this.productCategoryService
      .query()
      .pipe(map((res: HttpResponse<IProductCategory[]>) => res.body ?? []))
      .pipe(
        map((productCategories: IProductCategory[]) =>
          this.productCategoryService.addProductCategoryToCollectionIfMissing(
            productCategories,
            this.editForm.get('productCategory')!.value
          )
        )
      )
      .subscribe((productCategories: IProductCategory[]) => (this.productCategoriesSharedCollection = productCategories));
  }

  protected createFromForm(): IProduct {
    return {
      ...new Product(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      eanCode: this.editForm.get(['eanCode'])!.value,
      productUnits: this.editForm.get(['productUnits'])!.value,
      productCategory: this.editForm.get(['productCategory'])!.value,
    };
  }
}

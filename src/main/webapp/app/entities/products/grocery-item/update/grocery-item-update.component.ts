import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IGroceryItem, GroceryItem } from '../grocery-item.model';
import { GroceryItemService } from '../service/grocery-item.service';
import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';
import { IProduct } from 'app/entities/products/product/product.model';
import { ProductService } from 'app/entities/products/product/service/product.service';
import { IProductUnit } from 'app/entities/products/product-unit/product-unit.model';
import { ProductUnitService } from 'app/entities/products/product-unit/service/product-unit.service';

@Component({
  selector: 'jhi-grocery-item-update',
  templateUrl: './grocery-item-update.component.html',
})
export class GroceryItemUpdateComponent implements OnInit {
  isSaving = false;

  usersSharedCollection: IUser[] = [];
  productsSharedCollection: IProduct[] = [];
  productUnitsSharedCollection: IProductUnit[] = [];

  editForm = this.fb.group({
    id: [],
    quantity: [],
    description: [],
    user: [],
    product: [],
    unit: [],
  });

  constructor(
    protected groceryItemService: GroceryItemService,
    protected userService: UserService,
    protected productService: ProductService,
    protected productUnitService: ProductUnitService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ groceryItem }) => {
      this.updateForm(groceryItem);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const groceryItem = this.createFromForm();
    if (groceryItem.id !== undefined) {
      this.subscribeToSaveResponse(this.groceryItemService.update(groceryItem));
    } else {
      this.subscribeToSaveResponse(this.groceryItemService.create(groceryItem));
    }
  }

  trackUserById(index: number, item: IUser): string {
    return item.id!;
  }

  trackProductById(index: number, item: IProduct): number {
    return item.id!;
  }

  trackProductUnitById(index: number, item: IProductUnit): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IGroceryItem>>): void {
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

  protected updateForm(groceryItem: IGroceryItem): void {
    this.editForm.patchValue({
      id: groceryItem.id,
      quantity: groceryItem.quantity,
      description: groceryItem.description,
      user: groceryItem.user,
      product: groceryItem.product,
      unit: groceryItem.unit,
    });

    this.usersSharedCollection = this.userService.addUserToCollectionIfMissing(this.usersSharedCollection, groceryItem.user);
    this.productsSharedCollection = this.productService.addProductToCollectionIfMissing(this.productsSharedCollection, groceryItem.product);
    this.productUnitsSharedCollection = this.productUnitService.addProductUnitToCollectionIfMissing(
      this.productUnitsSharedCollection,
      groceryItem.unit
    );
  }

  protected loadRelationshipsOptions(): void {
    this.userService
      .query()
      .pipe(map((res: HttpResponse<IUser[]>) => res.body ?? []))
      .pipe(map((users: IUser[]) => this.userService.addUserToCollectionIfMissing(users, this.editForm.get('user')!.value)))
      .subscribe((users: IUser[]) => (this.usersSharedCollection = users));

    this.productService
      .query()
      .pipe(map((res: HttpResponse<IProduct[]>) => res.body ?? []))
      .pipe(
        map((products: IProduct[]) => this.productService.addProductToCollectionIfMissing(products, this.editForm.get('product')!.value))
      )
      .subscribe((products: IProduct[]) => (this.productsSharedCollection = products));

    this.productUnitService
      .query()
      .pipe(map((res: HttpResponse<IProductUnit[]>) => res.body ?? []))
      .pipe(
        map((productUnits: IProductUnit[]) =>
          this.productUnitService.addProductUnitToCollectionIfMissing(productUnits, this.editForm.get('unit')!.value)
        )
      )
      .subscribe((productUnits: IProductUnit[]) => (this.productUnitsSharedCollection = productUnits));
  }

  protected createFromForm(): IGroceryItem {
    return {
      ...new GroceryItem(),
      id: this.editForm.get(['id'])!.value,
      quantity: this.editForm.get(['quantity'])!.value,
      description: this.editForm.get(['description'])!.value,
      user: this.editForm.get(['user'])!.value,
      product: this.editForm.get(['product'])!.value,
      unit: this.editForm.get(['unit'])!.value,
    };
  }
}

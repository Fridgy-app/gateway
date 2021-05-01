import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IRecipeIngredient, RecipeIngredient } from '../recipe-ingredient.model';
import { RecipeIngredientService } from '../service/recipe-ingredient.service';
import { IProduct } from 'app/entities/products/product/product.model';
import { ProductService } from 'app/entities/products/product/service/product.service';
import { IProductUnit } from 'app/entities/products/product-unit/product-unit.model';
import { ProductUnitService } from 'app/entities/products/product-unit/service/product-unit.service';
import { IRecipe } from 'app/entities/products/recipe/recipe.model';
import { RecipeService } from 'app/entities/products/recipe/service/recipe.service';

@Component({
  selector: 'jhi-recipe-ingredient-update',
  templateUrl: './recipe-ingredient-update.component.html',
})
export class RecipeIngredientUpdateComponent implements OnInit {
  isSaving = false;

  productsSharedCollection: IProduct[] = [];
  productUnitsSharedCollection: IProductUnit[] = [];
  recipesSharedCollection: IRecipe[] = [];

  editForm = this.fb.group({
    id: [],
    quantity: [],
    product: [],
    productUnit: [],
    recipe: [],
  });

  constructor(
    protected recipeIngredientService: RecipeIngredientService,
    protected productService: ProductService,
    protected productUnitService: ProductUnitService,
    protected recipeService: RecipeService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ recipeIngredient }) => {
      this.updateForm(recipeIngredient);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const recipeIngredient = this.createFromForm();
    if (recipeIngredient.id !== undefined) {
      this.subscribeToSaveResponse(this.recipeIngredientService.update(recipeIngredient));
    } else {
      this.subscribeToSaveResponse(this.recipeIngredientService.create(recipeIngredient));
    }
  }

  trackProductById(index: number, item: IProduct): number {
    return item.id!;
  }

  trackProductUnitById(index: number, item: IProductUnit): number {
    return item.id!;
  }

  trackRecipeById(index: number, item: IRecipe): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IRecipeIngredient>>): void {
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

  protected updateForm(recipeIngredient: IRecipeIngredient): void {
    this.editForm.patchValue({
      id: recipeIngredient.id,
      quantity: recipeIngredient.quantity,
      product: recipeIngredient.product,
      productUnit: recipeIngredient.productUnit,
      recipe: recipeIngredient.recipe,
    });

    this.productsSharedCollection = this.productService.addProductToCollectionIfMissing(
      this.productsSharedCollection,
      recipeIngredient.product
    );
    this.productUnitsSharedCollection = this.productUnitService.addProductUnitToCollectionIfMissing(
      this.productUnitsSharedCollection,
      recipeIngredient.productUnit
    );
    this.recipesSharedCollection = this.recipeService.addRecipeToCollectionIfMissing(this.recipesSharedCollection, recipeIngredient.recipe);
  }

  protected loadRelationshipsOptions(): void {
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
          this.productUnitService.addProductUnitToCollectionIfMissing(productUnits, this.editForm.get('productUnit')!.value)
        )
      )
      .subscribe((productUnits: IProductUnit[]) => (this.productUnitsSharedCollection = productUnits));

    this.recipeService
      .query()
      .pipe(map((res: HttpResponse<IRecipe[]>) => res.body ?? []))
      .pipe(map((recipes: IRecipe[]) => this.recipeService.addRecipeToCollectionIfMissing(recipes, this.editForm.get('recipe')!.value)))
      .subscribe((recipes: IRecipe[]) => (this.recipesSharedCollection = recipes));
  }

  protected createFromForm(): IRecipeIngredient {
    return {
      ...new RecipeIngredient(),
      id: this.editForm.get(['id'])!.value,
      quantity: this.editForm.get(['quantity'])!.value,
      product: this.editForm.get(['product'])!.value,
      productUnit: this.editForm.get(['productUnit'])!.value,
      recipe: this.editForm.get(['recipe'])!.value,
    };
  }
}

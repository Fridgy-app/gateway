jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { RecipeIngredientService } from '../service/recipe-ingredient.service';
import { IRecipeIngredient, RecipeIngredient } from '../recipe-ingredient.model';
import { IProduct } from 'app/entities/products/product/product.model';
import { ProductService } from 'app/entities/products/product/service/product.service';
import { IProductUnit } from 'app/entities/products/product-unit/product-unit.model';
import { ProductUnitService } from 'app/entities/products/product-unit/service/product-unit.service';
import { IRecipe } from 'app/entities/products/recipe/recipe.model';
import { RecipeService } from 'app/entities/products/recipe/service/recipe.service';

import { RecipeIngredientUpdateComponent } from './recipe-ingredient-update.component';

describe('Component Tests', () => {
  describe('RecipeIngredient Management Update Component', () => {
    let comp: RecipeIngredientUpdateComponent;
    let fixture: ComponentFixture<RecipeIngredientUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let recipeIngredientService: RecipeIngredientService;
    let productService: ProductService;
    let productUnitService: ProductUnitService;
    let recipeService: RecipeService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [RecipeIngredientUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(RecipeIngredientUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(RecipeIngredientUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      recipeIngredientService = TestBed.inject(RecipeIngredientService);
      productService = TestBed.inject(ProductService);
      productUnitService = TestBed.inject(ProductUnitService);
      recipeService = TestBed.inject(RecipeService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call Product query and add missing value', () => {
        const recipeIngredient: IRecipeIngredient = { id: 456 };
        const product: IProduct = { id: 67141 };
        recipeIngredient.product = product;

        const productCollection: IProduct[] = [{ id: 78804 }];
        spyOn(productService, 'query').and.returnValue(of(new HttpResponse({ body: productCollection })));
        const additionalProducts = [product];
        const expectedCollection: IProduct[] = [...additionalProducts, ...productCollection];
        spyOn(productService, 'addProductToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ recipeIngredient });
        comp.ngOnInit();

        expect(productService.query).toHaveBeenCalled();
        expect(productService.addProductToCollectionIfMissing).toHaveBeenCalledWith(productCollection, ...additionalProducts);
        expect(comp.productsSharedCollection).toEqual(expectedCollection);
      });

      it('Should call ProductUnit query and add missing value', () => {
        const recipeIngredient: IRecipeIngredient = { id: 456 };
        const productUnit: IProductUnit = { id: 59697 };
        recipeIngredient.productUnit = productUnit;

        const productUnitCollection: IProductUnit[] = [{ id: 95585 }];
        spyOn(productUnitService, 'query').and.returnValue(of(new HttpResponse({ body: productUnitCollection })));
        const additionalProductUnits = [productUnit];
        const expectedCollection: IProductUnit[] = [...additionalProductUnits, ...productUnitCollection];
        spyOn(productUnitService, 'addProductUnitToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ recipeIngredient });
        comp.ngOnInit();

        expect(productUnitService.query).toHaveBeenCalled();
        expect(productUnitService.addProductUnitToCollectionIfMissing).toHaveBeenCalledWith(
          productUnitCollection,
          ...additionalProductUnits
        );
        expect(comp.productUnitsSharedCollection).toEqual(expectedCollection);
      });

      it('Should call Recipe query and add missing value', () => {
        const recipeIngredient: IRecipeIngredient = { id: 456 };
        const recipe: IRecipe = { id: 2515 };
        recipeIngredient.recipe = recipe;

        const recipeCollection: IRecipe[] = [{ id: 78793 }];
        spyOn(recipeService, 'query').and.returnValue(of(new HttpResponse({ body: recipeCollection })));
        const additionalRecipes = [recipe];
        const expectedCollection: IRecipe[] = [...additionalRecipes, ...recipeCollection];
        spyOn(recipeService, 'addRecipeToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ recipeIngredient });
        comp.ngOnInit();

        expect(recipeService.query).toHaveBeenCalled();
        expect(recipeService.addRecipeToCollectionIfMissing).toHaveBeenCalledWith(recipeCollection, ...additionalRecipes);
        expect(comp.recipesSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const recipeIngredient: IRecipeIngredient = { id: 456 };
        const product: IProduct = { id: 58366 };
        recipeIngredient.product = product;
        const productUnit: IProductUnit = { id: 411 };
        recipeIngredient.productUnit = productUnit;
        const recipe: IRecipe = { id: 38777 };
        recipeIngredient.recipe = recipe;

        activatedRoute.data = of({ recipeIngredient });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(recipeIngredient));
        expect(comp.productsSharedCollection).toContain(product);
        expect(comp.productUnitsSharedCollection).toContain(productUnit);
        expect(comp.recipesSharedCollection).toContain(recipe);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const recipeIngredient = { id: 123 };
        spyOn(recipeIngredientService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ recipeIngredient });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: recipeIngredient }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(recipeIngredientService.update).toHaveBeenCalledWith(recipeIngredient);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const recipeIngredient = new RecipeIngredient();
        spyOn(recipeIngredientService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ recipeIngredient });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: recipeIngredient }));
        saveSubject.complete();

        // THEN
        expect(recipeIngredientService.create).toHaveBeenCalledWith(recipeIngredient);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const recipeIngredient = { id: 123 };
        spyOn(recipeIngredientService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ recipeIngredient });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(recipeIngredientService.update).toHaveBeenCalledWith(recipeIngredient);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackProductById', () => {
        it('Should return tracked Product primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackProductById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });

      describe('trackProductUnitById', () => {
        it('Should return tracked ProductUnit primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackProductUnitById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });

      describe('trackRecipeById', () => {
        it('Should return tracked Recipe primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackRecipeById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });
  });
});

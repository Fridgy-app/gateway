jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { ProductService } from '../service/product.service';
import { IProduct, Product } from '../product.model';
import { IProductUnit } from 'app/entities/products/product-unit/product-unit.model';
import { ProductUnitService } from 'app/entities/products/product-unit/service/product-unit.service';
import { IProductCategory } from 'app/entities/products/product-category/product-category.model';
import { ProductCategoryService } from 'app/entities/products/product-category/service/product-category.service';

import { ProductUpdateComponent } from './product-update.component';

describe('Component Tests', () => {
  describe('Product Management Update Component', () => {
    let comp: ProductUpdateComponent;
    let fixture: ComponentFixture<ProductUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let productService: ProductService;
    let productUnitService: ProductUnitService;
    let productCategoryService: ProductCategoryService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [ProductUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(ProductUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(ProductUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      productService = TestBed.inject(ProductService);
      productUnitService = TestBed.inject(ProductUnitService);
      productCategoryService = TestBed.inject(ProductCategoryService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call ProductUnit query and add missing value', () => {
        const product: IProduct = { id: 456 };
        const productUnits: IProductUnit[] = [{ id: 36420 }];
        product.productUnits = productUnits;

        const productUnitCollection: IProductUnit[] = [{ id: 55603 }];
        spyOn(productUnitService, 'query').and.returnValue(of(new HttpResponse({ body: productUnitCollection })));
        const additionalProductUnits = [...productUnits];
        const expectedCollection: IProductUnit[] = [...additionalProductUnits, ...productUnitCollection];
        spyOn(productUnitService, 'addProductUnitToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ product });
        comp.ngOnInit();

        expect(productUnitService.query).toHaveBeenCalled();
        expect(productUnitService.addProductUnitToCollectionIfMissing).toHaveBeenCalledWith(
          productUnitCollection,
          ...additionalProductUnits
        );
        expect(comp.productUnitsSharedCollection).toEqual(expectedCollection);
      });

      it('Should call ProductCategory query and add missing value', () => {
        const product: IProduct = { id: 456 };
        const productCategory: IProductCategory = { id: 2462 };
        product.productCategory = productCategory;

        const productCategoryCollection: IProductCategory[] = [{ id: 13314 }];
        spyOn(productCategoryService, 'query').and.returnValue(of(new HttpResponse({ body: productCategoryCollection })));
        const additionalProductCategories = [productCategory];
        const expectedCollection: IProductCategory[] = [...additionalProductCategories, ...productCategoryCollection];
        spyOn(productCategoryService, 'addProductCategoryToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ product });
        comp.ngOnInit();

        expect(productCategoryService.query).toHaveBeenCalled();
        expect(productCategoryService.addProductCategoryToCollectionIfMissing).toHaveBeenCalledWith(
          productCategoryCollection,
          ...additionalProductCategories
        );
        expect(comp.productCategoriesSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const product: IProduct = { id: 456 };
        const productUnits: IProductUnit = { id: 63409 };
        product.productUnits = [productUnits];
        const productCategory: IProductCategory = { id: 37388 };
        product.productCategory = productCategory;

        activatedRoute.data = of({ product });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(product));
        expect(comp.productUnitsSharedCollection).toContain(productUnits);
        expect(comp.productCategoriesSharedCollection).toContain(productCategory);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const product = { id: 123 };
        spyOn(productService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ product });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: product }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(productService.update).toHaveBeenCalledWith(product);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const product = new Product();
        spyOn(productService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ product });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: product }));
        saveSubject.complete();

        // THEN
        expect(productService.create).toHaveBeenCalledWith(product);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const product = { id: 123 };
        spyOn(productService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ product });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(productService.update).toHaveBeenCalledWith(product);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackProductUnitById', () => {
        it('Should return tracked ProductUnit primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackProductUnitById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });

      describe('trackProductCategoryById', () => {
        it('Should return tracked ProductCategory primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackProductCategoryById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });

    describe('Getting selected relationships', () => {
      describe('getSelectedProductUnit', () => {
        it('Should return option if no ProductUnit is selected', () => {
          const option = { id: 123 };
          const result = comp.getSelectedProductUnit(option);
          expect(result === option).toEqual(true);
        });

        it('Should return selected ProductUnit for according option', () => {
          const option = { id: 123 };
          const selected = { id: 123 };
          const selected2 = { id: 456 };
          const result = comp.getSelectedProductUnit(option, [selected2, selected]);
          expect(result === selected).toEqual(true);
          expect(result === selected2).toEqual(false);
          expect(result === option).toEqual(false);
        });

        it('Should return option if this ProductUnit is not selected', () => {
          const option = { id: 123 };
          const selected = { id: 456 };
          const result = comp.getSelectedProductUnit(option, [selected]);
          expect(result === option).toEqual(true);
          expect(result === selected).toEqual(false);
        });
      });
    });
  });
});

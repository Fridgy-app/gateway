jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { GroceryItemService } from '../service/grocery-item.service';
import { IGroceryItem, GroceryItem } from '../grocery-item.model';

import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';
import { IProduct } from 'app/entities/products/product/product.model';
import { ProductService } from 'app/entities/products/product/service/product.service';
import { IProductUnit } from 'app/entities/products/product-unit/product-unit.model';
import { ProductUnitService } from 'app/entities/products/product-unit/service/product-unit.service';

import { GroceryItemUpdateComponent } from './grocery-item-update.component';

describe('Component Tests', () => {
  describe('GroceryItem Management Update Component', () => {
    let comp: GroceryItemUpdateComponent;
    let fixture: ComponentFixture<GroceryItemUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let groceryItemService: GroceryItemService;
    let userService: UserService;
    let productService: ProductService;
    let productUnitService: ProductUnitService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [GroceryItemUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(GroceryItemUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(GroceryItemUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      groceryItemService = TestBed.inject(GroceryItemService);
      userService = TestBed.inject(UserService);
      productService = TestBed.inject(ProductService);
      productUnitService = TestBed.inject(ProductUnitService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call User query and add missing value', () => {
        const groceryItem: IGroceryItem = { id: 456 };
        const user: IUser = { id: 'Investment' };
        groceryItem.user = user;

        const userCollection: IUser[] = [{ id: 'Honduras initiatives SSL' }];
        spyOn(userService, 'query').and.returnValue(of(new HttpResponse({ body: userCollection })));
        const additionalUsers = [user];
        const expectedCollection: IUser[] = [...additionalUsers, ...userCollection];
        spyOn(userService, 'addUserToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ groceryItem });
        comp.ngOnInit();

        expect(userService.query).toHaveBeenCalled();
        expect(userService.addUserToCollectionIfMissing).toHaveBeenCalledWith(userCollection, ...additionalUsers);
        expect(comp.usersSharedCollection).toEqual(expectedCollection);
      });

      it('Should call Product query and add missing value', () => {
        const groceryItem: IGroceryItem = { id: 456 };
        const product: IProduct = { id: 46007 };
        groceryItem.product = product;

        const productCollection: IProduct[] = [{ id: 77380 }];
        spyOn(productService, 'query').and.returnValue(of(new HttpResponse({ body: productCollection })));
        const additionalProducts = [product];
        const expectedCollection: IProduct[] = [...additionalProducts, ...productCollection];
        spyOn(productService, 'addProductToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ groceryItem });
        comp.ngOnInit();

        expect(productService.query).toHaveBeenCalled();
        expect(productService.addProductToCollectionIfMissing).toHaveBeenCalledWith(productCollection, ...additionalProducts);
        expect(comp.productsSharedCollection).toEqual(expectedCollection);
      });

      it('Should call ProductUnit query and add missing value', () => {
        const groceryItem: IGroceryItem = { id: 456 };
        const unit: IProductUnit = { id: 89946 };
        groceryItem.unit = unit;

        const productUnitCollection: IProductUnit[] = [{ id: 82147 }];
        spyOn(productUnitService, 'query').and.returnValue(of(new HttpResponse({ body: productUnitCollection })));
        const additionalProductUnits = [unit];
        const expectedCollection: IProductUnit[] = [...additionalProductUnits, ...productUnitCollection];
        spyOn(productUnitService, 'addProductUnitToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ groceryItem });
        comp.ngOnInit();

        expect(productUnitService.query).toHaveBeenCalled();
        expect(productUnitService.addProductUnitToCollectionIfMissing).toHaveBeenCalledWith(
          productUnitCollection,
          ...additionalProductUnits
        );
        expect(comp.productUnitsSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const groceryItem: IGroceryItem = { id: 456 };
        const user: IUser = { id: 'Table Shirt' };
        groceryItem.user = user;
        const product: IProduct = { id: 4565 };
        groceryItem.product = product;
        const unit: IProductUnit = { id: 96883 };
        groceryItem.unit = unit;

        activatedRoute.data = of({ groceryItem });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(groceryItem));
        expect(comp.usersSharedCollection).toContain(user);
        expect(comp.productsSharedCollection).toContain(product);
        expect(comp.productUnitsSharedCollection).toContain(unit);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const groceryItem = { id: 123 };
        spyOn(groceryItemService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ groceryItem });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: groceryItem }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(groceryItemService.update).toHaveBeenCalledWith(groceryItem);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const groceryItem = new GroceryItem();
        spyOn(groceryItemService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ groceryItem });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: groceryItem }));
        saveSubject.complete();

        // THEN
        expect(groceryItemService.create).toHaveBeenCalledWith(groceryItem);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const groceryItem = { id: 123 };
        spyOn(groceryItemService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ groceryItem });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(groceryItemService.update).toHaveBeenCalledWith(groceryItem);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackUserById', () => {
        it('Should return tracked User primary key', () => {
          const entity = { id: 'ABC' };
          const trackResult = comp.trackUserById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });

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
    });
  });
});

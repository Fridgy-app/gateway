jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { ProductUnitService } from '../service/product-unit.service';
import { IProductUnit, ProductUnit } from '../product-unit.model';

import { ProductUnitUpdateComponent } from './product-unit-update.component';

describe('Component Tests', () => {
  describe('ProductUnit Management Update Component', () => {
    let comp: ProductUnitUpdateComponent;
    let fixture: ComponentFixture<ProductUnitUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let productUnitService: ProductUnitService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [ProductUnitUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(ProductUnitUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(ProductUnitUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      productUnitService = TestBed.inject(ProductUnitService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should update editForm', () => {
        const productUnit: IProductUnit = { id: 456 };

        activatedRoute.data = of({ productUnit });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(productUnit));
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const productUnit = { id: 123 };
        spyOn(productUnitService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ productUnit });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: productUnit }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(productUnitService.update).toHaveBeenCalledWith(productUnit);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const productUnit = new ProductUnit();
        spyOn(productUnitService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ productUnit });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: productUnit }));
        saveSubject.complete();

        // THEN
        expect(productUnitService.create).toHaveBeenCalledWith(productUnit);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const productUnit = { id: 123 };
        spyOn(productUnitService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ productUnit });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(productUnitService.update).toHaveBeenCalledWith(productUnit);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });
  });
});

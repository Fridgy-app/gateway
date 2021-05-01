import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ProductUnitDetailComponent } from './product-unit-detail.component';

describe('Component Tests', () => {
  describe('ProductUnit Management Detail Component', () => {
    let comp: ProductUnitDetailComponent;
    let fixture: ComponentFixture<ProductUnitDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [ProductUnitDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ productUnit: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(ProductUnitDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(ProductUnitDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load productUnit on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.productUnit).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});

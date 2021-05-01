jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ProductUnitService } from '../service/product-unit.service';

import { ProductUnitComponent } from './product-unit.component';

describe('Component Tests', () => {
  describe('ProductUnit Management Component', () => {
    let comp: ProductUnitComponent;
    let fixture: ComponentFixture<ProductUnitComponent>;
    let service: ProductUnitService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [ProductUnitComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { snapshot: { queryParams: {} } },
          },
        ],
      })
        .overrideTemplate(ProductUnitComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(ProductUnitComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(ProductUnitService);

      const headers = new HttpHeaders().append('link', 'link;link');
      spyOn(service, 'query').and.returnValue(
        of(
          new HttpResponse({
            body: [{ id: 123 }],
            headers,
          })
        )
      );
    });

    it('Should call load all on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.productUnits?.[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});

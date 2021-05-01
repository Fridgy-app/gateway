jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IProductUnit, ProductUnit } from '../product-unit.model';
import { ProductUnitService } from '../service/product-unit.service';

import { ProductUnitRoutingResolveService } from './product-unit-routing-resolve.service';

describe('Service Tests', () => {
  describe('ProductUnit routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: ProductUnitRoutingResolveService;
    let service: ProductUnitService;
    let resultProductUnit: IProductUnit | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(ProductUnitRoutingResolveService);
      service = TestBed.inject(ProductUnitService);
      resultProductUnit = undefined;
    });

    describe('resolve', () => {
      it('should return IProductUnit returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultProductUnit = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultProductUnit).toEqual({ id: 123 });
      });

      it('should return new IProductUnit if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultProductUnit = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultProductUnit).toEqual(new ProductUnit());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        spyOn(service, 'find').and.returnValue(of(new HttpResponse({ body: null })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultProductUnit = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultProductUnit).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});

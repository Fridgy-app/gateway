jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IGroceryItem, GroceryItem } from '../grocery-item.model';
import { GroceryItemService } from '../service/grocery-item.service';

import { GroceryItemRoutingResolveService } from './grocery-item-routing-resolve.service';

describe('Service Tests', () => {
  describe('GroceryItem routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: GroceryItemRoutingResolveService;
    let service: GroceryItemService;
    let resultGroceryItem: IGroceryItem | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(GroceryItemRoutingResolveService);
      service = TestBed.inject(GroceryItemService);
      resultGroceryItem = undefined;
    });

    describe('resolve', () => {
      it('should return IGroceryItem returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultGroceryItem = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultGroceryItem).toEqual({ id: 123 });
      });

      it('should return new IGroceryItem if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultGroceryItem = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultGroceryItem).toEqual(new GroceryItem());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        spyOn(service, 'find').and.returnValue(of(new HttpResponse({ body: null })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultGroceryItem = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultGroceryItem).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});

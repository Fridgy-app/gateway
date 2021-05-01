jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IRecipeIngredient, RecipeIngredient } from '../recipe-ingredient.model';
import { RecipeIngredientService } from '../service/recipe-ingredient.service';

import { RecipeIngredientRoutingResolveService } from './recipe-ingredient-routing-resolve.service';

describe('Service Tests', () => {
  describe('RecipeIngredient routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: RecipeIngredientRoutingResolveService;
    let service: RecipeIngredientService;
    let resultRecipeIngredient: IRecipeIngredient | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(RecipeIngredientRoutingResolveService);
      service = TestBed.inject(RecipeIngredientService);
      resultRecipeIngredient = undefined;
    });

    describe('resolve', () => {
      it('should return IRecipeIngredient returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultRecipeIngredient = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultRecipeIngredient).toEqual({ id: 123 });
      });

      it('should return new IRecipeIngredient if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultRecipeIngredient = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultRecipeIngredient).toEqual(new RecipeIngredient());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        spyOn(service, 'find').and.returnValue(of(new HttpResponse({ body: null })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultRecipeIngredient = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultRecipeIngredient).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});

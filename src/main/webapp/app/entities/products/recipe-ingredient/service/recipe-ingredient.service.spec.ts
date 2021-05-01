import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IRecipeIngredient, RecipeIngredient } from '../recipe-ingredient.model';

import { RecipeIngredientService } from './recipe-ingredient.service';

describe('Service Tests', () => {
  describe('RecipeIngredient Service', () => {
    let service: RecipeIngredientService;
    let httpMock: HttpTestingController;
    let elemDefault: IRecipeIngredient;
    let expectedResult: IRecipeIngredient | IRecipeIngredient[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(RecipeIngredientService);
      httpMock = TestBed.inject(HttpTestingController);

      elemDefault = {
        id: 0,
        quantity: 0,
      };
    });

    describe('Service methods', () => {
      it('should find an element', () => {
        const returnedFromService = Object.assign({}, elemDefault);

        service.find(123).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(elemDefault);
      });

      it('should create a RecipeIngredient', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new RecipeIngredient()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a RecipeIngredient', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            quantity: 1,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a RecipeIngredient', () => {
        const patchObject = Object.assign({}, new RecipeIngredient());

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign({}, returnedFromService);

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of RecipeIngredient', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            quantity: 1,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.query().subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush([returnedFromService]);
        httpMock.verify();
        expect(expectedResult).toContainEqual(expected);
      });

      it('should delete a RecipeIngredient', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addRecipeIngredientToCollectionIfMissing', () => {
        it('should add a RecipeIngredient to an empty array', () => {
          const recipeIngredient: IRecipeIngredient = { id: 123 };
          expectedResult = service.addRecipeIngredientToCollectionIfMissing([], recipeIngredient);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(recipeIngredient);
        });

        it('should not add a RecipeIngredient to an array that contains it', () => {
          const recipeIngredient: IRecipeIngredient = { id: 123 };
          const recipeIngredientCollection: IRecipeIngredient[] = [
            {
              ...recipeIngredient,
            },
            { id: 456 },
          ];
          expectedResult = service.addRecipeIngredientToCollectionIfMissing(recipeIngredientCollection, recipeIngredient);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a RecipeIngredient to an array that doesn't contain it", () => {
          const recipeIngredient: IRecipeIngredient = { id: 123 };
          const recipeIngredientCollection: IRecipeIngredient[] = [{ id: 456 }];
          expectedResult = service.addRecipeIngredientToCollectionIfMissing(recipeIngredientCollection, recipeIngredient);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(recipeIngredient);
        });

        it('should add only unique RecipeIngredient to an array', () => {
          const recipeIngredientArray: IRecipeIngredient[] = [{ id: 123 }, { id: 456 }, { id: 26824 }];
          const recipeIngredientCollection: IRecipeIngredient[] = [{ id: 123 }];
          expectedResult = service.addRecipeIngredientToCollectionIfMissing(recipeIngredientCollection, ...recipeIngredientArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const recipeIngredient: IRecipeIngredient = { id: 123 };
          const recipeIngredient2: IRecipeIngredient = { id: 456 };
          expectedResult = service.addRecipeIngredientToCollectionIfMissing([], recipeIngredient, recipeIngredient2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(recipeIngredient);
          expect(expectedResult).toContain(recipeIngredient2);
        });

        it('should accept null and undefined values', () => {
          const recipeIngredient: IRecipeIngredient = { id: 123 };
          expectedResult = service.addRecipeIngredientToCollectionIfMissing([], null, recipeIngredient, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(recipeIngredient);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});

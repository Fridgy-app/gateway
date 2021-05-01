import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IGroceryItem, GroceryItem } from '../grocery-item.model';

import { GroceryItemService } from './grocery-item.service';

describe('Service Tests', () => {
  describe('GroceryItem Service', () => {
    let service: GroceryItemService;
    let httpMock: HttpTestingController;
    let elemDefault: IGroceryItem;
    let expectedResult: IGroceryItem | IGroceryItem[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(GroceryItemService);
      httpMock = TestBed.inject(HttpTestingController);

      elemDefault = {
        id: 0,
        quantity: 0,
        description: 'AAAAAAA',
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

      it('should create a GroceryItem', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new GroceryItem()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a GroceryItem', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            quantity: 1,
            description: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a GroceryItem', () => {
        const patchObject = Object.assign(
          {
            quantity: 1,
          },
          new GroceryItem()
        );

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign({}, returnedFromService);

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of GroceryItem', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            quantity: 1,
            description: 'BBBBBB',
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

      it('should delete a GroceryItem', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addGroceryItemToCollectionIfMissing', () => {
        it('should add a GroceryItem to an empty array', () => {
          const groceryItem: IGroceryItem = { id: 123 };
          expectedResult = service.addGroceryItemToCollectionIfMissing([], groceryItem);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(groceryItem);
        });

        it('should not add a GroceryItem to an array that contains it', () => {
          const groceryItem: IGroceryItem = { id: 123 };
          const groceryItemCollection: IGroceryItem[] = [
            {
              ...groceryItem,
            },
            { id: 456 },
          ];
          expectedResult = service.addGroceryItemToCollectionIfMissing(groceryItemCollection, groceryItem);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a GroceryItem to an array that doesn't contain it", () => {
          const groceryItem: IGroceryItem = { id: 123 };
          const groceryItemCollection: IGroceryItem[] = [{ id: 456 }];
          expectedResult = service.addGroceryItemToCollectionIfMissing(groceryItemCollection, groceryItem);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(groceryItem);
        });

        it('should add only unique GroceryItem to an array', () => {
          const groceryItemArray: IGroceryItem[] = [{ id: 123 }, { id: 456 }, { id: 4719 }];
          const groceryItemCollection: IGroceryItem[] = [{ id: 123 }];
          expectedResult = service.addGroceryItemToCollectionIfMissing(groceryItemCollection, ...groceryItemArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const groceryItem: IGroceryItem = { id: 123 };
          const groceryItem2: IGroceryItem = { id: 456 };
          expectedResult = service.addGroceryItemToCollectionIfMissing([], groceryItem, groceryItem2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(groceryItem);
          expect(expectedResult).toContain(groceryItem2);
        });

        it('should accept null and undefined values', () => {
          const groceryItem: IGroceryItem = { id: 123 };
          expectedResult = service.addGroceryItemToCollectionIfMissing([], null, groceryItem, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(groceryItem);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});

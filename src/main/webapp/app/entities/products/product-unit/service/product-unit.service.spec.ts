import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IProductUnit, ProductUnit } from '../product-unit.model';

import { ProductUnitService } from './product-unit.service';

describe('Service Tests', () => {
  describe('ProductUnit Service', () => {
    let service: ProductUnitService;
    let httpMock: HttpTestingController;
    let elemDefault: IProductUnit;
    let expectedResult: IProductUnit | IProductUnit[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(ProductUnitService);
      httpMock = TestBed.inject(HttpTestingController);

      elemDefault = {
        id: 0,
        name: 'AAAAAAA',
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

      it('should create a ProductUnit', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new ProductUnit()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a ProductUnit', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            name: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a ProductUnit', () => {
        const patchObject = Object.assign({}, new ProductUnit());

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign({}, returnedFromService);

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of ProductUnit', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            name: 'BBBBBB',
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

      it('should delete a ProductUnit', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addProductUnitToCollectionIfMissing', () => {
        it('should add a ProductUnit to an empty array', () => {
          const productUnit: IProductUnit = { id: 123 };
          expectedResult = service.addProductUnitToCollectionIfMissing([], productUnit);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(productUnit);
        });

        it('should not add a ProductUnit to an array that contains it', () => {
          const productUnit: IProductUnit = { id: 123 };
          const productUnitCollection: IProductUnit[] = [
            {
              ...productUnit,
            },
            { id: 456 },
          ];
          expectedResult = service.addProductUnitToCollectionIfMissing(productUnitCollection, productUnit);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a ProductUnit to an array that doesn't contain it", () => {
          const productUnit: IProductUnit = { id: 123 };
          const productUnitCollection: IProductUnit[] = [{ id: 456 }];
          expectedResult = service.addProductUnitToCollectionIfMissing(productUnitCollection, productUnit);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(productUnit);
        });

        it('should add only unique ProductUnit to an array', () => {
          const productUnitArray: IProductUnit[] = [{ id: 123 }, { id: 456 }, { id: 89415 }];
          const productUnitCollection: IProductUnit[] = [{ id: 123 }];
          expectedResult = service.addProductUnitToCollectionIfMissing(productUnitCollection, ...productUnitArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const productUnit: IProductUnit = { id: 123 };
          const productUnit2: IProductUnit = { id: 456 };
          expectedResult = service.addProductUnitToCollectionIfMissing([], productUnit, productUnit2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(productUnit);
          expect(expectedResult).toContain(productUnit2);
        });

        it('should accept null and undefined values', () => {
          const productUnit: IProductUnit = { id: 123 };
          expectedResult = service.addProductUnitToCollectionIfMissing([], null, productUnit, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(productUnit);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});

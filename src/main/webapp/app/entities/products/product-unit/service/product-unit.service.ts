import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { Search } from 'app/core/request/request.model';
import { IProductUnit, getProductUnitIdentifier } from '../product-unit.model';

export type EntityResponseType = HttpResponse<IProductUnit>;
export type EntityArrayResponseType = HttpResponse<IProductUnit[]>;

@Injectable({ providedIn: 'root' })
export class ProductUnitService {
  public resourceUrl = this.applicationConfigService.getEndpointFor('api/product-units', 'products');
  public resourceSearchUrl = this.applicationConfigService.getEndpointFor('api/_search/product-units', 'products');

  constructor(protected http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  create(productUnit: IProductUnit): Observable<EntityResponseType> {
    return this.http.post<IProductUnit>(this.resourceUrl, productUnit, { observe: 'response' });
  }

  update(productUnit: IProductUnit): Observable<EntityResponseType> {
    return this.http.put<IProductUnit>(`${this.resourceUrl}/${getProductUnitIdentifier(productUnit) as number}`, productUnit, {
      observe: 'response',
    });
  }

  partialUpdate(productUnit: IProductUnit): Observable<EntityResponseType> {
    return this.http.patch<IProductUnit>(`${this.resourceUrl}/${getProductUnitIdentifier(productUnit) as number}`, productUnit, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IProductUnit>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IProductUnit[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  search(req: Search): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IProductUnit[]>(this.resourceSearchUrl, { params: options, observe: 'response' });
  }

  addProductUnitToCollectionIfMissing(
    productUnitCollection: IProductUnit[],
    ...productUnitsToCheck: (IProductUnit | null | undefined)[]
  ): IProductUnit[] {
    const productUnits: IProductUnit[] = productUnitsToCheck.filter(isPresent);
    if (productUnits.length > 0) {
      const productUnitCollectionIdentifiers = productUnitCollection.map(productUnitItem => getProductUnitIdentifier(productUnitItem)!);
      const productUnitsToAdd = productUnits.filter(productUnitItem => {
        const productUnitIdentifier = getProductUnitIdentifier(productUnitItem);
        if (productUnitIdentifier == null || productUnitCollectionIdentifiers.includes(productUnitIdentifier)) {
          return false;
        }
        productUnitCollectionIdentifiers.push(productUnitIdentifier);
        return true;
      });
      return [...productUnitsToAdd, ...productUnitCollection];
    }
    return productUnitCollection;
  }
}

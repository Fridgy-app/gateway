import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { SearchWithPagination } from 'app/core/request/request.model';
import { IGroceryItem, getGroceryItemIdentifier } from '../grocery-item.model';

export type EntityResponseType = HttpResponse<IGroceryItem>;
export type EntityArrayResponseType = HttpResponse<IGroceryItem[]>;

@Injectable({ providedIn: 'root' })
export class GroceryItemService {
  public resourceUrl = this.applicationConfigService.getEndpointFor('api/grocery-items', 'products');
  public resourceSearchUrl = this.applicationConfigService.getEndpointFor('api/_search/grocery-items', 'products');

  constructor(protected http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  create(groceryItem: IGroceryItem): Observable<EntityResponseType> {
    return this.http.post<IGroceryItem>(this.resourceUrl, groceryItem, { observe: 'response' });
  }

  update(groceryItem: IGroceryItem): Observable<EntityResponseType> {
    return this.http.put<IGroceryItem>(`${this.resourceUrl}/${getGroceryItemIdentifier(groceryItem) as number}`, groceryItem, {
      observe: 'response',
    });
  }

  partialUpdate(groceryItem: IGroceryItem): Observable<EntityResponseType> {
    return this.http.patch<IGroceryItem>(`${this.resourceUrl}/${getGroceryItemIdentifier(groceryItem) as number}`, groceryItem, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IGroceryItem>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IGroceryItem[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  search(req: SearchWithPagination): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IGroceryItem[]>(this.resourceSearchUrl, { params: options, observe: 'response' });
  }

  addGroceryItemToCollectionIfMissing(
    groceryItemCollection: IGroceryItem[],
    ...groceryItemsToCheck: (IGroceryItem | null | undefined)[]
  ): IGroceryItem[] {
    const groceryItems: IGroceryItem[] = groceryItemsToCheck.filter(isPresent);
    if (groceryItems.length > 0) {
      const groceryItemCollectionIdentifiers = groceryItemCollection.map(groceryItemItem => getGroceryItemIdentifier(groceryItemItem)!);
      const groceryItemsToAdd = groceryItems.filter(groceryItemItem => {
        const groceryItemIdentifier = getGroceryItemIdentifier(groceryItemItem);
        if (groceryItemIdentifier == null || groceryItemCollectionIdentifiers.includes(groceryItemIdentifier)) {
          return false;
        }
        groceryItemCollectionIdentifiers.push(groceryItemIdentifier);
        return true;
      });
      return [...groceryItemsToAdd, ...groceryItemCollection];
    }
    return groceryItemCollection;
  }
}

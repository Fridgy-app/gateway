import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { Search } from 'app/core/request/request.model';
import { IRecipeIngredient, getRecipeIngredientIdentifier } from '../recipe-ingredient.model';

export type EntityResponseType = HttpResponse<IRecipeIngredient>;
export type EntityArrayResponseType = HttpResponse<IRecipeIngredient[]>;

@Injectable({ providedIn: 'root' })
export class RecipeIngredientService {
  public resourceUrl = this.applicationConfigService.getEndpointFor('api/recipe-ingredients', 'products');
  public resourceSearchUrl = this.applicationConfigService.getEndpointFor('api/_search/recipe-ingredients', 'products');

  constructor(protected http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  create(recipeIngredient: IRecipeIngredient): Observable<EntityResponseType> {
    return this.http.post<IRecipeIngredient>(this.resourceUrl, recipeIngredient, { observe: 'response' });
  }

  update(recipeIngredient: IRecipeIngredient): Observable<EntityResponseType> {
    return this.http.put<IRecipeIngredient>(
      `${this.resourceUrl}/${getRecipeIngredientIdentifier(recipeIngredient) as number}`,
      recipeIngredient,
      { observe: 'response' }
    );
  }

  partialUpdate(recipeIngredient: IRecipeIngredient): Observable<EntityResponseType> {
    return this.http.patch<IRecipeIngredient>(
      `${this.resourceUrl}/${getRecipeIngredientIdentifier(recipeIngredient) as number}`,
      recipeIngredient,
      { observe: 'response' }
    );
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IRecipeIngredient>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IRecipeIngredient[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  search(req: Search): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IRecipeIngredient[]>(this.resourceSearchUrl, { params: options, observe: 'response' });
  }

  addRecipeIngredientToCollectionIfMissing(
    recipeIngredientCollection: IRecipeIngredient[],
    ...recipeIngredientsToCheck: (IRecipeIngredient | null | undefined)[]
  ): IRecipeIngredient[] {
    const recipeIngredients: IRecipeIngredient[] = recipeIngredientsToCheck.filter(isPresent);
    if (recipeIngredients.length > 0) {
      const recipeIngredientCollectionIdentifiers = recipeIngredientCollection.map(
        recipeIngredientItem => getRecipeIngredientIdentifier(recipeIngredientItem)!
      );
      const recipeIngredientsToAdd = recipeIngredients.filter(recipeIngredientItem => {
        const recipeIngredientIdentifier = getRecipeIngredientIdentifier(recipeIngredientItem);
        if (recipeIngredientIdentifier == null || recipeIngredientCollectionIdentifiers.includes(recipeIngredientIdentifier)) {
          return false;
        }
        recipeIngredientCollectionIdentifiers.push(recipeIngredientIdentifier);
        return true;
      });
      return [...recipeIngredientsToAdd, ...recipeIngredientCollection];
    }
    return recipeIngredientCollection;
  }
}

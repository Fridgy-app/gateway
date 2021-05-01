import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IRecipeIngredient, RecipeIngredient } from '../recipe-ingredient.model';
import { RecipeIngredientService } from '../service/recipe-ingredient.service';

@Injectable({ providedIn: 'root' })
export class RecipeIngredientRoutingResolveService implements Resolve<IRecipeIngredient> {
  constructor(protected service: RecipeIngredientService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IRecipeIngredient> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((recipeIngredient: HttpResponse<RecipeIngredient>) => {
          if (recipeIngredient.body) {
            return of(recipeIngredient.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new RecipeIngredient());
  }
}

import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IGroceryItem, GroceryItem } from '../grocery-item.model';
import { GroceryItemService } from '../service/grocery-item.service';

@Injectable({ providedIn: 'root' })
export class GroceryItemRoutingResolveService implements Resolve<IGroceryItem> {
  constructor(protected service: GroceryItemService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IGroceryItem> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((groceryItem: HttpResponse<GroceryItem>) => {
          if (groceryItem.body) {
            return of(groceryItem.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new GroceryItem());
  }
}

import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IProductUnit, ProductUnit } from '../product-unit.model';
import { ProductUnitService } from '../service/product-unit.service';

@Injectable({ providedIn: 'root' })
export class ProductUnitRoutingResolveService implements Resolve<IProductUnit> {
  constructor(protected service: ProductUnitService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IProductUnit> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((productUnit: HttpResponse<ProductUnit>) => {
          if (productUnit.body) {
            return of(productUnit.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new ProductUnit());
  }
}

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ProductUnitComponent } from '../list/product-unit.component';
import { ProductUnitDetailComponent } from '../detail/product-unit-detail.component';
import { ProductUnitUpdateComponent } from '../update/product-unit-update.component';
import { ProductUnitRoutingResolveService } from './product-unit-routing-resolve.service';

const productUnitRoute: Routes = [
  {
    path: '',
    component: ProductUnitComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ProductUnitDetailComponent,
    resolve: {
      productUnit: ProductUnitRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ProductUnitUpdateComponent,
    resolve: {
      productUnit: ProductUnitRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ProductUnitUpdateComponent,
    resolve: {
      productUnit: ProductUnitRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(productUnitRoute)],
  exports: [RouterModule],
})
export class ProductUnitRoutingModule {}

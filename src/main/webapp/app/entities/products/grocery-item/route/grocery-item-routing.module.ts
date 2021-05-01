import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { GroceryItemComponent } from '../list/grocery-item.component';
import { GroceryItemDetailComponent } from '../detail/grocery-item-detail.component';
import { GroceryItemUpdateComponent } from '../update/grocery-item-update.component';
import { GroceryItemRoutingResolveService } from './grocery-item-routing-resolve.service';

const groceryItemRoute: Routes = [
  {
    path: '',
    component: GroceryItemComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: GroceryItemDetailComponent,
    resolve: {
      groceryItem: GroceryItemRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: GroceryItemUpdateComponent,
    resolve: {
      groceryItem: GroceryItemRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: GroceryItemUpdateComponent,
    resolve: {
      groceryItem: GroceryItemRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(groceryItemRoute)],
  exports: [RouterModule],
})
export class GroceryItemRoutingModule {}

import { NgModule } from '@angular/core';

import { SharedModule } from 'app/shared/shared.module';
import { GroceryItemComponent } from './list/grocery-item.component';
import { GroceryItemDetailComponent } from './detail/grocery-item-detail.component';
import { GroceryItemUpdateComponent } from './update/grocery-item-update.component';
import { GroceryItemDeleteDialogComponent } from './delete/grocery-item-delete-dialog.component';
import { GroceryItemRoutingModule } from './route/grocery-item-routing.module';

@NgModule({
  imports: [SharedModule, GroceryItemRoutingModule],
  declarations: [GroceryItemComponent, GroceryItemDetailComponent, GroceryItemUpdateComponent, GroceryItemDeleteDialogComponent],
  entryComponents: [GroceryItemDeleteDialogComponent],
})
export class ProductsGroceryItemModule {}

import { NgModule } from '@angular/core';

import { SharedModule } from 'app/shared/shared.module';
import { ProductUnitComponent } from './list/product-unit.component';
import { ProductUnitDetailComponent } from './detail/product-unit-detail.component';
import { ProductUnitUpdateComponent } from './update/product-unit-update.component';
import { ProductUnitDeleteDialogComponent } from './delete/product-unit-delete-dialog.component';
import { ProductUnitRoutingModule } from './route/product-unit-routing.module';

@NgModule({
  imports: [SharedModule, ProductUnitRoutingModule],
  declarations: [ProductUnitComponent, ProductUnitDetailComponent, ProductUnitUpdateComponent, ProductUnitDeleteDialogComponent],
  entryComponents: [ProductUnitDeleteDialogComponent],
})
export class ProductsProductUnitModule {}

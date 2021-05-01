import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IProductUnit } from '../product-unit.model';
import { ProductUnitService } from '../service/product-unit.service';

@Component({
  templateUrl: './product-unit-delete-dialog.component.html',
})
export class ProductUnitDeleteDialogComponent {
  productUnit?: IProductUnit;

  constructor(protected productUnitService: ProductUnitService, public activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.productUnitService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}

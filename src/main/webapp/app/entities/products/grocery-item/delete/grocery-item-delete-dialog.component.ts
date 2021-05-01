import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IGroceryItem } from '../grocery-item.model';
import { GroceryItemService } from '../service/grocery-item.service';

@Component({
  templateUrl: './grocery-item-delete-dialog.component.html',
})
export class GroceryItemDeleteDialogComponent {
  groceryItem?: IGroceryItem;

  constructor(protected groceryItemService: GroceryItemService, public activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.groceryItemService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}

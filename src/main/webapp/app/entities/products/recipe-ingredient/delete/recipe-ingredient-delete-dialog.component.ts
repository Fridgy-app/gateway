import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IRecipeIngredient } from '../recipe-ingredient.model';
import { RecipeIngredientService } from '../service/recipe-ingredient.service';

@Component({
  templateUrl: './recipe-ingredient-delete-dialog.component.html',
})
export class RecipeIngredientDeleteDialogComponent {
  recipeIngredient?: IRecipeIngredient;

  constructor(protected recipeIngredientService: RecipeIngredientService, public activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.recipeIngredientService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}

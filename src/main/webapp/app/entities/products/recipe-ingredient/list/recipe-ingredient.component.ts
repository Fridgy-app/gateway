import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IRecipeIngredient } from '../recipe-ingredient.model';
import { RecipeIngredientService } from '../service/recipe-ingredient.service';
import { RecipeIngredientDeleteDialogComponent } from '../delete/recipe-ingredient-delete-dialog.component';

@Component({
  selector: 'jhi-recipe-ingredient',
  templateUrl: './recipe-ingredient.component.html',
})
export class RecipeIngredientComponent implements OnInit {
  recipeIngredients?: IRecipeIngredient[];
  isLoading = false;
  currentSearch: string;

  constructor(
    protected recipeIngredientService: RecipeIngredientService,
    protected modalService: NgbModal,
    protected activatedRoute: ActivatedRoute
  ) {
    this.currentSearch = this.activatedRoute.snapshot.queryParams['search'] ?? '';
  }

  loadAll(): void {
    this.isLoading = true;
    if (this.currentSearch) {
      this.recipeIngredientService
        .search({
          query: this.currentSearch,
        })
        .subscribe(
          (res: HttpResponse<IRecipeIngredient[]>) => {
            this.isLoading = false;
            this.recipeIngredients = res.body ?? [];
          },
          () => {
            this.isLoading = false;
          }
        );
      return;
    }

    this.recipeIngredientService.query().subscribe(
      (res: HttpResponse<IRecipeIngredient[]>) => {
        this.isLoading = false;
        this.recipeIngredients = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  search(query: string): void {
    this.currentSearch = query;
    this.loadAll();
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IRecipeIngredient): number {
    return item.id!;
  }

  delete(recipeIngredient: IRecipeIngredient): void {
    const modalRef = this.modalService.open(RecipeIngredientDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.recipeIngredient = recipeIngredient;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}

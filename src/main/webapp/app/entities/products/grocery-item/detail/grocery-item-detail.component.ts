import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IGroceryItem } from '../grocery-item.model';

@Component({
  selector: 'jhi-grocery-item-detail',
  templateUrl: './grocery-item-detail.component.html',
})
export class GroceryItemDetailComponent implements OnInit {
  groceryItem: IGroceryItem | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ groceryItem }) => {
      this.groceryItem = groceryItem;
    });
  }

  previousState(): void {
    window.history.back();
  }
}

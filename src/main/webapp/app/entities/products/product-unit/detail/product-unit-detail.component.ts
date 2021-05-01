import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IProductUnit } from '../product-unit.model';

@Component({
  selector: 'jhi-product-unit-detail',
  templateUrl: './product-unit-detail.component.html',
})
export class ProductUnitDetailComponent implements OnInit {
  productUnit: IProductUnit | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ productUnit }) => {
      this.productUnit = productUnit;
    });
  }

  previousState(): void {
    window.history.back();
  }
}

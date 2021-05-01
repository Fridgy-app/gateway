import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IProductUnit } from '../product-unit.model';
import { ProductUnitService } from '../service/product-unit.service';
import { ProductUnitDeleteDialogComponent } from '../delete/product-unit-delete-dialog.component';

@Component({
  selector: 'jhi-product-unit',
  templateUrl: './product-unit.component.html',
})
export class ProductUnitComponent implements OnInit {
  productUnits?: IProductUnit[];
  isLoading = false;
  currentSearch: string;

  constructor(
    protected productUnitService: ProductUnitService,
    protected modalService: NgbModal,
    protected activatedRoute: ActivatedRoute
  ) {
    this.currentSearch = this.activatedRoute.snapshot.queryParams['search'] ?? '';
  }

  loadAll(): void {
    this.isLoading = true;
    if (this.currentSearch) {
      this.productUnitService
        .search({
          query: this.currentSearch,
        })
        .subscribe(
          (res: HttpResponse<IProductUnit[]>) => {
            this.isLoading = false;
            this.productUnits = res.body ?? [];
          },
          () => {
            this.isLoading = false;
          }
        );
      return;
    }

    this.productUnitService.query().subscribe(
      (res: HttpResponse<IProductUnit[]>) => {
        this.isLoading = false;
        this.productUnits = res.body ?? [];
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

  trackId(index: number, item: IProductUnit): number {
    return item.id!;
  }

  delete(productUnit: IProductUnit): void {
    const modalRef = this.modalService.open(ProductUnitDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.productUnit = productUnit;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}

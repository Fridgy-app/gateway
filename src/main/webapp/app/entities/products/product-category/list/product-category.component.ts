import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IProductCategory } from '../product-category.model';
import { ProductCategoryService } from '../service/product-category.service';
import { ProductCategoryDeleteDialogComponent } from '../delete/product-category-delete-dialog.component';

@Component({
  selector: 'jhi-product-category',
  templateUrl: './product-category.component.html',
})
export class ProductCategoryComponent implements OnInit {
  productCategories?: IProductCategory[];
  isLoading = false;
  currentSearch: string;

  constructor(
    protected productCategoryService: ProductCategoryService,
    protected modalService: NgbModal,
    protected activatedRoute: ActivatedRoute
  ) {
    this.currentSearch = this.activatedRoute.snapshot.queryParams['search'] ?? '';
  }

  loadAll(): void {
    this.isLoading = true;
    if (this.currentSearch) {
      this.productCategoryService
        .search({
          query: this.currentSearch,
        })
        .subscribe(
          (res: HttpResponse<IProductCategory[]>) => {
            this.isLoading = false;
            this.productCategories = res.body ?? [];
          },
          () => {
            this.isLoading = false;
          }
        );
      return;
    }

    this.productCategoryService.query().subscribe(
      (res: HttpResponse<IProductCategory[]>) => {
        this.isLoading = false;
        this.productCategories = res.body ?? [];
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

  trackId(index: number, item: IProductCategory): number {
    return item.id!;
  }

  delete(productCategory: IProductCategory): void {
    const modalRef = this.modalService.open(ProductCategoryDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.productCategory = productCategory;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}

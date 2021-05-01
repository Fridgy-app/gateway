import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IProductUnit, ProductUnit } from '../product-unit.model';
import { ProductUnitService } from '../service/product-unit.service';

@Component({
  selector: 'jhi-product-unit-update',
  templateUrl: './product-unit-update.component.html',
})
export class ProductUnitUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    name: [null, [Validators.required]],
  });

  constructor(protected productUnitService: ProductUnitService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ productUnit }) => {
      this.updateForm(productUnit);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const productUnit = this.createFromForm();
    if (productUnit.id !== undefined) {
      this.subscribeToSaveResponse(this.productUnitService.update(productUnit));
    } else {
      this.subscribeToSaveResponse(this.productUnitService.create(productUnit));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IProductUnit>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(productUnit: IProductUnit): void {
    this.editForm.patchValue({
      id: productUnit.id,
      name: productUnit.name,
    });
  }

  protected createFromForm(): IProductUnit {
    return {
      ...new ProductUnit(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
    };
  }
}

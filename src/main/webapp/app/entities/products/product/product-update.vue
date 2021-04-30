<template>
  <div class="row justify-content-center">
    <div class="col-8">
      <form name="editForm" role="form" novalidate v-on:submit.prevent="save()">
        <h2
          id="gatewayApp.productsProduct.home.createOrEditLabel"
          data-cy="ProductCreateUpdateHeading"
          v-text="$t('gatewayApp.productsProduct.home.createOrEditLabel')"
        >
          Create or edit a Product
        </h2>
        <div>
          <div class="form-group" v-if="product.id">
            <label for="id" v-text="$t('global.field.id')">ID</label>
            <input type="text" class="form-control" id="id" name="id" v-model="product.id" readonly />
          </div>
          <div class="form-group">
            <label class="form-control-label" v-text="$t('gatewayApp.productsProduct.name')" for="product-name">Name</label>
            <input
              type="text"
              class="form-control"
              name="name"
              id="product-name"
              data-cy="name"
              :class="{ valid: !$v.product.name.$invalid, invalid: $v.product.name.$invalid }"
              v-model="$v.product.name.$model"
              required
            />
            <div v-if="$v.product.name.$anyDirty && $v.product.name.$invalid">
              <small class="form-text text-danger" v-if="!$v.product.name.required" v-text="$t('entity.validation.required')">
                This field is required.
              </small>
            </div>
          </div>
          <div class="form-group">
            <label class="form-control-label" v-text="$t('gatewayApp.productsProduct.eanCode')" for="product-eanCode">Ean Code</label>
            <input
              type="text"
              class="form-control"
              name="eanCode"
              id="product-eanCode"
              data-cy="eanCode"
              :class="{ valid: !$v.product.eanCode.$invalid, invalid: $v.product.eanCode.$invalid }"
              v-model="$v.product.eanCode.$model"
            />
          </div>
          <div class="form-group">
            <label class="form-control-label" v-text="$t('gatewayApp.productsProduct.productCategory')" for="product-productCategory"
              >Product Category</label
            >
            <select
              class="form-control"
              id="product-productCategory"
              data-cy="productCategory"
              name="productCategory"
              v-model="product.productCategory"
            >
              <option v-bind:value="null"></option>
              <option
                v-bind:value="
                  product.productCategory && productCategoryOption.id === product.productCategory.id
                    ? product.productCategory
                    : productCategoryOption
                "
                v-for="productCategoryOption in productCategories"
                :key="productCategoryOption.id"
              >
                {{ productCategoryOption.id }}
              </option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-control-label" v-text="$t('gatewayApp.productsProduct.productUnit')" for="product-productUnit"
              >Product Unit</label
            >
            <select class="form-control" id="product-productUnit" data-cy="productUnit" name="productUnit" v-model="product.productUnit">
              <option v-bind:value="null"></option>
              <option
                v-bind:value="
                  product.productUnit && productUnitOption.id === product.productUnit.id ? product.productUnit : productUnitOption
                "
                v-for="productUnitOption in productUnits"
                :key="productUnitOption.id"
              >
                {{ productUnitOption.id }}
              </option>
            </select>
          </div>
        </div>
        <div>
          <button type="button" id="cancel-save" class="btn btn-secondary" v-on:click="previousState()">
            <font-awesome-icon icon="ban"></font-awesome-icon>&nbsp;<span v-text="$t('entity.action.cancel')">Cancel</span>
          </button>
          <button
            type="submit"
            id="save-entity"
            data-cy="entityCreateSaveButton"
            :disabled="$v.product.$invalid || isSaving"
            class="btn btn-primary"
          >
            <font-awesome-icon icon="save"></font-awesome-icon>&nbsp;<span v-text="$t('entity.action.save')">Save</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
<script lang="ts" src="./product-update.component.ts"></script>

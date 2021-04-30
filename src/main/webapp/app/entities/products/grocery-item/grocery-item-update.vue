<template>
  <div class="row justify-content-center">
    <div class="col-8">
      <form name="editForm" role="form" novalidate v-on:submit.prevent="save()">
        <h2
          id="gatewayApp.productsGroceryItem.home.createOrEditLabel"
          data-cy="GroceryItemCreateUpdateHeading"
          v-text="$t('gatewayApp.productsGroceryItem.home.createOrEditLabel')"
        >
          Create or edit a GroceryItem
        </h2>
        <div>
          <div class="form-group" v-if="groceryItem.id">
            <label for="id" v-text="$t('global.field.id')">ID</label>
            <input type="text" class="form-control" id="id" name="id" v-model="groceryItem.id" readonly />
          </div>
          <div class="form-group">
            <label class="form-control-label" v-text="$t('gatewayApp.productsGroceryItem.quantity')" for="grocery-item-quantity"
              >Quantity</label
            >
            <input
              type="number"
              class="form-control"
              name="quantity"
              id="grocery-item-quantity"
              data-cy="quantity"
              :class="{ valid: !$v.groceryItem.quantity.$invalid, invalid: $v.groceryItem.quantity.$invalid }"
              v-model.number="$v.groceryItem.quantity.$model"
            />
          </div>
          <div class="form-group">
            <label class="form-control-label" v-text="$t('gatewayApp.productsGroceryItem.description')" for="grocery-item-description"
              >Description</label
            >
            <input
              type="text"
              class="form-control"
              name="description"
              id="grocery-item-description"
              data-cy="description"
              :class="{ valid: !$v.groceryItem.description.$invalid, invalid: $v.groceryItem.description.$invalid }"
              v-model="$v.groceryItem.description.$model"
            />
          </div>
          <div class="form-group">
            <label class="form-control-label" v-text="$t('gatewayApp.productsGroceryItem.user')" for="grocery-item-user">User</label>
            <select class="form-control" id="grocery-item-user" data-cy="user" name="user" v-model="groceryItem.user">
              <option v-bind:value="null"></option>
              <option
                v-bind:value="groceryItem.user && userOption.id === groceryItem.user.id ? groceryItem.user : userOption"
                v-for="userOption in users"
                :key="userOption.id"
              >
                {{ userOption.login }}
              </option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-control-label" v-text="$t('gatewayApp.productsGroceryItem.product')" for="grocery-item-product"
              >Product</label
            >
            <select class="form-control" id="grocery-item-product" data-cy="product" name="product" v-model="groceryItem.product">
              <option v-bind:value="null"></option>
              <option
                v-bind:value="groceryItem.product && productOption.id === groceryItem.product.id ? groceryItem.product : productOption"
                v-for="productOption in products"
                :key="productOption.id"
              >
                {{ productOption.id }}
              </option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-control-label" v-text="$t('gatewayApp.productsGroceryItem.unit')" for="grocery-item-unit">Unit</label>
            <select class="form-control" id="grocery-item-unit" data-cy="unit" name="unit" v-model="groceryItem.unit">
              <option v-bind:value="null"></option>
              <option
                v-bind:value="groceryItem.unit && productUnitOption.id === groceryItem.unit.id ? groceryItem.unit : productUnitOption"
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
            :disabled="$v.groceryItem.$invalid || isSaving"
            class="btn btn-primary"
          >
            <font-awesome-icon icon="save"></font-awesome-icon>&nbsp;<span v-text="$t('entity.action.save')">Save</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
<script lang="ts" src="./grocery-item-update.component.ts"></script>

<template>
  <div class="row justify-content-center">
    <div class="col-8">
      <form name="editForm" role="form" novalidate v-on:submit.prevent="save()">
        <h2
          id="gatewayApp.productsProductUnit.home.createOrEditLabel"
          data-cy="ProductUnitCreateUpdateHeading"
          v-text="$t('gatewayApp.productsProductUnit.home.createOrEditLabel')"
        >
          Create or edit a ProductUnit
        </h2>
        <div>
          <div class="form-group" v-if="productUnit.id">
            <label for="id" v-text="$t('global.field.id')">ID</label>
            <input type="text" class="form-control" id="id" name="id" v-model="productUnit.id" readonly />
          </div>
          <div class="form-group">
            <label class="form-control-label" v-text="$t('gatewayApp.productsProductUnit.name')" for="product-unit-name">Name</label>
            <input
              type="text"
              class="form-control"
              name="name"
              id="product-unit-name"
              data-cy="name"
              :class="{ valid: !$v.productUnit.name.$invalid, invalid: $v.productUnit.name.$invalid }"
              v-model="$v.productUnit.name.$model"
              required
            />
            <div v-if="$v.productUnit.name.$anyDirty && $v.productUnit.name.$invalid">
              <small class="form-text text-danger" v-if="!$v.productUnit.name.required" v-text="$t('entity.validation.required')">
                This field is required.
              </small>
            </div>
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
            :disabled="$v.productUnit.$invalid || isSaving"
            class="btn btn-primary"
          >
            <font-awesome-icon icon="save"></font-awesome-icon>&nbsp;<span v-text="$t('entity.action.save')">Save</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
<script lang="ts" src="./product-unit-update.component.ts"></script>

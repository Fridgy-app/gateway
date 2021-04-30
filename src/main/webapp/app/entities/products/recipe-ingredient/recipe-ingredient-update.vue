<template>
  <div class="row justify-content-center">
    <div class="col-8">
      <form name="editForm" role="form" novalidate v-on:submit.prevent="save()">
        <h2
          id="gatewayApp.productsRecipeIngredient.home.createOrEditLabel"
          data-cy="RecipeIngredientCreateUpdateHeading"
          v-text="$t('gatewayApp.productsRecipeIngredient.home.createOrEditLabel')"
        >
          Create or edit a RecipeIngredient
        </h2>
        <div>
          <div class="form-group" v-if="recipeIngredient.id">
            <label for="id" v-text="$t('global.field.id')">ID</label>
            <input type="text" class="form-control" id="id" name="id" v-model="recipeIngredient.id" readonly />
          </div>
          <div class="form-group">
            <label class="form-control-label" v-text="$t('gatewayApp.productsRecipeIngredient.quantity')" for="recipe-ingredient-quantity"
              >Quantity</label
            >
            <input
              type="number"
              class="form-control"
              name="quantity"
              id="recipe-ingredient-quantity"
              data-cy="quantity"
              :class="{ valid: !$v.recipeIngredient.quantity.$invalid, invalid: $v.recipeIngredient.quantity.$invalid }"
              v-model.number="$v.recipeIngredient.quantity.$model"
            />
          </div>
          <div class="form-group">
            <label class="form-control-label" v-text="$t('gatewayApp.productsRecipeIngredient.product')" for="recipe-ingredient-product"
              >Product</label
            >
            <select class="form-control" id="recipe-ingredient-product" data-cy="product" name="product" v-model="recipeIngredient.product">
              <option v-bind:value="null"></option>
              <option
                v-bind:value="
                  recipeIngredient.product && productOption.id === recipeIngredient.product.id ? recipeIngredient.product : productOption
                "
                v-for="productOption in products"
                :key="productOption.id"
              >
                {{ productOption.id }}
              </option>
            </select>
          </div>
          <div class="form-group">
            <label
              class="form-control-label"
              v-text="$t('gatewayApp.productsRecipeIngredient.productUnit')"
              for="recipe-ingredient-productUnit"
              >Product Unit</label
            >
            <select
              class="form-control"
              id="recipe-ingredient-productUnit"
              data-cy="productUnit"
              name="productUnit"
              v-model="recipeIngredient.productUnit"
            >
              <option v-bind:value="null"></option>
              <option
                v-bind:value="
                  recipeIngredient.productUnit && productUnitOption.id === recipeIngredient.productUnit.id
                    ? recipeIngredient.productUnit
                    : productUnitOption
                "
                v-for="productUnitOption in productUnits"
                :key="productUnitOption.id"
              >
                {{ productUnitOption.id }}
              </option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-control-label" v-text="$t('gatewayApp.productsRecipeIngredient.recipe')" for="recipe-ingredient-recipe"
              >Recipe</label
            >
            <select class="form-control" id="recipe-ingredient-recipe" data-cy="recipe" name="recipe" v-model="recipeIngredient.recipe">
              <option v-bind:value="null"></option>
              <option
                v-bind:value="
                  recipeIngredient.recipe && recipeOption.id === recipeIngredient.recipe.id ? recipeIngredient.recipe : recipeOption
                "
                v-for="recipeOption in recipes"
                :key="recipeOption.id"
              >
                {{ recipeOption.id }}
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
            :disabled="$v.recipeIngredient.$invalid || isSaving"
            class="btn btn-primary"
          >
            <font-awesome-icon icon="save"></font-awesome-icon>&nbsp;<span v-text="$t('entity.action.save')">Save</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
<script lang="ts" src="./recipe-ingredient-update.component.ts"></script>

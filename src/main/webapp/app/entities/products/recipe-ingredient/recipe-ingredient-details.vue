<template>
  <div class="row justify-content-center">
    <div class="col-8">
      <div v-if="recipeIngredient">
        <h2 class="jh-entity-heading" data-cy="recipeIngredientDetailsHeading">
          <span v-text="$t('gatewayApp.productsRecipeIngredient.detail.title')">RecipeIngredient</span> {{ recipeIngredient.id }}
        </h2>
        <dl class="row jh-entity-details">
          <dt>
            <span v-text="$t('gatewayApp.productsRecipeIngredient.quantity')">Quantity</span>
          </dt>
          <dd>
            <span>{{ recipeIngredient.quantity }}</span>
          </dd>
          <dt>
            <span v-text="$t('gatewayApp.productsRecipeIngredient.product')">Product</span>
          </dt>
          <dd>
            <div v-if="recipeIngredient.product">
              <router-link :to="{ name: 'ProductView', params: { productId: recipeIngredient.product.id } }">{{
                recipeIngredient.product.id
              }}</router-link>
            </div>
          </dd>
          <dt>
            <span v-text="$t('gatewayApp.productsRecipeIngredient.productUnit')">Product Unit</span>
          </dt>
          <dd>
            <div v-if="recipeIngredient.productUnit">
              <router-link :to="{ name: 'ProductUnitView', params: { productUnitId: recipeIngredient.productUnit.id } }">{{
                recipeIngredient.productUnit.id
              }}</router-link>
            </div>
          </dd>
          <dt>
            <span v-text="$t('gatewayApp.productsRecipeIngredient.recipe')">Recipe</span>
          </dt>
          <dd>
            <div v-if="recipeIngredient.recipe">
              <router-link :to="{ name: 'RecipeView', params: { recipeId: recipeIngredient.recipe.id } }">{{
                recipeIngredient.recipe.id
              }}</router-link>
            </div>
          </dd>
        </dl>
        <button type="submit" v-on:click.prevent="previousState()" class="btn btn-info" data-cy="entityDetailsBackButton">
          <font-awesome-icon icon="arrow-left"></font-awesome-icon>&nbsp;<span v-text="$t('entity.action.back')"> Back</span>
        </button>
        <router-link
          v-if="recipeIngredient.id"
          :to="{ name: 'RecipeIngredientEdit', params: { recipeIngredientId: recipeIngredient.id } }"
          custom
          v-slot="{ navigate }"
        >
          <button @click="navigate" class="btn btn-primary">
            <font-awesome-icon icon="pencil-alt"></font-awesome-icon>&nbsp;<span v-text="$t('entity.action.edit')"> Edit</span>
          </button>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script lang="ts" src="./recipe-ingredient-details.component.ts"></script>

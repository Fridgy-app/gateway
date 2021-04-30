<template>
  <div>
    <h2 id="page-heading" data-cy="RecipeIngredientHeading">
      <span v-text="$t('gatewayApp.productsRecipeIngredient.home.title')" id="recipe-ingredient-heading">Recipe Ingredients</span>
      <div class="d-flex justify-content-end">
        <button class="btn btn-info mr-2" v-on:click="handleSyncList" :disabled="isFetching">
          <font-awesome-icon icon="sync" :spin="isFetching"></font-awesome-icon>
          <span v-text="$t('gatewayApp.productsRecipeIngredient.home.refreshListLabel')">Refresh List</span>
        </button>
        <router-link :to="{ name: 'RecipeIngredientCreate' }" custom v-slot="{ navigate }">
          <button
            @click="navigate"
            id="jh-create-entity"
            data-cy="entityCreateButton"
            class="btn btn-primary jh-create-entity create-recipe-ingredient"
          >
            <font-awesome-icon icon="plus"></font-awesome-icon>
            <span v-text="$t('gatewayApp.productsRecipeIngredient.home.createLabel')"> Create a new Recipe Ingredient </span>
          </button>
        </router-link>
      </div>
    </h2>
    <div class="row">
      <div class="col-sm-12">
        <form name="searchForm" class="form-inline" v-on:submit.prevent="search(currentSearch)">
          <div class="input-group w-100 mt-3">
            <input
              type="text"
              class="form-control"
              name="currentSearch"
              id="currentSearch"
              v-bind:placeholder="$t('gatewayApp.productsRecipeIngredient.home.search')"
              v-model="currentSearch"
            />
            <button type="button" id="launch-search" class="btn btn-primary" v-on:click="search(currentSearch)">
              <font-awesome-icon icon="search"></font-awesome-icon>
            </button>
            <button type="button" id="clear-search" class="btn btn-secondary" v-on:click="clear()" v-if="currentSearch">
              <font-awesome-icon icon="trash"></font-awesome-icon>
            </button>
          </div>
        </form>
      </div>
    </div>
    <br />
    <div class="alert alert-warning" v-if="!isFetching && recipeIngredients && recipeIngredients.length === 0">
      <span v-text="$t('gatewayApp.productsRecipeIngredient.home.notFound')">No recipeIngredients found</span>
    </div>
    <div class="table-responsive" v-if="recipeIngredients && recipeIngredients.length > 0">
      <table class="table table-striped" aria-describedby="recipeIngredients">
        <thead>
          <tr>
            <th scope="row"><span v-text="$t('global.field.id')">ID</span></th>
            <th scope="row"><span v-text="$t('gatewayApp.productsRecipeIngredient.quantity')">Quantity</span></th>
            <th scope="row"><span v-text="$t('gatewayApp.productsRecipeIngredient.product')">Product</span></th>
            <th scope="row"><span v-text="$t('gatewayApp.productsRecipeIngredient.productUnit')">Product Unit</span></th>
            <th scope="row"><span v-text="$t('gatewayApp.productsRecipeIngredient.recipe')">Recipe</span></th>
            <th scope="row"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="recipeIngredient in recipeIngredients" :key="recipeIngredient.id" data-cy="entityTable">
            <td>
              <router-link :to="{ name: 'RecipeIngredientView', params: { recipeIngredientId: recipeIngredient.id } }">{{
                recipeIngredient.id
              }}</router-link>
            </td>
            <td>{{ recipeIngredient.quantity }}</td>
            <td>
              <div v-if="recipeIngredient.product">
                <router-link :to="{ name: 'ProductView', params: { productId: recipeIngredient.product.id } }">{{
                  recipeIngredient.product.id
                }}</router-link>
              </div>
            </td>
            <td>
              <div v-if="recipeIngredient.productUnit">
                <router-link :to="{ name: 'ProductUnitView', params: { productUnitId: recipeIngredient.productUnit.id } }">{{
                  recipeIngredient.productUnit.id
                }}</router-link>
              </div>
            </td>
            <td>
              <div v-if="recipeIngredient.recipe">
                <router-link :to="{ name: 'RecipeView', params: { recipeId: recipeIngredient.recipe.id } }">{{
                  recipeIngredient.recipe.id
                }}</router-link>
              </div>
            </td>
            <td class="text-right">
              <div class="btn-group">
                <router-link
                  :to="{ name: 'RecipeIngredientView', params: { recipeIngredientId: recipeIngredient.id } }"
                  custom
                  v-slot="{ navigate }"
                >
                  <button @click="navigate" class="btn btn-info btn-sm details" data-cy="entityDetailsButton">
                    <font-awesome-icon icon="eye"></font-awesome-icon>
                    <span class="d-none d-md-inline" v-text="$t('entity.action.view')">View</span>
                  </button>
                </router-link>
                <router-link
                  :to="{ name: 'RecipeIngredientEdit', params: { recipeIngredientId: recipeIngredient.id } }"
                  custom
                  v-slot="{ navigate }"
                >
                  <button @click="navigate" class="btn btn-primary btn-sm edit" data-cy="entityEditButton">
                    <font-awesome-icon icon="pencil-alt"></font-awesome-icon>
                    <span class="d-none d-md-inline" v-text="$t('entity.action.edit')">Edit</span>
                  </button>
                </router-link>
                <b-button
                  v-on:click="prepareRemove(recipeIngredient)"
                  variant="danger"
                  class="btn btn-sm"
                  data-cy="entityDeleteButton"
                  v-b-modal.removeEntity
                >
                  <font-awesome-icon icon="times"></font-awesome-icon>
                  <span class="d-none d-md-inline" v-text="$t('entity.action.delete')">Delete</span>
                </b-button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <b-modal ref="removeEntity" id="removeEntity">
      <span slot="modal-title"
        ><span
          id="gatewayApp.productsRecipeIngredient.delete.question"
          data-cy="recipeIngredientDeleteDialogHeading"
          v-text="$t('entity.delete.title')"
          >Confirm delete operation</span
        ></span
      >
      <div class="modal-body">
        <p id="jhi-delete-recipeIngredient-heading" v-text="$t('gatewayApp.productsRecipeIngredient.delete.question', { id: removeId })">
          Are you sure you want to delete this Recipe Ingredient?
        </p>
      </div>
      <div slot="modal-footer">
        <button type="button" class="btn btn-secondary" v-text="$t('entity.action.cancel')" v-on:click="closeDialog()">Cancel</button>
        <button
          type="button"
          class="btn btn-primary"
          id="jhi-confirm-delete-recipeIngredient"
          data-cy="entityConfirmDeleteButton"
          v-text="$t('entity.action.delete')"
          v-on:click="removeRecipeIngredient()"
        >
          Delete
        </button>
      </div>
    </b-modal>
  </div>
</template>

<script lang="ts" src="./recipe-ingredient.component.ts"></script>

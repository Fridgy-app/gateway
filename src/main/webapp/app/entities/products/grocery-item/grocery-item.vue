<template>
  <div>
    <h2 id="page-heading" data-cy="GroceryItemHeading">
      <span v-text="$t('gatewayApp.productsGroceryItem.home.title')" id="grocery-item-heading">Grocery Items</span>
      <div class="d-flex justify-content-end">
        <button class="btn btn-info mr-2" v-on:click="handleSyncList" :disabled="isFetching">
          <font-awesome-icon icon="sync" :spin="isFetching"></font-awesome-icon>
          <span v-text="$t('gatewayApp.productsGroceryItem.home.refreshListLabel')">Refresh List</span>
        </button>
        <router-link :to="{ name: 'GroceryItemCreate' }" custom v-slot="{ navigate }">
          <button
            @click="navigate"
            id="jh-create-entity"
            data-cy="entityCreateButton"
            class="btn btn-primary jh-create-entity create-grocery-item"
          >
            <font-awesome-icon icon="plus"></font-awesome-icon>
            <span v-text="$t('gatewayApp.productsGroceryItem.home.createLabel')"> Create a new Grocery Item </span>
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
              v-bind:placeholder="$t('gatewayApp.productsGroceryItem.home.search')"
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
    <div class="alert alert-warning" v-if="!isFetching && groceryItems && groceryItems.length === 0">
      <span v-text="$t('gatewayApp.productsGroceryItem.home.notFound')">No groceryItems found</span>
    </div>
    <div class="table-responsive" v-if="groceryItems && groceryItems.length > 0">
      <table class="table table-striped" aria-describedby="groceryItems">
        <thead>
          <tr>
            <th scope="row" v-on:click="changeOrder('id')">
              <span v-text="$t('global.field.id')">ID</span>
              <jhi-sort-indicator :current-order="propOrder" :reverse="reverse" :field-name="'id'"></jhi-sort-indicator>
            </th>
            <th scope="row" v-on:click="changeOrder('quantity')">
              <span v-text="$t('gatewayApp.productsGroceryItem.quantity')">Quantity</span>
              <jhi-sort-indicator :current-order="propOrder" :reverse="reverse" :field-name="'quantity'"></jhi-sort-indicator>
            </th>
            <th scope="row" v-on:click="changeOrder('description')">
              <span v-text="$t('gatewayApp.productsGroceryItem.description')">Description</span>
              <jhi-sort-indicator :current-order="propOrder" :reverse="reverse" :field-name="'description'"></jhi-sort-indicator>
            </th>
            <th scope="row" v-on:click="changeOrder('user.login')">
              <span v-text="$t('gatewayApp.productsGroceryItem.user')">User</span>
              <jhi-sort-indicator :current-order="propOrder" :reverse="reverse" :field-name="'user.login'"></jhi-sort-indicator>
            </th>
            <th scope="row" v-on:click="changeOrder('product.id')">
              <span v-text="$t('gatewayApp.productsGroceryItem.product')">Product</span>
              <jhi-sort-indicator :current-order="propOrder" :reverse="reverse" :field-name="'product.id'"></jhi-sort-indicator>
            </th>
            <th scope="row" v-on:click="changeOrder('unit.id')">
              <span v-text="$t('gatewayApp.productsGroceryItem.unit')">Unit</span>
              <jhi-sort-indicator :current-order="propOrder" :reverse="reverse" :field-name="'unit.id'"></jhi-sort-indicator>
            </th>
            <th scope="row"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="groceryItem in groceryItems" :key="groceryItem.id" data-cy="entityTable">
            <td>
              <router-link :to="{ name: 'GroceryItemView', params: { groceryItemId: groceryItem.id } }">{{ groceryItem.id }}</router-link>
            </td>
            <td>{{ groceryItem.quantity }}</td>
            <td>{{ groceryItem.description }}</td>
            <td>
              {{ groceryItem.user ? groceryItem.user.login : '' }}
            </td>
            <td>
              <div v-if="groceryItem.product">
                <router-link :to="{ name: 'ProductView', params: { productId: groceryItem.product.id } }">{{
                  groceryItem.product.id
                }}</router-link>
              </div>
            </td>
            <td>
              <div v-if="groceryItem.unit">
                <router-link :to="{ name: 'ProductUnitView', params: { productUnitId: groceryItem.unit.id } }">{{
                  groceryItem.unit.id
                }}</router-link>
              </div>
            </td>
            <td class="text-right">
              <div class="btn-group">
                <router-link :to="{ name: 'GroceryItemView', params: { groceryItemId: groceryItem.id } }" custom v-slot="{ navigate }">
                  <button @click="navigate" class="btn btn-info btn-sm details" data-cy="entityDetailsButton">
                    <font-awesome-icon icon="eye"></font-awesome-icon>
                    <span class="d-none d-md-inline" v-text="$t('entity.action.view')">View</span>
                  </button>
                </router-link>
                <router-link :to="{ name: 'GroceryItemEdit', params: { groceryItemId: groceryItem.id } }" custom v-slot="{ navigate }">
                  <button @click="navigate" class="btn btn-primary btn-sm edit" data-cy="entityEditButton">
                    <font-awesome-icon icon="pencil-alt"></font-awesome-icon>
                    <span class="d-none d-md-inline" v-text="$t('entity.action.edit')">Edit</span>
                  </button>
                </router-link>
                <b-button
                  v-on:click="prepareRemove(groceryItem)"
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
        <infinite-loading
          ref="infiniteLoading"
          v-if="totalItems > itemsPerPage"
          :identifier="infiniteId"
          slot="append"
          @infinite="loadMore"
          force-use-infinite-wrapper=".el-table__body-wrapper"
          :distance="20"
        >
        </infinite-loading>
      </table>
    </div>
    <b-modal ref="removeEntity" id="removeEntity">
      <span slot="modal-title"
        ><span
          id="gatewayApp.productsGroceryItem.delete.question"
          data-cy="groceryItemDeleteDialogHeading"
          v-text="$t('entity.delete.title')"
          >Confirm delete operation</span
        ></span
      >
      <div class="modal-body">
        <p id="jhi-delete-groceryItem-heading" v-text="$t('gatewayApp.productsGroceryItem.delete.question', { id: removeId })">
          Are you sure you want to delete this Grocery Item?
        </p>
      </div>
      <div slot="modal-footer">
        <button type="button" class="btn btn-secondary" v-text="$t('entity.action.cancel')" v-on:click="closeDialog()">Cancel</button>
        <button
          type="button"
          class="btn btn-primary"
          id="jhi-confirm-delete-groceryItem"
          data-cy="entityConfirmDeleteButton"
          v-text="$t('entity.action.delete')"
          v-on:click="removeGroceryItem()"
        >
          Delete
        </button>
      </div>
    </b-modal>
  </div>
</template>

<script lang="ts" src="./grocery-item.component.ts"></script>

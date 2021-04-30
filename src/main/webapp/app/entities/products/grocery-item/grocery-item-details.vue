<template>
  <div class="row justify-content-center">
    <div class="col-8">
      <div v-if="groceryItem">
        <h2 class="jh-entity-heading" data-cy="groceryItemDetailsHeading">
          <span v-text="$t('gatewayApp.productsGroceryItem.detail.title')">GroceryItem</span> {{ groceryItem.id }}
        </h2>
        <dl class="row jh-entity-details">
          <dt>
            <span v-text="$t('gatewayApp.productsGroceryItem.quantity')">Quantity</span>
          </dt>
          <dd>
            <span>{{ groceryItem.quantity }}</span>
          </dd>
          <dt>
            <span v-text="$t('gatewayApp.productsGroceryItem.description')">Description</span>
          </dt>
          <dd>
            <span>{{ groceryItem.description }}</span>
          </dd>
          <dt>
            <span v-text="$t('gatewayApp.productsGroceryItem.user')">User</span>
          </dt>
          <dd>
            {{ groceryItem.user ? groceryItem.user.login : '' }}
          </dd>
          <dt>
            <span v-text="$t('gatewayApp.productsGroceryItem.product')">Product</span>
          </dt>
          <dd>
            <div v-if="groceryItem.product">
              <router-link :to="{ name: 'ProductView', params: { productId: groceryItem.product.id } }">{{
                groceryItem.product.id
              }}</router-link>
            </div>
          </dd>
          <dt>
            <span v-text="$t('gatewayApp.productsGroceryItem.unit')">Unit</span>
          </dt>
          <dd>
            <div v-if="groceryItem.unit">
              <router-link :to="{ name: 'ProductUnitView', params: { productUnitId: groceryItem.unit.id } }">{{
                groceryItem.unit.id
              }}</router-link>
            </div>
          </dd>
        </dl>
        <button type="submit" v-on:click.prevent="previousState()" class="btn btn-info" data-cy="entityDetailsBackButton">
          <font-awesome-icon icon="arrow-left"></font-awesome-icon>&nbsp;<span v-text="$t('entity.action.back')"> Back</span>
        </button>
        <router-link
          v-if="groceryItem.id"
          :to="{ name: 'GroceryItemEdit', params: { groceryItemId: groceryItem.id } }"
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

<script lang="ts" src="./grocery-item-details.component.ts"></script>

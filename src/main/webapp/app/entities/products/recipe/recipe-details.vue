<template>
  <div class="row justify-content-center">
    <div class="col-8">
      <div v-if="recipe">
        <h2 class="jh-entity-heading" data-cy="recipeDetailsHeading">
          <span v-text="$t('gatewayApp.productsRecipe.detail.title')">Recipe</span> {{ recipe.id }}
        </h2>
        <dl class="row jh-entity-details">
          <dt>
            <span v-text="$t('gatewayApp.productsRecipe.name')">Name</span>
          </dt>
          <dd>
            <span>{{ recipe.name }}</span>
          </dd>
          <dt>
            <span v-text="$t('gatewayApp.productsRecipe.instructionsBody')">Instructions Body</span>
          </dt>
          <dd>
            <span>{{ recipe.instructionsBody }}</span>
          </dd>
          <dt>
            <span v-text="$t('gatewayApp.productsRecipe.user')">User</span>
          </dt>
          <dd>
            {{ recipe.user ? recipe.user.login : '' }}
          </dd>
        </dl>
        <button type="submit" v-on:click.prevent="previousState()" class="btn btn-info" data-cy="entityDetailsBackButton">
          <font-awesome-icon icon="arrow-left"></font-awesome-icon>&nbsp;<span v-text="$t('entity.action.back')"> Back</span>
        </button>
        <router-link v-if="recipe.id" :to="{ name: 'RecipeEdit', params: { recipeId: recipe.id } }" custom v-slot="{ navigate }">
          <button @click="navigate" class="btn btn-primary">
            <font-awesome-icon icon="pencil-alt"></font-awesome-icon>&nbsp;<span v-text="$t('entity.action.edit')"> Edit</span>
          </button>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script lang="ts" src="./recipe-details.component.ts"></script>

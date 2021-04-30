<template>
  <div class="row justify-content-center">
    <div class="col-8">
      <form name="editForm" role="form" novalidate v-on:submit.prevent="save()">
        <h2
          id="gatewayApp.productsRecipe.home.createOrEditLabel"
          data-cy="RecipeCreateUpdateHeading"
          v-text="$t('gatewayApp.productsRecipe.home.createOrEditLabel')"
        >
          Create or edit a Recipe
        </h2>
        <div>
          <div class="form-group" v-if="recipe.id">
            <label for="id" v-text="$t('global.field.id')">ID</label>
            <input type="text" class="form-control" id="id" name="id" v-model="recipe.id" readonly />
          </div>
          <div class="form-group">
            <label class="form-control-label" v-text="$t('gatewayApp.productsRecipe.name')" for="recipe-name">Name</label>
            <input
              type="text"
              class="form-control"
              name="name"
              id="recipe-name"
              data-cy="name"
              :class="{ valid: !$v.recipe.name.$invalid, invalid: $v.recipe.name.$invalid }"
              v-model="$v.recipe.name.$model"
              required
            />
            <div v-if="$v.recipe.name.$anyDirty && $v.recipe.name.$invalid">
              <small class="form-text text-danger" v-if="!$v.recipe.name.required" v-text="$t('entity.validation.required')">
                This field is required.
              </small>
            </div>
          </div>
          <div class="form-group">
            <label class="form-control-label" v-text="$t('gatewayApp.productsRecipe.instructionsBody')" for="recipe-instructionsBody"
              >Instructions Body</label
            >
            <input
              type="text"
              class="form-control"
              name="instructionsBody"
              id="recipe-instructionsBody"
              data-cy="instructionsBody"
              :class="{ valid: !$v.recipe.instructionsBody.$invalid, invalid: $v.recipe.instructionsBody.$invalid }"
              v-model="$v.recipe.instructionsBody.$model"
              required
            />
            <div v-if="$v.recipe.instructionsBody.$anyDirty && $v.recipe.instructionsBody.$invalid">
              <small class="form-text text-danger" v-if="!$v.recipe.instructionsBody.required" v-text="$t('entity.validation.required')">
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
            :disabled="$v.recipe.$invalid || isSaving"
            class="btn btn-primary"
          >
            <font-awesome-icon icon="save"></font-awesome-icon>&nbsp;<span v-text="$t('entity.action.save')">Save</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
<script lang="ts" src="./recipe-update.component.ts"></script>

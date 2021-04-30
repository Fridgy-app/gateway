import { Component, Vue, Inject } from 'vue-property-decorator';

import { IRecipeIngredient } from '@/shared/model/products/recipe-ingredient.model';
import RecipeIngredientService from './recipe-ingredient.service';

@Component
export default class RecipeIngredientDetails extends Vue {
  @Inject('recipeIngredientService') private recipeIngredientService: () => RecipeIngredientService;
  public recipeIngredient: IRecipeIngredient = {};

  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (to.params.recipeIngredientId) {
        vm.retrieveRecipeIngredient(to.params.recipeIngredientId);
      }
    });
  }

  public retrieveRecipeIngredient(recipeIngredientId) {
    this.recipeIngredientService()
      .find(recipeIngredientId)
      .then(res => {
        this.recipeIngredient = res;
      });
  }

  public previousState() {
    this.$router.go(-1);
  }
}

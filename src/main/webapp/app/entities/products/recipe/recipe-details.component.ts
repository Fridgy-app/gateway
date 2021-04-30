import { Component, Vue, Inject } from 'vue-property-decorator';

import { IRecipe } from '@/shared/model/products/recipe.model';
import RecipeService from './recipe.service';

@Component
export default class RecipeDetails extends Vue {
  @Inject('recipeService') private recipeService: () => RecipeService;
  public recipe: IRecipe = {};

  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (to.params.recipeId) {
        vm.retrieveRecipe(to.params.recipeId);
      }
    });
  }

  public retrieveRecipe(recipeId) {
    this.recipeService()
      .find(recipeId)
      .then(res => {
        this.recipe = res;
      });
  }

  public previousState() {
    this.$router.go(-1);
  }
}

import { Component, Vue, Inject } from 'vue-property-decorator';

import { required } from 'vuelidate/lib/validators';

import RecipeIngredientService from '@/entities/products/recipe-ingredient/recipe-ingredient.service';
import { IRecipeIngredient } from '@/shared/model/products/recipe-ingredient.model';

import { IRecipe, Recipe } from '@/shared/model/products/recipe.model';
import RecipeService from './recipe.service';

const validations: any = {
  recipe: {
    name: {
      required,
    },
    instructionsBody: {
      required,
    },
  },
};

@Component({
  validations,
})
export default class RecipeUpdate extends Vue {
  @Inject('recipeService') private recipeService: () => RecipeService;
  public recipe: IRecipe = new Recipe();

  @Inject('recipeIngredientService') private recipeIngredientService: () => RecipeIngredientService;

  public recipeIngredients: IRecipeIngredient[] = [];
  public isSaving = false;
  public currentLanguage = '';

  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (to.params.recipeId) {
        vm.retrieveRecipe(to.params.recipeId);
      }
      vm.initRelationships();
    });
  }

  created(): void {
    this.currentLanguage = this.$store.getters.currentLanguage;
    this.$store.watch(
      () => this.$store.getters.currentLanguage,
      () => {
        this.currentLanguage = this.$store.getters.currentLanguage;
      }
    );
  }

  public save(): void {
    this.isSaving = true;
    if (this.recipe.id) {
      this.recipeService()
        .update(this.recipe)
        .then(param => {
          this.isSaving = false;
          this.$router.go(-1);
          const message = this.$t('productsApp.productsRecipe.updated', { param: param.id });
          return this.$root.$bvToast.toast(message.toString(), {
            toaster: 'b-toaster-top-center',
            title: 'Info',
            variant: 'info',
            solid: true,
            autoHideDelay: 5000,
          });
        });
    } else {
      this.recipeService()
        .create(this.recipe)
        .then(param => {
          this.isSaving = false;
          this.$router.go(-1);
          const message = this.$t('productsApp.productsRecipe.created', { param: param.id });
          this.$root.$bvToast.toast(message.toString(), {
            toaster: 'b-toaster-top-center',
            title: 'Success',
            variant: 'success',
            solid: true,
            autoHideDelay: 5000,
          });
        });
    }
  }

  public retrieveRecipe(recipeId): void {
    this.recipeService()
      .find(recipeId)
      .then(res => {
        this.recipe = res;
      });
  }

  public previousState(): void {
    this.$router.go(-1);
  }

  public initRelationships(): void {
    this.recipeIngredientService()
      .retrieve()
      .then(res => {
        this.recipeIngredients = res.data;
      });
  }
}

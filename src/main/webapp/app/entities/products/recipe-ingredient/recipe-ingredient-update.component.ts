import { Component, Vue, Inject } from 'vue-property-decorator';

import ProductService from '@/entities/products/product/product.service';
import { IProduct } from '@/shared/model/products/product.model';

import ProductUnitService from '@/entities/products/product-unit/product-unit.service';
import { IProductUnit } from '@/shared/model/products/product-unit.model';

import RecipeService from '@/entities/products/recipe/recipe.service';
import { IRecipe } from '@/shared/model/products/recipe.model';

import { IRecipeIngredient, RecipeIngredient } from '@/shared/model/products/recipe-ingredient.model';
import RecipeIngredientService from './recipe-ingredient.service';

const validations: any = {
  recipeIngredient: {
    quantity: {},
  },
};

@Component({
  validations,
})
export default class RecipeIngredientUpdate extends Vue {
  @Inject('recipeIngredientService') private recipeIngredientService: () => RecipeIngredientService;
  public recipeIngredient: IRecipeIngredient = new RecipeIngredient();

  @Inject('productService') private productService: () => ProductService;

  public products: IProduct[] = [];

  @Inject('productUnitService') private productUnitService: () => ProductUnitService;

  public productUnits: IProductUnit[] = [];

  @Inject('recipeService') private recipeService: () => RecipeService;

  public recipes: IRecipe[] = [];
  public isSaving = false;
  public currentLanguage = '';

  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (to.params.recipeIngredientId) {
        vm.retrieveRecipeIngredient(to.params.recipeIngredientId);
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
    if (this.recipeIngredient.id) {
      this.recipeIngredientService()
        .update(this.recipeIngredient)
        .then(param => {
          this.isSaving = false;
          this.$router.go(-1);
          const message = this.$t('productsApp.productsRecipeIngredient.updated', { param: param.id });
          return this.$root.$bvToast.toast(message.toString(), {
            toaster: 'b-toaster-top-center',
            title: 'Info',
            variant: 'info',
            solid: true,
            autoHideDelay: 5000,
          });
        });
    } else {
      this.recipeIngredientService()
        .create(this.recipeIngredient)
        .then(param => {
          this.isSaving = false;
          this.$router.go(-1);
          const message = this.$t('productsApp.productsRecipeIngredient.created', { param: param.id });
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

  public retrieveRecipeIngredient(recipeIngredientId): void {
    this.recipeIngredientService()
      .find(recipeIngredientId)
      .then(res => {
        this.recipeIngredient = res;
      });
  }

  public previousState(): void {
    this.$router.go(-1);
  }

  public initRelationships(): void {
    this.productService()
      .retrieve()
      .then(res => {
        this.products = res.data;
      });
    this.productUnitService()
      .retrieve()
      .then(res => {
        this.productUnits = res.data;
      });
    this.recipeService()
      .retrieve()
      .then(res => {
        this.recipes = res.data;
      });
  }
}

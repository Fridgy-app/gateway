import { Component, Vue, Inject } from 'vue-property-decorator';

import UserOAuth2Service from '@/entities/user/user.oauth2.service';

import ProductService from '@/entities/products/product/product.service';
import { IProduct } from '@/shared/model/products/product.model';

import ProductUnitService from '@/entities/products/product-unit/product-unit.service';
import { IProductUnit } from '@/shared/model/products/product-unit.model';

import { IGroceryItem, GroceryItem } from '@/shared/model/products/grocery-item.model';
import GroceryItemService from './grocery-item.service';

const validations: any = {
  groceryItem: {
    quantity: {},
    description: {},
  },
};

@Component({
  validations,
})
export default class GroceryItemUpdate extends Vue {
  @Inject('groceryItemService') private groceryItemService: () => GroceryItemService;
  public groceryItem: IGroceryItem = new GroceryItem();

  @Inject('userOAuth2Service') private userOAuth2Service: () => UserOAuth2Service;

  public users: Array<any> = [];

  @Inject('productService') private productService: () => ProductService;

  public products: IProduct[] = [];

  @Inject('productUnitService') private productUnitService: () => ProductUnitService;

  public productUnits: IProductUnit[] = [];
  public isSaving = false;
  public currentLanguage = '';

  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (to.params.groceryItemId) {
        vm.retrieveGroceryItem(to.params.groceryItemId);
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
    if (this.groceryItem.id) {
      this.groceryItemService()
        .update(this.groceryItem)
        .then(param => {
          this.isSaving = false;
          this.$router.go(-1);
          const message = this.$t('productsApp.productsGroceryItem.updated', { param: param.id });
          return this.$root.$bvToast.toast(message.toString(), {
            toaster: 'b-toaster-top-center',
            title: 'Info',
            variant: 'info',
            solid: true,
            autoHideDelay: 5000,
          });
        });
    } else {
      this.groceryItemService()
        .create(this.groceryItem)
        .then(param => {
          this.isSaving = false;
          this.$router.go(-1);
          const message = this.$t('productsApp.productsGroceryItem.created', { param: param.id });
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

  public retrieveGroceryItem(groceryItemId): void {
    this.groceryItemService()
      .find(groceryItemId)
      .then(res => {
        this.groceryItem = res;
      });
  }

  public previousState(): void {
    this.$router.go(-1);
  }

  public initRelationships(): void {
    this.userOAuth2Service()
      .retrieve()
      .then(res => {
        this.users = res.data;
      });
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
  }
}

import { mixins } from 'vue-class-component';

import { Component, Vue, Inject } from 'vue-property-decorator';
import Vue2Filters from 'vue2-filters';
import { IProductCategory } from '@/shared/model/products/product-category.model';

import ProductCategoryService from './product-category.service';

@Component({
  mixins: [Vue2Filters.mixin],
})
export default class ProductCategory extends Vue {
  @Inject('productCategoryService') private productCategoryService: () => ProductCategoryService;
  public currentSearch = '';
  private removeId: number = null;

  public productCategories: IProductCategory[] = [];

  public isFetching = false;

  public mounted(): void {
    this.retrieveAllProductCategorys();
  }

  public search(query): void {
    if (!query) {
      return this.clear();
    }
    this.currentSearch = query;
    this.retrieveAllProductCategorys();
  }

  public clear(): void {
    this.currentSearch = '';
    this.retrieveAllProductCategorys();
  }

  public retrieveAllProductCategorys(): void {
    this.isFetching = true;

    if (this.currentSearch) {
      this.productCategoryService()
        .search(this.currentSearch)
        .then(
          res => {
            this.productCategories = res;
            this.isFetching = false;
          },
          err => {
            this.isFetching = false;
          }
        );
      return;
    }
    this.productCategoryService()
      .retrieve()
      .then(
        res => {
          this.productCategories = res.data;
          this.isFetching = false;
        },
        err => {
          this.isFetching = false;
        }
      );
  }

  public handleSyncList(): void {
    this.clear();
  }

  public prepareRemove(instance: IProductCategory): void {
    this.removeId = instance.id;
    if (<any>this.$refs.removeEntity) {
      (<any>this.$refs.removeEntity).show();
    }
  }

  public removeProductCategory(): void {
    this.productCategoryService()
      .delete(this.removeId)
      .then(() => {
        const message = this.$t('productsApp.productsProductCategory.deleted', { param: this.removeId });
        this.$bvToast.toast(message.toString(), {
          toaster: 'b-toaster-top-center',
          title: 'Info',
          variant: 'danger',
          solid: true,
          autoHideDelay: 5000,
        });
        this.removeId = null;
        this.retrieveAllProductCategorys();
        this.closeDialog();
      });
  }

  public closeDialog(): void {
    (<any>this.$refs.removeEntity).hide();
  }
}

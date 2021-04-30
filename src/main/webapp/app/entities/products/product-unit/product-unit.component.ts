import { mixins } from 'vue-class-component';

import { Component, Vue, Inject } from 'vue-property-decorator';
import Vue2Filters from 'vue2-filters';
import { IProductUnit } from '@/shared/model/products/product-unit.model';

import ProductUnitService from './product-unit.service';

@Component({
  mixins: [Vue2Filters.mixin],
})
export default class ProductUnit extends Vue {
  @Inject('productUnitService') private productUnitService: () => ProductUnitService;
  public currentSearch = '';
  private removeId: number = null;

  public productUnits: IProductUnit[] = [];

  public isFetching = false;

  public mounted(): void {
    this.retrieveAllProductUnits();
  }

  public search(query): void {
    if (!query) {
      return this.clear();
    }
    this.currentSearch = query;
    this.retrieveAllProductUnits();
  }

  public clear(): void {
    this.currentSearch = '';
    this.retrieveAllProductUnits();
  }

  public retrieveAllProductUnits(): void {
    this.isFetching = true;

    if (this.currentSearch) {
      this.productUnitService()
        .search(this.currentSearch)
        .then(
          res => {
            this.productUnits = res;
            this.isFetching = false;
          },
          err => {
            this.isFetching = false;
          }
        );
      return;
    }
    this.productUnitService()
      .retrieve()
      .then(
        res => {
          this.productUnits = res.data;
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

  public prepareRemove(instance: IProductUnit): void {
    this.removeId = instance.id;
    if (<any>this.$refs.removeEntity) {
      (<any>this.$refs.removeEntity).show();
    }
  }

  public removeProductUnit(): void {
    this.productUnitService()
      .delete(this.removeId)
      .then(() => {
        const message = this.$t('productsApp.productsProductUnit.deleted', { param: this.removeId });
        this.$bvToast.toast(message.toString(), {
          toaster: 'b-toaster-top-center',
          title: 'Info',
          variant: 'danger',
          solid: true,
          autoHideDelay: 5000,
        });
        this.removeId = null;
        this.retrieveAllProductUnits();
        this.closeDialog();
      });
  }

  public closeDialog(): void {
    (<any>this.$refs.removeEntity).hide();
  }
}

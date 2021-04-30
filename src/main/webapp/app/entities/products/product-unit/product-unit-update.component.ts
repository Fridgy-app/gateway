import { Component, Vue, Inject } from 'vue-property-decorator';

import { required } from 'vuelidate/lib/validators';

import ProductService from '@/entities/products/product/product.service';
import { IProduct } from '@/shared/model/products/product.model';

import { IProductUnit, ProductUnit } from '@/shared/model/products/product-unit.model';
import ProductUnitService from './product-unit.service';

const validations: any = {
  productUnit: {
    name: {
      required,
    },
  },
};

@Component({
  validations,
})
export default class ProductUnitUpdate extends Vue {
  @Inject('productUnitService') private productUnitService: () => ProductUnitService;
  public productUnit: IProductUnit = new ProductUnit();

  @Inject('productService') private productService: () => ProductService;

  public products: IProduct[] = [];
  public isSaving = false;
  public currentLanguage = '';

  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (to.params.productUnitId) {
        vm.retrieveProductUnit(to.params.productUnitId);
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
    if (this.productUnit.id) {
      this.productUnitService()
        .update(this.productUnit)
        .then(param => {
          this.isSaving = false;
          this.$router.go(-1);
          const message = this.$t('productsApp.productsProductUnit.updated', { param: param.id });
          return this.$root.$bvToast.toast(message.toString(), {
            toaster: 'b-toaster-top-center',
            title: 'Info',
            variant: 'info',
            solid: true,
            autoHideDelay: 5000,
          });
        });
    } else {
      this.productUnitService()
        .create(this.productUnit)
        .then(param => {
          this.isSaving = false;
          this.$router.go(-1);
          const message = this.$t('productsApp.productsProductUnit.created', { param: param.id });
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

  public retrieveProductUnit(productUnitId): void {
    this.productUnitService()
      .find(productUnitId)
      .then(res => {
        this.productUnit = res;
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
  }
}

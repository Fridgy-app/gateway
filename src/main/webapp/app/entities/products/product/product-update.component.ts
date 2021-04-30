import { Component, Vue, Inject } from 'vue-property-decorator';

import { required } from 'vuelidate/lib/validators';

import ProductCategoryService from '@/entities/products/product-category/product-category.service';
import { IProductCategory } from '@/shared/model/products/product-category.model';

import ProductUnitService from '@/entities/products/product-unit/product-unit.service';
import { IProductUnit } from '@/shared/model/products/product-unit.model';

import { IProduct, Product } from '@/shared/model/products/product.model';
import ProductService from './product.service';

const validations: any = {
  product: {
    name: {
      required,
    },
    eanCode: {},
  },
};

@Component({
  validations,
})
export default class ProductUpdate extends Vue {
  @Inject('productService') private productService: () => ProductService;
  public product: IProduct = new Product();

  @Inject('productCategoryService') private productCategoryService: () => ProductCategoryService;

  public productCategories: IProductCategory[] = [];

  @Inject('productUnitService') private productUnitService: () => ProductUnitService;

  public productUnits: IProductUnit[] = [];
  public isSaving = false;
  public currentLanguage = '';

  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (to.params.productId) {
        vm.retrieveProduct(to.params.productId);
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
    if (this.product.id) {
      this.productService()
        .update(this.product)
        .then(param => {
          this.isSaving = false;
          this.$router.go(-1);
          const message = this.$t('productsApp.productsProduct.updated', { param: param.id });
          return this.$root.$bvToast.toast(message.toString(), {
            toaster: 'b-toaster-top-center',
            title: 'Info',
            variant: 'info',
            solid: true,
            autoHideDelay: 5000,
          });
        });
    } else {
      this.productService()
        .create(this.product)
        .then(param => {
          this.isSaving = false;
          this.$router.go(-1);
          const message = this.$t('productsApp.productsProduct.created', { param: param.id });
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

  public retrieveProduct(productId): void {
    this.productService()
      .find(productId)
      .then(res => {
        this.product = res;
      });
  }

  public previousState(): void {
    this.$router.go(-1);
  }

  public initRelationships(): void {
    this.productCategoryService()
      .retrieve()
      .then(res => {
        this.productCategories = res.data;
      });
    this.productUnitService()
      .retrieve()
      .then(res => {
        this.productUnits = res.data;
      });
  }
}

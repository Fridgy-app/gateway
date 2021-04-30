import { Component, Vue, Inject } from 'vue-property-decorator';

import { IProductUnit } from '@/shared/model/products/product-unit.model';
import ProductUnitService from './product-unit.service';

@Component
export default class ProductUnitDetails extends Vue {
  @Inject('productUnitService') private productUnitService: () => ProductUnitService;
  public productUnit: IProductUnit = {};

  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (to.params.productUnitId) {
        vm.retrieveProductUnit(to.params.productUnitId);
      }
    });
  }

  public retrieveProductUnit(productUnitId) {
    this.productUnitService()
      .find(productUnitId)
      .then(res => {
        this.productUnit = res;
      });
  }

  public previousState() {
    this.$router.go(-1);
  }
}

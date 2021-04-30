import { Component, Vue, Inject } from 'vue-property-decorator';

import { IGroceryItem } from '@/shared/model/products/grocery-item.model';
import GroceryItemService from './grocery-item.service';

@Component
export default class GroceryItemDetails extends Vue {
  @Inject('groceryItemService') private groceryItemService: () => GroceryItemService;
  public groceryItem: IGroceryItem = {};

  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (to.params.groceryItemId) {
        vm.retrieveGroceryItem(to.params.groceryItemId);
      }
    });
  }

  public retrieveGroceryItem(groceryItemId) {
    this.groceryItemService()
      .find(groceryItemId)
      .then(res => {
        this.groceryItem = res;
      });
  }

  public previousState() {
    this.$router.go(-1);
  }
}

/* tslint:disable max-line-length */
import { shallowMount, createLocalVue, Wrapper } from '@vue/test-utils';
import sinon, { SinonStubbedInstance } from 'sinon';
import VueRouter from 'vue-router';

import * as config from '@/shared/config/config';
import GroceryItemDetailComponent from '@/entities/products/grocery-item/grocery-item-details.vue';
import GroceryItemClass from '@/entities/products/grocery-item/grocery-item-details.component';
import GroceryItemService from '@/entities/products/grocery-item/grocery-item.service';
import router from '@/router';

const localVue = createLocalVue();
localVue.use(VueRouter);

config.initVueApp(localVue);
const i18n = config.initI18N(localVue);
const store = config.initVueXStore(localVue);
localVue.component('font-awesome-icon', {});
localVue.component('router-link', {});

describe('Component Tests', () => {
  describe('GroceryItem Management Detail Component', () => {
    let wrapper: Wrapper<GroceryItemClass>;
    let comp: GroceryItemClass;
    let groceryItemServiceStub: SinonStubbedInstance<GroceryItemService>;

    beforeEach(() => {
      groceryItemServiceStub = sinon.createStubInstance<GroceryItemService>(GroceryItemService);

      wrapper = shallowMount<GroceryItemClass>(GroceryItemDetailComponent, {
        store,
        i18n,
        localVue,
        router,
        provide: { groceryItemService: () => groceryItemServiceStub },
      });
      comp = wrapper.vm;
    });

    describe('OnInit', () => {
      it('Should call load all on init', async () => {
        // GIVEN
        const foundGroceryItem = { id: 123 };
        groceryItemServiceStub.find.resolves(foundGroceryItem);

        // WHEN
        comp.retrieveGroceryItem(123);
        await comp.$nextTick();

        // THEN
        expect(comp.groceryItem).toBe(foundGroceryItem);
      });
    });

    describe('Before route enter', () => {
      it('Should retrieve data', async () => {
        // GIVEN
        const foundGroceryItem = { id: 123 };
        groceryItemServiceStub.find.resolves(foundGroceryItem);

        // WHEN
        comp.beforeRouteEnter({ params: { groceryItemId: 123 } }, null, cb => cb(comp));
        await comp.$nextTick();

        // THEN
        expect(comp.groceryItem).toBe(foundGroceryItem);
      });
    });

    describe('Previous state', () => {
      it('Should go previous state', async () => {
        comp.previousState();
        await comp.$nextTick();

        expect(comp.$router.currentRoute.fullPath).toContain('/');
      });
    });
  });
});

/* tslint:disable max-line-length */
import { shallowMount, createLocalVue, Wrapper } from '@vue/test-utils';
import sinon, { SinonStubbedInstance } from 'sinon';
import Router from 'vue-router';

import * as config from '@/shared/config/config';
import GroceryItemUpdateComponent from '@/entities/products/grocery-item/grocery-item-update.vue';
import GroceryItemClass from '@/entities/products/grocery-item/grocery-item-update.component';
import GroceryItemService from '@/entities/products/grocery-item/grocery-item.service';

import UserOAuth2Service from '@/entities/user/user.oauth2.service';

import ProductService from '@/entities/products/product/product.service';

import ProductUnitService from '@/entities/products/product-unit/product-unit.service';

const localVue = createLocalVue();

config.initVueApp(localVue);
const i18n = config.initI18N(localVue);
const store = config.initVueXStore(localVue);
const router = new Router();
localVue.use(Router);
localVue.component('font-awesome-icon', {});
localVue.component('b-input-group', {});
localVue.component('b-input-group-prepend', {});
localVue.component('b-form-datepicker', {});
localVue.component('b-form-input', {});

describe('Component Tests', () => {
  describe('GroceryItem Management Update Component', () => {
    let wrapper: Wrapper<GroceryItemClass>;
    let comp: GroceryItemClass;
    let groceryItemServiceStub: SinonStubbedInstance<GroceryItemService>;

    beforeEach(() => {
      groceryItemServiceStub = sinon.createStubInstance<GroceryItemService>(GroceryItemService);

      wrapper = shallowMount<GroceryItemClass>(GroceryItemUpdateComponent, {
        store,
        i18n,
        localVue,
        router,
        provide: {
          groceryItemService: () => groceryItemServiceStub,

          userOAuth2Service: () => new UserOAuth2Service(),

          productService: () => new ProductService(),

          productUnitService: () => new ProductUnitService(),
        },
      });
      comp = wrapper.vm;
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', async () => {
        // GIVEN
        const entity = { id: 123 };
        comp.groceryItem = entity;
        groceryItemServiceStub.update.resolves(entity);

        // WHEN
        comp.save();
        await comp.$nextTick();

        // THEN
        expect(groceryItemServiceStub.update.calledWith(entity)).toBeTruthy();
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', async () => {
        // GIVEN
        const entity = {};
        comp.groceryItem = entity;
        groceryItemServiceStub.create.resolves(entity);

        // WHEN
        comp.save();
        await comp.$nextTick();

        // THEN
        expect(groceryItemServiceStub.create.calledWith(entity)).toBeTruthy();
        expect(comp.isSaving).toEqual(false);
      });
    });

    describe('Before route enter', () => {
      it('Should retrieve data', async () => {
        // GIVEN
        const foundGroceryItem = { id: 123 };
        groceryItemServiceStub.find.resolves(foundGroceryItem);
        groceryItemServiceStub.retrieve.resolves([foundGroceryItem]);

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

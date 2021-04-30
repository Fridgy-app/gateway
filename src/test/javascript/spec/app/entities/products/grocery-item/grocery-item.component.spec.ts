/* tslint:disable max-line-length */
import { shallowMount, createLocalVue, Wrapper } from '@vue/test-utils';
import sinon, { SinonStubbedInstance } from 'sinon';

import * as config from '@/shared/config/config';
import GroceryItemComponent from '@/entities/products/grocery-item/grocery-item.vue';
import GroceryItemClass from '@/entities/products/grocery-item/grocery-item.component';
import GroceryItemService from '@/entities/products/grocery-item/grocery-item.service';

const localVue = createLocalVue();

config.initVueApp(localVue);
const i18n = config.initI18N(localVue);
const store = config.initVueXStore(localVue);
localVue.component('font-awesome-icon', {});
localVue.component('b-badge', {});
localVue.component('jhi-sort-indicator', {});
localVue.directive('b-modal', {});
localVue.component('b-button', {});
localVue.component('router-link', {});

const bModalStub = {
  render: () => {},
  methods: {
    hide: () => {},
    show: () => {},
  },
};

describe('Component Tests', () => {
  describe('GroceryItem Management Component', () => {
    let wrapper: Wrapper<GroceryItemClass>;
    let comp: GroceryItemClass;
    let groceryItemServiceStub: SinonStubbedInstance<GroceryItemService>;

    beforeEach(() => {
      groceryItemServiceStub = sinon.createStubInstance<GroceryItemService>(GroceryItemService);
      groceryItemServiceStub.retrieve.resolves({ headers: {} });

      wrapper = shallowMount<GroceryItemClass>(GroceryItemComponent, {
        store,
        i18n,
        localVue,
        stubs: { jhiItemCount: true, bPagination: true, bModal: bModalStub as any },
        provide: {
          groceryItemService: () => groceryItemServiceStub,
        },
      });
      comp = wrapper.vm;
    });

    it('Should call load all on init', async () => {
      // GIVEN
      groceryItemServiceStub.retrieve.resolves({ headers: {}, data: [{ id: 123 }] });

      // WHEN
      comp.retrieveAllGroceryItems();
      await comp.$nextTick();

      // THEN
      expect(groceryItemServiceStub.retrieve.called).toBeTruthy();
      expect(comp.groceryItems[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });

    it('should load a page', async () => {
      // GIVEN
      groceryItemServiceStub.retrieve.resolves({ headers: {}, data: [{ id: 123 }] });
      comp.previousPage = 1;

      // WHEN
      comp.loadPage(2);
      await comp.$nextTick();

      // THEN
      expect(groceryItemServiceStub.retrieve.called).toBeTruthy();
      expect(comp.groceryItems[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });

    it('should re-initialize the page', async () => {
      // GIVEN
      groceryItemServiceStub.retrieve.reset();
      groceryItemServiceStub.retrieve.resolves({ headers: {}, data: [{ id: 123 }] });

      // WHEN
      comp.loadPage(2);
      await comp.$nextTick();
      comp.clear();
      await comp.$nextTick();

      // THEN
      expect(groceryItemServiceStub.retrieve.callCount).toEqual(2);
      expect(comp.page).toEqual(1);
      expect(comp.groceryItems[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });

    it('should calculate the sort attribute for an id', () => {
      // WHEN
      const result = comp.sort();

      // THEN
      expect(result).toEqual(['id,asc']);
    });

    it('should calculate the sort attribute for a non-id attribute', () => {
      // GIVEN
      comp.propOrder = 'name';

      // WHEN
      const result = comp.sort();

      // THEN
      expect(result).toEqual(['name,asc', 'id']);
    });
    it('Should call delete service on confirmDelete', async () => {
      // GIVEN
      groceryItemServiceStub.delete.resolves({});

      // WHEN
      comp.prepareRemove({ id: 123 });
      comp.removeGroceryItem();
      await comp.$nextTick();

      // THEN
      expect(groceryItemServiceStub.delete.called).toBeTruthy();
      expect(groceryItemServiceStub.retrieve.callCount).toEqual(1);
    });
  });
});

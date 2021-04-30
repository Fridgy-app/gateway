/* tslint:disable max-line-length */
import { shallowMount, createLocalVue, Wrapper } from '@vue/test-utils';
import sinon, { SinonStubbedInstance } from 'sinon';

import * as config from '@/shared/config/config';
import ProductUnitComponent from '@/entities/products/product-unit/product-unit.vue';
import ProductUnitClass from '@/entities/products/product-unit/product-unit.component';
import ProductUnitService from '@/entities/products/product-unit/product-unit.service';

const localVue = createLocalVue();

config.initVueApp(localVue);
const i18n = config.initI18N(localVue);
const store = config.initVueXStore(localVue);
localVue.component('font-awesome-icon', {});
localVue.component('b-badge', {});
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
  describe('ProductUnit Management Component', () => {
    let wrapper: Wrapper<ProductUnitClass>;
    let comp: ProductUnitClass;
    let productUnitServiceStub: SinonStubbedInstance<ProductUnitService>;

    beforeEach(() => {
      productUnitServiceStub = sinon.createStubInstance<ProductUnitService>(ProductUnitService);
      productUnitServiceStub.retrieve.resolves({ headers: {} });

      wrapper = shallowMount<ProductUnitClass>(ProductUnitComponent, {
        store,
        i18n,
        localVue,
        stubs: { bModal: bModalStub as any },
        provide: {
          productUnitService: () => productUnitServiceStub,
        },
      });
      comp = wrapper.vm;
    });

    it('Should call load all on init', async () => {
      // GIVEN
      productUnitServiceStub.retrieve.resolves({ headers: {}, data: [{ id: 123 }] });

      // WHEN
      comp.retrieveAllProductUnits();
      await comp.$nextTick();

      // THEN
      expect(productUnitServiceStub.retrieve.called).toBeTruthy();
      expect(comp.productUnits[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
    it('Should call delete service on confirmDelete', async () => {
      // GIVEN
      productUnitServiceStub.delete.resolves({});

      // WHEN
      comp.prepareRemove({ id: 123 });
      comp.removeProductUnit();
      await comp.$nextTick();

      // THEN
      expect(productUnitServiceStub.delete.called).toBeTruthy();
      expect(productUnitServiceStub.retrieve.callCount).toEqual(1);
    });
  });
});

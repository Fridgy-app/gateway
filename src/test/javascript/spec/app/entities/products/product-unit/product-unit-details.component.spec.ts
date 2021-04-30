/* tslint:disable max-line-length */
import { shallowMount, createLocalVue, Wrapper } from '@vue/test-utils';
import sinon, { SinonStubbedInstance } from 'sinon';
import VueRouter from 'vue-router';

import * as config from '@/shared/config/config';
import ProductUnitDetailComponent from '@/entities/products/product-unit/product-unit-details.vue';
import ProductUnitClass from '@/entities/products/product-unit/product-unit-details.component';
import ProductUnitService from '@/entities/products/product-unit/product-unit.service';
import router from '@/router';

const localVue = createLocalVue();
localVue.use(VueRouter);

config.initVueApp(localVue);
const i18n = config.initI18N(localVue);
const store = config.initVueXStore(localVue);
localVue.component('font-awesome-icon', {});
localVue.component('router-link', {});

describe('Component Tests', () => {
  describe('ProductUnit Management Detail Component', () => {
    let wrapper: Wrapper<ProductUnitClass>;
    let comp: ProductUnitClass;
    let productUnitServiceStub: SinonStubbedInstance<ProductUnitService>;

    beforeEach(() => {
      productUnitServiceStub = sinon.createStubInstance<ProductUnitService>(ProductUnitService);

      wrapper = shallowMount<ProductUnitClass>(ProductUnitDetailComponent, {
        store,
        i18n,
        localVue,
        router,
        provide: { productUnitService: () => productUnitServiceStub },
      });
      comp = wrapper.vm;
    });

    describe('OnInit', () => {
      it('Should call load all on init', async () => {
        // GIVEN
        const foundProductUnit = { id: 123 };
        productUnitServiceStub.find.resolves(foundProductUnit);

        // WHEN
        comp.retrieveProductUnit(123);
        await comp.$nextTick();

        // THEN
        expect(comp.productUnit).toBe(foundProductUnit);
      });
    });

    describe('Before route enter', () => {
      it('Should retrieve data', async () => {
        // GIVEN
        const foundProductUnit = { id: 123 };
        productUnitServiceStub.find.resolves(foundProductUnit);

        // WHEN
        comp.beforeRouteEnter({ params: { productUnitId: 123 } }, null, cb => cb(comp));
        await comp.$nextTick();

        // THEN
        expect(comp.productUnit).toBe(foundProductUnit);
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

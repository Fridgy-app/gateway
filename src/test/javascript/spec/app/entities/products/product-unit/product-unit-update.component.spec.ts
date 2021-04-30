/* tslint:disable max-line-length */
import { shallowMount, createLocalVue, Wrapper } from '@vue/test-utils';
import sinon, { SinonStubbedInstance } from 'sinon';
import Router from 'vue-router';

import * as config from '@/shared/config/config';
import ProductUnitUpdateComponent from '@/entities/products/product-unit/product-unit-update.vue';
import ProductUnitClass from '@/entities/products/product-unit/product-unit-update.component';
import ProductUnitService from '@/entities/products/product-unit/product-unit.service';

import ProductService from '@/entities/products/product/product.service';

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
  describe('ProductUnit Management Update Component', () => {
    let wrapper: Wrapper<ProductUnitClass>;
    let comp: ProductUnitClass;
    let productUnitServiceStub: SinonStubbedInstance<ProductUnitService>;

    beforeEach(() => {
      productUnitServiceStub = sinon.createStubInstance<ProductUnitService>(ProductUnitService);

      wrapper = shallowMount<ProductUnitClass>(ProductUnitUpdateComponent, {
        store,
        i18n,
        localVue,
        router,
        provide: {
          productUnitService: () => productUnitServiceStub,

          productService: () => new ProductService(),
        },
      });
      comp = wrapper.vm;
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', async () => {
        // GIVEN
        const entity = { id: 123 };
        comp.productUnit = entity;
        productUnitServiceStub.update.resolves(entity);

        // WHEN
        comp.save();
        await comp.$nextTick();

        // THEN
        expect(productUnitServiceStub.update.calledWith(entity)).toBeTruthy();
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', async () => {
        // GIVEN
        const entity = {};
        comp.productUnit = entity;
        productUnitServiceStub.create.resolves(entity);

        // WHEN
        comp.save();
        await comp.$nextTick();

        // THEN
        expect(productUnitServiceStub.create.calledWith(entity)).toBeTruthy();
        expect(comp.isSaving).toEqual(false);
      });
    });

    describe('Before route enter', () => {
      it('Should retrieve data', async () => {
        // GIVEN
        const foundProductUnit = { id: 123 };
        productUnitServiceStub.find.resolves(foundProductUnit);
        productUnitServiceStub.retrieve.resolves([foundProductUnit]);

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

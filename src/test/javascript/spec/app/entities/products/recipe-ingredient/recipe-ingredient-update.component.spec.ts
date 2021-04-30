/* tslint:disable max-line-length */
import { shallowMount, createLocalVue, Wrapper } from '@vue/test-utils';
import sinon, { SinonStubbedInstance } from 'sinon';
import Router from 'vue-router';

import * as config from '@/shared/config/config';
import RecipeIngredientUpdateComponent from '@/entities/products/recipe-ingredient/recipe-ingredient-update.vue';
import RecipeIngredientClass from '@/entities/products/recipe-ingredient/recipe-ingredient-update.component';
import RecipeIngredientService from '@/entities/products/recipe-ingredient/recipe-ingredient.service';

import ProductService from '@/entities/products/product/product.service';

import ProductUnitService from '@/entities/products/product-unit/product-unit.service';

import RecipeService from '@/entities/products/recipe/recipe.service';

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
  describe('RecipeIngredient Management Update Component', () => {
    let wrapper: Wrapper<RecipeIngredientClass>;
    let comp: RecipeIngredientClass;
    let recipeIngredientServiceStub: SinonStubbedInstance<RecipeIngredientService>;

    beforeEach(() => {
      recipeIngredientServiceStub = sinon.createStubInstance<RecipeIngredientService>(RecipeIngredientService);

      wrapper = shallowMount<RecipeIngredientClass>(RecipeIngredientUpdateComponent, {
        store,
        i18n,
        localVue,
        router,
        provide: {
          recipeIngredientService: () => recipeIngredientServiceStub,

          productService: () => new ProductService(),

          productUnitService: () => new ProductUnitService(),

          recipeService: () => new RecipeService(),
        },
      });
      comp = wrapper.vm;
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', async () => {
        // GIVEN
        const entity = { id: 123 };
        comp.recipeIngredient = entity;
        recipeIngredientServiceStub.update.resolves(entity);

        // WHEN
        comp.save();
        await comp.$nextTick();

        // THEN
        expect(recipeIngredientServiceStub.update.calledWith(entity)).toBeTruthy();
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', async () => {
        // GIVEN
        const entity = {};
        comp.recipeIngredient = entity;
        recipeIngredientServiceStub.create.resolves(entity);

        // WHEN
        comp.save();
        await comp.$nextTick();

        // THEN
        expect(recipeIngredientServiceStub.create.calledWith(entity)).toBeTruthy();
        expect(comp.isSaving).toEqual(false);
      });
    });

    describe('Before route enter', () => {
      it('Should retrieve data', async () => {
        // GIVEN
        const foundRecipeIngredient = { id: 123 };
        recipeIngredientServiceStub.find.resolves(foundRecipeIngredient);
        recipeIngredientServiceStub.retrieve.resolves([foundRecipeIngredient]);

        // WHEN
        comp.beforeRouteEnter({ params: { recipeIngredientId: 123 } }, null, cb => cb(comp));
        await comp.$nextTick();

        // THEN
        expect(comp.recipeIngredient).toBe(foundRecipeIngredient);
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

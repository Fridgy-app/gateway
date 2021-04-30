/* tslint:disable max-line-length */
import { shallowMount, createLocalVue, Wrapper } from '@vue/test-utils';
import sinon, { SinonStubbedInstance } from 'sinon';

import * as config from '@/shared/config/config';
import RecipeIngredientComponent from '@/entities/products/recipe-ingredient/recipe-ingredient.vue';
import RecipeIngredientClass from '@/entities/products/recipe-ingredient/recipe-ingredient.component';
import RecipeIngredientService from '@/entities/products/recipe-ingredient/recipe-ingredient.service';

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
  describe('RecipeIngredient Management Component', () => {
    let wrapper: Wrapper<RecipeIngredientClass>;
    let comp: RecipeIngredientClass;
    let recipeIngredientServiceStub: SinonStubbedInstance<RecipeIngredientService>;

    beforeEach(() => {
      recipeIngredientServiceStub = sinon.createStubInstance<RecipeIngredientService>(RecipeIngredientService);
      recipeIngredientServiceStub.retrieve.resolves({ headers: {} });

      wrapper = shallowMount<RecipeIngredientClass>(RecipeIngredientComponent, {
        store,
        i18n,
        localVue,
        stubs: { bModal: bModalStub as any },
        provide: {
          recipeIngredientService: () => recipeIngredientServiceStub,
        },
      });
      comp = wrapper.vm;
    });

    it('Should call load all on init', async () => {
      // GIVEN
      recipeIngredientServiceStub.retrieve.resolves({ headers: {}, data: [{ id: 123 }] });

      // WHEN
      comp.retrieveAllRecipeIngredients();
      await comp.$nextTick();

      // THEN
      expect(recipeIngredientServiceStub.retrieve.called).toBeTruthy();
      expect(comp.recipeIngredients[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
    it('Should call delete service on confirmDelete', async () => {
      // GIVEN
      recipeIngredientServiceStub.delete.resolves({});

      // WHEN
      comp.prepareRemove({ id: 123 });
      comp.removeRecipeIngredient();
      await comp.$nextTick();

      // THEN
      expect(recipeIngredientServiceStub.delete.called).toBeTruthy();
      expect(recipeIngredientServiceStub.retrieve.callCount).toEqual(1);
    });
  });
});

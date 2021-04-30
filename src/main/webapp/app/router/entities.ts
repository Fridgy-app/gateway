import { Authority } from '@/shared/security/authority';
/* tslint:disable */
// prettier-ignore

// prettier-ignore
const GroceryItem = () => import('@/entities/products/grocery-item/grocery-item.vue');
// prettier-ignore
const GroceryItemUpdate = () => import('@/entities/products/grocery-item/grocery-item-update.vue');
// prettier-ignore
const GroceryItemDetails = () => import('@/entities/products/grocery-item/grocery-item-details.vue');
// prettier-ignore
const RecipeIngredient = () => import('@/entities/products/recipe-ingredient/recipe-ingredient.vue');
// prettier-ignore
const RecipeIngredientUpdate = () => import('@/entities/products/recipe-ingredient/recipe-ingredient-update.vue');
// prettier-ignore
const RecipeIngredientDetails = () => import('@/entities/products/recipe-ingredient/recipe-ingredient-details.vue');
// prettier-ignore
const ProductUnit = () => import('@/entities/products/product-unit/product-unit.vue');
// prettier-ignore
const ProductUnitUpdate = () => import('@/entities/products/product-unit/product-unit-update.vue');
// prettier-ignore
const ProductUnitDetails = () => import('@/entities/products/product-unit/product-unit-details.vue');
// prettier-ignore
const Product = () => import('@/entities/products/product/product.vue');
// prettier-ignore
const ProductUpdate = () => import('@/entities/products/product/product-update.vue');
// prettier-ignore
const ProductDetails = () => import('@/entities/products/product/product-details.vue');
// prettier-ignore
const Recipe = () => import('@/entities/products/recipe/recipe.vue');
// prettier-ignore
const RecipeUpdate = () => import('@/entities/products/recipe/recipe-update.vue');
// prettier-ignore
const RecipeDetails = () => import('@/entities/products/recipe/recipe-details.vue');
// prettier-ignore
const ProductCategory = () => import('@/entities/products/product-category/product-category.vue');
// prettier-ignore
const ProductCategoryUpdate = () => import('@/entities/products/product-category/product-category-update.vue');
// prettier-ignore
const ProductCategoryDetails = () => import('@/entities/products/product-category/product-category-details.vue');
// jhipster-needle-add-entity-to-router-import - JHipster will import entities to the router here

export default [
  {
    path: '/grocery-item',
    name: 'GroceryItem',
    component: GroceryItem,
    meta: { authorities: [Authority.USER] },
  },
  {
    path: '/grocery-item/new',
    name: 'GroceryItemCreate',
    component: GroceryItemUpdate,
    meta: { authorities: [Authority.USER] },
  },
  {
    path: '/grocery-item/:groceryItemId/edit',
    name: 'GroceryItemEdit',
    component: GroceryItemUpdate,
    meta: { authorities: [Authority.USER] },
  },
  {
    path: '/grocery-item/:groceryItemId/view',
    name: 'GroceryItemView',
    component: GroceryItemDetails,
    meta: { authorities: [Authority.USER] },
  },
  {
    path: '/recipe-ingredient',
    name: 'RecipeIngredient',
    component: RecipeIngredient,
    meta: { authorities: [Authority.USER] },
  },
  {
    path: '/recipe-ingredient/new',
    name: 'RecipeIngredientCreate',
    component: RecipeIngredientUpdate,
    meta: { authorities: [Authority.USER] },
  },
  {
    path: '/recipe-ingredient/:recipeIngredientId/edit',
    name: 'RecipeIngredientEdit',
    component: RecipeIngredientUpdate,
    meta: { authorities: [Authority.USER] },
  },
  {
    path: '/recipe-ingredient/:recipeIngredientId/view',
    name: 'RecipeIngredientView',
    component: RecipeIngredientDetails,
    meta: { authorities: [Authority.USER] },
  },
  {
    path: '/product-unit',
    name: 'ProductUnit',
    component: ProductUnit,
    meta: { authorities: [Authority.USER] },
  },
  {
    path: '/product-unit/new',
    name: 'ProductUnitCreate',
    component: ProductUnitUpdate,
    meta: { authorities: [Authority.USER] },
  },
  {
    path: '/product-unit/:productUnitId/edit',
    name: 'ProductUnitEdit',
    component: ProductUnitUpdate,
    meta: { authorities: [Authority.USER] },
  },
  {
    path: '/product-unit/:productUnitId/view',
    name: 'ProductUnitView',
    component: ProductUnitDetails,
    meta: { authorities: [Authority.USER] },
  },
  {
    path: '/product',
    name: 'Product',
    component: Product,
    meta: { authorities: [Authority.USER] },
  },
  {
    path: '/product/new',
    name: 'ProductCreate',
    component: ProductUpdate,
    meta: { authorities: [Authority.USER] },
  },
  {
    path: '/product/:productId/edit',
    name: 'ProductEdit',
    component: ProductUpdate,
    meta: { authorities: [Authority.USER] },
  },
  {
    path: '/product/:productId/view',
    name: 'ProductView',
    component: ProductDetails,
    meta: { authorities: [Authority.USER] },
  },
  {
    path: '/recipe',
    name: 'Recipe',
    component: Recipe,
    meta: { authorities: [Authority.USER] },
  },
  {
    path: '/recipe/new',
    name: 'RecipeCreate',
    component: RecipeUpdate,
    meta: { authorities: [Authority.USER] },
  },
  {
    path: '/recipe/:recipeId/edit',
    name: 'RecipeEdit',
    component: RecipeUpdate,
    meta: { authorities: [Authority.USER] },
  },
  {
    path: '/recipe/:recipeId/view',
    name: 'RecipeView',
    component: RecipeDetails,
    meta: { authorities: [Authority.USER] },
  },
  {
    path: '/product-category',
    name: 'ProductCategory',
    component: ProductCategory,
    meta: { authorities: [Authority.USER] },
  },
  {
    path: '/product-category/new',
    name: 'ProductCategoryCreate',
    component: ProductCategoryUpdate,
    meta: { authorities: [Authority.USER] },
  },
  {
    path: '/product-category/:productCategoryId/edit',
    name: 'ProductCategoryEdit',
    component: ProductCategoryUpdate,
    meta: { authorities: [Authority.USER] },
  },
  {
    path: '/product-category/:productCategoryId/view',
    name: 'ProductCategoryView',
    component: ProductCategoryDetails,
    meta: { authorities: [Authority.USER] },
  },
  // jhipster-needle-add-entity-to-router - JHipster will add entities to the router here
];

import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'grocery-item',
        data: { pageTitle: 'gatewayApp.productsGroceryItem.home.title' },
        loadChildren: () => import('./products/grocery-item/grocery-item.module').then(m => m.ProductsGroceryItemModule),
      },
      {
        path: 'recipe-ingredient',
        data: { pageTitle: 'gatewayApp.productsRecipeIngredient.home.title' },
        loadChildren: () => import('./products/recipe-ingredient/recipe-ingredient.module').then(m => m.ProductsRecipeIngredientModule),
      },
      {
        path: 'product-unit',
        data: { pageTitle: 'gatewayApp.productsProductUnit.home.title' },
        loadChildren: () => import('./products/product-unit/product-unit.module').then(m => m.ProductsProductUnitModule),
      },
      {
        path: 'product',
        data: { pageTitle: 'gatewayApp.productsProduct.home.title' },
        loadChildren: () => import('./products/product/product.module').then(m => m.ProductsProductModule),
      },
      {
        path: 'recipe',
        data: { pageTitle: 'gatewayApp.productsRecipe.home.title' },
        loadChildren: () => import('./products/recipe/recipe.module').then(m => m.ProductsRecipeModule),
      },
      {
        path: 'product-category',
        data: { pageTitle: 'gatewayApp.productsProductCategory.home.title' },
        loadChildren: () => import('./products/product-category/product-category.module').then(m => m.ProductsProductCategoryModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}

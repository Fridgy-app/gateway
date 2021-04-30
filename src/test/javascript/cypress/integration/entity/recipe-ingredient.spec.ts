import {
  entityTableSelector,
  entityDetailsButtonSelector,
  entityDetailsBackButtonSelector,
  entityCreateButtonSelector,
  entityCreateSaveButtonSelector,
  entityEditButtonSelector,
  entityDeleteButtonSelector,
  entityConfirmDeleteButtonSelector,
} from '../../support/entity';

describe('RecipeIngredient e2e test', () => {
  let startingEntitiesCount = 0;

  beforeEach(() => {
    cy.getOauth2Data();
    cy.get('@oauth2Data').then(oauth2Data => {
      cy.oauthLogin(oauth2Data, Cypress.env('E2E_USERNAME') || 'admin', Cypress.env('E2E_PASSWORD') || 'admin');
    });
    cy.intercept('GET', '/services/products/api/recipe-ingredients*').as('entitiesRequest');
    cy.visit('');
    cy.clickOnEntityMenuItem('recipe-ingredient');
    cy.wait('@entitiesRequest').then(({ request, response }) => (startingEntitiesCount = response.body.length));
    cy.visit('/');
  });

  afterEach(() => {
    cy.get('@oauth2Data').then(oauth2Data => {
      cy.oauthLogout(oauth2Data);
    });
    cy.clearCache();
  });

  it('should load RecipeIngredients', () => {
    cy.intercept('GET', '/services/products/api/recipe-ingredients*').as('entitiesRequest');
    cy.visit('/');
    cy.clickOnEntityMenuItem('recipe-ingredient');
    cy.wait('@entitiesRequest');
    cy.getEntityHeading('RecipeIngredient').should('exist');
    if (startingEntitiesCount === 0) {
      cy.get(entityTableSelector).should('not.exist');
    } else {
      cy.get(entityTableSelector).should('have.lengthOf', startingEntitiesCount);
    }
    cy.visit('/');
  });

  it('should load details RecipeIngredient page', () => {
    cy.intercept('GET', '/services/products/api/recipe-ingredients*').as('entitiesRequest');
    cy.visit('/');
    cy.clickOnEntityMenuItem('recipe-ingredient');
    cy.wait('@entitiesRequest');
    if (startingEntitiesCount > 0) {
      cy.get(entityDetailsButtonSelector).first().click({ force: true });
      cy.getEntityDetailsHeading('recipeIngredient');
      cy.get(entityDetailsBackButtonSelector).should('exist');
    }
    cy.visit('/');
  });

  it('should load create RecipeIngredient page', () => {
    cy.intercept('GET', '/services/products/api/recipe-ingredients*').as('entitiesRequest');
    cy.visit('/');
    cy.clickOnEntityMenuItem('recipe-ingredient');
    cy.wait('@entitiesRequest');
    cy.get(entityCreateButtonSelector).click({ force: true });
    cy.getEntityCreateUpdateHeading('RecipeIngredient');
    cy.get(entityCreateSaveButtonSelector).should('exist');
    cy.visit('/');
  });

  it('should load edit RecipeIngredient page', () => {
    cy.intercept('GET', '/services/products/api/recipe-ingredients*').as('entitiesRequest');
    cy.visit('/');
    cy.clickOnEntityMenuItem('recipe-ingredient');
    cy.wait('@entitiesRequest');
    if (startingEntitiesCount > 0) {
      cy.get(entityEditButtonSelector).first().click({ force: true });
      cy.getEntityCreateUpdateHeading('RecipeIngredient');
      cy.get(entityCreateSaveButtonSelector).should('exist');
    }
    cy.visit('/');
  });

  it('should create an instance of RecipeIngredient', () => {
    cy.intercept('GET', '/services/products/api/recipe-ingredients*').as('entitiesRequest');
    cy.visit('/');
    cy.clickOnEntityMenuItem('recipe-ingredient');
    cy.wait('@entitiesRequest').then(({ request, response }) => (startingEntitiesCount = response.body.length));
    cy.get(entityCreateButtonSelector).click({ force: true });
    cy.getEntityCreateUpdateHeading('RecipeIngredient');

    cy.get(`[data-cy="quantity"]`).type('70392').should('have.value', '70392');

    cy.setFieldSelectToLastOfEntity('product');

    cy.setFieldSelectToLastOfEntity('productUnit');

    cy.setFieldSelectToLastOfEntity('recipe');

    cy.get(entityCreateSaveButtonSelector).click({ force: true });
    cy.scrollTo('top', { ensureScrollable: false });
    cy.get(entityCreateSaveButtonSelector).should('not.exist');
    cy.intercept('GET', '/services/products/api/recipe-ingredients*').as('entitiesRequestAfterCreate');
    cy.visit('/');
    cy.clickOnEntityMenuItem('recipe-ingredient');
    cy.wait('@entitiesRequestAfterCreate');
    cy.get(entityTableSelector).should('have.lengthOf', startingEntitiesCount + 1);
    cy.visit('/');
  });

  it('should delete last instance of RecipeIngredient', () => {
    cy.intercept('GET', '/services/products/api/recipe-ingredients*').as('entitiesRequest');
    cy.intercept('DELETE', '/services/products/api/recipe-ingredients/*').as('deleteEntityRequest');
    cy.visit('/');
    cy.clickOnEntityMenuItem('recipe-ingredient');
    cy.wait('@entitiesRequest').then(({ request, response }) => {
      startingEntitiesCount = response.body.length;
      if (startingEntitiesCount > 0) {
        cy.get(entityTableSelector).should('have.lengthOf', startingEntitiesCount);
        cy.get(entityDeleteButtonSelector).last().click({ force: true });
        cy.getEntityDeleteDialogHeading('recipeIngredient').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click({ force: true });
        cy.wait('@deleteEntityRequest');
        cy.intercept('GET', '/services/products/api/recipe-ingredients*').as('entitiesRequestAfterDelete');
        cy.visit('/');
        cy.clickOnEntityMenuItem('recipe-ingredient');
        cy.wait('@entitiesRequestAfterDelete');
        cy.get(entityTableSelector).should('have.lengthOf', startingEntitiesCount - 1);
      }
      cy.visit('/');
    });
  });
});

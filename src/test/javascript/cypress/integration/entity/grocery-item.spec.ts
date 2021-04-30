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

describe('GroceryItem e2e test', () => {
  let startingEntitiesCount = 0;

  beforeEach(() => {
    cy.getOauth2Data();
    cy.get('@oauth2Data').then(oauth2Data => {
      cy.oauthLogin(oauth2Data, Cypress.env('E2E_USERNAME') || 'admin', Cypress.env('E2E_PASSWORD') || 'admin');
    });
    cy.intercept('GET', '/services/products/api/grocery-items*').as('entitiesRequest');
    cy.visit('');
    cy.clickOnEntityMenuItem('grocery-item');
    cy.wait('@entitiesRequest').then(({ request, response }) => (startingEntitiesCount = response.body.length));
    cy.visit('/');
  });

  afterEach(() => {
    cy.get('@oauth2Data').then(oauth2Data => {
      cy.oauthLogout(oauth2Data);
    });
    cy.clearCache();
  });

  it('should load GroceryItems', () => {
    cy.intercept('GET', '/services/products/api/grocery-items*').as('entitiesRequest');
    cy.visit('/');
    cy.clickOnEntityMenuItem('grocery-item');
    cy.wait('@entitiesRequest');
    cy.getEntityHeading('GroceryItem').should('exist');
    if (startingEntitiesCount === 0) {
      cy.get(entityTableSelector).should('not.exist');
    } else {
      cy.get(entityTableSelector).should('have.lengthOf', startingEntitiesCount);
    }
    cy.visit('/');
  });

  it('should load details GroceryItem page', () => {
    cy.intercept('GET', '/services/products/api/grocery-items*').as('entitiesRequest');
    cy.visit('/');
    cy.clickOnEntityMenuItem('grocery-item');
    cy.wait('@entitiesRequest');
    if (startingEntitiesCount > 0) {
      cy.get(entityDetailsButtonSelector).first().click({ force: true });
      cy.getEntityDetailsHeading('groceryItem');
      cy.get(entityDetailsBackButtonSelector).should('exist');
    }
    cy.visit('/');
  });

  it('should load create GroceryItem page', () => {
    cy.intercept('GET', '/services/products/api/grocery-items*').as('entitiesRequest');
    cy.visit('/');
    cy.clickOnEntityMenuItem('grocery-item');
    cy.wait('@entitiesRequest');
    cy.get(entityCreateButtonSelector).click({ force: true });
    cy.getEntityCreateUpdateHeading('GroceryItem');
    cy.get(entityCreateSaveButtonSelector).should('exist');
    cy.visit('/');
  });

  it('should load edit GroceryItem page', () => {
    cy.intercept('GET', '/services/products/api/grocery-items*').as('entitiesRequest');
    cy.visit('/');
    cy.clickOnEntityMenuItem('grocery-item');
    cy.wait('@entitiesRequest');
    if (startingEntitiesCount > 0) {
      cy.get(entityEditButtonSelector).first().click({ force: true });
      cy.getEntityCreateUpdateHeading('GroceryItem');
      cy.get(entityCreateSaveButtonSelector).should('exist');
    }
    cy.visit('/');
  });

  it('should create an instance of GroceryItem', () => {
    cy.intercept('GET', '/services/products/api/grocery-items*').as('entitiesRequest');
    cy.visit('/');
    cy.clickOnEntityMenuItem('grocery-item');
    cy.wait('@entitiesRequest').then(({ request, response }) => (startingEntitiesCount = response.body.length));
    cy.get(entityCreateButtonSelector).click({ force: true });
    cy.getEntityCreateUpdateHeading('GroceryItem');

    cy.get(`[data-cy="quantity"]`).type('69018').should('have.value', '69018');

    cy.get(`[data-cy="description"]`).type('Web 24/7', { force: true }).invoke('val').should('match', new RegExp('Web 24/7'));

    cy.setFieldSelectToLastOfEntity('user');

    cy.setFieldSelectToLastOfEntity('product');

    cy.setFieldSelectToLastOfEntity('unit');

    cy.get(entityCreateSaveButtonSelector).click({ force: true });
    cy.scrollTo('top', { ensureScrollable: false });
    cy.get(entityCreateSaveButtonSelector).should('not.exist');
    cy.intercept('GET', '/services/products/api/grocery-items*').as('entitiesRequestAfterCreate');
    cy.visit('/');
    cy.clickOnEntityMenuItem('grocery-item');
    cy.wait('@entitiesRequestAfterCreate');
    cy.get(entityTableSelector).should('have.lengthOf', startingEntitiesCount + 1);
    cy.visit('/');
  });

  it('should delete last instance of GroceryItem', () => {
    cy.intercept('GET', '/services/products/api/grocery-items*').as('entitiesRequest');
    cy.intercept('DELETE', '/services/products/api/grocery-items/*').as('deleteEntityRequest');
    cy.visit('/');
    cy.clickOnEntityMenuItem('grocery-item');
    cy.wait('@entitiesRequest').then(({ request, response }) => {
      startingEntitiesCount = response.body.length;
      if (startingEntitiesCount > 0) {
        cy.get(entityTableSelector).should('have.lengthOf', startingEntitiesCount);
        cy.get(entityDeleteButtonSelector).last().click({ force: true });
        cy.getEntityDeleteDialogHeading('groceryItem').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click({ force: true });
        cy.wait('@deleteEntityRequest');
        cy.intercept('GET', '/services/products/api/grocery-items*').as('entitiesRequestAfterDelete');
        cy.visit('/');
        cy.clickOnEntityMenuItem('grocery-item');
        cy.wait('@entitiesRequestAfterDelete');
        cy.get(entityTableSelector).should('have.lengthOf', startingEntitiesCount - 1);
      }
      cy.visit('/');
    });
  });
});

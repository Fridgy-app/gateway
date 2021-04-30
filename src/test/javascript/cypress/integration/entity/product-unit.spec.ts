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

describe('ProductUnit e2e test', () => {
  let startingEntitiesCount = 0;

  beforeEach(() => {
    cy.getOauth2Data();
    cy.get('@oauth2Data').then(oauth2Data => {
      cy.oauthLogin(oauth2Data, Cypress.env('E2E_USERNAME') || 'admin', Cypress.env('E2E_PASSWORD') || 'admin');
    });
    cy.intercept('GET', '/services/products/api/product-units*').as('entitiesRequest');
    cy.visit('');
    cy.clickOnEntityMenuItem('product-unit');
    cy.wait('@entitiesRequest').then(({ request, response }) => (startingEntitiesCount = response.body.length));
    cy.visit('/');
  });

  afterEach(() => {
    cy.get('@oauth2Data').then(oauth2Data => {
      cy.oauthLogout(oauth2Data);
    });
    cy.clearCache();
  });

  it('should load ProductUnits', () => {
    cy.intercept('GET', '/services/products/api/product-units*').as('entitiesRequest');
    cy.visit('/');
    cy.clickOnEntityMenuItem('product-unit');
    cy.wait('@entitiesRequest');
    cy.getEntityHeading('ProductUnit').should('exist');
    if (startingEntitiesCount === 0) {
      cy.get(entityTableSelector).should('not.exist');
    } else {
      cy.get(entityTableSelector).should('have.lengthOf', startingEntitiesCount);
    }
    cy.visit('/');
  });

  it('should load details ProductUnit page', () => {
    cy.intercept('GET', '/services/products/api/product-units*').as('entitiesRequest');
    cy.visit('/');
    cy.clickOnEntityMenuItem('product-unit');
    cy.wait('@entitiesRequest');
    if (startingEntitiesCount > 0) {
      cy.get(entityDetailsButtonSelector).first().click({ force: true });
      cy.getEntityDetailsHeading('productUnit');
      cy.get(entityDetailsBackButtonSelector).should('exist');
    }
    cy.visit('/');
  });

  it('should load create ProductUnit page', () => {
    cy.intercept('GET', '/services/products/api/product-units*').as('entitiesRequest');
    cy.visit('/');
    cy.clickOnEntityMenuItem('product-unit');
    cy.wait('@entitiesRequest');
    cy.get(entityCreateButtonSelector).click({ force: true });
    cy.getEntityCreateUpdateHeading('ProductUnit');
    cy.get(entityCreateSaveButtonSelector).should('exist');
    cy.visit('/');
  });

  it('should load edit ProductUnit page', () => {
    cy.intercept('GET', '/services/products/api/product-units*').as('entitiesRequest');
    cy.visit('/');
    cy.clickOnEntityMenuItem('product-unit');
    cy.wait('@entitiesRequest');
    if (startingEntitiesCount > 0) {
      cy.get(entityEditButtonSelector).first().click({ force: true });
      cy.getEntityCreateUpdateHeading('ProductUnit');
      cy.get(entityCreateSaveButtonSelector).should('exist');
    }
    cy.visit('/');
  });

  it('should create an instance of ProductUnit', () => {
    cy.intercept('GET', '/services/products/api/product-units*').as('entitiesRequest');
    cy.visit('/');
    cy.clickOnEntityMenuItem('product-unit');
    cy.wait('@entitiesRequest').then(({ request, response }) => (startingEntitiesCount = response.body.length));
    cy.get(entityCreateButtonSelector).click({ force: true });
    cy.getEntityCreateUpdateHeading('ProductUnit');

    cy.get(`[data-cy="name"]`)
      .type('parsing Brook invoice', { force: true })
      .invoke('val')
      .should('match', new RegExp('parsing Brook invoice'));

    cy.get(entityCreateSaveButtonSelector).click({ force: true });
    cy.scrollTo('top', { ensureScrollable: false });
    cy.get(entityCreateSaveButtonSelector).should('not.exist');
    cy.intercept('GET', '/services/products/api/product-units*').as('entitiesRequestAfterCreate');
    cy.visit('/');
    cy.clickOnEntityMenuItem('product-unit');
    cy.wait('@entitiesRequestAfterCreate');
    cy.get(entityTableSelector).should('have.lengthOf', startingEntitiesCount + 1);
    cy.visit('/');
  });

  it('should delete last instance of ProductUnit', () => {
    cy.intercept('GET', '/services/products/api/product-units*').as('entitiesRequest');
    cy.intercept('DELETE', '/services/products/api/product-units/*').as('deleteEntityRequest');
    cy.visit('/');
    cy.clickOnEntityMenuItem('product-unit');
    cy.wait('@entitiesRequest').then(({ request, response }) => {
      startingEntitiesCount = response.body.length;
      if (startingEntitiesCount > 0) {
        cy.get(entityTableSelector).should('have.lengthOf', startingEntitiesCount);
        cy.get(entityDeleteButtonSelector).last().click({ force: true });
        cy.getEntityDeleteDialogHeading('productUnit').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click({ force: true });
        cy.wait('@deleteEntityRequest');
        cy.intercept('GET', '/services/products/api/product-units*').as('entitiesRequestAfterDelete');
        cy.visit('/');
        cy.clickOnEntityMenuItem('product-unit');
        cy.wait('@entitiesRequestAfterDelete');
        cy.get(entityTableSelector).should('have.lengthOf', startingEntitiesCount - 1);
      }
      cy.visit('/');
    });
  });
});

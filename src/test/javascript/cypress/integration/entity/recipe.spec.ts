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

describe('Recipe e2e test', () => {
  let startingEntitiesCount = 0;

  beforeEach(() => {
    cy.getOauth2Data();
    cy.get('@oauth2Data').then(oauth2Data => {
      cy.oauthLogin(oauth2Data, Cypress.env('E2E_USERNAME') || 'admin', Cypress.env('E2E_PASSWORD') || 'admin');
    });
    cy.intercept('GET', '/services/products/api/recipes*').as('entitiesRequest');
    cy.visit('');
    cy.clickOnEntityMenuItem('recipe');
    cy.wait('@entitiesRequest').then(({ request, response }) => (startingEntitiesCount = response.body.length));
    cy.visit('/');
  });

  afterEach(() => {
    cy.get('@oauth2Data').then(oauth2Data => {
      cy.oauthLogout(oauth2Data);
    });
    cy.clearCache();
  });

  it('should load Recipes', () => {
    cy.intercept('GET', '/services/products/api/recipes*').as('entitiesRequest');
    cy.visit('/');
    cy.clickOnEntityMenuItem('recipe');
    cy.wait('@entitiesRequest');
    cy.getEntityHeading('Recipe').should('exist');
    if (startingEntitiesCount === 0) {
      cy.get(entityTableSelector).should('not.exist');
    } else {
      cy.get(entityTableSelector).should('have.lengthOf', startingEntitiesCount);
    }
    cy.visit('/');
  });

  it('should load details Recipe page', () => {
    cy.intercept('GET', '/services/products/api/recipes*').as('entitiesRequest');
    cy.visit('/');
    cy.clickOnEntityMenuItem('recipe');
    cy.wait('@entitiesRequest');
    if (startingEntitiesCount > 0) {
      cy.get(entityDetailsButtonSelector).first().click({ force: true });
      cy.getEntityDetailsHeading('recipe');
      cy.get(entityDetailsBackButtonSelector).should('exist');
    }
    cy.visit('/');
  });

  it('should load create Recipe page', () => {
    cy.intercept('GET', '/services/products/api/recipes*').as('entitiesRequest');
    cy.visit('/');
    cy.clickOnEntityMenuItem('recipe');
    cy.wait('@entitiesRequest');
    cy.get(entityCreateButtonSelector).click({ force: true });
    cy.getEntityCreateUpdateHeading('Recipe');
    cy.get(entityCreateSaveButtonSelector).should('exist');
    cy.visit('/');
  });

  it('should load edit Recipe page', () => {
    cy.intercept('GET', '/services/products/api/recipes*').as('entitiesRequest');
    cy.visit('/');
    cy.clickOnEntityMenuItem('recipe');
    cy.wait('@entitiesRequest');
    if (startingEntitiesCount > 0) {
      cy.get(entityEditButtonSelector).first().click({ force: true });
      cy.getEntityCreateUpdateHeading('Recipe');
      cy.get(entityCreateSaveButtonSelector).should('exist');
    }
    cy.visit('/');
  });

  it('should create an instance of Recipe', () => {
    cy.intercept('GET', '/services/products/api/recipes*').as('entitiesRequest');
    cy.visit('/');
    cy.clickOnEntityMenuItem('recipe');
    cy.wait('@entitiesRequest').then(({ request, response }) => (startingEntitiesCount = response.body.length));
    cy.get(entityCreateButtonSelector).click({ force: true });
    cy.getEntityCreateUpdateHeading('Recipe');

    cy.get(`[data-cy="name"]`)
      .type('Strategist generate', { force: true })
      .invoke('val')
      .should('match', new RegExp('Strategist generate'));

    cy.get(`[data-cy="instructionsBody"]`)
      .type('conglomeration Ball e-business', { force: true })
      .invoke('val')
      .should('match', new RegExp('conglomeration Ball e-business'));

    cy.setFieldSelectToLastOfEntity('user');

    cy.get(entityCreateSaveButtonSelector).click({ force: true });
    cy.scrollTo('top', { ensureScrollable: false });
    cy.get(entityCreateSaveButtonSelector).should('not.exist');
    cy.intercept('GET', '/services/products/api/recipes*').as('entitiesRequestAfterCreate');
    cy.visit('/');
    cy.clickOnEntityMenuItem('recipe');
    cy.wait('@entitiesRequestAfterCreate');
    cy.get(entityTableSelector).should('have.lengthOf', startingEntitiesCount + 1);
    cy.visit('/');
  });

  it('should delete last instance of Recipe', () => {
    cy.intercept('GET', '/services/products/api/recipes*').as('entitiesRequest');
    cy.intercept('DELETE', '/services/products/api/recipes/*').as('deleteEntityRequest');
    cy.visit('/');
    cy.clickOnEntityMenuItem('recipe');
    cy.wait('@entitiesRequest').then(({ request, response }) => {
      startingEntitiesCount = response.body.length;
      if (startingEntitiesCount > 0) {
        cy.get(entityTableSelector).should('have.lengthOf', startingEntitiesCount);
        cy.get(entityDeleteButtonSelector).last().click({ force: true });
        cy.getEntityDeleteDialogHeading('recipe').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click({ force: true });
        cy.wait('@deleteEntityRequest');
        cy.intercept('GET', '/services/products/api/recipes*').as('entitiesRequestAfterDelete');
        cy.visit('/');
        cy.clickOnEntityMenuItem('recipe');
        cy.wait('@entitiesRequestAfterDelete');
        cy.get(entityTableSelector).should('have.lengthOf', startingEntitiesCount - 1);
      }
      cy.visit('/');
    });
  });
});

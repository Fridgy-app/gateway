jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { RecipeIngredientService } from '../service/recipe-ingredient.service';

import { RecipeIngredientComponent } from './recipe-ingredient.component';

describe('Component Tests', () => {
  describe('RecipeIngredient Management Component', () => {
    let comp: RecipeIngredientComponent;
    let fixture: ComponentFixture<RecipeIngredientComponent>;
    let service: RecipeIngredientService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [RecipeIngredientComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { snapshot: { queryParams: {} } },
          },
        ],
      })
        .overrideTemplate(RecipeIngredientComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(RecipeIngredientComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(RecipeIngredientService);

      const headers = new HttpHeaders().append('link', 'link;link');
      spyOn(service, 'query').and.returnValue(
        of(
          new HttpResponse({
            body: [{ id: 123 }],
            headers,
          })
        )
      );
    });

    it('Should call load all on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.recipeIngredients?.[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});

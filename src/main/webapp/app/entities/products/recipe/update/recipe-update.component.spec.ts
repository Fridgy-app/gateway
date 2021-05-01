jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { RecipeService } from '../service/recipe.service';
import { IRecipe, Recipe } from '../recipe.model';

import { RecipeUpdateComponent } from './recipe-update.component';

describe('Component Tests', () => {
  describe('Recipe Management Update Component', () => {
    let comp: RecipeUpdateComponent;
    let fixture: ComponentFixture<RecipeUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let recipeService: RecipeService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [RecipeUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(RecipeUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(RecipeUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      recipeService = TestBed.inject(RecipeService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should update editForm', () => {
        const recipe: IRecipe = { id: 456 };

        activatedRoute.data = of({ recipe });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(recipe));
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const recipe = { id: 123 };
        spyOn(recipeService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ recipe });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: recipe }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(recipeService.update).toHaveBeenCalledWith(recipe);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const recipe = new Recipe();
        spyOn(recipeService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ recipe });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: recipe }));
        saveSubject.complete();

        // THEN
        expect(recipeService.create).toHaveBeenCalledWith(recipe);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const recipe = { id: 123 };
        spyOn(recipeService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ recipe });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(recipeService.update).toHaveBeenCalledWith(recipe);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });
  });
});

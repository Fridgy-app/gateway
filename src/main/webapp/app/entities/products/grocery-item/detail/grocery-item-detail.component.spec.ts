import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { GroceryItemDetailComponent } from './grocery-item-detail.component';

describe('Component Tests', () => {
  describe('GroceryItem Management Detail Component', () => {
    let comp: GroceryItemDetailComponent;
    let fixture: ComponentFixture<GroceryItemDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [GroceryItemDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ groceryItem: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(GroceryItemDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(GroceryItemDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load groceryItem on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.groceryItem).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});

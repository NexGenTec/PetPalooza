import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';



import { gatoPage } from './gato.page';

describe('gatoPage', () => {
  let component: gatoPage;
  let fixture: ComponentFixture<gatoPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [gatoPage],
      imports: [IonicModule.forRoot(),]
    }).compileComponents();

    fixture = TestBed.createComponent(gatoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

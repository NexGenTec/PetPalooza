import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';



import { perroPage } from './perro.page';

describe('perroPage', () => {
  let component: perroPage;
  let fixture: ComponentFixture<perroPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [perroPage],
      imports: [IonicModule.forRoot(),]
    }).compileComponents();

    fixture = TestBed.createComponent(perroPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

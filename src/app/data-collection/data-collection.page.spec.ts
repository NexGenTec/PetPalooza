import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DataCollectionPage } from './data-collection.page';

describe('DataCollectionPage', () => {
  let component: DataCollectionPage;
  let fixture: ComponentFixture<DataCollectionPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DataCollectionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

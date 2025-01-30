import { TestBed } from '@angular/core/testing';

import { MestizosService } from './mestizos.service';

describe('MestizosService', () => {
  let service: MestizosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MestizosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { Seat } from './seat.service';

describe('Seat', () => {
  let service: Seat;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Seat);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { Venue } from './venue.service';

describe('Venue', () => {
  let service: Venue;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Venue);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

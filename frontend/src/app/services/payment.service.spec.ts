import { TestBed } from '@angular/core/testing';

import { Payment } from './payment.service';

describe('Payment', () => {
  let service: Payment;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Payment);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

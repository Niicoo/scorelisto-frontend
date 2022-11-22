import { TestBed } from '@angular/core/testing';

import { ParametersManagerService } from './parameters-manager.service';

describe('ParametersManagerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ParametersManagerService = TestBed.get(ParametersManagerService);
    expect(service).toBeTruthy();
  });
});

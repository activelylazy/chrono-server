import { describe, it } from 'mocha';
import { assert, should } from 'chai';
import { createDriverRow } from '../../../src/data_source/page1/create_driver_row';

should();

describe('create driver row', () => {
  it('copies page 1 and adds driver', () => {
    const driver = 'VAN';
    const lastGaps = {
      VAN: {
        lapsCompleted: 0,
      },
    };
    const lastPage1 = {
      VAN: {
        s1Time: 12.345,
        s2Time: 34.456,
      },
    };

    const row = createDriverRow(driver, lastGaps, lastPage1);

    assert(row.s1Time.should.equal(12.345));
    assert(row.s2Time.should.equal(34.456));
    assert(row.driver.should.equal('VAN'));
  });

  it('assigns lap number in sector 1', () => {
    const driver = 'VAN';
    const lastGaps = {
      VAN: {
        lapsCompleted: 3,
      },
    };
    const lastPage1 = {
      VAN: {
        s1Time: 12.345,
        s2Time: 34.456,
        s3Time: 45.567,
      },
    };

    const row = createDriverRow(driver, lastGaps, lastPage1);

    assert(row.lapNumber.should.equal(3));
  });

  it('assigns lap number + 1 in sector 2', () => {
    const driver = 'VAN';
    const lastGaps = {
      VAN: {
        lapsCompleted: 3,
      },
    };
    const lastPage1 = {
      VAN: {
        s1Time: 12.345,
        s2Time: NaN,
        s3Time: NaN,
      },
    };

    const row = createDriverRow(driver, lastGaps, lastPage1);

    assert(row.lapNumber.should.equal(4));
  });

  it('assigns lap number + 1 in sector 3', () => {
    const driver = 'VAN';
    const lastGaps = {
      VAN: {
        lapsCompleted: 3,
      },
    };
    const lastPage1 = {
      VAN: {
        s1Time: 12.345,
        s2Time: 23.456,
        s3Time: NaN,
      },
    };

    const row = createDriverRow(driver, lastGaps, lastPage1);

    assert(row.lapNumber.should.equal(4));
  });
});
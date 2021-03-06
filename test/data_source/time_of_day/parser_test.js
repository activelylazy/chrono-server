import { describe, it } from 'mocha';
import { assert, should } from 'chai';
import timeOfDayParser from '../../../src/data_source/time_of_day/parser';

should();

describe('time of day parser', () => {
  it('should extract time of day', () => {
    const input = {
      sq: {
        T: 11534623000000,
      },
    };

    const timeOfDay = timeOfDayParser.parse(input);

    assert(timeOfDay.time.should.equal(11534623));
  });

  it('extracts undefined in case of no source data', () => {
    const input = {
      sq: {
      },
    };

    const timeOfDay = timeOfDayParser.parse(input);

    assert(timeOfDay.time === undefined);
  });
});

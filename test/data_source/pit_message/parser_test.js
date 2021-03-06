import { describe, it } from 'mocha';
import { assert, should } from 'chai';
import pitMessageParser from '../../../src/data_source/pit_message/parser';

should();

describe('pit message parser', () => {
  const drivers = [
    {
      tla: 'VAN',
    },
    {
      tla: 'ALO',
    },
    {
      tla: 'VET',
    },
  ];

  it('should return null in case of no x data block', () => {
    const input = { };

    const pitData = pitMessageParser.parse(drivers, input);

    assert.isNull(pitData);
  });

  it('errors in case size of driver list disagrees', () => {
    const input = {
      x: {
        Test_Race_1234: {
          DR: [
            { }, { },
          ],
        },
      },
    };

    assert.throws(() => pitMessageParser.parse(drivers, input), 'Expected 3 drivers in x block but found 2');
  });

  it('parses empty pit data as single stint for driver', () => {
    const singleDriver = [{
      tla: 'VET',
    }];
    const input = {
      x: {
        Test_Race_1234: {
          DR: [
            {
              X: ',15,20,,,0,89.771,92.926,0.0,M,,,',
              TI: '5,3,3,',
              PD: '',
            },
          ],
        },
      },
    };

    const pitData = pitMessageParser.parse(singleDriver, input);

    assert(pitData.should.have.property('VET'));
    assert(pitData.VET.currentStatus.should.equal(''));
    assert(pitData.VET.should.have.property('stints'));
    assert(pitData.VET.stints.length.should.equal(1));
    assert(pitData.VET.stints[0].startLap.should.equal(0));
    assert(pitData.VET.stints[0].tyre.should.equal('M'));
    assert(pitData.VET.stints[0].tyreAge.should.equal(0));
  });

  it('parses 0,0 as pit entry at end of first stint', () => {
    const singleDriver = [{
      tla: 'VET',
    }];
    const input = {
      x: {
        Test_Race_1234: {
          DR: [
            {
              X: ',15,20,,,0,89.771,92.926,0.0,M,,,',
              TI: '5,3,3,',
              PD: '0,0',
            },
          ],
        },
      },
    };

    const pitData = pitMessageParser.parse(singleDriver, input);

    assert(pitData.should.have.property('VET'));
    assert(pitData.VET.currentStatus.should.equal('in pit'));
    assert(pitData.VET.should.have.property('stints'));
    assert(pitData.VET.stints.length.should.equal(1));
    assert(pitData.VET.stints[0].startLap.should.equal(0));
    assert(pitData.VET.stints[0].tyre.should.equal('M'));
    assert(pitData.VET.stints[0].tyreAge.should.equal(0));
  });

  it('parses single pair as two stints', () => {
    const singleDriver = [{
      tla: 'VET',
    }];
    const input = {
      x: {
        Test_Race_1234: {
          DR: [
            {
              X: ',15,20,,,0,89.771,92.926,0.0,SM,,,',
              TI: '5,3,3,',
              PD: '315000,7',
            },
          ],
        },
      },
    };

    const pitData = pitMessageParser.parse(singleDriver, input);

    assert(pitData.should.have.property('VET'));
    assert(pitData.VET.currentStatus.should.equal(''));
    assert(pitData.VET.should.have.property('stints'));
    assert(pitData.VET.stints.length.should.equal(2));
    assert(pitData.VET.stints[0].startLap.should.equal(0));
    assert(pitData.VET.stints[0].tyre.should.equal('M'));
    assert(pitData.VET.stints[0].pitLaneTime.should.be.NaN);
    assert(pitData.VET.stints[1].startLap.should.equal(8));
    assert(pitData.VET.stints[1].tyre.should.equal('S'));
    assert(pitData.VET.stints[1].pitLaneTime.should.equal(31.5));
  });
});

import { Vehicle } from '../src/models/Vehicle';

describe('Vehicle', () => {
  it('should create a vehicle with correct properties', () => {
    const v = new Vehicle('v1', 'north', 'south');
    expect(v.id).toBe('v1');
    expect(v.startRoad).toBe('north');
    expect(v.endRoad).toBe('south');
  });
});

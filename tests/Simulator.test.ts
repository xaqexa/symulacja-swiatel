import { Simulator } from '../src/Simulator';

describe('Simulator', () => {
  it('should process addVehicle and step commands', () => {
    const sim = new Simulator();
    const result = sim.run([
      { type: 'addVehicle', vehicleId: 'v1', startRoad: 'north', endRoad: 'south' },
      { type: 'addVehicle', vehicleId: 'v2', startRoad: 'south', endRoad: 'north' },
      { type: 'step' },
      { type: 'step' }
    ]);
    expect(result.stepStatuses[0].leftVehicles.sort()).toEqual(['v1', 'v2'].sort());
    expect(result.stepStatuses[1].leftVehicles).toEqual([]);
  });

  it('should handle edge case: empty commands', () => {
    const sim = new Simulator();
    const result = sim.run([]);
    expect(result.stepStatuses).toEqual([]);
  });
});

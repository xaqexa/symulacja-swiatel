import { Intersection } from '../src/models/Intersection';
import { Vehicle } from '../src/models/Vehicle';

describe('Intersection', () => {
  it('should add vehicles to correct queue', () => {
    const i = new Intersection();
    const v = new Vehicle('v1', 'north', 'south');
    i.addVehicle(v);
    expect(i.vehicleQueues['north'][0]).toBe(v);
  });

  it('should pass only one vehicle per green road per step', () => {
    const i = new Intersection();
    i.addVehicle(new Vehicle('v1', 'north', 'south'));
    i.addVehicle(new Vehicle('v2', 'south', 'north'));
    i.addVehicle(new Vehicle('v3', 'north', 'south'));
    expect(i.step().sort()).toEqual(['v1', 'v2'].sort());
    expect(i.step()).toEqual(['v3']); // v3 przejeżdża od razu, jeśli światło jest zielone
  });

  it('should alternate green pairs if queues are equal', () => {
    const i = new Intersection();
    i.addVehicle(new Vehicle('v1', 'north', 'south'));
    i.addVehicle(new Vehicle('v2', 'east', 'west'));
    expect(i.step()).toEqual(['v1']);
    expect(i.step()).toEqual(['v2']);
  });
});

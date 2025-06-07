import { Vehicle } from './Vehicle';
import { TrafficLight, TrafficLightState } from './TrafficLight';

export type Road = 'north' | 'south' | 'east' | 'west';

const CONFLICTING_ROADS: Record<Road, Road[]> = {
  north: ['south', 'east', 'west'],
  south: ['north', 'east', 'west'],
  east: ['west', 'north', 'south'],
  west: ['east', 'north', 'south'],
};

export class Intersection {
  vehicleQueues: Record<Road, Vehicle[]> = { north: [], south: [], east: [], west: [] };
  trafficLights: Record<Road, TrafficLight> = { north: new TrafficLight(), south: new TrafficLight(), east: new TrafficLight(), west: new TrafficLight() };
  greenPairs: [Road[], Road[]] = [ ['north', 'south'], ['east', 'west'] ];
  lastGreenIdx: number = 1; // alternate pairs
  yellowTime: number = 1;
  stepCount: number = 0;

  constructor() {
    Object.values(this.trafficLights).forEach(light => light.setState('red', 0));
  }

  addVehicle(vehicle: Vehicle) {
    this.vehicleQueues[vehicle.startRoad as Road].push(vehicle);
  }


  chooseNextGreenPair(): Road[] {
    const [ns, ew] = this.greenPairs;
    const nsCount = this.vehicleQueues['north'].length + this.vehicleQueues['south'].length;
    const ewCount = this.vehicleQueues['east'].length + this.vehicleQueues['west'].length;
    if (nsCount > ewCount) return ns;
    if (ewCount > nsCount) return ew;
    // If equal, alternate
    this.lastGreenIdx = 1 - this.lastGreenIdx;
    return this.greenPairs[this.lastGreenIdx];
  }

  step(): string[] {
    let leftVehicles: string[] = [];
    

    let greenNow: Road[] = Object.entries(this.trafficLights)
      .filter(([_, l]) => l.currentState === 'green')
      .map(([r, _]) => r as Road);

    if (greenNow.length === 0) {
      greenNow = this.chooseNextGreenPair();
      // Set new roads to green
      for (const road of greenNow) {
        this.trafficLights[road].setState('green', 1);
      }
      const allRoads: Road[] = ['north', 'south', 'east', 'west'];
      for (const road of allRoads) {
        if (!greenNow.includes(road)) {
          this.trafficLights[road].setState('red', 0);
        }
      }
    }

    for (const road of greenNow) {
      if (this.vehicleQueues[road].length > 0) {
        const vehicle = this.vehicleQueues[road].shift();
        if (vehicle) {
          leftVehicles.push(vehicle.id);
        }
      }
    }

    const hasVehiclesOnGreen = greenNow.some(road => this.vehicleQueues[road].length > 0);
    if (!hasVehiclesOnGreen) {
      // Turn current green roads to red
      for (const road of greenNow) {
        this.trafficLights[road].setState('red', 0);
      }
    }
    
    return leftVehicles;
}
}

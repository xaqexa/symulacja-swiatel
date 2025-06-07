import { Intersection } from './models/Intersection';
import { Vehicle } from './models/Vehicle';
import { Command, InputJSON, OutputJSON, StepStatus } from './types';

export class Simulator {
  intersection: Intersection;
  stepStatuses: StepStatus[] = [];

  constructor() {
    this.intersection = new Intersection();
  }

  executeCommand(command: Command) {
    if (command.type === 'addVehicle') {
      const vehicle = new Vehicle(command.vehicleId, command.startRoad, command.endRoad);
      this.intersection.addVehicle(vehicle);
    } else if (command.type === 'step') {
      const leftVehicles = this.intersection.step();
      this.stepStatuses.push({ leftVehicles });
    }
  }

  run(commands: Command[]): OutputJSON {
    for (const command of commands) {
      this.executeCommand(command);
    }
    return { stepStatuses: this.stepStatuses };
  }
}

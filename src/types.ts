export type Road = 'north' | 'south' | 'east' | 'west';

export interface AddVehicleCommand {
  type: 'addVehicle';
  vehicleId: string;
  startRoad: Road;
  endRoad: Road;
}

export interface StepCommand {
  type: 'step';
}

export type Command = AddVehicleCommand | StepCommand;

export interface InputJSON {
  commands: Command[];
}

export interface StepStatus {
  leftVehicles: string[];
}

export interface OutputJSON {
  stepStatuses: StepStatus[];
}

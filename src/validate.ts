import { Command, Road } from './types';

export function validateCommand(cmd: any): string | null {
  if (!cmd || typeof cmd !== 'object' || typeof cmd.type !== 'string') {
    return 'Invalid command format: missing or wrong type field.';
  }
  if (cmd.type === 'addVehicle') {
    if (typeof cmd.vehicleId !== 'string') return 'addVehicle: vehicleId must be string';
    if (!isRoad(cmd.startRoad)) return 'addVehicle: invalid startRoad';
    if (!isRoad(cmd.endRoad)) return 'addVehicle: invalid endRoad';
  } else if (cmd.type === 'step') {
    // OK
  } else {
    return `Unknown command type: ${cmd.type}`;
  }
  return null;
}

function isRoad(val: any): val is Road {
  return val === 'north' || val === 'south' || val === 'east' || val === 'west';
}

export function validateInputJSON(obj: any): string | null {
  if (!obj || typeof obj !== 'object' || !Array.isArray(obj.commands)) {
    return 'Input JSON must have commands array.';
  }
  for (let i = 0; i < obj.commands.length; ++i) {
    const err = validateCommand(obj.commands[i]);
    if (err) return `Error in command #${i}: ${err}`;
  }
  return null;
}

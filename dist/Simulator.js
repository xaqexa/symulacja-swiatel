"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Simulator = void 0;
const Intersection_1 = require("./models/Intersection");
const Vehicle_1 = require("./models/Vehicle");
class Simulator {
    constructor() {
        this.stepStatuses = [];
        this.intersection = new Intersection_1.Intersection();
    }
    executeCommand(command) {
        if (command.type === 'addVehicle') {
            const vehicle = new Vehicle_1.Vehicle(command.vehicleId, command.startRoad, command.endRoad);
            this.intersection.addVehicle(vehicle);
        }
        else if (command.type === 'step') {
            const leftVehicles = this.intersection.step();
            this.stepStatuses.push({ leftVehicles });
        }
    }
    run(commands) {
        for (const command of commands) {
            this.executeCommand(command);
        }
        return { stepStatuses: this.stepStatuses };
    }
}
exports.Simulator = Simulator;

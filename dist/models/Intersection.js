"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Intersection = void 0;
const TrafficLight_1 = require("./TrafficLight");
const CONFLICTING_ROADS = {
    north: ['south', 'east', 'west'],
    south: ['north', 'east', 'west'],
    east: ['west', 'north', 'south'],
    west: ['east', 'north', 'south'],
};
class Intersection {
    constructor() {
        this.vehicleQueues = { north: [], south: [], east: [], west: [] };
        this.trafficLights = { north: new TrafficLight_1.TrafficLight(), south: new TrafficLight_1.TrafficLight(), east: new TrafficLight_1.TrafficLight(), west: new TrafficLight_1.TrafficLight() };
        this.greenPairs = [['north', 'south'], ['east', 'west']];
        this.lastGreenIdx = 1; // alternate pairs
        this.yellowTime = 1;
        this.stepCount = 0;
        Object.values(this.trafficLights).forEach(light => light.setState('red', 0));
    }
    addVehicle(vehicle) {
        this.vehicleQueues[vehicle.startRoad].push(vehicle);
    }

    chooseNextGreenPair() {
        const [ns, ew] = this.greenPairs;
        const nsCount = this.vehicleQueues['north'].length + this.vehicleQueues['south'].length;
        const ewCount = this.vehicleQueues['east'].length + this.vehicleQueues['west'].length;
        if (nsCount > ewCount)
            return ns;
        if (ewCount > nsCount)
            return ew;
        // If equal, alternate
        this.lastGreenIdx = 1 - this.lastGreenIdx;
        return this.greenPairs[this.lastGreenIdx];
    }
    step() {
        this.stepCount++;
        let greenNow = [];
        const greenActive = Object.entries(this.trafficLights)
            .filter(([_, l]) => l.currentState === 'green')
            .map(([r, _]) => r);
        if (greenActive.length === 0) {
            greenNow = this.chooseNextGreenPair();
            for (const road of greenNow) {
                this.trafficLights[road].setState('green', 1); // green for 1 step
            }
        }
        else {
            greenNow = greenActive;
        }
        let leftVehicles = [];
        let anyPassed = false;
        for (const road of greenNow) {
            if (this.vehicleQueues[road].length > 0) {
                const vehicle = this.vehicleQueues[road].shift();
                if (vehicle) {
                    leftVehicles.push(vehicle.id);
                    anyPassed = true;
                }
            }
        }
        if (!anyPassed) {
            for (const road of greenNow) {
                this.trafficLights[road].setState('red', 0);
            }
        }
        return leftVehicles;
    }
}
exports.Intersection = Intersection;

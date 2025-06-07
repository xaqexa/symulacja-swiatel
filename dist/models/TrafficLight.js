"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrafficLight = void 0;
class TrafficLight {
    constructor(state = 'red', remainingTime = 0) {
        this.currentState = state;
        this.remainingTime = remainingTime;
    }
    setState(state, time) {
        this.currentState = state;
        this.remainingTime = time;
    }
}
exports.TrafficLight = TrafficLight;

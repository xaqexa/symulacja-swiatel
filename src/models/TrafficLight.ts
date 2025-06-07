export type TrafficLightState = 'green' | 'yellow' | 'red';

export class TrafficLight {
  currentState: TrafficLightState;
  remainingTime: number;

  constructor(state: TrafficLightState = 'red', remainingTime: number = 0) {
    this.currentState = state;
    this.remainingTime = remainingTime;
  }

  setState(state: TrafficLightState, time: number) {
    this.currentState = state;
    this.remainingTime = time;
  }
}

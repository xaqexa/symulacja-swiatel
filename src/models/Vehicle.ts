export class Vehicle {
  id: string;
  startRoad: string;
  endRoad: string;

  constructor(id: string, startRoad: string, endRoad: string) {
    this.id = id;
    this.startRoad = startRoad;
    this.endRoad = endRoad;
  }
}

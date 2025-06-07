import { TrafficLight } from '../src/models/TrafficLight';

describe('TrafficLight', () => {
  it('should initialize with red and 0 remainingTime by default', () => {
    const t = new TrafficLight();
    expect(t.currentState).toBe('red');
    expect(t.remainingTime).toBe(0);
  });

  it('should set state and time correctly', () => {
    const t = new TrafficLight();
    t.setState('green', 5);
    expect(t.currentState).toBe('green');
    expect(t.remainingTime).toBe(5);
  });
});

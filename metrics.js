const metrics = {
  totalVehicles: 0,
  totalDeparted: 0,
  totalWaitTime: 0,
  stepCount: 0,
  activeStepCount: 0,
  departedVehicles: [],
  vehiclesPerStep: [],

  perRoadStats: {
    north: { entered: 0, departed: 0, totalWait: 0 },
    south: { entered: 0, departed: 0, totalWait: 0 },
    east:  { entered: 0, departed: 0, totalWait: 0 },
    west:  { entered: 0, departed: 0, totalWait: 0 }
  },
  busiestRoad: null, // {road, count, step}


  greenPhaseStats: [],
  currentGreenPair: null,
  currentGreenDuration: 0,
  switchCount: 0,

  onAddVehicle(road) {
    this.totalVehicles++;
    if (this.perRoadStats[road]) this.perRoadStats[road].entered++;
  },

  onStep(leftVehicles, queues, greenPair, stepNumber) {
    this.stepCount++;
    if (leftVehicles.length > 0) this.activeStepCount++;
    this.vehiclesPerStep.push(leftVehicles.length);

    // Analiza świateł
    if (!this.currentGreenPair || JSON.stringify(greenPair) !== JSON.stringify(this.currentGreenPair)) {
      // Zakończ poprzednią fazę
      if (this.currentGreenPair) {
        this.greenPhaseStats.push({
          pair: this.currentGreenPair,
          duration: this.currentGreenDuration,
          passed: this.lastPhaseDeparted || 0
        });
      }
      this.currentGreenPair = [...greenPair];
      this.currentGreenDuration = 1;
      this.switchCount++;
      this.lastPhaseDeparted = leftVehicles.length;
    } else {
      this.currentGreenDuration++;
      this.lastPhaseDeparted = (this.lastPhaseDeparted || 0) + leftVehicles.length;
    }

    // Analiza pojazdów
    leftVehicles.forEach(v => {
      this.totalDeparted++;
      this.totalWaitTime += v.wait;
      this.departedVehicles.push({ id: v.id, waitTime: v.wait, departedStep: stepNumber });
    });
    // Najruchliwszy kierunek
    let maxRoad = null, maxCount = 0;
    for (const road in queues) {
      const count = (this.perRoadStats[road] ? this.perRoadStats[road].departed : 0);
      if (count > maxCount) { maxCount = count; maxRoad = road; }
    }
    this.busiestRoad = { road: maxRoad, count: maxCount, step: this.stepCount };
  },

  // --- Statystyki ---
  avgWaitTime() {
    return this.totalDeparted === 0 ? 0 : (this.totalWaitTime / this.totalDeparted).toFixed(2);
  },
  throughput() {
    return this.stepCount === 0 ? 0 : (this.totalDeparted / this.stepCount).toFixed(2);
  },
  efficiency() {
    return this.stepCount === 0 ? '0%' : ((this.activeStepCount / this.stepCount) * 100).toFixed(1) + '%';
  },
  avgWaitPerRoad() {
    const res = {};
    for (const road in this.perRoadStats) {
      const s = this.perRoadStats[road];
      res[road] = s.departed === 0 ? 0 : (s.totalWait / s.departed).toFixed(2);
    }
    return res;
  },
  phaseStats() {
    return this.greenPhaseStats.map(p => ({
      pair: p.pair,
      duration: p.duration,
      passed: p.passed,
      efficiency: p.duration === 0 ? 0 : (p.passed / p.duration).toFixed(2)
    }));
  },
  peakHour() {
    let max = 0, step = 0;
    this.vehiclesPerStep.forEach((n, i) => { if (n > max) { max = n; step = i+1; }});
    return { step, vehicles: max };
  },
  reset() {
    this.totalVehicles = 0;
    this.totalDeparted = 0;
    this.totalWaitTime = 0;
    this.stepCount = 0;
    this.activeStepCount = 0;
    this.departedVehicles = [];
    this.vehiclesPerStep = [];
    this.perRoadStats = {
      north: { entered: 0, departed: 0, totalWait: 0 },
      south: { entered: 0, departed: 0, totalWait: 0 },
      east:  { entered: 0, departed: 0, totalWait: 0 },
      west:  { entered: 0, departed: 0, totalWait: 0 }
    };
    this.busiestRoad = null;
    this.greenPhaseStats = [];
    this.currentGreenPair = null;
    this.currentGreenDuration = 0;
    this.switchCount = 0;
    this.lastPhaseDeparted = 0;
  }
};
window.metrics = metrics;

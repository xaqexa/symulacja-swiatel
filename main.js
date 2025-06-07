// Prosta symulacja na froncie (nie korzysta z TS backendu, ale logika jest zbliżona)
const state = {
  vehicleQueues: { north: [], south: [], east: [], west: [] },
  trafficLights: { north: 'red', south: 'red', east: 'red', west: 'red' },
  vehicleId: 1,
  greenPairIdx: 0,
  stepNumber: 0,
};
const greenPairs = [ ['north', 'south'], ['east', 'west'] ];

function renderIntersection() {
  const intersection = document.getElementById('intersection');
  intersection.innerHTML = '';
  // Render roads
  ['north','south','east','west'].forEach(road => {
    const roadDiv = document.createElement('div');
    roadDiv.className = `road ${road}`;
    // Render traffic light
    const light = document.createElement('div');
    light.className = `light ${state.trafficLights[road]}`;
    roadDiv.appendChild(light);
    // Render vehicles
    state.vehicleQueues[road].forEach(v => {
      const veh = document.createElement('div');
      veh.className = 'vehicle';
      veh.textContent = v.id;
      roadDiv.appendChild(veh);
    });
    intersection.appendChild(roadDiv);
  });
}

function renderLog(msg) {
  const logDiv = document.getElementById('log');
  logDiv.innerHTML = msg + '<br>' + logDiv.innerHTML;
}

function renderMetrics() {
  const panel = document.getElementById('metrics-panel');
  if (!panel || !window.metrics) return;
  panel.innerHTML = `
    <b>Statystyki:</b>
    <table>
      <tr><th>Łącznie pojazdów</th><td>${metrics.totalVehicles}</td></tr>
      <tr><th>Przetworzonych pojazdów</th><td>${metrics.totalDeparted}</td></tr>
      <tr><th>Średni czas oczekiwania</th><td>${metrics.avgWaitTime()}</td></tr>
      <tr><th>Przepustowość (pojazdy/krok)</th><td>${metrics.throughput()}</td></tr>
      <tr><th>Efektywność systemu</th><td>${metrics.efficiency()}</td></tr>
    </table>
  `;
}

function addVehicle(road) {
  const id = 'V' + state.vehicleId++;
  state.vehicleQueues[road].push({ id, addedStep: state.stepNumber });
  if (window.metrics) metrics.onAddVehicle(road);
  renderIntersection();
  renderLog(`Dodano pojazd ${id} na ${road}.`);
  renderMetrics();
}

function stepSimulation() {
  state.stepNumber++;
  const [ns, ew] = greenPairs;
  const nsCount = state.vehicleQueues.north.length + state.vehicleQueues.south.length;
  const ewCount = state.vehicleQueues.east.length + state.vehicleQueues.west.length;
  let nextPair;
  if (nsCount > ewCount) nextPair = ns;
  else if (ewCount > nsCount) nextPair = ew;
  else {
    state.greenPairIdx = 1 - state.greenPairIdx;
    nextPair = greenPairs[state.greenPairIdx];
  }
  ['north','south','east','west'].forEach(r => {
    state.trafficLights[r] = nextPair.includes(r) ? 'green' : 'red';
  });
  let left = [];
  nextPair.forEach(r => {
    if (state.vehicleQueues[r].length > 0) {
      const vehicle = state.vehicleQueues[r].shift();
      left.push({ id: vehicle.id, wait: state.stepNumber - vehicle.addedStep });
    }
  });
  if (window.metrics) {
    metrics.onStep(left, state.vehicleQueues, nextPair, state.stepNumber);
  }
  renderIntersection();
  renderLog('Opuszczają skrzyżowanie: ' + (left.length ? left.map(v => v.id).join(', ') : 'brak'));
  renderMetrics();
}

document.getElementById('add-north').onclick = () => addVehicle('north');
document.getElementById('add-south').onclick = () => addVehicle('south');
document.getElementById('add-east').onclick = () => addVehicle('east');
document.getElementById('add-west').onclick = () => addVehicle('west');
document.getElementById('next-step').onclick = stepSimulation;

renderIntersection();
renderLog('Symulacja gotowa. Dodaj pojazdy i klikaj "Krok symulacji".');

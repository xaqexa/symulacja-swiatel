"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Entry point for intelligent traffic lights simulation
const fs_1 = require("fs");
const Simulator_1 = require("./Simulator");
function main() {
    const args = process.argv.slice(2);
    if (args.length < 2) {
        console.error('Usage: node simulation.js input.json output.json');
        process.exit(1);
    }
    const [inputPath, outputPath] = args;
    const inputData = JSON.parse((0, fs_1.readFileSync)(inputPath, 'utf-8'));
    const simulator = new Simulator_1.Simulator();
    const result = simulator.run(inputData.commands);
    (0, fs_1.writeFileSync)(outputPath, JSON.stringify(result, null, 2), 'utf-8');
}
main();

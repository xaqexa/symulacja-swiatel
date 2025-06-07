import { readFileSync, writeFileSync } from 'fs';
import { Simulator } from './Simulator';
import { InputJSON } from './types';
import { validateInputJSON } from './validate';

function main() {
  const args = process.argv.slice(2);
  if (args.length < 2) {
    console.error('Usage: node simulation.js input.json output.json');
    process.exit(1);
  }
  const [inputPath, outputPath] = args;
  let inputData: InputJSON;
  try {
    inputData = JSON.parse(readFileSync(inputPath, 'utf-8'));
  } catch (e) {
    console.error('Invalid JSON:', e.message);
    process.exit(1);
  }
  const validationError = validateInputJSON(inputData);
  if (validationError) {
    console.error('Input validation error:', validationError);
    process.exit(1);
  }
  const simulator = new Simulator();
  const result = simulator.run(inputData.commands);
  writeFileSync(outputPath, JSON.stringify(result, null, 2), 'utf-8');
}

main();

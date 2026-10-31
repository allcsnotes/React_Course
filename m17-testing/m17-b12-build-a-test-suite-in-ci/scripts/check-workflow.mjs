import { readFileSync } from 'node:fs'
import { parse } from 'yaml'

const file = '.github/workflows/ci.yml'
const workflow = parse(readFileSync(file, 'utf8'))
const steps = workflow.jobs.test.steps
console.log(`${file}: valid YAML, ${steps.length} steps`)
for (const step of steps) console.log(' -', step.run ?? step.uses)

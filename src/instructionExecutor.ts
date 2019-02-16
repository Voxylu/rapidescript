import * as fs from 'fs'
import * as path from 'path'
import { execSync } from 'child_process'
import { Instruction } from './Scriptor'

export const runCommand = (
  command: string,
  addtionalArgs: string[] = [],
  stdio: boolean = false
) => {
  const cmdPath = path.resolve(
    process.cwd(),
    'node_modules/.bin/',
    command.split(' ')[0]
  )
  let commandToEx = ''
  if (fs.existsSync(cmdPath)) {
    commandToEx = `${cmdPath} ${command
      .split(' ')
      .slice(1)
      .concat(addtionalArgs)
      .join(' ')}`.trim()
  } else {
    commandToEx = `${command} ${addtionalArgs.join(' ')}`.trim()
  }
  const env = {
    ...process.env,
    PATH: `${process.env.PATH}:${path.resolve(
      process.cwd(),
      'node_modules/.bin/'
    )}`,
  }
  if (stdio) {
    return execSync(commandToEx, { stdio: 'inherit', env })
  } else {
    return execSync(commandToEx, { env }).toString()
  }
}

export const instructionExecutor: (
  instruction: Instruction,
  additionalArgs: string[]
) => void = (instruction, additionalArgs) => {
  switch (instruction.type) {
    case 'run':
      for (const command of instruction.args) {
        runCommand(command, additionalArgs, true)
      }
      break
    case 'execute':
      // The first args is a js fn
      instruction.args[0](additionalArgs) // TODO: better thisContext
      break
    default:
      throw new Error(
        `Can't find any instruction with type ${instruction.type}.`
      )
  }
}

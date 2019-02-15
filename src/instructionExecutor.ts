import * as fs from 'fs'
import * as path from 'path'
import * as os from 'os'
import { execSync } from 'child_process'
import { Instruction } from './Scriptor'

export const runCommand = (
  command: string,
  addtionalArgs: string[] = [],
  stdio: boolean = false
) => {
  const ext = os.platform() === 'win32' ? '.cmd' : ''
  const cmdPath = path.resolve(
    process.cwd(),
    'node_modules/.bin/',
    command.split(' ')[0],
    ext
  )
  if (fs.existsSync(cmdPath)) {
    const commandToEx = `${cmdPath} ${command
      .split(' ')
      .slice(1)
      .concat(addtionalArgs)
      .join(' ')}`.trim()
    if (stdio) {
      return execSync(commandToEx, { stdio: 'inherit' })
    } else {
      return execSync(commandToEx).toString()
    }
  } else {
    const commandToEx = `${command} ${addtionalArgs.join(' ')}`.trim()
    if (stdio) {
      return execSync(commandToEx, { stdio: 'inherit' })
    } else {
      return execSync(commandToEx).toString()
    }
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
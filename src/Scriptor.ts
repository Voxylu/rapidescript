import { instructionExecutor } from './instructionExecutor'

type RunAction = (
  command: string
) =>
  | ScriptActions
  | ((commands: string[]) => ScriptActions)
  | ((...commands: string[]) => ScriptActions)

export type ScriptActions = {
  run: RunAction
  execute: (fn: () => any) => ScriptActions
}

type RegisterFn = (type: string, args: any[]) => void

const generateScriptsActions: (registerFn: RegisterFn) => ScriptActions = (
  registerFn
) => ({
  run: (...cmds) => {
    const commands = cmds.flat(Infinity)
    registerFn('run', commands)
    return generateScriptsActions(registerFn)
  },
  execute: (fn) => {
    registerFn('execute', [fn])
    return generateScriptsActions(registerFn)
  },
})

export type Instruction = { type: string; args: any[] }
type ScriptMap = { [x: string]: Instruction[] }

export class Scriptor {
  private innerScripts: ScriptMap = {}

  script: (name: string) => ScriptActions = (name) => {
    this.innerScripts[name] = []
    const registerFn: RegisterFn = (type, args) => {
      this.innerScripts[name].push({ type, args })
    }
    return generateScriptsActions(registerFn)
  }

  executeScript: (name: string, ...args: string[]) => void = (
    name,
    ...additionalArgs
  ) => {
    if (this.innerScripts[name]) {
      const script = this.innerScripts[name]
      for (const instruction of script) {
        instructionExecutor(instruction, additionalArgs)
      }
    } else {
      throw new Error(`Can't find a script with name ${name}.`)
    }
  }

  scriptExist: (name: string) => boolean = (name) => {
    return this.innerScripts[name] ? true : false
  }

  getScripts: () => string = () => {
    return `${Object.keys(this.innerScripts).join('\n-')}`
  }
}

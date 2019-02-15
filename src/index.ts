import * as fs from 'fs'
import * as path from 'path'
import * as vm from 'vm'
import { Scriptor } from './Scriptor'
import { baseContext } from './context'
import { execSync } from 'child_process'

const main = () => {
  const args = process.argv.slice(2)
  fs.readFile(
    path.resolve(process.cwd(), 'rs.js'),
    {
      encoding: 'utf-8',
    },
    (err, file) => {
      if (err) {
        console.error(
          `Can't find a file named \`rs.js\` in \`${process.cwd()}\`.`
        )
        process.exit(1)
      }
      const scriptor = new Scriptor()
      const context = {
        ...baseContext,
        script: scriptor.script,
      }
      vm.createContext(context)
      try {
        vm.runInContext(file, context)
      } catch (err) {
        console.error(`Error with the \`rs.js\` file: \`${err}\`.`)
        process.exit(1)
      }
      if (args.length === 0) {
        console.log(`Scripts:\n-${scriptor.getScripts()}`)
      } else if (scriptor.scriptExist(args[0])) {
        try {
          scriptor.executeScript(args[0], ...args.slice(1))
        } catch (err) {
          console.error(`Error with the script \`${args[0]}\`: \`${err}\``)
          process.exit(1)
        }
      } else {
        const cmdPath = path.resolve(
          process.cwd(),
          'node_modules/.bin/',
          args[0]
        )
        if (fs.existsSync(cmdPath)) {
          const commandToEx = `${cmdPath} ${args[0]
            .split(' ')
            .slice(1)
            .concat(args.slice(1))
            .join(' ')}`.trim()
          execSync(commandToEx, { stdio: 'inherit' })
        } else {
          console.error(
            `Unknow script: \`${
              args[0]
            }\`, available scripts:\n-${scriptor.getScripts()}`
          )
          process.exit(1)
        }
      }
    }
  )
}

main()

import * as fs from 'fs'
import * as path from 'path'
import { runCommand } from './instructionExecutor'

const removeDir = (dirPath: string) => {
  if (fs.existsSync(dirPath)) {
    fs.readdirSync(dirPath).forEach((file) => {
      const currentPath = path.join(dirPath, file)
      if (fs.lstatSync(currentPath).isDirectory()) {
        removeDir(currentPath)
      } else {
        fs.unlinkSync(currentPath)
      }
    })
    fs.rmdirSync(dirPath)
  }
}

export const fileContext = {
  writeFile: (filePath: string, content: string) => {
    const { dir } = path.parse(filePath)
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }
    return fs.writeFileSync(filePath, content)
  },
  readFile: (filePath: string) => {
    return fs.readFileSync(filePath, { encoding: 'utf-8' })
  },
  copyFile: (filePath: string, destinitionPath: string) => {
    return fs.copyFileSync(filePath, destinitionPath)
  },
  removeFile: (filePath: string) => {
    return fs.unlinkSync(filePath)
  },
  removeDir,
  createDir: (dirPath: string) => {
    return fs.mkdirSync(dirPath, { recursive: true })
  },
}

export const baseContext = {
  run: runCommand,
  ...fileContext,
  env: process.env,
  console: console,
  require: require,
  process: process,
  __dirname: __dirname,
  __filename: __filename,
  ...global,
}

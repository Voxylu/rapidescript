# RapideScript

> A fast, 0 depencies, cli to quicly creates scripts. A replacement of npm scripts.

1. Install rapidescript: `npm i -g rapidescript`
2. Create a `rs.js` file
3. Write `script("start").run("node src/index.js")`
4. Save and type `rs start`
5. And **PAF** you have a start script !

## Example

```javascript
script('start').run('nodemon -x ts-node src/index.ts')

script('build')
  .run('tsc')
  .execute(() => {
    copyFile('src/schema.graphql', 'dist/schema.graphql')
    removeDir('.cache/')
    writeFile('dist/changelog.txt', run('git log'))
  })
  .run('echo "Buildind complete" | lolcat')
```

## Api

Start a script by calling a function named `script()` with the name of the script as the first arguement.
Then you can specify the rest of the script by chaining the `run()` and `execute()` methods.

To start a script just use the `rs` command by doing `rs <name of the script>`

```typescript
/**
 * How to use run()
 * run() take one or more commands and execute them
 */
run('ls').run('cat package.json')
run('ls', 'cat package.json')
// In each case `ls` will be executed then `cat package.json`
```

```typescript
/**
 * How to use execute()
 * execute() take a javascript and execute it
 */
execute((args) => console.log(`The arguments are: ${args.join(',')}`))
// args will the args of the provided when the scripts is called
```

The are global shortcut to help you:

```typescript
/** Alias to fs.writeFileSync */
declare function writeFile(filePath: string, content: string): void

/** Alias to fs.readFileSync */
declare function readFile(filePath: string): string

/** Alias to fs.copyFileSync */
declare function copyFile(filePath: string, destinitionPath: string): void

/** Alias to fs.unlinkSync */
declare function removeFile(filePath: string): void

/** Recursively remove a directory */
declare function removeDir(dirPath: string): void

/** Alias to fs.mkdirSync */
declare function createDir(dirPath: string): void

/** Run a command */
declare function run(command: string): string

/** Alias to process.env */
declare const env: any
```

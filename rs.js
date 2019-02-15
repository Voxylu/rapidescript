script('build')
  .run('echo "Let\'s build this thing !"', 'rollup -c')
  .execute(() => {
    const file = readFile('./bin/index.js')
    writeFile('./bin/index.js', `#!/usr/bin/env node\n${file}`)
  })
  .run('echo "And there we go !"')

script('clean').execute(() => {
  removeDir('.rpt2_cache/')
})

script('publish').run('git push origin master', 'npm publish')

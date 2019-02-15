import typescriptPlugin from 'rollup-plugin-typescript2'
import { uglify } from 'rollup-plugin-uglify'

export default {
  input: 'src/index.ts',
  output: {
    file: 'bin/index.js',
    format: 'cjs',
  },
  plugins: [typescriptPlugin(), uglify()],
}

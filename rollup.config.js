import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';

export default {
  external: ['react'],
  input: 'src/index.js',
  output: {
    file: 'dist/index.js',
    format: 'umd',
    name: 'reactHelmetHooks',
    globals: {
      'react': 'React'
    }
  },
  plugins: [
    resolve({
      jsnext: true,
      main: true,
    }),
    babel({
      exclude: 'node_modules/**',
      presets: ['@babel/preset-env', '@babel/preset-react']
    }),
    commonjs()
  ]
};

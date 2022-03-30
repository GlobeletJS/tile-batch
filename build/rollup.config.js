import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs"; // TODO: is this needed?
import { glsl } from "./glsl-plugin.js";
//import pkg from "../package.json";

// Bundling is only needed for some sub-modules
export default [{
  input: 'src/main.js',
  plugins: [
    glsl(),
    resolve(),
    commonjs(),
  ],
  output: {
    file: 'dist/context.bundle.js',
    format: 'esm',
    name: 'initGL',
  }
}, {
  input: 'src/serialize.js',
  plugins: [
    resolve(),
    commonjs(),
  ],
  external: ['pbf-esm'],
  treeshake: { moduleSideEffects: "no-external" },
  output: {
    file: 'dist/serializer.bundle.js',
    format: 'esm',
    name: 'initSerializer',
  }
}];

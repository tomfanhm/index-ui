import { readFileSync } from "fs"
import path from "path"
import { defineConfig } from "vite"
import dts from "vite-plugin-dts"
import tsconfigPaths from "vite-tsconfig-paths"

const packageJson = JSON.parse(readFileSync("./package.json", { encoding: "utf-8" }))

const globals = {
  ...(packageJson.dependencies || {}),
}

function resolve(str: string) {
  return path.resolve(__dirname, str)
}

export default defineConfig({
  build: {
    cssCodeSplit: false,
    lib: {
      entry: {
        index: resolve("./src/index.ts"),
      },
      formats: ["es", "cjs"],
      fileName: (format, entryName) => {
        if (format === "es") {
          return `${entryName}.js`
        }
        return `${entryName}.${format}`
      },
    },
    rollupOptions: {
      external: [...Object.keys(globals)],
    },
  },
  plugins: [
    dts({
      exclude: ["**/*.test.ts"],
    }),
    tsconfigPaths(),
  ],
})

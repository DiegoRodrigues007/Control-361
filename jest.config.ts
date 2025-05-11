import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest/presets/default-esm",
  testEnvironment: "jsdom",

  extensionsToTreatAsEsm: [".ts", ".tsx"],

  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],

  setupFiles: ["dotenv/config"],

  setupFilesAfterEnv: ["<rootDir>/src/setupTests.ts"],

  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "^.+\\.(css|less|scss|sass)$": "identity-obj-proxy",
  },

  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        useESM: true,
        tsconfig: {
          target: "ES2020",
          module: "ES2020",
          moduleResolution: "node",
          jsx: "react-jsx",
        },
      },
    ],
  },

  transformIgnorePatterns: ["/node_modules/"],
};

export default config;

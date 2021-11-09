module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es6: true
  },
  extends: "eslint:recommended",
  globals: {
    Atomics: "readonly",
    SharedArrayBuffer: "readonly",
    MCSERVER: "writeable",
    __dirname: "writeable",
    Buffer: "writeable",
    Vue: "readonly",
    MI: "writeable",
    MS: "writeable",
    TOOLS: "writeable",
    VIEW_MODEL: "writeable",
    RES: "readonly",
    PAGE: "writeable",
    $: "writeable",
    WS: "readonly",
    hex_md5: "readonly",
    process: "readonly",
    logger: "readonly",
  },
  parserOptions: {
    ecmaVersion: 2018
  },
  rules: {
    "no-unused-vars": "warn",
    "no-use-before-define": "warn",
    "no-undef": "warn",
    "no-prototype-builtins": "off"
  }
};
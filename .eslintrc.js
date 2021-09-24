/*
 * @Author: your name
 * @Date: 2021-05-18 17:01:00
 * @LastEditTime: 2021-09-01 20:33:02
 * @LastEditors: sueRimn
 * @Description: In User Settings Edit
 * @FilePath: \font2\.eslintrc.js
 */
module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: ['plugin:vue/essential', '@vue/standard'],
  parserOptions: {
    ecmaVersion: 2020
  },
  rules: {
    'camelcase': [0, {properties: 'always'}],
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'space-before-function-paren': 0,
    'no-unused-expressions': 0,
    'spaced-comment': 0
  }
}

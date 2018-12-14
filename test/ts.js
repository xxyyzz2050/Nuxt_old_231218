import '@babel/polyfill'

import fs from 'fs'
import ts2 from './ts2'

async function test() {
  console.log('test 1A')
  await test2()
  console.log('test 1B')
}

async function test2() {
  console.log('test2')
}

test()
ts2()

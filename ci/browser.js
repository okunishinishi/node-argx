#!/usr/bin/env node

/**
 * Compile to browser source
 */

'use strict'

process.chdir(`${__dirname}/..`)

const apeTasking = require('ape-tasking')
const ababelEs2015 = require('ababel-es2015')

apeTasking.runTasks('browser', [
  () => ababelEs2015('**/*.js', {
    cwd: 'lib',
    out: 'shim/browser'
  })
], true)

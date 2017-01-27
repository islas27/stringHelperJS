module.exports = StringHelper
require('array-extensions')

const isArr = inp => Array.isArray(inp)
const isType = (type, inp) => typeof inp === type
const isFunc = inp => isType('function', inp)
const isNum = inp => isType('number', inp)
const isIgnored = inp => isType('undefined', inp) || isType('object', inp)
const reverse = arr => arr.slice().reverse()
const enclose = (pf, arg, sf) => reverse(pf).concat([...arg].concat(sf))

function StringHelper () {
  let aux = []
  let buffer = []
  let prefixes = []
  let suffixes = []
  let decorators = false

  function join () {
    const len = arguments.length
    let args = arguments
    for (let i = 0; i < len; i += 1) {
      let arg = args[i]
      if (isFunc(arg)) join(arg.call(new StringHelper()))
      else if (isArr(arg)) join(...arg.flatten())
      else if (isIgnored(arg)) continue
      else aux.push(arg)
    }
  }

  this.cat = function () {
    let args = (decorators) ? enclose(prefixes, arguments, suffixes) : arguments
    aux = []
    join.apply(this, args)
    buffer.push(...aux)
    return this
  }

  this.str = function () {
    return buffer.join('')
  }

  this.catIf = function () {
    let args = [...arguments]
    if (args.pop() === true) this.cat(args)
    return this
  }

  this.rep = function () {
    let args = [...arguments]
    let rep = args.pop()
    if (isNum(rep)) {
      for (let i = 0; i < rep; i += 1) {
        this.cat(args)
      }
    } else this.cat(args.concat(rep))
    return this
  }

  this.wrap = function (prefix, suffix) {
    if (arguments.length !== 2) return this
    decorators = true
    prefixes.push(prefix)
    suffixes.push(suffix)
    return this
  }

  this.end = function (deep) {
    const howMany = (isNum(deep) && deep >= 0) ? deep : 1
    for (let i = 0; i < howMany; i += 1) {
      prefixes.pop()
      suffixes.pop()
    }
    return this
  }

  this.each = function (data, callback) {
    let len = data.length
    for (var i = 0; i < len; i += 1) {
      callback.call(this, data[i], i, data)
    }
    return this
  }

  this.cat([...arguments])
}

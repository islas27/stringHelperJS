/* eslint-env mocha */
const StringHelper = require('../index')
const expect = require('chai').expect
// const sinon = require('sinon')

let people = [
  { name: 'pedro', sex: 'm', age: 30 },
  { name: 'leticia', sex: 'f', age: 21 },
  { name: 'pablo', sex: 'm', age: 20 }
]
let htmlSection = `<p>pedro is male</p>
<p>leticia is female</p>
<p>pablo is male</p>
`

describe('#when', () => {
  it('calls cat() on `thenArgs` when expression is true', () => {
    let exp = 10 > 0
    let helper = new StringHelper()
    let result = helper.when(exp, 'a', 'b').str()
    expect(result).to.equal('a')
  })

  it('calls cat() on `otherwiseArgs` when expression is true', () => {
    let exp = 0 > 100
    let helper = new StringHelper()
    let result = helper.when(exp, 'a', 'b').str()
    expect(result).to.equal('b')
  })

  it('is capable or receiving functions as `expression`', () => {
    let exp = function () {
      return this.str.length > 100
    }
    let helper = new StringHelper()
    let result = helper.when(exp, 'This is string is already long!', 'A short string').str()
    expect(result).to.equal('A short string')
  })

  it('works well with other functions', () => {
    let helper = new StringHelper()
    let result = helper.wrap('<p>', '</p>\n')
    .each(people, function (person) {
      this.when(person.sex === 'm',
        function () {
          return person.name + ' is male'
        },
        [ person.name, ' is female' ]
      )
    }).str()
    expect(result).to.equal(htmlSection)
  })
})
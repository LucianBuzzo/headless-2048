const test = require('tape')
const game = require('./index.js')

const render = (state) => {
  console.log('-----------------')
  for (let i = 0; i < state.length; i+=4) {
    console.log('| ' + state.slice(i, i+4).map(v => v || ' ').join(' | ') + ' |')
    console.log('-----------------')
  }
}

test('rotate(): should rotate a grid array', (t) => {
  const suite = [
    {
      start: [
        2, 2,
        null, null
      ],
      expected: [
        null, 2,
        null, 2
      ]
    },
    {
      start: [
        2, 2, null,
        null, null, null,
        null, null, null,
      ],
      expected: [
        null, null, 2,
        null, null, 2,
        null, null, null,
      ]
    },
    {
      start: [
        null, 2, 2, null,
        null, null, null, null,
        null, null, null, null,
        null, null, null, null,
      ],
      expected: [
        null, null, null, null,
        null, null, null, 2,
        null, null, null, 2,
        null, null, null, null,
      ]
    }
  ]
  t.plan(suite.length)

  for (const item of suite) {
    const result = game.rotate(item.start)
    t.deepEqual(result, item.expected)
  }
})

test('rotate(): should rotate a grid array multiple times', (t) => {
  const suite = [
    {
      start: [
        2, 2,
        null, null
      ],
      expected: [
        2, null,
        2, null
      ]
    },
    {
      start: [
        2, 2, null,
        null, null, null,
        null, null, null,
      ],
      expected: [
        null, null, null,
        2, null, null,
        2, null, null,
      ]
    },
    {
      start: [
        null, 2, 2, null,
        null, null, null, null,
        null, null, null, null,
        null, null, null, null,
      ],
      expected: [
        null, null, null, null,
        2, null, null, null,
        2, null, null, null,
        null, null, null, null,
      ]
    }
  ]
  t.plan(suite.length)

  for (const item of suite) {
    const result = game.rotate(item.start, 3)
    t.deepEqual(result, item.expected)
  }
})

test('processRow(): should merge two values together', (t) => {
  const suite = [
    {
      start: [ 2, 2, null, null ],
      expected: [ 4, null, null, null ],
    },
    {
      start: [ 2, null, 2, null ],
      expected: [ 4, null, null, null ],
    },
    {
      start: [ null, 2, 2, null ],
      expected: [ 4, null, null, null ],
    },
    {
      start: [ null, null, 2, 2 ],
      expected: [ 4, null, null, null ],
    },
    {
      start: [ 2, null, null, 2 ],
      expected: [ 4, null, null, null ]
    },
    {
      start: [ 2, 4, 2, 4 ],
      expected: [ 2, 4, 2, 4 ]
    },
    {
      start: [ 2, 4, 4, 4 ],
      expected: [ 2, 8, 4, null ]
    },
    {
      start: [ 2, 2, 2, 2 ],
      expected: [ 4, 4, null, null ]
    },
  ]
  t.plan(suite.length)

  for (const item of suite) {
    const result = game.processRow(item.start)
    t.deepEqual(result, item.expected)
  }
})

test('processRow(): should move a value to the beginning of the array', (t) => {
  const suite = [
    {
      start: [ null, 2, null, null ],
      expected: [ 2, null, null, null ],
    },
    {
      start: [ null, null, null, 2 ],
      expected: [ 2, null, null, null ],
    },
  ]
  t.plan(suite.length)

  for (const item of suite) {
    const result = game.processRow(item.start)
    t.deepEqual(result, item.expected)
  }
})

test('processRow(): should ignore a row of null values', (t) => {
  t.plan(1)
  const result = game.processRow([ null, null, null, null ])
  t.deepEqual(result, [ null, null, null, null ])
})

test('should merge two values together on swipe left', (t) => {
  t.plan(1)
  const start = [
    2, 2, null, null,
    null, null, null, null,
    null, null, null, null,
    null, null, null, null
  ]

  const result = game.run(start, 'left')

  render(result)

  t.equal(result[0], 4)
})

test('should merge two values together on swipe right', (t) => {
  t.plan(1)
  const start = [
    2, 2, null, null,
    null, null, null, null,
    null, null, null, null,
    null, null, null, null
  ]

  const result = game.run(start, 'right')

  render(result)

  t.equal(result[3], 4)
})

test('should merge two values together on swipe up', (t) => {
  t.plan(1)
  const start = [
    2, null, null, null,
    2, null, null, null,
    null, null, null, null,
    null, null, null, null
  ]

  const result = game.run(start, 'up')

  render(result)

  t.equal(result[0], 4)
})

test('should merge two values together on swipe down', (t) => {
  t.plan(1)
  const start = [
    2, null, null, null,
    2, null, null, null,
    null, null, null, null,
    null, null, null, null
  ]

  const result = game.run(start, 'down')

  render(result)

  t.equal(result[12], 4)
})

test('should merge multiple values together on swipe down', (t) => {
  t.plan(2)
  const start = [
    2, null, 2, null,
    2, null, 2, null,
    null, null, null, null,
    null, null, null, null
  ]

  const result = game.run(start, 'down')

  render(result)

  t.equal(result[12], 4)
  t.equal(result[14], 4)
})

const GRID_WIDTH = 4
const GRID_HEIGHT = 4
const LENGTH = GRID_WIDTH * GRID_HEIGHT

const K = (x) => x
const randBetween = (start, end) => Math.floor(Math.random() * end) + start

const addTile = (state) => {
  const openIndexes = state.reduce((carry, item, index) => item ? carry : carry.concat(index), [])

  const index = openIndexes[randBetween(0, openIndexes.length)]

  state[index] = Math.random() < 0.9 ? 2 : 4;

  return state
}

const processRow = (row) => {
  let [ current, ...remaining ] = row
  const nextIndex = remaining.findIndex(x => x)

  if (nextIndex === -1) {
    return row
  }

  const nextValue = remaining[nextIndex]

  remaining[nextIndex] = null

  if (current === null) {
    current = nextValue
    return processRow([ current, ...remaining ])
  }

  if (current === nextValue) {
    current = current * 2
  } else {
    remaining[0] = nextValue
  }

  return [ current, ...processRow(remaining) ]
}

const chunkArray = (arr, chunkSize = 4) => {
  const clone = arr.slice()
  const result = []
  while (clone.length) {
    result.push(clone.splice(0, chunkSize))
  }

  return result
}

// Rotate a "grid" array 90deg
const rotate = (arr, rotation = 1) => {
  const offset = Math.sqrt(arr.length)
  const chunks = chunkArray(arr, offset)

  const result = [...Array(offset).keys()].flatMap((v, index) => {
    return chunks.map((chunk) => chunk[index]).reverse()
  })

  rotation--

  return rotation ? rotate(result, rotation) : result
}

const processChunks = (arr) =>
  chunkArray(arr).flatMap(processRow)

const reverseProcessChunks = (arr) =>
  chunkArray(arr)
    .flatMap((chunk) =>
      processRow(chunk.reverse()).reverse()
    )


const run = (state, dir) => {
  if (!state) {
    return addTile(addTile(new Array(LENGTH).fill(null, 0, LENGTH)))
  }

  const p = ['left', 'up'].includes(dir) ? processChunks : reverseProcessChunks
  const r = ['left', 'right'].includes(dir) ? K : rotate

  return addTile(r(p(r(state.slice(), 3))))
}

module.exports = {
  processRow,
  run,
  rotate
}

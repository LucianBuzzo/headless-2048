const randBetween = (start, end) => Math.floor(Math.random() * end) + start

const getNewTileValue = () => Math.random() < 0.9 ? 2 : 4;

const GRID_WIDTH = 4
const GRID_HEIGHT = 4
const LENGTH = GRID_WIDTH * GRID_HEIGHT

const addTile = (state) => {
  const openIndexes = state.reduce((carry, item, index) => item ? carry : carry.concat(index), [])

  const index = openIndexes[randBetween(0, openIndexes.length)]

  state[index] = getNewTileValue()

  return state
}

const processRow = (row) => {
  let [ current, ...remaining ] = row
  const nextIndex = remaining.findIndex(x => x)

  if (nextIndex === -1) {
    // There is nothing else to do
    return row
  }

  const nextValue = remaining[nextIndex]

  // Null the index of the found tile
  remaining[nextIndex] = null

  // If the current value is null, swap the tile values and reprocess
  if (current === null) {
    current = nextValue
    return processRow([ current, ...remaining ])

  // If the value is the same as the current value add them together
  } else if (current === nextValue) {
    current = current * 2

  // If the value is not the same as the current value, move it to the
  // adjacent tile
  } else if (current !== nextValue) {
    remaining[0] = nextValue
  }

  return [ current, ...processRow(remaining) ]
}

const initialise = () => {
  const state = new Array(LENGTH).fill(null, 0, LENGTH)

  return addTile(addTile(state))
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
    state = initialise()
    return state
  }

  if (dir === 'left') {
    return addTile(processChunks(state))
  }

  if (dir === 'right') {
    return addTile(reverseProcessChunks(state))
  }

  if (dir === 'up') {
    const clone = rotate(state.slice(), 3)
    const result = rotate(processChunks(clone))
    return addTile(result)
  }

  if (dir === 'down') {
    const clone = rotate(state.slice(), 3)
    const result = rotate(reverseProcessChunks(clone))
    return addTile(result)

  }

  return state
}

module.exports = {
  processRow,
  run,
  rotate
}

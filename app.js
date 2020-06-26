// Code wird ausgeführt wenn das HTML-Dokument fertig geladen wurde:
document.addEventListener('DOMContentLoaded', () => {

  // Code starts Here
  const grid = document.querySelector('.grid')

  // 'Array.from()' erstellt ein Array aus allen ausgewählten <div>'s
  let squares = Array.from(document.querySelectorAll('.grid div'))

  const scoreDisplay = document.querySelector('#score')
  const startButton = document.querySelector('#start-button')
  const width = 10 // Grid-Breite = 10 Quadrate
  let nextRandom = 0 // zufälliger Stein
  let timerId
  let score = 0
  
  // Die Tetris-Steine:
  const lStein = [
    [1, width+1, width*2+1, 2],
    [width, width+1, width+2, width*2+2],
    [1, width+1, width*2+1, width*2],
    [width, width*2, width*2+1, width*2+2]
  ]

  const zStein = [
    [0,width, width+1, width*2+1],
    [width+1, width+2, width*2, width*2+1],
    [0, width, width+1, width*2+1],
    [width+1, width+2, width*2, width*2+1]
  ]

  const tStein = [
    [1, width, width+1, width+2],
    [1, width+1, width+2, width*2+1],
    [width, width+1, width+2, width*2+1],
    [1, width, width+1, width*2+1]
  ]

  const oStein = [
    [0, 1, width, width+1],
    [0, 1, width, width+1],
    [0, 1, width, width+1],
    [0, 1, width, width+1]
  ]

  const iStein = [
    [1, width+1, width*2+1, width*3+1],
    [width, width+1, width+2, width+3],
    [1, width+1, width*2+1, width*3+1],
    [width, width+1, width+2, width+3]
  ]

  const steine = [lStein, zStein, tStein, oStein, iStein]


  let currentPosition = 4
  let currentRotation = 0

  // Wähle zufälligen Stein und seine erste Rotation
  let random = Math.floor(Math.random() * steine.length)
  let current = steine[random][currentRotation]

  // Zeichne Stein
  // Squares zur Darstellung des Steins bekommen die Class="stein" assigned.
  function draw() {
    current.forEach(index => {
      squares[currentPosition + index].classList.add('stein')
    })
  }

  // Lösche Stein
  // Das Class-Assignment im DOM wird wieder aufgehoben.
  function undraw() {
    current.forEach(index => {
      squares[currentPosition + index].classList.remove('stein')
    })
  }

  // Fall-Geschwindigkeit der Steine:
  // timerId = setInterval(moveDown, 500)

// Start/Stop und Bewegungsfunktionen zu Keycodes assignen
  function control(e) {
    // KeyCodes: [37 = ArrowLeft], [38 = ArrowUp], [39 = ArrowRight], [40 = ArrowDown]
    if (e.keyCode === 37) {
      moveLeft()
    } else if (e.keyCode === 38) {
      rotate()
    } else if (e.keyCode === 39) {
      moveRight()
    } else if (e.keyCode === 40) {
      moveDown()
    }
  }
  document.addEventListener('keyup', control)

  // Move down Funktion für Steine
  function moveDown() {
    undraw()
    currentPosition += width
    draw()
    freeze()
  }

// Freeze Funktion
// Wenn einer der 'gezeichneten Blöcke + Width' die class 'taken' hat,
// bekommen die gezeichneten Blöcke auch die class 'taken' assigned.
  function freeze() {
    if (current.some(index => squares[currentPosition + index + width].classList.contains('taken'))) {
      current.forEach(index => squares[currentPosition + index].classList.add('taken'))
      // Starte neuen fallenden Stein
      random = nextRandom
      nextRandom = Math.floor(Math.random() * steine.length)
      current = steine[random][currentRotation]
      currentPosition = 4
      draw()
      displayShape()
      addScore()
      gameOver()
    }
  }

  // Den Stein nach links bewegen, außer er ist am linken Rand oder blockiert
  function moveLeft() {
    undraw()
    const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0)
    // Stein nicht am linken Rand? Dann bewege 1 Square nach links
    if (!isAtLeftEdge) currentPosition -= 1
    // Wenn der Stein bei Bewegung nach links in ein 'taken'-Square bewegt wurde,
    // wird er wieder um 1 Square nach rechts bewegt
    if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
      currentPosition += 1
    }

    draw()
  }

  // Den Stein nach rechts bewegen, außer er ist am rechten Rand oder blockiert
  function moveRight() {
    undraw()
    const isAtRightEdge = current.some(index => (currentPosition + index) % width === width - 1)
    // Stein nicht am rechten Rand? Dann bewege 1 Square nach rechts
    if (!isAtRightEdge) currentPosition += 1
    // Wenn der Stein bei Bewegung nach rechts in ein 'taken'-Square bewegt wurde,
    // wird er wieder um 1 Square nach links bewegt
    if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
      currentPosition -= 1
    }
    draw()
  }

// Stein rotieren
function rotate() {
  undraw()
  currentRotation++
  // Wenn currentRotation die letzte ist, gehe wieder zur ersten
  if (currentRotation === current.length) {
    currentRotation = 0
  }
  current = steine[random][currentRotation]
  draw()
}

// Anzeige für den nächsten Stein
const displaySquares = document.querySelectorAll('.miniGrid div')
const displayWidth = 4
let displayIndex = 0

// Steine ohne Rotationen für die upNext Anzeige
const steinUpNext = [
  [1, displayWidth + 1, displayWidth * 2 + 1, 2], // L-Stein
  [0, displayWidth, displayWidth + 1, displayWidth * 2 + 1], // Z-Stein
  [1, displayWidth, displayWidth + 1, displayWidth + 2], // T-Stein
  [0, 1, displayWidth, displayWidth + 1], // O-Stein
  [1, displayWidth + 1, displayWidth * 2 + 1, displayWidth * 3 + 1] // I-Stein
]

// Zeichne Stein in upNext-Anzeige
function displayShape() {
  // entferne Rückstände von Steinen auf dem Grid
  displaySquares.forEach(square => {
    square.classList.remove('stein')
  })
  steinUpNext[nextRandom].forEach(index => {
    displaySquares[displayIndex + index].classList.add('stein')
  })
}

// Funktion des Start-Buttons
startButton.addEventListener('click', () => {
  if (timerId) {
    clearInterval(timerId)
    timerId = null
  } else {
    draw()
    timerId = setInterval(moveDown, 750)
    nextRandom = Math.floor(Math.random() * steine.length)
    displayShape()
  }
})

// Wenn eine Zeile am Boden gefüllt wurde, wird sie gelöscht und oben eingefügt
// addiere Punktzahl zum Highscore
function addScore() {
  for (let i = 0; i < 199; i += width) {
    const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9]

    if (row.every(index => squares[index].classList.contains('taken'))) {
      score += 10
      scoreDisplay.innerHTML = score
      row.forEach(index => {
        squares[index].classList.remove('taken')
        squares[index].classList.remove('stein')
      })
      const squaresRemoved = squares.splice(i, width)
      squares = squaresRemoved.concat(squares)
      squares.forEach(cell => grid.appendChild(cell))
    }
  }
}

// Game Over
function gameOver() {
  if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
    scoreDisplay.innerHTML = 'Game Over'
    clearInterval(timerId)
  }
}














// Ende
})

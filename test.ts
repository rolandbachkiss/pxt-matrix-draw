// test.ts — comprehensive visual tests for pxt-matrix-draw

// ---------------------------------------------------------------------------
// Step 1: Initialize the matrix
// ---------------------------------------------------------------------------
matrixCore.initNeoPixel(DigitalPin.P0, MatrixLayout.Grid2x2)

const red = matrixCore.rgb(255, 0, 0)
const green = matrixCore.rgb(0, 255, 0)
const blue = matrixCore.rgb(0, 0, 255)
const yellow = matrixCore.rgb(255, 255, 0)
const cyan = matrixCore.rgb(0, 255, 255)
const magenta = matrixCore.rgb(255, 0, 255)
const white = matrixCore.rgb(255, 255, 255)

// ---------------------------------------------------------------------------
// Test 1: Horizontal and vertical lines
// ---------------------------------------------------------------------------
matrixCore.clear()
// Top edge - horizontal line
matrixDraw.line(0, 0, 31, 0, red)
// Left edge - vertical line
matrixDraw.line(0, 0, 0, 31, green)
// Diagonal top-left to bottom-right
matrixDraw.line(0, 0, 31, 31, blue)
// Diagonal top-right to bottom-left
matrixDraw.line(31, 0, 0, 31, yellow)
matrixCore.updateDisplay()
basic.pause(2000)

// ---------------------------------------------------------------------------
// Test 2: Rectangle outlines
// ---------------------------------------------------------------------------
matrixCore.clear()
// Full screen rectangle
matrixDraw.rect(0, 0, 32, 32, red)
// Nested rectangles
matrixDraw.rect(4, 4, 24, 24, green)
matrixDraw.rect(8, 8, 16, 16, blue)
matrixCore.updateDisplay()
basic.pause(2000)

// ---------------------------------------------------------------------------
// Test 3: Filled rectangles
// ---------------------------------------------------------------------------
matrixCore.clear()
// Large filled rectangle
matrixDraw.fillRect(4, 4, 24, 24, cyan)
// Border around it
matrixDraw.rect(2, 2, 28, 28, white)
matrixCore.updateDisplay()
basic.pause(2000)

// ---------------------------------------------------------------------------
// Test 4: Circle outlines
// ---------------------------------------------------------------------------
matrixCore.clear()
// Multiple circles at different radii
matrixDraw.circle(16, 16, 14, red)
matrixDraw.circle(16, 16, 10, green)
matrixDraw.circle(16, 16, 6, blue)
matrixCore.updateDisplay()
basic.pause(2000)

// ---------------------------------------------------------------------------
// Test 5: Filled circles
// ---------------------------------------------------------------------------
matrixCore.clear()
// Four filled circles in corners
matrixDraw.fillCircle(8, 8, 6, red)
matrixDraw.fillCircle(24, 8, 6, green)
matrixDraw.fillCircle(8, 24, 6, blue)
matrixDraw.fillCircle(24, 24, 6, yellow)
// Center circle with outline
matrixDraw.fillCircle(16, 16, 5, cyan)
matrixDraw.circle(16, 16, 5, white)
matrixCore.updateDisplay()
basic.pause(2000)

// ---------------------------------------------------------------------------
// Test 6: Clipping test - shapes at screen edges
// ---------------------------------------------------------------------------
matrixCore.clear()
// Line that goes off-screen (should clip)
matrixDraw.line(-5, 10, 10, 10, red)
matrixDraw.line(10, -5, 10, 10, green)
// Rectangle partially off-screen
matrixDraw.fillRect(26, 26, 10, 10, blue)
// Circle at edge
matrixDraw.fillCircle(30, 30, 5, yellow)
matrixCore.updateDisplay()
basic.pause(2000)

// ---------------------------------------------------------------------------
// Test 7: Combined drawing - simple house
// ---------------------------------------------------------------------------
matrixCore.clear()
// House base (filled rectangle)
matrixDraw.fillRect(8, 16, 16, 12, cyan)
// Roof (triangle made of lines)
matrixDraw.line(6, 16, 16, 6, red)
matrixDraw.line(16, 6, 26, 16, red)
// Door
matrixDraw.fillRect(13, 20, 6, 8, magenta)
// Sun (filled circle)
matrixDraw.fillCircle(28, 6, 4, yellow)
matrixCore.updateDisplay()
basic.pause(2000)

// ---------------------------------------------------------------------------
// Test 8: Animation - bouncing filled circle
// ---------------------------------------------------------------------------
let x = 5
let y = 5
let vx = 1
let vy = 1
const radius = 4

basic.forever(function () {
    matrixCore.clear()
    
    // Draw bouncing ball
    matrixDraw.fillCircle(x, y, radius, cyan)
    
    // Update position
    x += vx
    y += vy
    
    // Bounce off walls
    if (x <= radius || x >= matrixCore.width() - radius - 1) {
        vx = -vx
    }
    if (y <= radius || y >= matrixCore.height() - radius - 1) {
        vy = -vy
    }
    
    matrixCore.updateDisplay()
    basic.pause(50)
})

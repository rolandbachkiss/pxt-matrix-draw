# pxt-matrix-draw

Drawing primitives for NeoPixel LED matrix panels. This extension depends on [pxt-matrix-core](https://github.com/rolandbachkiss/pxt-matrix-core) and provides line, rectangle, and circle rendering into the back framebuffer.

All drawing functions write into the back buffer. Call `matrixCore.updateDisplay()` to push the buffer to the LEDs.

## Setup

```typescript
matrixCore.initNeoPixel(DigitalPin.P0, MatrixLayout.Grid2x2)
```

---

## Lines

### `matrixDraw.line(x0, y0, x1, y1, c)`

Draw a straight line between two points using Bresenham's algorithm.

```typescript
// Red diagonal line from top-left to bottom-right
matrixDraw.line(0, 0, 31, 31, matrixCore.rgb(255, 0, 0))
matrixCore.updateDisplay()
```

---

## Rectangles

### `matrixDraw.rect(x, y, w, h, c)`

Draw a rectangle outline (4 edges, corners shared).

```typescript
// Green 10×10 rectangle outline at (2, 2)
matrixDraw.rect(2, 2, 10, 10, matrixCore.rgb(0, 255, 0))
matrixCore.updateDisplay()
```

### `matrixDraw.fillRect(x, y, w, h, c)`

Fill a rectangle with a solid color.

```typescript
// Blue filled 8×4 rectangle at (4, 4)
matrixDraw.fillRect(4, 4, 8, 4, matrixCore.rgb(0, 0, 255))
matrixCore.updateDisplay()
```

---

## Circles

### `matrixDraw.circle(cx, cy, r, c)`

Draw a circle outline using the midpoint circle algorithm with 8-way symmetry.

```typescript
// White circle centered at (16, 16) with radius 8
matrixDraw.circle(16, 16, 8, matrixCore.rgb(255, 255, 255))
matrixCore.updateDisplay()
```

### `matrixDraw.fillCircle(cx, cy, r, c)`

Fill a circle with a solid color using horizontal scanlines.

```typescript
// Blue filled circle centered at (16, 16) with radius 5
matrixDraw.fillCircle(16, 16, 5, matrixCore.rgb(0, 0, 255))
matrixCore.updateDisplay()
```

---

## Complete Example

```typescript
matrixCore.initNeoPixel(DigitalPin.P0, MatrixLayout.Grid2x2)

// Red diagonal
matrixDraw.line(0, 0, 31, 31, matrixCore.rgb(255, 0, 0))

// Green rectangle outline
matrixDraw.rect(2, 2, 10, 10, matrixCore.rgb(0, 255, 0))

// Blue filled circle
matrixDraw.fillCircle(16, 16, 5, matrixCore.rgb(0, 0, 255))

matrixCore.updateDisplay()
```

---

## Internal / Advanced API

These functions are exported for use by `pxt-matrix-3d` and other extensions that need low-level access:

| Function | Description |
|---|---|
| `matrixDraw.hLine(x, y, w, r, g, b)` | Clipped horizontal pixel span with raw RGB |
| `matrixDraw.vLine(x, y, h, r, g, b)` | Clipped vertical pixel span with raw RGB |
| `matrixDraw.lineRGB(x0, y0, x1, y1, r, g, b)` | Bresenham line with raw RGB components |

---

## License

MIT — © Roland Bach Kiss

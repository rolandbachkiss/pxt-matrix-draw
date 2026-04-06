# pxt-matrix-draw

Drawing primitives for NeoPixel LED matrix panels. Depends on [pxt-matrix-core](https://github.com/rolandbachkiss/pxt-matrix-core).

## Overview

- **Lines** — Bresenham algorithm with fast paths for horizontal/vertical
- **Rectangles** — outline and filled
- **Circles** — antialiased outline (alpha blending) and filled (hard edges)

All functions write directly into the strip buffer. Call `matrixCore.updateDisplay()` to push to LEDs.

---

## Quick Start

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

## API Reference

### Lines

| Block | Description |
|-------|-------------|
| `draw line from x x0 y y0 to x x1 y y1 color c` | Draw a line (Bresenham) |

### Rectangles

| Block | Description |
|-------|-------------|
| `draw rectangle x x y y width w height h color c` | Rectangle outline |
| `fill rectangle x x y y width w height h color c` | Filled rectangle |

### Circles

| Block | Description |
|-------|-------------|
| `draw circle center x cx y cy radius r color c` | Antialiased circle outline |
| `fill circle center x cx y cy radius r color c` | Filled circle (hard edges) |

---

## Antialiased Circles

The `circle()` function uses sub-pixel alpha blending via `matrixCore.blendPixelXY()`. It scans the bounding box around the circle and computes the distance from each pixel centre to the ideal edge. Pixels within 1 pixel of the edge are alpha-blended — alpha is 255 at the exact edge, fading to 0 at 1 pixel away. This produces smooth, anti-aliased circles on the LED grid.

---

## Internal API (for dependent extensions)

These functions are exported for use by `pxt-matrix-3d` and other extensions:

| Function | Description |
|----------|-------------|
| `hLine(x, y, w, r, g, b)` | Clipped horizontal pixel span |
| `vLine(x, y, h, r, g, b)` | Clipped vertical pixel span |
| `lineRGB(x0, y0, x1, y1, r, g, b)` | Bresenham line with separate R, G, B |

---

## Dependencies

- [pxt-matrix-core](https://github.com/rolandbachkiss/pxt-matrix-core) — pixel buffer, setPixelXY, blendPixelXY

## License

MIT © Roland Bach Kiss

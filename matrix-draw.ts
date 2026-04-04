/**
 * Drawing primitives for NeoPixel matrix panels.
 * All functions write into the back buffer via matrixCore.
 */
//% color="#00A0A0" weight=90 icon="\uf1fc"
//% groups='["Lines", "Rectangles", "Circles"]'
namespace matrixDraw {

    /**
     * Fast clipped horizontal span.
     * Used internally and exported for pxt-matrix-3d.
     */
    export function hLine(x: number, y: number, w: number, r: number, g: number, b: number): void {
        const mw = matrixCore.width()
        const mh = matrixCore.height()
        // Clip y
        if (y < 0 || y >= mh) return
        // Clip x range
        if (x < 0) {
            w += x
            x = 0
        }
        if (x + w > mw) {
            w = mw - x
        }
        if (w <= 0) return
        const buf = matrixCore.getBackBuffer()
        for (let i = 0; i < w; i++) {
            matrixCore.setPixelBuf(buf, x + i, y, r, g, b)
        }
    }

    /**
     * Fast clipped vertical span.
     * Used internally.
     */
    export function vLine(x: number, y: number, h: number, r: number, g: number, b: number): void {
        const mw = matrixCore.width()
        const mh = matrixCore.height()
        // Clip x
        if (x < 0 || x >= mw) return
        // Clip y range
        if (y < 0) {
            h += y
            y = 0
        }
        if (y + h > mh) {
            h = mh - y
        }
        if (h <= 0) return
        const buf = matrixCore.getBackBuffer()
        for (let i = 0; i < h; i++) {
            matrixCore.setPixelBuf(buf, x, y + i, r, g, b)
        }
    }

    /**
     * Bresenham line with RGB components.
     * Dispatches to hLine/vLine for axis-aligned cases.
     * Exported for pxt-matrix-3d.
     */
    export function lineRGB(x0: number, y0: number, x1: number, y1: number, r: number, g: number, b: number): void {
        // Axis-aligned fast paths
        if (y0 === y1) {
            const startX = x0 < x1 ? x0 : x1
            const len = Math.abs(x1 - x0) + 1
            hLine(startX, y0, len, r, g, b)
            return
        }
        if (x0 === x1) {
            const startY = y0 < y1 ? y0 : y1
            const len = Math.abs(y1 - y0) + 1
            vLine(x0, startY, len, r, g, b)
            return
        }

        // Standard Bresenham line algorithm (integer only)
        const dx = Math.abs(x1 - x0)
        const dy = Math.abs(y1 - y0)
        const sx = x0 < x1 ? 1 : -1
        const sy = y0 < y1 ? 1 : -1
        let err = dx - dy
        const buf = matrixCore.getBackBuffer()

        while (true) {
            matrixCore.setPixelBuf(buf, x0, y0, r, g, b)
            if (x0 === x1 && y0 === y1) break
            const e2 = 2 * err
            if (e2 > -dy) {
                err -= dy
                x0 += sx
            }
            if (e2 < dx) {
                err += dx
                y0 += sy
            }
        }
    }

    /**
     * Draw a line between two points.
     * @param x0 start x
     * @param y0 start y
     * @param x1 end x
     * @param y1 end y
     * @param c packed RGB color
     */
    //% blockId=matrix_draw_line
    //% block="draw line from x $x0 y $y0 to x $x1 y $y1 color $c"
    //% c.shadow="colorNumberPicker"
    //% group="Lines" weight=100
    export function line(x0: number, y0: number, x1: number, y1: number, c: number): void {
        const r = (c >> 16) & 0xFF
        const g = (c >> 8) & 0xFF
        const b = c & 0xFF
        lineRGB(x0, y0, x1, y1, r, g, b)
    }

    /**
     * Draw a rectangle outline.
     * @param x left edge x
     * @param y top edge y
     * @param w width in pixels
     * @param h height in pixels
     * @param c packed RGB color
     */
    //% blockId=matrix_draw_rect
    //% block="draw rectangle x $x y $y width $w height $h color $c"
    //% c.shadow="colorNumberPicker"
    //% group="Rectangles" weight=90
    export function rect(x: number, y: number, w: number, h: number, c: number): void {
        if (w <= 0 || h <= 0) return
        const r = (c >> 16) & 0xFF
        const g = (c >> 8) & 0xFF
        const b = c & 0xFF
        // Top edge
        hLine(x, y, w, r, g, b)
        // Bottom edge
        hLine(x, y + h - 1, w, r, g, b)
        // Left edge (excluding corners)
        if (h > 2) {
            vLine(x, y + 1, h - 2, r, g, b)
        }
        // Right edge (excluding corners)
        if (h > 2) {
            vLine(x + w - 1, y + 1, h - 2, r, g, b)
        }
    }

    /**
     * Fill a rectangle with a solid color.
     * @param x left edge x
     * @param y top edge y
     * @param w width in pixels
     * @param h height in pixels
     * @param c packed RGB color
     */
    //% blockId=matrix_draw_fill_rect
    //% block="fill rectangle x $x y $y width $w height $h color $c"
    //% c.shadow="colorNumberPicker"
    //% group="Rectangles" weight=89
    export function fillRect(x: number, y: number, w: number, h: number, c: number): void {
        if (w <= 0 || h <= 0) return
        const r = (c >> 16) & 0xFF
        const g = (c >> 8) & 0xFF
        const b = c & 0xFF
        for (let row = 0; row < h; row++) {
            hLine(x, y + row, w, r, g, b)
        }
    }

    /**
     * Draw a circle outline using the midpoint circle algorithm.
     * @param cx center x
     * @param cy center y
     * @param r radius
     * @param c packed RGB color
     */
    //% blockId=matrix_draw_circle
    //% block="draw circle center x $cx y $cy radius $r color $c"
    //% c.shadow="colorNumberPicker"
    //% group="Circles" weight=80
    export function circle(cx: number, cy: number, r: number, c: number): void {
        if (r < 0) return
        const cr = (c >> 16) & 0xFF
        const cg = (c >> 8) & 0xFF
        const cb = c & 0xFF
        const buf = matrixCore.getBackBuffer()

        // Midpoint circle algorithm with 8-way symmetry
        let px = r
        let py = 0
        let err = 0

        while (px >= py) {
            // Plot 8 octant points
            matrixCore.setPixelBuf(buf, cx + px, cy + py, cr, cg, cb)
            matrixCore.setPixelBuf(buf, cx + py, cy + px, cr, cg, cb)
            matrixCore.setPixelBuf(buf, cx - py, cy + px, cr, cg, cb)
            matrixCore.setPixelBuf(buf, cx - px, cy + py, cr, cg, cb)
            matrixCore.setPixelBuf(buf, cx - px, cy - py, cr, cg, cb)
            matrixCore.setPixelBuf(buf, cx - py, cy - px, cr, cg, cb)
            matrixCore.setPixelBuf(buf, cx + py, cy - px, cr, cg, cb)
            matrixCore.setPixelBuf(buf, cx + px, cy - py, cr, cg, cb)

            py++
            if (err <= 0) {
                err += 2 * py + 1
            } else {
                px--
                err += 2 * (py - px) + 1
            }
        }
    }

    /**
     * Fill a circle with a solid color using horizontal spans.
     * @param cx center x
     * @param cy center y
     * @param r radius
     * @param c packed RGB color
     */
    //% blockId=matrix_draw_fill_circle
    //% block="fill circle center x $cx y $cy radius $r color $c"
    //% c.shadow="colorNumberPicker"
    //% group="Circles" weight=79
    export function fillCircle(cx: number, cy: number, r: number, c: number): void {
        if (r < 0) return
        const cr = (c >> 16) & 0xFF
        const cg = (c >> 8) & 0xFF
        const cb = c & 0xFF
        const r2 = r * r

        for (let dy = -r; dy <= r; dy++) {
            // Integer square root: find largest dx such that dx*dx <= r2 - dy*dy
            const limit = r2 - dy * dy
            let dx = r
            while (dx * dx > limit) {
                dx--
            }
            hLine(cx - dx, cy + dy, 2 * dx + 1, cr, cg, cb)
        }
    }

} // namespace matrixDraw

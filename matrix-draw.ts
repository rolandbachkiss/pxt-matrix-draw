/**
 * Drawing primitives for NeoPixel matrix panels.
 *
 * Depends on pxt-matrix-core for the framebuffer and pixel output.
 *
 * Provides:
 * - Lines (Bresenham algorithm, with fast paths for horizontal/vertical)
 * - Rectangles (outline and filled)
 * - Circles (antialiased outline via alpha blending, and filled)
 *
 * All functions write directly into the strip buffer via matrixCore.setPixelXY()
 * or matrixCore.blendPixelXY(). Call matrixCore.updateDisplay() to push to LEDs.
 */
//% color="#00A0A0" weight=90 icon="\uf1fc"
//% groups='["Lines","Rectangles","Circles"]'
namespace matrixDraw {

    // -----------------------------------------------------------------------
    // Internal span helpers — no buf parameter, write directly via setPixelXY
    // -----------------------------------------------------------------------

    /**
     * Fast clipped horizontal span.
     * Exported for pxt-matrix-3d and other dependent extensions.
     */
    export function hLine(x: number, y: number, w: number, r: number, g: number, b: number): void {
        const mw = matrixCore.width()
        const mh = matrixCore.height()
        if (y < 0 || y >= mh) return
        if (x < 0) { w += x; x = 0 }
        if (x + w > mw) { w = mw - x }
        if (w <= 0) return
        for (let i = 0; i < w; i++) {
            matrixCore.setPixelXY(x + i, y, r, g, b)
        }
    }

    /**
     * Fast clipped vertical span.
     * Exported for dependent extensions.
     */
    export function vLine(x: number, y: number, h: number, r: number, g: number, b: number): void {
        const mw = matrixCore.width()
        const mh = matrixCore.height()
        if (x < 0 || x >= mw) return
        if (y < 0) { h += y; y = 0 }
        if (y + h > mh) { h = mh - y }
        if (h <= 0) return
        for (let i = 0; i < h; i++) {
            matrixCore.setPixelXY(x, y + i, r, g, b)
        }
    }

    /**
     * Bresenham line with separate R, G, B components.
     * Dispatches to hLine/vLine for axis-aligned cases.
     * Exported for pxt-matrix-3d.
     */
    export function lineRGB(x0: number, y0: number, x1: number, y1: number, r: number, g: number, b: number): void {
        // Axis-aligned fast paths
        if (y0 === y1) {
            const startX = x0 < x1 ? x0 : x1
            hLine(startX, y0, Math.abs(x1 - x0) + 1, r, g, b)
            return
        }
        if (x0 === x1) {
            const startY = y0 < y1 ? y0 : y1
            vLine(x0, startY, Math.abs(y1 - y0) + 1, r, g, b)
            return
        }

        // Standard Bresenham (integer only)
        const dx = Math.abs(x1 - x0)
        const dy = Math.abs(y1 - y0)
        const sx = x0 < x1 ? 1 : -1
        const sy = y0 < y1 ? 1 : -1
        let err = dx - dy

        while (true) {
            matrixCore.setPixelXY(x0, y0, r, g, b)
            if (x0 === x1 && y0 === y1) break
            const e2 = 2 * err
            if (e2 > -dy) { err -= dy; x0 += sx }
            if (e2 < dx)  { err += dx; y0 += sy }
        }
    }

    // -----------------------------------------------------------------------
    // Public blocks — Lines
    // -----------------------------------------------------------------------

    /**
     * Draw a line between two points using Bresenham's algorithm.
     * Clips to matrix bounds automatically.
     * @param x0 start x (0–31)
     * @param y0 start y (0–31)
     * @param x1 end x (0–31)
     * @param y1 end y (0–31)
     * @param c packed RGB color (use matrixCore.rgb(r, g, b))
     */
    //% blockId=matrix_draw_line
    //% block="draw line from x $x0 y $y0 to x $x1 y $y1 color $c"
    //% c.shadow="colorNumberPicker"
    //% group="Lines" weight=100
    export function line(x0: number, y0: number, x1: number, y1: number, c: number): void {
        lineRGB(x0, y0, x1, y1, (c >> 16) & 0xFF, (c >> 8) & 0xFF, c & 0xFF)
    }

    // -----------------------------------------------------------------------
    // Public blocks — Rectangles
    // -----------------------------------------------------------------------

    /**
     * Draw a rectangle outline (4 edges, corners shared).
     * @param x left edge (0–31)
     * @param y top edge (0–31)
     * @param w width in pixels (1–32)
     * @param h height in pixels (1–32)
     * @param c packed RGB color (use matrixCore.rgb(r, g, b))
     */
    //% blockId=matrix_draw_rect
    //% block="draw rectangle x $x y $y width $w height $h color $c"
    //% c.shadow="colorNumberPicker"
    //% group="Rectangles" weight=90
    export function rect(x: number, y: number, w: number, h: number, c: number): void {
        if (w <= 0 || h <= 0) return
        const r = (c >> 16) & 0xFF; const g = (c >> 8) & 0xFF; const b = c & 0xFF
        hLine(x, y, w, r, g, b)
        hLine(x, y + h - 1, w, r, g, b)
        if (h > 2) { vLine(x, y + 1, h - 2, r, g, b); vLine(x + w - 1, y + 1, h - 2, r, g, b) }
    }

    /**
     * Fill a circle with a solid color (hard edges, no antialiasing).
     * Uses horizontal scanlines for efficient filling.
     * @param cx center x (0–31)
     * @param cy center y (0–31)
     * @param r radius in pixels (0–16)
     * @param c packed RGB color (use matrixCore.rgb(r, g, b))
     */
    //% blockId=matrix_draw_fill_rect
    //% block="fill rectangle x $x y $y width $w height $h color $c"
    //% c.shadow="colorNumberPicker"
    //% group="Rectangles" weight=89
    export function fillRect(x: number, y: number, w: number, h: number, c: number): void {
        if (w <= 0 || h <= 0) return
        const r = (c >> 16) & 0xFF; const g = (c >> 8) & 0xFF; const b = c & 0xFF
        for (let row = 0; row < h; row++) hLine(x, y + row, w, r, g, b)
    }

    // -----------------------------------------------------------------------
    // Public blocks — Circles
    // -----------------------------------------------------------------------

    /**
     * Draw an antialiased circle outline.
     * Pixels near the ideal edge are alpha-blended for smooth appearance
     * using matrixCore.blendPixelXY(). The edge band is 1 pixel wide.
     * @param cx center x (0–31)
     * @param cy center y (0–31)
     * @param r radius in pixels (0–16)
     * @param c packed RGB color (use matrixCore.rgb(r, g, b))
     */
    //% blockId=matrix_draw_circle
    //% block="draw circle center x $cx y $cy radius $r color $c"
    //% c.shadow="colorNumberPicker"
    //% group="Circles" weight=80
    export function circle(cx: number, cy: number, r: number, c: number): void {
        if (r < 0) return
        const cr = (c >> 16) & 0xFF
        const cg = (c >> 8)  & 0xFF
        const cb =  c        & 0xFF

        // Scan the bounding box of the 2-pixel-wide annular band
        const x0 = cx - r - 1
        const x1 = cx + r + 1
        const y0 = cy - r - 1
        const y1 = cy + r + 1

        for (let py = y0; py <= y1; py++) {
            for (let px = x0; px <= x1; px++) {
                const dx = px - cx
                const dy = py - cy
                // Distance from pixel centre to circle centre
                const dist = Math.sqrt(dx * dx + dy * dy)
                // Sub-pixel distance from the ideal circle edge
                const diff = dist - r
                const absDiff = diff < 0 ? -diff : diff
                if (absDiff >= 1.0) continue          // fully outside the 1-px edge band
                // Alpha: 1.0 at the ideal edge, 0.0 at 1 pixel away
                const alpha = Math.round((1.0 - absDiff) * 255)
                matrixCore.blendPixelXY(px, py, cr, cg, cb, alpha)
            }
        }
    }

    /**
     * Draw a line between two points using Bresenham's algorithm.
     * Clips to matrix bounds automatically.
     * @param x0 start x (0–31)
     * @param y0 start y (0–31)
     * @param x1 end x (0–31)
     * @param y1 end y (0–31)
     * @param c packed RGB color (use matrixCore.rgb(r, g, b))
     */
    //% blockId=matrix_draw_fill_circle
    //% block="fill circle center x $cx y $cy radius $r color $c"
    //% c.shadow="colorNumberPicker"
    //% group="Circles" weight=79
    export function fillCircle(cx: number, cy: number, r: number, c: number): void {
        if (r < 0) return
        const cr = (c >> 16) & 0xFF
        const cg = (c >> 8)  & 0xFF
        const cb =  c        & 0xFF
        const r2 = r * r

        for (let dy = -r; dy <= r; dy++) {
            // Largest dx such that dx*dx <= r2 - dy*dy
            const limit = r2 - dy * dy
            let dx = r
            while (dx * dx > limit) dx--
            hLine(cx - dx, cy + dy, 2 * dx + 1, cr, cg, cb)
        }
    }

} // namespace matrixDraw

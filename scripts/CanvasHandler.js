class CanvasHandler {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.context = this.canvas.getContext("2d");
        this.buffer = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);
        this.pitch = this.buffer.width * 4;
    }

    putPixel(x, y, color) {
        x = this.canvas.width/2 + x;
        y = this.canvas.height/2 - y - 1;

        if (x < 0 || x >= this.canvas.width || y < 0 || y >= this.canvas.height) {
            return;
        }

        let offset = x*4 + this.pitch*y;
        this.buffer.data[offset++] = color.x;
        this.buffer.data[offset++] = color.y;
        this.buffer.data[offset++] = color.z;
        this.buffer.data[offset] = 255;
    }

    updateCanvas() {
        this.context.putImageData(this.buffer, 0, 0);
    }

    clear() {
        this.canvas.width = this.canvas.width;
    }
}

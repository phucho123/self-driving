import { lerp } from "./utils.js";
export class Road {
    constructor(x, width, numLane) {
        this.x = x;
        this.width = width;
        this.numLane = numLane;
        this.infinity = 1000000;
        this.left = this.x - this.width / 2;
        this.right = this.x + this.width / 2;
        this.top = this.infinity;
        this.bottom = -this.infinity;
        this.roadBorder = [
            [{ x: this.left, y: this.top }, { x: this.left, y: this.bottom }],
            [{ x: this.right, y: this.top }, { x: this.right, y: this.bottom }]
        ];
    }
    getLaneCenter(index) {
        return lerp(this.left, this.right, index / this.numLane) + this.width / this.numLane / 2;
    }
    draw(ctx) {
        for (let i = 0; i <= this.numLane; i++) {
            const x = lerp(this.left, this.right, i / this.numLane);
            ctx.beginPath();
            ctx.strokeStyle = "white";
            if (i == 0 || i == this.numLane) {
                ctx.setLineDash([]);
            }
            else {
                ctx.setLineDash([20, 20]);
            }
            ctx.moveTo(x, this.top);
            ctx.lineTo(x, this.bottom);
            ctx.lineWidth = 5;
            ctx.stroke();
        }
    }
}

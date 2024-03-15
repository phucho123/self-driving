import { lerp, lineIntersection } from "./utils.js";
export class Sensor {
    constructor(car, numRay, rayLen) {
        this.raySpread = Math.PI / 2;
        this.car = car;
        this.numRay = numRay;
        this.rayLen = rayLen;
        this.rays = [];
        this.readings = [];
    }
    getReading(ray, roadBorder, traffic) {
        const touches = [];
        for (let i = 0; i < roadBorder.length; i++) {
            const touch = lineIntersection(ray[0], ray[1], roadBorder[i][0], roadBorder[i][1]);
            if (touch != null) {
                touches.push(touch);
            }
        }
        for (let i = 0; i < traffic.length; i++) {
            const polygon = traffic[i].polygon;
            for (let j = 0; j < polygon.length; j++) {
                const touch = lineIntersection(ray[0], ray[1], polygon[j], polygon[(j + 1) % 4]);
                if (touch != null) {
                    touches.push(touch);
                }
            }
        }
        if (touches.length == 0)
            return null;
        const offsetList = touches.map(touch => touch.offset);
        const minOffset = Math.min(...offsetList);
        return touches.find(touch => touch.offset == minOffset);
    }
    update(roadBorder, traffic) {
        this.rays = [];
        this.readings = [];
        for (let i = 0; i < this.numRay; i++) {
            const start = { x: this.car.getPos().x, y: this.car.getPos().y };
            const angle = lerp(-this.raySpread / 2, this.raySpread / 2, i / (this.numRay == 1 ? 1 : this.numRay - 1)) + this.car.getAngle();
            const end = {
                x: start.x - this.rayLen * Math.sin(angle),
                y: start.y - this.rayLen * Math.cos(angle)
            };
            const ray = [start, end];
            this.readings.push(this.getReading(ray, roadBorder, traffic));
            this.rays.push(ray);
        }
    }
    draw(ctx) {
        this.rays.forEach((ray, index) => {
            ctx.beginPath();
            ctx.lineWidth = 2;
            ctx.strokeStyle = "yellow";
            ctx.moveTo(ray[0].x, ray[0].y);
            if (this.readings[index] != null) {
                ctx.lineTo(this.readings[index].x, this.readings[index].y);
                ctx.stroke();
                ctx.beginPath();
                ctx.lineWidth = 2;
                ctx.strokeStyle = "black";
                ctx.moveTo(this.readings[index].x, this.readings[index].y);
                ctx.lineTo(ray[1].x, ray[1].y);
                ctx.stroke();
            }
            else {
                ctx.lineTo(ray[1].x, ray[1].y);
                ctx.stroke();
            }
        });
    }
}

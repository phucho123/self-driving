import { Controller } from "./Controller.js";
import { NeuralNetwork } from "./Network.js";
import { Sensor } from "./Sensor.js";
import { Vector2f } from "./types";
import { polygonIntersection } from "./utils.js";

export class Car {
    private pos: Vector2f;
    private width: number;
    private height: number;
    private speed: number;
    private maxSpeed: number;
    private acceleration: number;
    private friction: number;
    private controller: Controller;
    private angle: number;
    private image: HTMLImageElement;
    private sensor: Sensor | null;
    private damaged: boolean;
    public polygon: Vector2f[];
    public type: string;
    public brain: NeuralNetwork | null;
    constructor(pos: Vector2f, width: number, height: number, imageUrl: string, type: string, maxSpeed = 3) {
        this.pos = pos;
        this.width = width;
        this.height = height;
        this.speed = 0;
        this.maxSpeed = maxSpeed;
        this.acceleration = 0.2;
        this.friction = 0.05;
        this.controller = new Controller(type);
        this.angle = 0;
        this.image = new Image();
        this.image.src = imageUrl;
        if (type != "DUMMY") {
            this.sensor = new Sensor(this, 5, 300);
        } else this.sensor = null;
        this.damaged = false;
        this.polygon = [];
        this.type = type;
        if (type != "DUMMY" && this.sensor) {
            this.brain = new NeuralNetwork(
                [this.sensor.numRay, 6, 4]
            )
        } else this.brain = null;
    }

    getPolygon() {
        const points = [];
        const rad = Math.hypot(this.width, this.height) / 2;
        const alpha = Math.atan2(this.width, this.height);

        points.push({
            x: this.pos.x - Math.sin(this.angle + alpha) * rad,
            y: this.pos.y - Math.cos(this.angle + alpha) * rad
        })

        points.push({
            x: this.pos.x - Math.sin(this.angle - alpha) * rad,
            y: this.pos.y - Math.cos(this.angle - alpha) * rad
        })

        points.push({
            x: this.pos.x + Math.sin(this.angle + alpha) * rad,
            y: this.pos.y + Math.cos(this.angle + alpha) * rad
        })

        points.push({
            x: this.pos.x + Math.sin(this.angle - alpha) * rad,
            y: this.pos.y + Math.cos(this.angle - alpha) * rad
        })

        return points;
    }

    checkDamage(polygon: Array<Vector2f>, roadBorder: Array<Array<Vector2f>>, traffic: Car[]) {
        for (let i = 0; i < roadBorder.length; i++) {
            if (polygonIntersection(polygon, roadBorder[i])) return true;
        }

        for (let i = 0; i < traffic.length; i++) {
            const poly = traffic[i].getPolygon();
            for (let j = 0; j < poly.length; j++) {
                if (polygonIntersection(polygon, poly)) return true;
            }
        }

        return false;
    }

    move(): void {
        if (this.controller.forward) {
            this.speed += this.acceleration;
        }
        if (this.controller.reverse) {
            this.speed -= this.acceleration;
        }
        if (this.controller.left) {
            this.angle += 0.03;
        }
        if (this.controller.right) {
            this.angle -= 0.03;
        }

        if (this.speed > this.maxSpeed) this.speed = this.maxSpeed;
        if (this.speed < -this.maxSpeed) this.speed = -this.maxSpeed;

        if (this.speed > 0) this.speed -= this.friction;
        if (this.speed < 0) this.speed += this.friction;
        if (Math.abs(this.speed) < this.friction) this.speed = 0;

        this.pos.x -= Math.sin(this.angle) * this.speed;
        this.pos.y -= Math.cos(this.angle) * this.speed;
    }

    update(roadBorder: Array<Array<any>>, traffic: Car[]): void {
        if (!this.damaged) {
            this.move();
            this.polygon = this.getPolygon();
            if (this.type != "DUMMY") {
                this.damaged = this.checkDamage(this.polygon, roadBorder, traffic);
            }
        }
        if (this.type != "DUMMY" && this.sensor) {
            this.sensor.update(roadBorder, traffic);
            const outputs = NeuralNetwork.feedForward(
                this.sensor.readings.map(e => e == null ? 0 : 1 - e.offset),
                this.brain as NeuralNetwork
            );


            this.controller.forward = outputs[0] == 1 ? true : false;
            this.controller.left = outputs[1] == 1 ? true : false;
            this.controller.right = outputs[2] == 1 ? true : false;
            this.controller.reverse = outputs[3] == 1 ? true : false;
        }

    }

    draw(ctx: CanvasRenderingContext2D, drawSensor: boolean): void {

        ctx.beginPath();
        if (this.type != "") {
            ctx.save();
            ctx.translate(this.pos.x, this.pos.y);
            ctx.rotate(-this.angle);
            ctx.drawImage(
                this.image,
                - this.width / 2,
                - this.height / 2,
                this.width,
                this.height
            );
            ctx.restore();
        }
        if (this.damaged) {
            ctx.fillStyle = "gray";
        } else if (this.type != "DUMMY") ctx.fillStyle = "blue";
        else ctx.fillStyle = "red";
        if (this.type == "") {

            ctx.moveTo(this.polygon[0].x, this.polygon[0].y);

            for (let i = 1; i < this.polygon.length; i++) {
                ctx.lineTo(this.polygon[i].x, this.polygon[i].y);
            }

            ctx.fill();
        }

        // ctx.restore();
        if (drawSensor && this.type != "DUMMY" && this.sensor) this.sensor.draw(ctx);
    }

    getPos(): Vector2f {
        return this.pos;
    }

    getAngle(): number {
        return this.angle;
    }
}
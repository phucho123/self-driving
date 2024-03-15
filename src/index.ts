import { Car } from "./Car.js";
import { NeuralNetwork } from "./Network.js";
import { Road } from "./Road.js";

const canvas1 = document.getElementById("canvas1") as HTMLCanvasElement;
const ctx1 = canvas1?.getContext("2d") as CanvasRenderingContext2D;

canvas1.height = window.innerHeight;
canvas1.width = 400;

const road = new Road(canvas1.width / 2, canvas1.width * 0.9, 3);

// const car = new Car(
//     {
//         x: road.getLaneCenter(1),
//         y: 500
//     },
//     50,
//     100,
//     "assets/car.png",
//     "AI",
//     3
// )
const N = 1;
const cars = generateCars(N);
let bestCar = cars[0];
if (localStorage.getItem("bestBrain")) {
    cars.forEach((car, index) => {
        car.brain = JSON.parse(localStorage.getItem("bestBrain") as string);

        if (index != 0) {
            NeuralNetwork.mutate(car.brain as NeuralNetwork, 0.1);
        }
    })
}

const traffic = [
    new Car({
        x: road.getLaneCenter(1),
        y: 300
    },
        50, 100,
        "assets/dummycar.png",
        "DUMMY",
        2
    ),
    new Car({
        x: road.getLaneCenter(0),
        y: 0
    },
        50, 100,
        "assets/dummycar.png",
        "DUMMY",
        2
    ),
    new Car({
        x: road.getLaneCenter(1),
        y: 0
    },
        50, 100,
        "assets/dummycar.png",
        "DUMMY",
        2
    ),
    new Car({
        x: road.getLaneCenter(1),
        y: -400
    },
        50, 100,
        "assets/dummycar.png",
        "DUMMY",
        2
    ),
    new Car({
        x: road.getLaneCenter(2),
        y: -300
    },
        50, 100,
        "assets/dummycar.png",
        "DUMMY",
        2
    ),
    new Car({
        x: road.getLaneCenter(1),
        y: -600
    },
        50, 100,
        "assets/dummycar.png",
        "DUMMY",
        2
    ),
    new Car({
        x: road.getLaneCenter(0),
        y: -800
    },
        50, 100,
        "assets/dummycar.png",
        "DUMMY",
        2
    )
]

function generateCars(n: number) {
    const cars = [];
    for (let i = 0; i < n; i++) {
        cars.push(
            new Car(
                {
                    x: road.getLaneCenter(1),
                    y: 500
                },
                50,
                100,
                "assets/car.png",
                "AI",
                3
            )
        )
    }

    return cars;
}

const saveButton = document.getElementById("save");
const clearButton = document.getElementById("clear");
saveButton?.addEventListener("click", (e) => {
    saveBrain();
});
clearButton?.addEventListener("click", (e) => {
    clearBrain();
});

function saveBrain() {
    localStorage.setItem("bestBrain", JSON.stringify(bestCar.brain));
}

function clearBrain() {
    localStorage.removeItem("bestBrain");
}


function animate() {

    for (let i = 0; i < traffic.length; i++) {
        traffic[i].update(road.roadBorder, []);
    }
    cars.forEach(car => car.update(road.roadBorder, traffic));
    bestCar = cars.find(car => car.getPos().y == Math.min(
        ...cars.map(car => car.getPos().y)
    )) as Car;


    canvas1.height = window.innerHeight;

    ctx1.save();
    ctx1.translate(0, -bestCar.getPos().y + canvas1.height * 0.7);
    road.draw(ctx1);
    for (let i = 0; i < traffic.length; i++) {
        traffic[i].draw(ctx1, false);
    }
    ctx1.globalAlpha = 0.2;
    cars.forEach(car => car.draw(ctx1, false));
    ctx1.globalAlpha = 1;
    bestCar.draw(ctx1, false);

    ctx1.restore();
    requestAnimationFrame(animate);
}

animate();




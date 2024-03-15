import { lerp } from "./utils.js";

export class NeuralNetwork {
    public levels: Level[];
    constructor(neuronCnt: number[]) {
        this.levels = [];

        for (let i = 0; i < neuronCnt.length - 1; i++) {
            this.levels.push(
                new Level(neuronCnt[i], neuronCnt[i + 1])
            )
        }
    }

    static feedForward(inputs: Array<number>, network: NeuralNetwork) {
        let outputs = Level.feedForward(
            network.levels[0],
            inputs
        )
        for (let i = 1; i < network.levels.length; i++) {
            outputs = Level.feedForward(
                network.levels[i],
                outputs
            )
        }

        return outputs;
    }

    static mutate(network: NeuralNetwork, amount: number) {
        network.levels.forEach(level => {
            for (let i = 0; i < level.biases.length; i++) {
                level.biases[i] = lerp(
                    level.biases[i],
                    Math.random() * 2 - 1,
                    amount
                )
            }

            for (let i = 0; i < level.weights.length; i++) {
                for (let j = 0; j < level.weights[i].length; j++) {
                    level.weights[i][j] = lerp(
                        level.weights[i][j],
                        Math.random() * 2 - 1,
                        amount
                    )
                }
            }
        })
    }
}

export class Level {
    public inputs: Array<number>;
    public outputs: Array<number>;
    public biases: Array<number>;
    public weights: Array<Array<number>>;
    constructor(inputCnt: number, outputCnt: number) {
        this.inputs = new Array(inputCnt);
        this.outputs = new Array(outputCnt);
        this.biases = new Array(outputCnt);

        this.weights = [];

        for (let i = 0; i < inputCnt; i++) {
            this.weights[i] = new Array(outputCnt);
        }

        Level.randomize(this);
    }

    static randomize(level: Level) {
        for (let i = 0; i < level.inputs.length; i++) {
            for (let j = 0; j < level.outputs.length; j++) {
                level.weights[i][j] = Math.random() * 2 - 1;
            }
        }

        for (let i = 0; i < level.biases.length; i++) {
            level.biases[i] = Math.random() * 2 - 1;
        }
    }

    static feedForward(level: Level, inputs: Array<number>) {
        for (let i = 0; i < level.outputs.length; i++) {
            let sum = 0;
            for (let j = 0; j < inputs.length; j++) {
                sum += level.weights[j][i] * inputs[j];
            }
            if (sum > level.biases[i]) {
                level.outputs[i] = 1;
            } else level.outputs[i] = 0;
        }

        return level.outputs;
    }
}

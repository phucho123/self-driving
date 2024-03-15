export class Level {
    constructor(inputCnt, outputCnt) {
        this.inputs = new Array(inputCnt);
        this.outputs = new Array(outputCnt);
        this.biases = new Array(outputCnt);
        this.weights = [];
        for (let i = 0; i < inputCnt; i++) {
            this.weights[i] = new Array(outputCnt);
        }
        Level.randomize(this);
    }
    static randomize(level) {
        for (let i = 0; i < level.inputs.length; i++) {
            for (let j = 0; j < level.outputs.length; j++) {
                level.weights[i][j] = Math.random() * 2 - 1;
            }
        }
        for (let i = 0; i < level.biases.length; i++) {
            level.biases[i] = Math.random() * 2 - 1;
        }
    }
    static feedForward(level, inputs) {
        for (let i = 0; i < level.outputs.length; i++) {
            let sum = 0;
            for (let j = 0; j < inputs.length; j++) {
                sum += level.weights[j][i] * inputs[j];
            }
            if (sum > level.biases[i]) {
                level.outputs[i] = 1;
            }
            else
                level.outputs[i] = 0;
        }
    }
}

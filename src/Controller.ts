export class Controller {
    public forward = false;
    public reverse = false;
    public left = false;
    public right = false;

    constructor(type: string) {
        if (type == "USER")
            this.addEventListener();
        else if (type == "DUMMY")
            this.forward = true;
    }

    addEventListener() {
        document.onkeydown = (e) => {
            switch (e.key) {
                case "a":
                    this.left = true;
                    break;
                case "d":
                    this.right = true;
                    break;
                case "w":
                    this.forward = true;
                    break;
                case "s":
                    this.reverse = true;
                    break;
                default:
                    break;
            }
        }

        document.onkeyup = (e) => {
            switch (e.key) {
                case "a":
                    this.left = false;
                    break;
                case "d":
                    this.right = false;
                    break;
                case "w":
                    this.forward = false;
                    break;
                case "s":
                    this.reverse = false;
                    break;
                default:
                    break;
            }
        }
    }
}
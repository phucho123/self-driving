import { Vector2f } from "./types";

const lerp = (A: number, B: number, t: number) => {
    return A + (B - A) * t;
}

const lineIntersection = (A: Vector2f, B: Vector2f, C: Vector2f, D: Vector2f) => {
    const tTop = (A.x - C.x) * (C.y - D.y) - (A.y - C.y) * (C.x - D.x);
    const uTop = - (A.x - B.x) * (A.y - C.y) + (A.y - B.y) * (A.x - C.x);
    const bottom = (A.x - B.x) * (C.y - D.y) - (A.y - B.y) * (C.x - D.x);

    if (bottom != 0) {
        const t = tTop / bottom;
        const u = uTop / bottom;

        if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
            return {
                x: A.x + (B.x - A.x) * t,
                y: A.y + (B.y - A.y) * t,
                offset: t
            }
        }
    }

    return null;
}

const polygonIntersection = (A: Vector2f[], B: Vector2f[]) => {
    for (let i = 0; i < A.length; i++) {
        for (let j = 0; j < B.length; j++) {
            const touch = lineIntersection(
                A[i],
                A[(i + 1) % A.length],
                B[j],
                B[(j + 1) % B.length]
            )

            if (touch != null) return true;
        }
    }

    return false;
}

export { lerp, lineIntersection, polygonIntersection }
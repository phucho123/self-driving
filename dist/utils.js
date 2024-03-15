const lerp = (A, B, t) => {
    return A + (B - A) * t;
};
const lineIntersection = (A, B, C, D) => {
    const tTop = (A.x - C.x) * (C.y - D.y) - (A.y - C.y) * (C.x - D.x);
    const uTop = -(A.x - B.x) * (A.y - C.y) + (A.y - B.y) * (A.x - C.x);
    const bottom = (A.x - B.x) * (C.y - D.y) - (A.y - B.y) * (C.x - D.x);
    if (bottom != 0) {
        const t = tTop / bottom;
        const u = uTop / bottom;
        if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
            return {
                x: A.x + (B.x - A.x) * t,
                y: A.y + (B.y - A.y) * t,
                offset: t
            };
        }
    }
    return null;
};
const polygonIntersection = (A, B) => {
    for (let i = 0; i < A.length; i++) {
        for (let j = 0; j < B.length; j++) {
            const touch = lineIntersection(A[i], A[(i + 1) % A.length], B[j], B[(j + 1) % B.length]);
            if (touch != null)
                return true;
        }
    }
    return false;
};
export { lerp, lineIntersection, polygonIntersection };

function euclideanDistance(embedding1: number[], embedding2: number[]): number {
    let sum = 0;
    for (let i = 0; i < embedding1.length; i++) {
        sum += Math.pow(embedding1[i] - embedding2[i], 2);
    }
    return Math.sqrt(sum);
}

export function isSameFace(embedding1: number[], embedding2: number[], threshold: number = 5): boolean {
    const distance = euclideanDistance(embedding1, embedding2);
    return distance < threshold;
}


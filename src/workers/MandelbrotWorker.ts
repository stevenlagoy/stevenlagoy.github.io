/// <reference lib="webworker" />


self.onmessage = (e) => {
    const { width, height, startY, re0, im0, reStep, imStep, maxIter, frameId } = e.data;
    const data = new Uint8ClampedArray(width * height * 4);

    for (let y = 0; y < height; y++) {
        const im = im0 + y * imStep;
        for (let x = 0; x < width; x++) {
            const re = re0 + x * reStep;
            let zx = 0, zy = 0, iter = 0;
            while (zx * zx + zy * zy < 4 && iter < maxIter) {
                const tmp = zx * zx - zy * zy + re;
                zy = 2 * zx * zy + im;
                zx = tmp;
                iter++;
            }

            let t = iter / maxIter;
            t = Math.pow(t, 1.75);
            const brightness = Math.min(255, t * 255);
            
            const i = (y * width + x) * 4;
            data[i] = brightness * 0.3;
            data[i + 1] = brightness;
            data[i + 2] = brightness * 0.3;
            data[i + 3] = 255;
        }
    }

    (self as DedicatedWorkerGlobalScope).postMessage(
        { buffer: data.buffer, startY, frameId },
        [data.buffer]
    );
}
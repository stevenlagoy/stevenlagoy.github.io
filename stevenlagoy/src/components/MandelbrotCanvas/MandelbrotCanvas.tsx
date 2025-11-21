import { useEffect, useRef, useState } from "react";
// import styles from "./MandelbrotCanvas.module.scss";

const MandelbrotWorker = new URL("@/workers/MandelbrotWorker.ts", import.meta.url);

export default function MandelbrotCanvas() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [view, setView] = useState({ cx: -0.75, cy: 0, scale: 3.5 });
    const [maxIter, setMaxIter] = useState(35);
    const workersRef = useRef<Worker[]>([]);
    const imageDataRef = useRef<ImageData | null>(null);
    const pendingWorkers = useRef<number>(0);
    const stripeBuffers = useRef<Uint8ClampedArray[]>([]);
    const frameIdRef = useRef(0);
    const rafRef = useRef<number | null>(null);

    const NUM_WORKERS = navigator.hardwareConcurrency || 4;

    // const render = (canvas: HTMLCanvasElement, cx: number, cy: number, scale: number, maxIter: number) => {
    //     const ctx = canvas.getContext("2d");
    //     if (!ctx) return;
    //     const width = canvas.width = canvas.clientWidth;
    //     const height = canvas.height = canvas.clientHeight;
    //     const image = ctx.createImageData(width, height);
    //     const data = image.data;

    //     const aspect = width / height;
    //     const re0 = cx - scale / 2;
    //     const im0 = cy - (scale / aspect) / 2;
    //     const reStep = scale / width;
    //     const imStep = (scale / aspect) / height;
    //     let idx = 0;

    //     for (let y = 0; y < height; y++) {
    //         const im = im0 + y * imStep;
    //         for (let x = 0; x < width; x++) {
    //             const re = re0 + x * reStep;
    //             let zr = 0, zi = 0, zr2 = 0, zi2 = 0, iter = 0;
    //             while (iter < maxIter && zr2 + zi2 <= 4) {
    //                 zi = 2 * zr * zi + im;
    //                 zr = zr2 - zi2 + re;
    //                 zr2 = zr * zr;
    //                 zi2 = zi * zi;
    //                 iter++;
    //             }
    //             let norm = iter;
    //             if (iter < maxIter) {
    //                 const mod = Math.sqrt(zr2 + zi2);
    //                 norm = iter + 1 - Math.log(Math.log(mod)) / Math.log(2);
    //             }
    //             const hue = 360 * (0.95 + 20 * norm / maxIter) % 360;
    //             const sat = 0.9, val = iter === maxIter ? 0 : 1 - Math.exp(-0.02 * norm);
    //             const c = val * sat;
    //             const x2 = c * (1 - Math.abs(((hue / 60) % 2) - 1));
    //             const m = val - c;
    //             let r = 0, g = 0, b = 0;
    //             if (hue < 60) {
    //                 r = c; g = x2 * 10; b = 0;
    //             }
    //             else if (hue < 120) {
    //                 r = 0; g = c * 10; b = x2;
    //             }
    //             else if (hue < 180) {
    //                 r = 0; g = x2 * 10; b = c;
    //             }
    //             else if (hue < 240) {
    //                 r = 0; g = x2 * 10; b = c;
    //             }
    //             else if (hue < 300) {
    //                 r = x2; g = 0 * 10; b = c;
    //             }
    //             else {
    //                 r = c; g = 0 * 10; b = x2;
    //             }
    //             data[idx++] = (r + m) * 255;
    //             data[idx++] = (g + m) * 255;
    //             data[idx++] = (b + m) * 255;
    //             data[idx++] = 255;
    //         }
    //     }
    //     ctx.putImageData(image, 0, 0);
    // };

    useEffect(() => {
        // Create workers
        workersRef.current = Array.from({ length: NUM_WORKERS }, () => new Worker(MandelbrotWorker, { type: "module" }));
        const canvas = canvasRef.current;
        if (!canvas) return;
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;

        // Initialize ImageData buffer
        imageDataRef.current = new ImageData(canvas.width, canvas.height);
        
        workersRef.current.forEach((worker) => {
            worker.onmessage = (e: MessageEvent) => {
                const { buffer, startY, frameId } = e.data;
                if (frameId !== frameIdRef.current) return; // ignore old frames
                stripeBuffers.current[startY] = new Uint8ClampedArray(buffer);
                pendingWorkers.current--;

                if (stripeBuffers.current.length) {
                    const ctx = canvasRef.current?.getContext("2d");
                    if (!ctx) return;
                    Object.entries(stripeBuffers.current).forEach(([start, buf]) => {
                        const copiedBuffer = new Uint8ClampedArray(buf); // Copy to a new Uint8ClampedArray
                        ctx.putImageData(new ImageData(copiedBuffer, canvasRef.current!.width, copiedBuffer.length / (canvasRef.current!.width * 4)), 0, Number(start));
                    });
                }
            };
        });

        return () => {
            workersRef.current.forEach(w => w.terminate());
        };
    }, [NUM_WORKERS]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const width = canvas.width;
        const height = canvas.height;
        
        const currentFrame = ++frameIdRef.current;
        const stripeHeight = Math.ceil(height / NUM_WORKERS);
        pendingWorkers.current = NUM_WORKERS;
        stripeBuffers.current = [];

        const aspect = width / height;
        const re0 = view.cx - view.scale / 2;
        const im0 = view.cy - (view.scale / aspect) / 2;
        const reStep = view.scale / width;
        const imStep = (view.scale / aspect) / height;

        workersRef.current.forEach((worker, i) => {
            const startY = i * stripeHeight;
            const h = Math.min(stripeHeight, height - startY);
            worker.postMessage({
                width,
                height: h,
                startY,
                re0,
                im0: im0 + startY * imStep,
                reStep,
                imStep,
                maxIter,
                frameId: currentFrame
            });
        });
    }, [NUM_WORKERS, view, maxIter]);

    useEffect(() => {
        const baseIter = 35;
        const zoomFactor = (baseIter / 10) / view.scale;
        const exponent = 0.3;
        const adjustedIter = Math.floor(baseIter * Math.pow(zoomFactor, exponent));
        setMaxIter(adjustedIter);
    }, [view.scale]);

    const updateView = (newView: typeof view) => {
        // cancel scheduled frames
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        // schedule update for next frame
        rafRef.current = requestAnimationFrame(() => {
            setView(newView);

            const canvas = canvasRef.current;
            if (!canvas) return;
            const width = canvas.width;
            const height = canvas.height;
            
            const currentFrame = ++frameIdRef.current;
            const stripeHeight = Math.ceil(height / NUM_WORKERS);
            pendingWorkers.current = NUM_WORKERS;
            stripeBuffers.current = [];

            const aspect = width / height;
            const re0 = newView.cx - newView.scale / 2;
            const im0 = newView.cy - (newView.scale / aspect) / 2;
            const reStep = newView.scale / width;
            const imStep = (newView.scale / aspect) / height;

            workersRef.current.forEach((worker, i) => {
                const startY = i * stripeHeight;
                const h = Math.min(stripeHeight, height - startY);
                worker.postMessage({
                    width,
                    height: h,
                    startY,
                    re0,
                    im0: im0 + startY * imStep,
                    reStep,
                    imStep,
                    maxIter,
                    frameId: currentFrame
                });
            });
        });
    };

    const handleWheel = (e: React.WheelEvent) => {
        // e.preventDefault();
        const factor = e.deltaY > 0 ? 1.12 : 0.88;
        setView(v => ({ ...v, scale: v.scale * factor }));
    };

    let dragStart: {x: number, y: number, cx: number, cy: number} | null = null;
    const handleMouseDown = (e: React.MouseEvent) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        dragStart = { x: e.clientX, y: e.clientY, cx: view.cx, cy: view.cy };

        const move = (ev: MouseEvent) => {
            if (!dragStart) return;
            const dx = ev.clientX - dragStart.x;
            const dy = ev.clientY - dragStart.y;
            const newView = {
                ...view,
                cx: dragStart!.cx - dx * (view.scale / canvas.clientWidth),
                cy: dragStart!.cy - dy * (view.scale / canvas.clientHeight),
                scale: view.scale
            };
            updateView(newView); // throttled update
        };
        const up = () => {
            dragStart = null;
            window.removeEventListener("mousemove", move);
            window.removeEventListener("mouseup", up);
            updateView(view);
        };
        window.addEventListener("mousemove", move);
        window.addEventListener("mouseup", up);
    };

    return (
        <div style={{ width: "100vw", height: "100vh", background: "#111", color: "#ccc" }}>
            <canvas
                ref={canvasRef}
                onWheel={handleWheel}
                onMouseDown={handleMouseDown}
                style={{ width: "100%", height: "100%", display: "block", cursor: "grab" }}
            />
            {/* <div style={{ position: "fixed", top: 8, left: 8, background: "rgba(0,0,0,0.4)", padding: "6px", borderRadius: "6px" }}>
                <label>
                    Iterations: {" "}
                    <input
                        type="number"
                        value={maxIter}
                        onChange={e => setMaxIter(Number(e.target.value))}
                        style={{ width: "70px" }}
                    />
                </label>
            </div> */}
        </div>
    );
}
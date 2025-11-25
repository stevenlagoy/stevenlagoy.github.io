import { useCallback, useEffect, useRef, useState } from "react";
// import styles from "./MandelbrotCanvas.module.scss";

import ScrollBubble from "@components/ScrollBubble";

const MandelbrotWorker = new URL("@/workers/MandelbrotWorker", import.meta.url);

export default function MandelbrotCanvas() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [view, setView] = useState({ cx: -0.75, cy: 0, scale: 3.5 });
    const [maxIter, setMaxIter] = useState(35);
    const workersRef = useRef<Worker[]>([]);
    const imageDataRef = useRef<ImageData | null>(null);
    const pendingWorkers = useRef<number>(0);
    const stripeBuffers = useRef<Uint8ClampedArray[]>([]);
    const frameIdRef = useRef(0);
    const isVisible = useRef(true);

    const NUM_WORKERS = navigator.hardwareConcurrency || 4;

    useEffect(() => {
        // Create workers
        workersRef.current = Array.from({ length: NUM_WORKERS }, () => new Worker(MandelbrotWorker, { type: "module" }));
        const canvas = canvasRef.current;
        if (!canvas) return;
        canvas.width = canvas.clientWidth * 0.75;
        canvas.height = canvas.clientHeight * 0.75;

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

    const updateView = useCallback((newView: typeof view) => {
        
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
    }, [NUM_WORKERS, maxIter]);

    const globalCenter = { cx: -1, cy: 0, scale: 3.5 };
    useEffect(() => {
        let animFrame: number;
        let lastTime = performance.now();
        let t = 0;
        let phase: "zoomOut" | "zoomIn" = "zoomIn";

        const cycleDuration = 30_000; // total time for in+out
        const halfCycle = cycleDuration / 2;

        const baseScale = 3.5; // zoomed-out view
        const minScale = 0.05;  // deepest zoom

        const pickInterestingTarget = () => {
            const candidates = 500;
            const maxTestIter = 100;
            let best = { cx: -0.75, cy: 0, score: -Infinity };

            for (let i = 0; i < candidates; i++) {
                const cx = -4 + Math.random() * 8;
                const cy = -2 + Math.random() * 4;

                let x = 0, y = 0, iter = 0;
                while (x*x + y*y <= 4 && iter < maxTestIter) {
                    const xt = x*x - y*y + cx;
                    y = 2*x*y + cy;
                    x = xt;
                    iter++;
                }

                const score = iter / maxTestIter;
                const interestingness = score * (1 - score); // peaks near 0.5
                if (interestingness > best.score) {
                    best = { cx, cy, score: interestingness };
                }
            }

            return { cx: best.cx, cy: best.cy };
        };

        let target = pickInterestingTarget();
        let startView = { ...globalCenter }; // starting view for interpolation

        const minFrameMS = 60;
        let lastRender = 0;

        const animate = (time: number) => {
            animFrame = requestAnimationFrame(animate);

            if (!isVisible.current) return;

            // Only render when enough time passed
            if (time - lastRender < minFrameMS) return;
            lastRender = time;

            const dt = time - lastTime;
            lastTime = time;

            t += dt / halfCycle;

            if (t >= 1) {
                t = 0;
                if (phase === "zoomOut") {
                    // Start zooming in
                    phase = "zoomIn";
                    target = pickInterestingTarget();
                    startView = { ...globalCenter };
                }
                else {
                    // Start zooming out
                    phase = "zoomOut";
                    startView = { ...target, scale: 0 };
                    target = pickInterestingTarget();
                }
            }

            // smoothstep
            const ease = t * t * (3 - 2 * t);

            let scale, cx, cy;

            if (phase === "zoomOut") {
                scale = minScale + (baseScale - minScale) * ease;
                cx = target.cx + (globalCenter.cx - target.cx) * ease;
                cy = target.cy + (globalCenter.cy - target.cy) * ease;
            } else {
                scale = baseScale * Math.pow(minScale / baseScale, ease);
                cx = startView.cx + (target.cx - startView.cx) * ease;
                cy = startView.cy + (target.cy - startView.cy) * ease;
            }

            updateView({ cx, cy, scale });
        };

        animFrame = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(animFrame);
    }, []);

    useEffect(() => {
        const handleVisibility = () => {
            isVisible.current = window.scrollY <= 1200;
        }
        window.addEventListener("scroll", handleVisibility);
        return () => window.removeEventListener("scroll", handleVisibility);
    });
    
    return (
        <div style={{ width: "100vw", height: "100vh", background: "#111", color: "#ccc" }}>
            <canvas
                ref={canvasRef}
                style={{ width: "100%", height: "100%", display: "block", cursor: "default" }}
            />
            <ScrollBubble />
        </div>
    );
}
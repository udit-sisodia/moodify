import { useEffect, useRef, useState } from "react";
import { init, classifyEmotion } from "../utils/util";

export default function FaceExpression() {
    const videoRef = useRef(null)
    const landmarkerRef = useRef(null)
    const streamRef = useRef(null)
    const rafRef = useRef(null);

    const [expression, setExpression] = useState("");
    const [started, setStarted] = useState(false);

    const startDetection = async () => {
        setStarted(true);
        setExpression("Initializing...");

        await init({ landmarkerRef, videoRef, streamRef });

        setExpression("Neutral 😐");

        const loop = () => {
            if (landmarkerRef.current && videoRef.current?.readyState >= 2) {
                const results = landmarkerRef.current.detectForVideo(
                    videoRef.current,
                    performance.now()
                );
                if (results.faceBlendshapes?.[0]) {
                    setExpression(classifyEmotion(results.faceBlendshapes[0].categories));
                }
            }
            rafRef.current = requestAnimationFrame(loop);
        };

        loop();
    };

    useEffect(() => {
        return () => {
            cancelAnimationFrame(rafRef.current);
            landmarkerRef.current?.close();
            streamRef.current?.getTracks().forEach((t) => t.stop());
        };
    }, []);

    return (
        <div style={{ textAlign: "center", padding: 20 }}>
            <video
                ref={videoRef}
                style={{ width: 400, borderRadius: 12, display: started ? "block" : "none", margin: "0 auto" }}
                muted
                playsInline
            />

            {expression && <h2 style={{ marginTop: 12, fontSize: 28 }}>{expression}</h2>}

            {!started && (
                <button
                    onClick={startDetection}
                    style={{ padding: "10px 24px", fontSize: 16, cursor: "pointer", marginTop: 12 }}
                >
                    Start Detection
                </button>
            )}
        </div>
    );
}
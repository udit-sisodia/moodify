import { useEffect, useRef, useState, useCallback } from "react";

function classifyEmotion(bs) {
  const g = (k) => parseFloat(bs[k] || 0);
  const smile = (g("mouthSmileLeft") + g("mouthSmileRight")) / 2;
  const frown = (g("mouthFrownLeft") + g("mouthFrownRight")) / 2;
  const browDown = (g("browDownLeft") + g("browDownRight")) / 2;
  const jaw = g("jawOpen");

  if (smile > 0.45) return "😊 Happy";
  if (frown > 0.3 || browDown > 0.4) return "😢 Sad";
  if (jaw > 0.5) return "😮 Surprised";
  return "😐 Neutral";
}

export default function FaceExpression() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const landmarkerRef = useRef(null);
  const rafRef = useRef(null);
  const [emotion, setEmotion] = useState("😐 Neutral");
  const [running, setRunning] = useState(false);

  const detect = useCallback(() => {
    const video = videoRef.current;
    const lm = landmarkerRef.current;
    if (lm && video && video.readyState >= 2) {
      const results = lm.detectForVideo(video, performance.now());
      if (results.faceBlendshapes?.length > 0) {
        const map = {};
        results.faceBlendshapes[0].categories.forEach(({ categoryName, score }) => {
          map[categoryName] = score;
        });
        setEmotion(classifyEmotion(map));
      }
    }
    rafRef.current = requestAnimationFrame(detect);
  }, []);

  const start = async () => {
    const { FaceLandmarker, FilesetResolver } = await import("@mediapipe/tasks-vision");
    const filesetResolver = await FilesetResolver.forVisionTasks(
      "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
    );
    landmarkerRef.current = await FaceLandmarker.createFromOptions(filesetResolver, {
      baseOptions: {
        modelAssetPath:
          "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
        delegate: "GPU",
      },
      outputFaceBlendshapes: true,
      runningMode: "VIDEO",
      numFaces: 1,
    });
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    videoRef.current.srcObject = stream;
    videoRef.current.play();
    setRunning(true);
    rafRef.current = requestAnimationFrame(detect);
  };

  useEffect(() => () => cancelAnimationFrame(rafRef.current), []);

  return (
    <div style={{ textAlign: "center", padding: 20 }}>
      <video
        ref={videoRef}
        width={480}
        height={360}
        muted
        playsInline
        style={{ display: running ? "block" : "none", margin: "0 auto", borderRadius: 8 }}
      />
      <canvas ref={canvasRef} style={{ display: "none" }} />

      {!running && (
        <button onClick={start} style={{ padding: "10px 24px", fontSize: 16, cursor: "pointer" }}>
          Start Camera
        </button>
      )}

      {running && (
        <h2 style={{ marginTop: 12, fontSize: 28 }}>{emotion}</h2>
      )}
    </div>
  );
}
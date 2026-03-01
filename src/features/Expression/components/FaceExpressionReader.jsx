import { useEffect, useRef, useState } from "react";

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
  const landmarkerRef = useRef(null);
  const [emotion, setEmotion] = useState("Initializing...");

  useEffect(() => {
    async function init() {
      const { FaceLandmarker, FilesetResolver } = await import("@mediapipe/tasks-vision");

      const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
      );

      landmarkerRef.current = await FaceLandmarker.createFromOptions(vision, {
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
      await videoRef.current.play();
      setEmotion("😐 Neutral");

      function detect() {
        const results = landmarkerRef.current.detectForVideo(videoRef.current, performance.now());
        if (results.faceBlendshapes?.[0]) {
          const map = {};
          results.faceBlendshapes[0].categories.forEach(({ categoryName, score }) => {
            map[categoryName] = score;
          });
          setEmotion(classifyEmotion(map));
        }
        requestAnimationFrame(detect);
      }

      detect();
    }

    init();
  }, []);

  return (
    <div style={{ textAlign: "center", padding: 20 }}>
      <video
        ref={videoRef}
        width={480}
        height={360}
        muted
        playsInline
        style={{ display: "block", margin: "0 auto", borderRadius: 8 }}
      />
      <h2 style={{ marginTop: 12, fontSize: 28 }}>{emotion}</h2>
    </div>
  );
}
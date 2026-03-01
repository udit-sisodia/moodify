import { FaceLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";

export const init = async ({ landmarkerRef, videoRef, streamRef }) => {
    const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
    );

    landmarkerRef.current = await FaceLandmarker.createFromOptions(vision, {
        baseOptions: {
            modelAssetPath:
                "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
        },
        outputFaceBlendshapes: true,
        runningMode: "VIDEO",
        numFaces: 1,
    });

    streamRef.current = await navigator.mediaDevices.getUserMedia({ video: true });
    videoRef.current.srcObject = streamRef.current;
    await videoRef.current.play();
};

export const classifyEmotion = (blendshapes) => {
    const get = (name) => blendshapes.find((b) => b.categoryName === name)?.score || 0;

    const smile      = (get("mouthSmileLeft") + get("mouthSmileRight")) / 2;
    const frown      = (get("mouthFrownLeft") + get("mouthFrownRight")) / 2;
    const browDown   = (get("browDownLeft") + get("browDownRight")) / 2;
    const mouthClose = get("mouthClose");
    const pucker     = get("mouthPucker");
    const jaw        = get("jawOpen");
    const browUp     = get("browInnerUp");

    const sadScore = frown * 2 + browDown + pucker + mouthClose;

    if (smile > 0.45)               return "Happy 😄";
    if (sadScore > 0.5)             return "Sad 😢";
    if (jaw > 0.3 && browUp > 0.2)  return "Surprised 😲";
    return "Neutral 😐";
};
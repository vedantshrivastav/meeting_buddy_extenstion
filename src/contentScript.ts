let mediaRecorder: MediaRecorder | null = null;
let isRecording = false;
let socket: WebSocket | null = null;

chrome.runtime.onMessage.addListener(async (msg) => {
  if (msg.action === "START_RECORDING" && !isRecording) {
    try {
      isRecording = true;

      // 1️⃣ Open WebSocket connection to backend
      socket = new WebSocket("ws://localhost:4000");

      socket.onopen = async () => {
        console.log("Meeting Buddy: WebSocket connected");

        // 2️⃣ Capture system/tab audio (Google Meet)
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: true
        });

        // 3️⃣ Capture microphone audio
        const micStream = await navigator.mediaDevices.getUserMedia({
          audio: true
        });

        // 4️⃣ Merge audio tracks
        const combinedStream = new MediaStream([
          ...screenStream.getAudioTracks(),
          ...micStream.getAudioTracks()
        ]);

        // 5️⃣ Start MediaRecorder
        mediaRecorder = new MediaRecorder(combinedStream, {
          mimeType: "audio/webm"
        });

        mediaRecorder.ondataavailable = (event) => {
          if (
            event.data.size > 0 &&
            socket?.readyState === WebSocket.OPEN
          ) {
            socket.send(event.data);
          }
        };

        mediaRecorder.start(5000); // send chunk every 5s
        console.log("Meeting Buddy: Recording started");
      };

      socket.onerror = (err) => {
        console.error("Meeting Buddy: WebSocket error", err);
        isRecording = false;
      };

    } catch (err) {
      console.error("Meeting Buddy error:", err);
      isRecording = false;
    }
  }

  if (msg.action === "STOP_RECORDING" && isRecording) {
    mediaRecorder?.stop();
    socket?.close();

    mediaRecorder = null;
    socket = null;
    isRecording = false;

    console.log("Meeting Buddy: Recording stopped");
  }
});

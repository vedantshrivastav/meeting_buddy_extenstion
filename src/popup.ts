document.getElementById("startBtn")?.addEventListener("click", () => {
  console.log("Start button clicked");
  chrome.runtime.sendMessage({ action: "START_RECORDING" });
});

document.getElementById("stopBtn")?.addEventListener("click", () => {
  console.log("Stop button clicked");
  chrome.runtime.sendMessage({ action: "STOP_RECORDING" });
});

console.log('updated inside the background.ts');
chrome.runtime.onMessage.addListener((msg) => {
  if (msg.action === "START_RECORDING") {
    chrome.tabs.query({ url: "*://meet.google.com/*" }, (tabs) => {
      if (!tabs.length) {
        console.warn("Meeting Buddy: No Google Meet tab found");
        return;
      }

      chrome.tabs.sendMessage(tabs[0].id!, msg);
    });
  }
 else if (msg.action === "STOP_RECORDING") {
    chrome.tabs.query({ url: "*://meet.google.com/*" }, (tabs) => {
      if (!tabs.length) {
        console.warn("Meeting Buddy: No Google Meet tab found");
        return;
      }

      chrome.tabs.sendMessage(tabs[0].id!, msg);
    });
  }
  
});
console.log('background.ts ended');

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.action === "navigateBack") {
        // Logic to handle after navigation can be placed here or triggered via another message
        console.log("Handled navigation back. Ready to re-trigger logic.");
    }
});
let intervalId = null;
let tabId = null;

function scrollDown(speed) {
    window.stopIntervalId = setInterval(() => {
        const distance = speed * (1000 / 60);
        document.documentElement.style.scrollBehavior = 'smooth';
        window.scrollBy({
            top: distance,
            behavior: 'smooth'
        });
    }, 1000);
}

function stopScroll() {
    clearInterval(intervalId);
    chrome.scripting.executeScript({
        target: { tabId: tabId },
        function: () => {
            clearInterval(window.stopIntervalId);
        }
    });
    const stopButton = document.getElementById('stop');
    stopButton.style.display = 'none';
    const startButton = document.getElementById('start');
    startButton.style.display = 'inline';
}

document.addEventListener('DOMContentLoaded', () => {
    const startButton = document.getElementById('start');
    startButton.addEventListener('click', () => {
        const scrollSpeedInput = document.getElementById('scrollSpeed');
        const speed = parseInt(scrollSpeedInput.value);
        if (!isNaN(speed)) {
            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                tabId = tabs[0].id;
                chrome.scripting.executeScript({
                    target: { tabId: tabId },
                    function: scrollDown,
                    args: [speed]
                });
            });
            startButton.style.display = 'none';
            const stopButton = document.getElementById('stop');
            stopButton.style.display = 'inline';
        }
    });

    const stopButton = document.getElementById('stop');
    stopButton.addEventListener('click', stopScroll);
});

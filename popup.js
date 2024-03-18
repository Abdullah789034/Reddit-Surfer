let intervalId = null;
let tabId = null;



function clickRandomPostAndWait(minWaitTime, maxWaitTime, speed) {
    console.log('in func');

    //Clicking Post
    const posts = document.querySelectorAll('a[slot="full-post-link"]')
    console.log(posts);
    if (posts.length > 0) {
        const randomPostIndex = Math.floor(Math.random() * posts.length);
        posts[randomPostIndex].click();

        //Stop Scroll

    } else {
        console.error('No posts found with the specified selector.');
    }

    const waitTime = Math.random() * (maxWaitTime - minWaitTime) + minWaitTime;
    console.log(waitTime);
    setTimeout(() => {

        const redditLogo = document.querySelector('a[aria-label="Home"]');
        if (redditLogo) {
            redditLogo.click();
        } else {
            // If the logo is not found, simulate clicking the browser's back button
            window.history.back();
        }

        scrollDown(speed);
    }, waitTime * 1000);
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

function scrollDown(speed) {
    console.log('scrolling')
    window.stopIntervalId = setInterval(() => {
        const distance = speed * (1000 / 60);
        document.documentElement.style.scrollBehavior = 'smooth';
        window.scrollBy({
            top: distance,
            behavior: 'smooth'
        });
    }, 1000);
}


document.addEventListener('DOMContentLoaded', () => {
    const startButton = document.getElementById('start');
    startButton.addEventListener('click', () => {
        const scrollSpeedInput = document.getElementById('scrollSpeed');
        const minWaitTimeInput = document.getElementById('minWaitTime');
        const maxWaitTimeInput = document.getElementById('maxWaitTime');

        const speed = parseInt(scrollSpeedInput.value);
        const minWaitTime = parseInt(minWaitTimeInput.value);
        const maxWaitTime = parseInt(maxWaitTimeInput.value);
        if (!isNaN(speed)) {
            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                tabId = tabs[0].id;
                chrome.scripting.executeScript({
                    target: { tabId: tabId },
                    function: scrollDown,
                    args: [speed]
                });
                const random = Math.floor(Math.random() * 10) + 1;
                setTimeout(() => {
                    chrome.scripting.executeScript({
                        target: { tabId: tabId },
                        function: clickRandomPostAndWait,
                        args: [minWaitTime, maxWaitTime, speed]
                    });
                }, 1000 * random)


            });
            startButton.style.display = 'none';
            const stopButton = document.getElementById('stop');
            stopButton.style.display = 'inline';
        }
    });

    const stopButton = document.getElementById('stop');
    stopButton.addEventListener('click', stopScroll);
});

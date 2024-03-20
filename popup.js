let intervalId = null;
let tabId = null;
let stopIntervalId = null; // Added this line
let count = false;

const startButton = document.getElementById('start');
if (startButton.innerText === 'Start') {
    startButton.addEventListener('click', () => {
        clearInterval(intervalId);
        clearInterval(stopIntervalId); // Changed this line
        startButton.disabled = true
        scrollAndDo();
    });
}
else if (startButton.innerText === 'Stop') {
    startButton.addEventListener('click', () => {
        stopScroll();
    })
}

function scrollAndDo() {
    clearInterval(intervalId);
    clearInterval(stopIntervalId); // Changed this line
    const scrollSpeedInput = document.getElementById('scrollSpeed');
    const minWaitTimeInput = document.getElementById('minWaitTime');
    const maxWaitTimeInput = document.getElementById('maxWaitTime');


    const speed = parseInt(scrollSpeedInput.value);
    const minWaitTime = parseInt(minWaitTimeInput.value);
    const maxWaitTime = parseInt(maxWaitTimeInput.value);
    const breaks = document.getElementById('randomBreaks');
    const checks = breaks.checked;
    if (!isNaN(speed)) {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            tabId = tabs[0].id;
            chrome.scripting.executeScript({
                target: { tabId: tabId },
                function: scrollDown,
                args: [speed, checks]
            });
            const random = Math.floor(Math.random() * 10) + 3;
            console.log(random)
            setTimeout(() => {
                chrome.scripting.executeScript({
                    target: { tabId: tabId },
                    function: clickRandomPostAndWait,
                    args: [minWaitTime, maxWaitTime, speed]
                });
            }, 1000 * random);
        });
    }
}

async function clickRandomPostAndWait(minWaitTime, maxWaitTime, speed) {

    console.log('in func');

    //Clicking Post
    const posts = document.querySelectorAll('a[slot="full-post-link"]');
    console.log(posts);
    if (posts.length > 0) {
        const randomPostIndex = Math.floor(Math.random() * posts.length);
        posts[randomPostIndex].click();

        //Stop Scroll
        clearInterval(stopIntervalId); // Changed this line
    } else {
        console.error('No posts found with the specified selector.');
    }

    const waitTime = Math.random() * (maxWaitTime - minWaitTime) + minWaitTime;
    console.log(waitTime);
    setTimeout(async () => {
        const redditLogo = document.querySelector('a[id="reddit-logo"]');
        // if (redditLogo) {
        //     await redditLogo.click();
        // } else {
        window.history.back();
        //}
    }, waitTime * 1000);

}

function stopScroll() {
    clearInterval(intervalId);
    chrome.scripting.executeScript({
        target: { tabId: tabId },
        function: () => {
            clearInterval(stopIntervalId);
        }
    });
    const startButton = document.getElementById('start');
    startButton.disabled = true;
}

function generateRandom() {
    console.log('func');
    return Math.floor(Math.random() * 10) + 5;
}

const rn = generateRandom();

function scrollDown(speed, checks) {
    console.log('scrolling');
    console.log(checks)
    if (checks) {
        const rnd = Math.floor(Math.random() * 10) + 5;
        stopIntervalId = setInterval(() => { // Changed this line
            setTimeout(() => {
                const distance = speed * (1000 / 60);
                document.documentElement.style.scrollBehavior = 'smooth';
                window.scrollBy({
                    top: distance,
                    behavior: 'smooth'
                });
            }, rnd * 1000)

        }, 1000);
    }
    else {
        stopIntervalId = setInterval(() => { // Changed this line
            const distance = speed * (1000 / 60);
            document.documentElement.style.scrollBehavior = 'smooth';
            window.scrollBy({
                top: distance,
                behavior: 'smooth'
            });
        }, 1000);
    }

}

function checkStop() {
    const bt = document.getElementById('start')
    if (bt.innerText == 'Stop') {
        return true;
    }
}

const breaks = document.getElementById('randomBreaks');
const checks = breaks.checked;
console.log(checks)
if (checks) {
    const r = generateRandom(10, 5);
    setInterval(() => {
        setTimeout(() => {
            clearInterval(intervalId);
            clearInterval(stopIntervalId);
            count = true;
            console.log(count);
            if (count) {
                chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                    taburl = tabs[0].url;
                    if (taburl == "https://www.reddit.com/") {
                        scrollAndDo();
                    }
                });
            }
        }, 1000)
    }, 15000);
}
else {
    setInterval(() => {
        clearInterval(intervalId);
        clearInterval(stopIntervalId);
        count = true;
        console.log(count);
        if (count) {
            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                taburl = tabs[0].url;
                if (taburl == "https://www.reddit.com/") {
                    scrollAndDo();
                }
            });
        }
    }, 12000);
}






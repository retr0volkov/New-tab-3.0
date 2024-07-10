
function handleIdleChanged(state)
{
    if (state == "idle")
        makeInvisible()
    else
        makeVisible()
}

//
var elems = ["clock", "left_pannel", "perf_monitor", "pinned", "trains", "weather", "gkeep", "taskbar"]

//
function makeInvisible()
{
    elems.forEach(element => {
        // document.getElementById(element).classList.add("transparent");
        console.log(element);
    });
}

//
function makeVisible()
{
    elems.forEach(element => {
        document.getElementById(element).classList.remove("transparent");
    });
}

chrome.idle.setDetectionInterval(15);
chrome.idle.onStateChanged.addListener(handleIdleChanged)
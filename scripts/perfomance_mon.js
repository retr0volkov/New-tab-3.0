// returns single progressbar
async function getSingleProgress() {
    let response = await fetch("./components/single_progress.html");
    let text = await response.text();
    return text;
}

// returns triple progressbar
async function getTripleProgress() {
    let response = await fetch("./components/triple_progress.html");
    let text = await response.text();
    return text;
}

// adds single progressbars
async function addSingles()
{
    var element1 = document.createElement("template");
    element1.innerHTML = await getSingleProgress();
    element1.content.children[0].children[0].id = "memory";
    document.getElementById("perf_monitor").appendChild(element1.content);

    var element2 = document.createElement("template");
    element2.innerHTML = await getSingleProgress();
    element2.content.children[0].children[0].id = "battery";
    element2.content.children[0].children[0].classList.add("theme-red");
    document.getElementById("perf_monitor").appendChild(element2.content);

}

// adds triple progressbars for every cpu thread
async function addTriples()
{
    for (var i = 0; i < 12; i++)
    {
        var element = document.createElement("template");
        element.innerHTML = await getTripleProgress();
        element.content.children[0].children[0].id = "cpu" + i + "idle";
        element.content.children[0].children[1].id = "cpu" + i + "kernel";
        element.content.children[0].children[2].id = "cpu" + i + "user";
        document.getElementById("perf_monitor").appendChild(element.content);
    }
}

// arrays to keep defferential info about cpu
var oldIDLE = [], oldKernel = [], oldTotal = [], oldUser = [];
var deltaIDLE = [], deltaKernel = [], deltaTotal = [], deltaUser = [];

// function to fill cpu data to progressbars every 200 ms
function getCPU(result)
{
    var i = 0;
    result.processors.forEach(processor => {
        deltaIDLE[i] = processor.usage.idle - oldIDLE[i];
        deltaKernel[i] = processor.usage.kernel - oldKernel[i];
        deltaTotal[i] = processor.usage.total - oldTotal[i];
        deltaUser[i] = processor.usage.user - oldUser[i];
    
        oldIDLE[i] = processor.usage.idle;
        oldKernel[i] = processor.usage.kernel;
        oldTotal[i] = processor.usage.total;
        oldUser[i] = processor.usage.user;

        document.getElementById("cpu" + i + "idle").style.width = deltaIDLE[i] / deltaTotal[i] * 100 + "%";
        document.getElementById("cpu" + i + "kernel").style.width = deltaKernel[i] / deltaTotal[i] * 100 + "%";
        document.getElementById("cpu" + i + "user").style.width = deltaUser[i] / deltaTotal[i] * 100 + "%";
        document.getElementById("cpu" + i + "idle").textContent = "#" + i + ".idle." + ~~(deltaIDLE[i] / deltaTotal[i] * 100);
        document.getElementById("cpu" + i + "kernel").textContent = "#" + i + ".kernel." + ~~(deltaKernel[i] / deltaTotal[i] * 100);
        document.getElementById("cpu" + i + "user").textContent = "#" + i + ".user." + ~~(deltaUser[i] / deltaTotal[i] * 100);
        i++;
    });
}

// function to fill memory progressbar every second
function getMem(result)
{
    document.getElementById("memory").style.width = (result.capacity - result.availableCapacity) / result.capacity * 100 + "%";
    document.getElementById("memory").textContent = "mem." + ((result.capacity - result.availableCapacity) / 1024 / 1024 / 1024).toFixed(1) + "/" + (result.capacity / 1024 / 1024 / 1024).toFixed(1);
}

// function to fill battery progressbar every second
async function getBattery()
{
    let bat = await navigator.getBattery();
    if (bat.charging)
    {
        document.getElementById("battery").classList.remove("theme-red");
        document.getElementById("battery").classList.add("theme-green");
    }
    else
    {
        document.getElementById("battery").classList.remove("theme-green");
        document.getElementById("battery").classList.add("theme-red");
    }
    document.getElementById("battery").style.width = bat.level * 100 + "%";
    document.getElementById("battery").textContent = "bat." + bat.level * 100;
}

// initializer function - sets up elements and creates arrays with needed length
async function init()
{
    await addTriples();
    await addSingles();
    chrome.system.cpu.getInfo(result => {
        for (var i = 0; i < 12; i++) {
            //console.log(result);
            oldIDLE.push(result.processors[i].usage.idle);
            oldKernel.push(result.processors[i].usage.kernel);
            oldTotal.push(result.processors[i].usage.total);
            oldUser.push(result.processors[i].usage.user);
            deltaIDLE.push(result.processors[i].usage.idle);
            deltaKernel.push(result.processors[i].usage.kernel);
            deltaTotal.push(result.processors[i].usage.total);
            deltaUser.push(result.processors[i].usage.user);
        }
    })
}

// async function to initialize execution in order to await init()
async function perf_mon()
{
    await init();
    chrome.system.cpu.getInfo(getCPU)
    chrome.system.memory.getInfo(getMem)
    getBattery()
    setInterval(() => { chrome.system.cpu.getInfo(getCPU) }, 400);
    setInterval(() => { chrome.system.memory.getInfo(getMem) }, 1000);
    setInterval(() => getBattery(), 1000);
}

perf_mon();
//
async function getTaskbarElement()
{
    let response = await fetch("./components/taskbar_item.html");
    let text = await response.text();
    return text;
}

//
async function addTaskbarItem(tsbritem)
{
    var element = document.createElement("template");
    element.innerHTML = await getTaskbarElement();
    element.content.children[0].children[0].setAttribute("target", tsbritem.id);
    element.content.children[0].children[0].addEventListener("click", handleCheckChanged);
    element.content.children[0].children[2].textContent = tsbritem.icon;
    document.getElementById("taskbar").appendChild(element.content);
    document.getElementById("taskbar").children[0].children[0].checked = true;
}

//
async function handleTaskbarItems(result)
{
    result = result.tasks;
    result.forEach(addTaskbarItem);
}

//
function handleCheckChanged(e)
{
    var target = e.target;
    handleWindowChange(target.getAttribute("target"))
}

function handleWindowChange(activate)
{
    document.getElementById("pinned").classList.add("mt-[100vh]");
    document.getElementById("trains").classList.add("mt-[100vh]");
    document.getElementById("weather").classList.add("mt-[100vh]");
    document.getElementById("gkeep").classList.add("mt-[100vh]");

    document.getElementById(activate).classList.remove("mt-[100vh]");
}

chrome.storage.sync.get(["tasks"]).then(handleTaskbarItems);
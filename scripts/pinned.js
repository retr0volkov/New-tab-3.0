// returns favicon (hopefully rilghtly sized) of url if present
function faviconURL(u, s) {
    const url = new URL(chrome.runtime.getURL("/_favicon/"));
    url.searchParams.set("pageUrl", u);
    url.searchParams.set("size", s);
    return url.toString();
}

// returns pinned site element (reused bookmarkitem)
async function getPinnedElement() 
{
    let response = await fetch("./components/bookmark_item.html");
    let text = await response.text();
    return text;
}

async function getAddingElement()
{
    let response = await fetch("./components/new_pin.html");
    let text = await response.text();
    return text;
}

async function handleAdding(pinned)
{
    var element = document.createElement("template");
    element.innerHTML = await getPinnedElement();
    element.content.children[0].href = pinned.url;
    element.content.children[0].classList.remove("mb-2");
    element.content.children[0].children[0].src = faviconURL(pinned.url, "32");
    element.content.children[0].children[1].textContent = pinned.title;
    document.getElementById("pinned").appendChild(element.content);
}

async function handlePinned(result)
{
    var counter = 0;
    result = result.pinned;
    result.forEach((pin)=>{ handleAdding(pin); counter++; });
    handleAddingElement(counter);
}

async function handleAddingElement(count)
{
    if (count < 11)
    {
        var element = document.createElement("template");
        element.innerHTML = await getAddingElement();
        document.getElementById("pinned").appendChild(element.content);
    }
}

chrome.storage.sync.get(["pinned"]).then(handlePinned);
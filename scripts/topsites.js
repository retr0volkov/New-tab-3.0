// returns favicon (hopefully rilghtly sized) of url if present
function faviconURL(u, s) {
    const url = new URL(chrome.runtime.getURL("/_favicon/"));
    url.searchParams.set("pageUrl", u);
    url.searchParams.set("size", s);
    return url.toString();
}

// returns empty topSites element from components folder
async function getTopSitesElement()
{
    let response = await fetch("/components/topsites_link.html");
    let text = await response.text();
    return text;
}

// iterates result of using topsites api
function getTopSites(result)
{
    result.forEach(topSite => {
        handleTopSites(topSite);
    });
}

// handles adding elements to DOM
async function handleTopSites(topSite)
{
    var element = document.createElement("template");
    element.innerHTML = await getTopSitesElement();
    element.content.children[0].href = topSite.url;
    element.content.children[0].children[0].src = faviconURL(topSite.url, "32");
    element.content.children[0].children[1].children[0].textContent = topSite.title;
    element.content.children[0].children[1].children[1].textContent = topSite.url;
    document.getElementById("left_panel").appendChild(element.content);
}

// keeps count of initializer runs
var iters = 1;

// initializer (runs obly once)
function topSites()
{
    if (iters > 1) return;
    chrome.topSites.get(getTopSites);
    iters++;
}
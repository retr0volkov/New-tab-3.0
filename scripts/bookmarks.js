// returns favicon (hopefully rilghtly sized) of url if present
function faviconURL(u, s) {
    const url = new URL(chrome.runtime.getURL("/_favicon/"));
    url.searchParams.set("pageUrl", u);
    url.searchParams.set("size", s);
    return url.toString();
}

// returns html code for link bookmark element
async function getBookmarkElement()
{
    let response = await fetch("./components/bookmark_item.html");
    let text = await response.text();
    return text;
}

//returns html code for folder bookmark element
async function getBookmarkFolder()
{
    let response = await fetch("./components/bookmark_folder.html");
    let text = await response.text();
    return text;
}

// adds bookmark link to corresponding folder
async function addBookmark(bookmark)
{
    var element = document.createElement("template");
    element.innerHTML = await getBookmarkElement();
    element.content.children[0].href = bookmark.url;
    element.content.children[0].children[0].src = faviconURL(bookmark.url, "32");
    element.content.children[0].children[1].textContent = bookmark.title;
    document.getElementById("folder" + bookmark.parentId).appendChild(element.content);
}

// adds folder to panel
async function addFolder(folder)
{
    var element = document.createElement("template");
    element.innerHTML = await getBookmarkFolder();
    element.content.children[0].children[0].textContent = folder.title;
    element.content.children[0].id = "folder" + folder.id;
    document.getElementById("left_panel").appendChild(element.content);
}

// main recursive function
function getBookmarks(children)
{
    children.forEach(child => {
        chrome.bookmarks.get(child.id, handleBookmarks);
    });
}

// handles folders and links
async function handleBookmarks(result)
{
    if (result[0].url == undefined)
    {
        await addFolder(result[0]);
        chrome.bookmarks.getChildren(result[0].id, getBookmarks);
    }
    else 
    {
        addBookmark(result[0]);
        topSites();
    }
}

// initializer
chrome.bookmarks.getChildren("0", getBookmarks);
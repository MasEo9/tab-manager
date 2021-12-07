// get url hostname 
function getURL(tab) {
    var url = tab.url;
    var urlObj = new URL(url);
    var host = urlObj.hostname;
    return host
}

// create tabs list array
function createTabList(dict, url, tabid, grpid) {
    const arr = {};
    arr.url = url;
    arr.tabid = tabid;
    arr.grpid = grpid;
    dict.push(arr);
};

// get all current tabs open and return array
function allTabs(tabs) {
    var alltabs = [];
    for (let tab of tabs) {
        createTabList(alltabs, getURL(tab), tab.id, tab.groupId);
    }
    return alltabs;
};

// query and resolve tab promises
function queryTabs() {
    let querying = chrome.tabs.query({ currentWindow: true });
    var alltabs = querying.then(allTabs);
    var tabs = Promise.resolve(alltabs);
    return tabs;
}

// active tab grouper
chrome.tabs.onUpdated.addListener((tab, changeInfo) => {
    if (changeInfo.url) {
        // query all tabs currently open and assign to var
        const tabs = queryTabs();
        tabs.then(t => {
            // get current active tab
            chrome.tabs.query({ active: true, currentWindow: true }).then(x => {
                // filter current tabs list for match of current tab url
                const result = t.filter(t => getURL(x[0]) === t.url)
                console.log(result)
                    // if tab result list is greater then 1 group tabs
                if (result.length === 2 && result[0].grpid === -1) {
                    const tabs = [];
                    // loop to group tabs in result set
                    for (y = 0; y < result.length; y++) {
                        tabs.push(result[y].tabid)
                    }
                    // create tabs group and assign grouping name
                    chrome.tabs.group({ tabIds: tabs }, (groupId) => {
                        chrome.tabGroups.update(groupId, {
                            title: getURL(x[0])
                        });
                    })
                } else if (result.length === 1) {
                    // skip if standalone tab    
                    chrome.tabs.ungroup(x[0].id)
                } else if (x[0].groupId != result[result.length - 1].grpid) {
                    // if the tab does not match the most recent group - degroup and regroup with latest
                    chrome.tabs.ungroup(x[0].id)
                    chrome.tabs.group({ tabIds: x[0].id, groupId: result[result.length - 1].grpid })
                } else {
                    // find tab exisiting group and add
                    chrome.tabs.group({ tabIds: x[0].id, groupId: result[0].grpid })
                }
            });
        })
    }
});
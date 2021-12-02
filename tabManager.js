// get url hostname 
function getURL(tab) {
    var url = tab.url;
    var urlObj = new URL(url);
    var host = urlObj.hostname;
    return host
}

function createTabList(dict, url, tabid, grpid) {
    const arr = {};
    arr.url = url;
    arr.tabid = tabid;
    arr.grpid = grpid;
    dict.push(arr);
};

function allTabs(tabs) {
    var alltabs = [];
    for (let tab of tabs) {
        createTabList(alltabs, getURL(tab), tab.id, tab.groupId);
    }
    return alltabs;
};

function queryTabs() {
    let querying = chrome.tabs.query({ currentWindow: true });
    var alltabs = querying.then(allTabs);
    var tabs = Promise.resolve(alltabs);
    return tabs;
}

// const groupBy = (arr, prop) => {
//     return arr.reduce((groups, item) => {
//         let val = item[prop];
//         groups[val] = groups[val] || [];
//         groups[val].push(item);
//         return groups
//     }, {});
// }

// function startUpTabGrouper(list) {
//     var tabArr = Array.from(Object.entries(list))
//     for (i = 0; i < tabArr.length; i++) {
//         var tabIdObj = lstObj[i][1]
//         const tabs = [];
//         for (y = 0; y < tabIdObj.length; y++) {
//             dic.push(tabIdObj[y].tabid)
//         }
//         chrome.tabs.group({ tabIds: tabs })
//     }
// };

// function groupAll() {
//     var startingTabList = groupBy(dict, 'url');
//     startUpTabGrouper(startingTabList);
// };


chrome.tabs.onUpdated.addListener((tab, changeInfo) => {
    if (changeInfo.url) {
        var tabs = queryTabs();
        tabs.then(t => {
            chrome.tabs.query({ active: true, currentWindow: true }).then(x => {
                console.log(x)
                const result = t.filter(t => getURL(x[0]) === t.url)
                if (result.length > 1 && result[0].grpid < 0) {
                    const tabs = [];
                    for (y = 0; y < result.length; y++) {
                        tabs.push(result[y].tabid)
                    }
                    console.log(result[0])
                    chrome.tabs.group({ tabIds: tabs }, (groupId) => {
                            chrome.tabGroups.update(groupId, {
                                title: getURL(x[0])
                            });
                        })
                        // chrome.tabGroups.update(x[0].groupId, { title: 'test' })
                } else {
                    console.log('tabIds', x[0].id, 'groupId', result[0].grpid)
                    chrome.tabs.group({ tabIds: x[0].id, groupId: result[0].grpid })
                }
            });
        })
        if (tab.pinned) { return; }
    }
});

// eventually add custom grouping lists
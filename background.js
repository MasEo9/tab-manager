// get url hostname 
function getURL(tab) {
    var url = tab.url;
    var urlObj = new URL(url);
    var host = urlObj.hostname;
    return host
}

var dict = [];

function createTabList(dict, url, tabid) {
    const arr = {};
    arr.url = url;
    arr.tabid = tabid;
    dict.push(arr);
};

const groupBy = (arr, prop) => {
    return arr.reduce((groups, item) => {
        let val = item[prop];
        groups[val] = groups[val] || [];
        groups[val].push(item);
        return groups
    }, {});
}

function startUpTabGrouper(list) {
    var lstObj = Object.entries(list)
    var arr = Array.from(lstObj)
    for (i = 0; i < arr.length; i++) {
        var tabIdObj = lstObj[i][1]
        const dic = [];
        for (y = 0; y < tabIdObj.length; y++) {
            dic.push(tabIdObj[y].tabid)
            console.log('individual dic', dic, y, tabIdObj[y].tabid)
        }
        chrome.tabs.group({ tabIds: dic })
    }
};


chrome.tabs.query({ currentWindow: true }, function(tabs) {
    tabs.forEach(function(tab) {
        createTabList(dict, getURL(tab), tab.id);
    });
    var groups = groupBy(dict, 'url');
    startUpTabGrouper(groups)
});


// Array.from(lstObj).forEach(i => {
//     chrome.tab.group({ tabIds: lstObj[].tabid })
// })





// if (obj.key != obj.key.includes) {
//     obj.key.push(key)
//     obj.tabval.push(value)
//     obj.push.tabval()
// } else
// if (obj.key = obj.key.includes) {
//     obj.tabval.push(value)
// }
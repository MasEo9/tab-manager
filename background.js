// get all chrome tabs + info 
chrome.tabs.query({ currentWindow: true }, function(tabs) {
    tabs.forEach(function(tab) {
        chrome.tabs.group({ tabIds: tab.id });
        console.log('Tab ID: ', tab.id, tab.groupId);
    });
});
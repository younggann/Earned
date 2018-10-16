function addEntry(entry) {
  chrome.storage.sync.set({ "entry": entry }, function(){
});
}

function showEntries() {
  chrome.storage.sync.get(, function(items){
    console.log(items);
});
}
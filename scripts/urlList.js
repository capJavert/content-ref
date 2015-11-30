self.port.on("urlList", function(notifications) {
    var ul = document.getElementById("urlList");
    ul.innerHTML = "";

    for (i = 0; i < notifications.length; i++) {
        var li = document.createElement("li");
        li.innerHTML = '<a href="'+notifications[i]['url']+'">' +
        '<img src="'+notifications[i]['favicon']+'"/>'+
        notifications[i]['title']+'</a>'+
        '<span class="notification">'+notifications[i]['matches']+'</span>';
        ul.appendChild(li);
    }
});

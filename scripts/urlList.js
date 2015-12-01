self.port.on("urlList", function(data) {
    var ul = document.getElementById("urlList");
    ul.innerHTML = "";

    for (i = 0; i < data.notifications.length; i++) {
        var li = document.createElement("li");
        var a = document.createElement("a");
        a.setAttribute("href", data.notifications[i]['url']);
        //a.setAttribute("id", "link"+i);
        //a.setAttribute("target", "_blank");
        var span =  document.createElement("span");
        span.setAttribute("class", "notification");
        span.appendChild(document.createTextNode(data.notifications[i]['matches']));
        var img = document.createElement("img");
        img.setAttribute("src", data.notifications[i]['favicon']);
        a.appendChild(img);
        a.appendChild(document.createTextNode(data.notifications[i]['title']));
        li.appendChild(a);
        li.appendChild(span);
        ul.appendChild(li);
    }

    //if(data.listener == 'false') {
    document.body.onclick = function (event) {
        event.preventDefault();
        var url = event.target;

        self.port.emit('click-link', {url:url.toString()});
    };
    //}
});
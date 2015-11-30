var favicon = undefined;
var nodeList = document.getElementsByTagName("link");
for (var i = 0; i < nodeList.length; i++)
{
    if((nodeList[i].getAttribute("rel") == "icon")||(nodeList[i].getAttribute("rel") == "shortcut icon"))
    {
        favicon =  nodeList[i].getAttribute("href");
    }
}

self.port.emit('document', {DOM:document.body.innerHTML, title:document.title, favicon:favicon});
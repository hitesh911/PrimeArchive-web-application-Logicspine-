const url = "wss://api.zerotwo.in/websocket"

webSocket = new WebSocket(url);

switch(webSocket.readyState){
    case 0:
        console.log("Socket has been created. The connection is not yet open.");
        break;
    case 1:
        console.log("The connection is open and ready to communicate.");
        break;
    case 2:
        console.log("The connection is in the process of closing.");
        break;
    case 3:
        console.log("The connection is closed or couldn't be opened.");
        break;
}
webSocket.onmessage = (event) => {
    switch(event.data){
        case "[CRED]":
            
            break;
    }
  };
  


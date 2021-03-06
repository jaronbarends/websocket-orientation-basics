# websocket orientation basics

Basic implementation of using a browser on a device to control content within another browser window through web sockets

Uses express node-server in combination with socket.io.

## Global working

At the heart is a node-based webserver which can handle the communication between different browser instances using sockets. This socket server uses the concept of _rooms_. All _users_ of a room (i.e. browser instances, page) can communicate through the socket server. The server only caters for 1 room at the moment.

### Communication between browser instances

Every browser instance (i.e. page) has connect to the socket server and to _join_ the room before it can communicate with others. You need to do this in one script on every page.

To join the room, a page sends a join-event to io, together with a _user_-object with some info that might be of interest to other users in the room.
````
var user = {
    role: 'remote',
    id: io.id,
};
io.emit('join', user);
````

When a page joins the room, the socket server pushes the new user's user object into an array, sends a _joined_-event to the newly joined user, and a _newuser_-event to all other users of the room, both with an array containing all users.

### Passing custom events around

The socket server only handles basic stuff like joining and disconnecting. We do not want to make changes to the server's code for every type of event our app needs to pass around. Therefore I have created a special type of event: the _passthrough_ event.

Any user can send a passthrough event to the socket server:
````
var data = {
    eventName: 'someeventname',
    eventData: {foo: 'bar'}
};
io.emit('passthrough', data);
````
The socket server then sends an event with the event name and the data to all sockets.


## File structure

The root folder contains the node-server (_socket-server.js_) and the npm stuff. Everything in the folder _public_ can be served by the node-server.

## Javascript modules

The functionalities have been seperated as much as possible into different javascript files to prepare for re-use.

### socket-server.js

This is the server you run to serve the pages: `node socket-server`
Or double click the batch file _START SOCKET SERVER.bat_ (this is just a file containing the command `node socket-server`)

The socket-server serves files in the _public_ directory and handles traffic between sockets. Sockets can send events to the socket-server, and the socket-server sends some of its own events to the sockets.

#### Events socket-server.js listens for
* `disconnect` Sent by socket.io when user disconnects
* `join` Sent by clients when they want to join the room
* `updateusers` Sent by clients when the users of the room change
* `passthrough` Sent by clients to pass an event to all clients

#### Events socket-server.js sends
* `connectionready` Sent when socket has established a connection. Listened for by _connection-init.js_, which then sends a `connectionready.socket` event

### socket.io.js

External library for handling websockets

### public/js/connection-init.js

Creates a websocket, and lets the `document` trigger an event `connectionready.socket`. Other scripts can listen for that event, and initialize themselves.

### hub-page.js


### remote-page.js








## Troubleshooting

python needs ms Visual Studio. Default is 2010, but you'll have to adjust this to your own version: 
 npm install --save socket.io --msvs_version=2013
this line can be  put into package.json under "scripts"

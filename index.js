const express = require("express");
const socketIO = require("socket.io");
const path = require("path");

// Configuration
const PORT = process.env.PORT || 3000;
const INDEX = path.join(__dirname, 'index.html');

// Start server
const server = express()
  .use((req, res) => res.sendFile(INDEX) )
 .listen(PORT, () => console.log("Listening on localhost:" + PORT));

// Initiatlize SocketIO
const io = socketIO(server);
users= [];
// Register "connection" events to the WebSocket
io.on("connection", function(socket) {
  
    // join channel provided by client
    
    socket.on("join", function (room) {
      socket.join(room);
      socket.on("image", function(msg) {
      
        // Broadcast the "image" event to all other clients in the room
        socket.broadcast.to(room).emit("image", msg);
      });
      socket.on('msg', function(data) {
        //Send message to everyone
        socket.broadcast.to(room).emit('newmsg', data);
     });
      socket.on('setUsername', function(data) {
        console.log(data);
        
        if(users.indexOf(data) > -1) {
           socket.emit('userExists', data + ' username is taken! Try some other username.');
        } else {
           users.push(data);
           socket.emit('userSet', {username: data});
        }
     });
    
  })
 // })
});
const express = require('express');
const app = express();
const http = require('http');
const socketio = require("socket.io");
const path = require('path'); 

const server = http.createServer(app);
const io = socketio(server);

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, 'public')));

io.on("connection", (socket) => {
    socket.on("sendLocation", function(data) {
        // Broadcast the location data to all connected clients
        io.emit("recieveLocation", {id: socket.id, ...data});
    });
    console.log("connected");

    socket.on("disconnect", function(){
        io.emit("user-disconnected", socket.id)
    })
})

app.get("/", (req, res) =>{
    res.render("index");
})

// Use server.listen instead of app.listen:
server.listen(3000, () => {
    console.log('Server listening on port 3000');
});
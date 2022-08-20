const express = require('express');
const app = express();
const {Server} = require('socket.io');
const http=require('http');
const ACTIONS = require('./src/Actions');
const path = require('path');
const server=http.createServer(app);

const PORT=process.env.REACT_APP_URL || 5000;

app.use(express.static('build'));
app.use((req,res,next)=>{
res.sendFile(path.join(__dirname,'build','index.html'));
})

const io=new Server(server);
const userSocketMap={};
function getAllConnectedClients(roomId){
    return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map(socketId =>{
        return {
            socketId,
            username:userSocketMap[socketId]
        }
    })
}
io.on('connection',(socket)=>{
    console.log(`somebody connected with id=${socket.id}`)

    socket.on(ACTIONS.JOIN,({roomId,username})=>{
        // console.log({roomId,username})
        userSocketMap[socket.id]=username;
        socket.join(roomId);
        const clients=getAllConnectedClients(roomId);
        console.log(clients)
        clients.forEach(
            ({socketId}) => {
                io.to(socketId).emit(ACTIONS.JOINED,{
                    clients,
                    username,
                    socketId:socket.id
                })
            }
        )
    })

    socket.on(ACTIONS.CODE_CHANGE,({roomId,code})=>{
        socket.in(roomId).emit(ACTIONS.CODE_CHANGE,{code})
    })

    socket.on(ACTIONS.SYNC_CODE,({code,socketId})=>{
        io.to(socketId).emit(ACTIONS.CODE_CHANGE,{code})
    })

    socket.on('disconnecting',()=>{
        const rooms=[...socket.rooms]
        rooms.forEach((roomId)=>{
            socket.in(roomId).emit(ACTIONS.DISCONNECTED,{
                socketId:socket.id,
                username:userSocketMap[socket.id]
            })
        })
        delete userSocketMap[socket.id]
        socket.leave();
    })
})

server.listen(PORT,()=>{
    console.log('server running')
})
import {io} from 'socket.io-client';

export const initSocket=async () =>{
    const option={
        'force new connection':true,
        reconnectionAttept:'Infinity',
        timeout:10000,
        transports:['websocket']
    }
    return io('http://localhost:5000',option)
}
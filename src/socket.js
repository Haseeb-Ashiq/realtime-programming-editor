import {io} from 'socket.io-client';

export const initSocket=async () =>{
    const option={
        'force new connection':true,
        reconnectionAttept:'Infinity',
        timeout:10000,
        transports:['websocket']
    }
    return io(process.env.REACT_APP_URL,option)
}
import React, { useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import ACTIONS from '../Actions';
import Client from '../components/Client'
import Editor from '../components/Editor'
import { initSocket } from '../socket';

function EditorPage() {
    const socketRef = useRef(null);
    const codeRef=useRef(null);
    const { roomId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const [client, setClient] = useState([])
    useEffect(() => {
        const init = async () => {
            socketRef.current = await initSocket();
            socketRef.current.on('connect_error', (err) => handleErrors(err))
            socketRef.current.on('connect_failed', (err) => handleErrors(err))
            function handleErrors(e) {
                console.log('errors', e);
                toast.error('Socket connected failed try again.');
                navigate('/');
            }
            socketRef.current.emit(ACTIONS.JOIN, { roomId, username: location.state?.username })

            socketRef.current.on(ACTIONS.JOINED, ({ clients, username, socketId }) => {
                if (username !== location.state?.username) {
                    toast.success(`${username} have joined successfully!`)
                }
                setClient(clients);
                socketRef.current.emit(ACTIONS.SYNC_CODE,{code:codeRef.current,socketId})
            })

            socketRef.current.on(ACTIONS.DISCONNECTED, ({ socketId, username }) => {
                toast.success(`${username} have left.`)
                setClient((prev) => {
                    return prev.filter(
                        (cli) => cli.socketId !== socketId
                    )
                })
            })
        };
        init();
    }, [])
    useEffect(()=>{
        if(socketRef.current)
        {
            return () => {
                socketRef.current.off(ACTIONS.JOINED);
                socketRef.current.off(ACTIONS.DISCONNECTED);
                socketRef.current.disconnect();
            };
        }
    },[socketRef.current])

    async function copyRoomId(){
        try {
            await navigator.clipboard.writeText(roomId);
            toast.success('Room Id has been copied from clipboard.')
        } catch (error) {
            toast.error('could not copy room id from clipboard')
        }
    }
    return (
        <>
            <div className='mainWrapper'>
                <div className='aside'>
                    <div className='asideInner'>
                        <div className='clientsList'>
                            {
                                client.map(
                                    (c) => (
                                        <>
                                            <Client key={c.socketId} username={c.username} />
                                        </>
                                    )
                                )
                            }
                        </div>
                    </div>
                    <button onClick={copyRoomId}>Copy Room Id</button>
                    <button onClick={()=>navigate('/')}>Leave</button>
                </div>
                <div className='editorWrap'>
                    <Editor
                     socketRef={socketRef} 
                     roomId={roomId}
                     onCodeChange={(code)=>{codeRef.current=code}} />
                </div>
            </div>
        </>
    )
}

export default EditorPage
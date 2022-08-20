import React, { useState } from 'react'
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidV4 } from 'uuid';
function Home() {
    const [roomId, setRoomId] = useState('');
    const [username, setUserName] = useState('');
    const navigate=useNavigate();
    const generateRoomId = () => {
        const id = uuidV4();
        setRoomId(id);
        toast.success('Room Id Created!')
    }
    const joinRoom=()=>{
        if(!roomId || !username)
        {
            toast.error('Room Id & User name requred!')
            return;
        }
navigate(`/editor/${roomId}`,{
    state:{
        username,
    }
});
    }

    const handleInputEnter=e=>{
        if(e.code==='Enter')
        {
            joinRoom();
        }
    }
    return (
        <>
            <div className='login-container'>
                <div className='login-window'>
                    <div className='login-inner-container'>
                        <div className='input-group'>
                            <input
                                type={'text'}
                                value={roomId}
                                onChange={(e)=>setRoomId(e.target.value)}
                                placeholder="enter room id" 
                                onKeyUp={handleInputEnter}
                                />
                            <input
                                type={'text'}
                                value={username}
                                onChange={(e) => setUserName(e.target.value)}
                                placeholder="enter name" 
                                onKeyUp={handleInputEnter}
                                />
                            <div className='btn-group'>
                                <button onClick={generateRoomId}>Generate Id</button>
                                <button onClick={joinRoom}>Join</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Home
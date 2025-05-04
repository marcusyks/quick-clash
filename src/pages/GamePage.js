import './GamePage.css';
import { useNavigate, useParams } from 'react-router-dom';
import useLeaveGameOnExit from '../lib/useLeaveGameOnExit';
import { useEffect, useState } from 'react';
import { getSocket, socketConnected } from '../lib/socket';
import GameBoard from '../components/GameBoard';

function GamePage(){
    const { roomID } = useParams();
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState(null);
    useLeaveGameOnExit();

    useEffect(() => {
        if (!socketConnected()){
            navigate('/');
        }

        const socket = getSocket();


        // We handle all the overall game states here (end game, start game, force stop game)
        const handleForceStop= () => {
            console.log("Game stopped, redirecting to homepage...");
            setErrorMessage('forceStop')
            setTimeout(() => {
                navigate('/');
            }, 3000);
        }

        socket.on('forceStop', handleForceStop);

        return () => {
            socket.off('forceStop', handleForceStop);
        };
    }, [navigate])

    return(
        <div className='div_gamepage'>
            <GameBoard roomID={roomID}/>
            {errorMessage === 'forceStop' && (
                <div className='div_forceStopMessage'>
                    <p>Opponent left the game, redirecting to homepage...</p>
                </div>
            )}
        </div>
    )
}

export default GamePage;
import './GamePage.css';
import { useParams } from 'react-router-dom';
import useLeaveGameOnExit from '../lib/useLeaveGameOnExit';

function GamePage(){
    const { roomID } = useParams();
    useLeaveGameOnExit();

    return(
        <div className='div_gamepage'>
            <div className='div_gamecontent'>hello</div>
            <div className='div_roomid'>Room ID: {roomID}</div>
        </div>
    )
}

export default GamePage;
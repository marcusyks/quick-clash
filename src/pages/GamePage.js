import './GamePage.css';
import { useNavigate, useParams } from 'react-router-dom';
import { socketConnected } from '../lib/socket';
import { useEffect } from 'react';


function GamePage(){
    const { roomID } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        //prevents direct game access
        if (!socketConnected()) {
          navigate('/');
        }
      }, [navigate]);

    return(
        <div className='div_gamepage'>
            Room ID: {roomID}
        </div>
    )
}

export default GamePage;
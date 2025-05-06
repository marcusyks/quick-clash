import { useNavigate } from "react-router-dom";
import { getSocket, sendGameMessage, sendRoomMessage, socketConnected } from "../lib/socket";
import Button from "./Button";
import cross_icon from '../assets/mark.png';
import circle_icon from '../assets/circle.png';
import './GameBoard.css';
import { useEffect, useState} from "react";
import { Description, Dialog, DialogPanel, DialogTitle } from '@headlessui/react'


const GameBoard = ({roomID}) => {
    const navigate = useNavigate();
    const [playerTurn, setPlayerTurn] = useState('')
    const [turn, setTurn] = useState('');
    const [endGame, setEndGame] = useState('');
    let [isOpen, setIsOpen] = useState(false);
    const [notify, setNotify] = useState('')


    useEffect(()=>{
        if (!socketConnected()){
            navigate('/');
        }
        const socket = getSocket();
        const playerTurn = localStorage.getItem('playerTurn');
        const turn = localStorage.getItem('turn');

        setPlayerTurn(parseInt(playerTurn));
        setTurn(parseInt(turn));

        const handleActionResults = (data) => {
            const { board, turn } = data;
            setTurn(turn);
            const cells = document.querySelectorAll('.gameCanvas_cell');
            cells.forEach((cell, index) => {
                if (board[index] === 0) {
                    cell.innerHTML = `<img src="${cross_icon}" alt="cross"/>`;
                } else if (board[index] === 1) {
                    cell.innerHTML = `<img src="${circle_icon}" alt="circle"/>`;
                } else{
                    cell.innerHTML = ``;
                }
            });
        };

        const handleGameOver = (data) => {
            const {status} = data;
            setIsOpen(true);
            setEndGame(status);
        }

        const handlePostGame = (data) => {
            // Two possibilities --> opponent left game, opponent decides to stay
            const {status} = data;
            if (status === 'opponentLeft' || status === 'rematch'){
                setNotify(status);
            }
            else{
                setIsOpen(false);
                setNotify('');
            }
        }

        // handle turn
        socket.on('actionResults', handleActionResults);
        // handle game over
        socket.on('gameOver', handleGameOver);
        // handle post game
        socket.on('postGame', handlePostGame);

        return () =>{
            socket.off('actionResults', handleActionResults);
            socket.off('gameOver', handleGameOver);
            socket.on('postGame', handlePostGame);
        }
    }, [navigate])

    const handleLeaveGame = () => {
        sendRoomMessage('leaveRoom');
        navigate('/');
    }

    const handleGameAction = (cellID) => {
        if (playerTurn === turn) {
            sendGameMessage('performAction', {roomID: roomID, cellID: cellID});
        }
    }

    const handleRestartGame = ()=> {
        sendGameMessage('restartGame', {roomID: roomID});
        if (notify !== 'opponentLeft'){ //If opponent left, we dont tell them
            setNotify('Waiting for reply...');
        }
    }

    return(
        <div className='div_gameboard'>

            <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="modal">
            <div className="modal_wrapper">
                <DialogPanel>
                <DialogTitle className="font-bold">It was a {endGame}</DialogTitle>
                <Description>Sadly, the beautiful game of tic tacs have ended...</Description>
                <div className='modal_buttons'>
                    <Button label="Leave Game" onClick={handleLeaveGame}/>
                    <Button label="Restart Game" onClick={handleRestartGame}/>
                </div>
                <div className='modal_buttons'>
                    {
                        notify === 'opponentLeft' ? (
                            <p>Your opponent has left!</p>
                        ) : notify === 'rematch' ? (
                            <p>Your opponent wants a rematch!</p>
                        ) : (
                            <p>{notify}</p>
                        )
                    }
                </div>
                </DialogPanel>
            </div>
            </Dialog>

            <div className="div_turnDiv">
                <p className='span_playerTurn'>You are Player {playerTurn}
                    <span>
                        {playerTurn === 0 ? <img src={cross_icon} className='icon' alt='cross'/> : <img src={circle_icon} className='icon' alt='circle'/>}
                    </span>
                </p>
                <span>Player's {turn} turn</span>
            </div>
            <div className='div_gameCanvas'>
                <div className='gameCanvas_row1'>
                    <div className='gameCanvas_cell' onClick={(e)=>handleGameAction(0)}></div>
                    <div className='gameCanvas_cell' onClick={(e)=>handleGameAction(1)}></div>
                    <div className='gameCanvas_cell' onClick={(e)=>handleGameAction(2)}></div>
                </div>
                <div className='gameCanvas_row2'>
                    <div className='gameCanvas_cell'onClick={(e)=>handleGameAction(3)}></div>
                    <div className='gameCanvas_cell'onClick={(e)=>handleGameAction(4)}></div>
                    <div className='gameCanvas_cell'onClick={(e)=>handleGameAction(5)}></div>
                </div>
                <div className='gameCanvas_row3'>
                    <div className='gameCanvas_cell'onClick={(e)=>handleGameAction(6)}></div>
                    <div className='gameCanvas_cell'onClick={(e)=>handleGameAction(7)}></div>
                    <div className='gameCanvas_cell'onClick={(e)=>handleGameAction(8)}></div>
                </div>
            </div>
            <Button label={'Leave Game'} onClick={handleLeaveGame}/>
        </div>
    )
}

export default GameBoard;
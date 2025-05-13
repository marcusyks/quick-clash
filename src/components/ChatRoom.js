import { Description, Dialog, DialogPanel, DialogTitle } from '@headlessui/react'
import { useEffect, useRef, useState } from "react";
import { getSocket, sendChatMessage } from '../lib/socket';
import './ChatRoom.css';
import chat_icon from '../assets/chat_icon.png';
import Button from './Button';

const ChatRoom= ({roomID}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [socketID, setSocketID] = useState('');
    const chatRef = useRef(null);

    useEffect(()=>{
        const socket = getSocket();
        if (socketID === ""){setSocketID(socket.id);}

        const handleAddChatMessage = (msg, userID) => {
            setMessages((prevMessages) => {
                return [...prevMessages, (userID, msg)];
            });
        }

        socket.on('chatMessage', handleAddChatMessage);

        return () => {
            socket.off('chatMessage', handleAddChatMessage);
        }
    }, [socketID]);

    useEffect(() => {
        chatRef.current?.scrollIntoView({ behavior: 'auto'});
    }, [messages, isOpen]);

    const handleChatButton = () => {
        setIsOpen(true);
    }

    const handleSendMessage = (e) => {
        if (document.querySelector('.chat_inputbox').value !== ''){
            sendChatMessage({
                roomID: roomID,
                msg: document.querySelector('.chat_inputbox').value
            });
            document.querySelector('.chat_inputbox').value = '';
        }
    }

    const handleEnter = (e) => {
        if (e.key === 'Enter' && document.querySelector('.chat_inputbox').value !== ''){
            sendChatMessage({
                roomID: roomID,
                msg: document.querySelector('.chat_inputbox').value
            });
            document.querySelector('.chat_inputbox').value = '';
        }
    }

    return(
        <div className='div_chatBoard'>
            <button className='chatButton' onClick={handleChatButton}>
                <img src={chat_icon} alt='chat icon' className='chat_icon'/>
            </button>

            <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="chat_modal">
                <div className="chat_modal_wrapper">
                    <DialogPanel className='chat_modal_panel'>
                        <div>
                            <DialogTitle>Chat Room</DialogTitle>
                            <Description>Talk to your opponent!</Description>
                        </div>
                        <div className='div_chatBoard'>
                            <div className="div_messages">
                                {messages.length > 0 ? (
                                    messages.map((message, index) => {
                                    const isMe = message.userID === socketID;

                                    return (
                                        <div
                                        key={index}
                                        className={`div_message_wrapper ${isMe ? "align-right" : "align-left"}`}
                                        >
                                            <div className={`div_message ${isMe ? "me" : "other"}`}>
                                                <span className="div_message_userID">
                                                {isMe ? "Me" : "user" + message.userID}
                                                </span>
                                                <p>{message.msg}</p>
                                            </div>
                                        </div>
                                    );
                                })
                                ) : (
                                    <p>No messages found...</p>
                                )}
                                <div ref={chatRef} />
                            </div>
                            <div className='div_submit'>
                                <textarea type='text' placeholder='Enter your message...' className='chat_inputbox' onKeyDown={(e) => handleEnter(e)}></textarea>
                                <Button label='Send' onClick={handleSendMessage}/>
                            </div>
                        </div>
                    </DialogPanel>
                </div>
            </Dialog>
        </div>
    )
}

export default ChatRoom;
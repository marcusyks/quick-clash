import { Description, Dialog, DialogPanel, DialogTitle, Textarea } from '@headlessui/react'
import { useEffect, useRef, useState } from "react";
import { getSocket, sendChatMessage } from '../lib/socket';
import './ChatRoom.css';
import chat_icon from '../assets/chat_icon.png';
import Button from './Button';

const ChatRoom= ({roomID}) => {
    const isOpenRef = useRef(false);
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [socketID, setSocketID] = useState('');
    const chatRef = useRef(null);

    useEffect(()=>{
        const socket = getSocket();
        if (socketID === ""){setSocketID(socket.id);}

        const handleAddChatMessage = ({ msg, userID, time }) => {
            setMessages((prevMessages) => [
            ...prevMessages,
            { msg, userID, time }
            ]);
        };

        socket.on('chatMessage', handleAddChatMessage);

        return () => {
            socket.off('chatMessage', handleAddChatMessage);
        }
    }, [socketID]);

    // Ref keeps track of isOpen variable
    useEffect(() => {
        isOpenRef.current = isOpen;
    }, [isOpen]);

    // checks badge
    useEffect(() => {
        const badge = document.querySelector('.chatButton_badge');
        if (badge) {
            badge.style.opacity = !isOpenRef.current && messages.length > 0 ? 1 : 0;
        }
    }, [messages]);

    // Scroll to the bottom of the chat when a new message is added
    useEffect(() => {
        if (isOpen) {
            requestAnimationFrame(() => {
                chatRef.current?.scrollIntoView({ behavior: 'smooth' });
            });
        }
    }, [messages,isOpen]);

    const handleChatButton = () => {
        const badge = document.querySelector('.chatButton_badge');
        if (badge) {
            badge.style.opacity = isOpenRef.current ? 1 : 0;
        }
        setIsOpen(true);
    }

    const handleSendMessage = () => {
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
                <div className='chatButton_badge'/>
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
                                    const { msg, userID, time } = message;
                                    const isMe = userID === socketID;

                                    return (
                                        <div
                                        key={index}
                                        className={`div_message_wrapper ${isMe ? "align-right" : "align-left"}`}
                                        >
                                            <div className={`div_message ${isMe ? "me" : "other"}`}>
                                                <span className="div_message_userID">
                                                    {isMe ? "Me" : "Opponent"}
                                                </span>
                                                <p>{msg}</p>
                                                <p className='timestamp'>{time}</p>
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
                                <Textarea
                                    className='chat_inputbox'
                                    rows={3}
                                    onKeyDown={(e) => handleEnter(e)}
                                    placeholder='Type your message here...'
                                />
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
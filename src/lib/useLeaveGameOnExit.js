// hooks/useLeaveGameOnExit.js
import { useEffect, useRef } from "react";
import { getSocket, socketConnected } from "./socket";
import { useNavigate } from "react-router-dom";

const useLeaveGameOnExit = () => {
    const navigate = useNavigate();
    const initialized = useRef(false); //overcome strict mode

    useEffect(() => {
        if (!socketConnected()){
            navigate("/");
            return;
        };

        const handleBack = () => {
            // If the current page is a game page and user goes back
              const socket = getSocket();
              console.log("User left game, deleting room...");
              socket.emit("roomMessage", "leaveRoom");
        }

        if (!initialized.current) {
            initialized.current = true;
            window.addEventListener("popstate", handleBack);
        }

    }, [navigate]);
};

export default useLeaveGameOnExit;

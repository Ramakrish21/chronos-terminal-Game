// client/src/components/Game.js
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const Game = () => {
    const [currentLocation, setCurrentLocation] = useState(null);
    const [gameMessages, setGameMessages] = useState([]);
    const [command, setCommand] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // This will be the ID of our starting room.
    // After seeding, you can get this ID from MongoDB Compass or Atlas.
    // For now, we'll hardcode one of the seeded location IDs as a starting point.
    // **IMPORTANT**: Replace this with an actual ID from your seeded 'Starting Room' if you have one,
    // or just use the first one available if you're fetching all for testing.
    const STARTING_LOCATION_ID = '666cd8513b632906e23bb410'; // <<< REPLACE WITH YOUR ACTUAL STARTING ROOM ID

    // Ref for auto-scrolling messages
    const messagesEndRef = useRef(null);

    // Function to scroll to the bottom of messages
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    // Function to add a message to the game log
    const addMessage = (msg, type = 'normal') => {
        setGameMessages(prevMessages => [...prevMessages, { text: msg, type }]);
    };

    // Fetch initial location data
    useEffect(() => {
        const fetchInitialLocation = async () => {
            try {
                const res = await axios.get(`<span class="math-inline">\{process\.env\.REACT\_APP\_API\_URL\}/api/game/current\-location/</span>{STARTING_LOCATION_ID}`);
                setCurrentLocation(res.data);
                addMessage(`Welcome to The Chronos Terminal.`, 'system');
                addMessage(`You awaken in a cramped, concrete room. The air is stale and cold, and the only light comes from a flickering overhead bulb. Dust motes dance in the weak light, sometimes appearing to move backward.`, 'description');
                setIsLoading(false);
            } catch (err) {
                console.error("Error fetching initial location:", err);
                setError("Failed to load game. Please check server connection.");
                setIsLoading(false);
            }
        };
        fetchInitialLocation();
    }, []); // Empty dependency array means this runs once on component mount

    // Effect to scroll to bottom when messages update
    useEffect(() => {
        scrollToBottom();
    }, [gameMessages]);


    const handleCommandSubmit = async (e) => {
        e.preventDefault();
        if (!command.trim() || !currentLocation) return;

        const inputCommand = command.trim().toLowerCase();
        addMessage(`> ${inputCommand}`, 'command'); // Echo the command

        setCommand(''); // Clear input

        const [verb, ...args] = inputCommand.split(' ');
        const objectName = args.join(' '); // For commands like 'examine flashlight'

        try {
            if (verb === 'go') {
                const direction = objectName; // e.g., 'north'
                const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/game/move`, {
                    current_location_id: currentLocation._id,
                    direction: direction,
                });
                setCurrentLocation(res.data.newLocation);
                addMessage(res.data.message, 'system');
                addMessage(res.data.newLocation.description, 'description');
                if (res.data.newLocation.temporalHint) {
                    addMessage(`[Temporal Hint]: ${res.data.newLocation.temporalHint}`, 'hint');
                }
            } else if (verb === 'examine') {
                const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/game/examine`, {
                    current_location_id: currentLocation._id,
                    object_name: objectName,
                });
                addMessage(res.data.message, 'object-description');
            } else if (verb === 'look' || verb === 'l') {
                // Re-display current location description and details
                addMessage(currentLocation.description, 'description');
                if (currentLocation.temporalHint) {
                    addMessage(`[Temporal Hint]: ${currentLocation.temporalHint}`, 'hint');
                }
                if (currentLocation.objects && currentLocation.objects.length > 0) {
                    addMessage(`You see: ${currentLocation.objects.map(obj => obj.name).join(', ')}.`, 'info');
                }
                const exits = Object.keys(currentLocation.exits);
                if (exits.length > 0) {
                    addMessage(`Exits: ${exits.join(', ')}.`, 'info');
                } else {
                    addMessage(`There are no obvious exits.`, 'info');
                }
            } else {
                addMessage(`Unknown command: "${inputCommand}". Try 'go [direction]', 'examine [object]', or 'look'.`, 'error');
            }
        } catch (err) {
            console.error("Command error:", err.response ? err.response.data : err.message);
            addMessage(err.response ? err.response.data.msg : 'An unexpected error occurred.', 'error');
        }
    };

    if (isLoading) {
        return <div className="text-white text-center p-8 bg-gray-900 min-h-screen flex items-center justify-center">Loading Chronos Terminal...</div>;
    }

    if (error) {
        return <div className="text-red-500 text-center p-8 bg-gray-900 min-h-screen flex items-center justify-center">Error: {error}</div>;
    }

    return (
        <div className="flex flex-col h-screen bg-gray-950 text-green-400 font-mono p-4">
            <h1 className="text-3xl font-bold mb-4 text-center text-green-500">The Chronos Terminal</h1>

            {/* Game Output Area */}
            <div className="flex-grow overflow-y-auto border border-green-700 p-4 mb-4 rounded bg-gray-900 text-sm scrollbar-thin scrollbar-thumb-green-600 scrollbar-track-gray-800">
                {gameMessages.map((msg, index) => (
                    <p key={index} className={`mb-1 ${
                        msg.type === 'system' ? 'text-green-300' :
                        msg.type === 'description' ? 'text-green-100' :
                        msg.type === 'object-description' ? 'text-yellow-300' :
                        msg.type === 'command' ? 'text-blue-300' :
                        msg.type === 'hint' ? 'text-purple-300 italic' :
                        msg.type === 'error' ? 'text-red-500' :
                        msg.type === 'info' ? 'text-gray-400' :
                        'text-green-400'
                    }`}>
                        {msg.text}
                    </p>
                ))}
                <div ref={messagesEndRef} /> {/* For auto-scrolling */}
            </div>

            {/* Current Location Info */}
            {currentLocation && (
                <div className="border border-green-700 p-3 mb-4 rounded bg-gray-900 text-sm">
                    <p className="text-lg text-green-500 mb-2">Location: {currentLocation.name}</p>
                    {currentLocation.objects && currentLocation.objects.length > 0 && (
                        <p className="mb-1">You see: <span className="text-yellow-200">{currentLocation.objects.map(obj => obj.name).join(', ')}</span></p>
                    )}
                    {currentLocation.exits && Object.keys(currentLocation.exits).length > 0 && (
                        <p>Exits: <span className="text-blue-200">{Object.keys(currentLocation.exits).join(', ')}</span></p>
                    )}
                </div>
            )}


            {/* Command Input */}
            <form onSubmit={handleCommandSubmit} className="flex">
                <input
                    type="text"
                    className="flex-grow bg-gray-800 text-green-400 border border-green-700 p-3 rounded-l-md focus:outline-none focus:border-green-500"
                    placeholder="Enter command (e.g., go north, examine flashlight, look)..."
                    value={command}
                    onChange={(e) => setCommand(e.target.value)}
                    autoFocus
                />
                <button
                    type="submit"
                    className="bg-green-700 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-r-md transition-colors duration-200"
                >
                    Execute
                </button>
            </form>
        </div>
    );
};

export default Game;
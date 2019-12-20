const util = require('util');
const prompt = require('prompt');
const axios = require('axios');
const { ChatManager, TokenProvider } = require('@pusher/chatkit-client');
const { JSDOM } = require('jsdom');
const readline = require('readline');

const makeChatkitNodeCompatible = () => {
    const { window } = new JSDOM();
    global.window = window;
    global.navigator = {};
};

const createUser = async (username) => {
    try {
        await axios.post('http://localhost:3001/users', {
            username
        });
    }
    catch(err) {
        console.error(err);
    }
}

const main = async () => {
    makeChatkitNodeCompatible();
    try {
        prompt.start();
        prompt.message = '';
    
        const get = util.promisify(prompt.get);
        const usernameSchema = [
            {
                description: 'Enter your username',
                name: 'username',
                required: true
            }
        ];
        const { username } = await get(usernameSchema);
        await createUser(username);

        const chatManager = new ChatManager({
            instanceLocator: 'v1:us1:a795d3e9-45d4-426c-87e1-2036110af5f7',
            tokenProvider: new TokenProvider({
                url: 'http://localhost:3001/authenticate'
            }),
            userId: username,
        });
        const currentUser = await chatManager.connect();

        const joinableRooms = await currentUser.getJoinableRooms();
        const availableRooms = [...currentUser.rooms, ...joinableRooms];
        availableRooms.forEach((room, index ) => {
            console.log(`${index} - ${room.name}`);
        });

        const roomSchema = [
            {
                description: 'Select a room',
                name: 'chosenRoom',
                required: true
            }
        ];

        const { chosenRoom } = await get(roomSchema);
        const room = availableRooms[chosenRoom];


    }
    catch(err) {
        console.error(err);
        process.exit(1);
    }
}
main();
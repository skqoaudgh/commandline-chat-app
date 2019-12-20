const util = require('util');
const prompt = require('prompt');
const axios = require('axios');

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
        createUser(username);
    }
    catch(err) {
        console.error(err);
        process.exit(1);
    }
}
main();
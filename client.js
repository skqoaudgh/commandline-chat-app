const util = require('util');
const prompt = require('prompt');

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
        console.log(username);
    }
    catch(err) {
        console.error(err);
        process.exit(1);
    }
}
main();
/* Project Configuration File */
/* Rename to config.js */

var config = module.exports = {};

// set socket.io transports
config.transports = ['xhr-polling'];
config.port = 3000; // Shell service will use 3001 by default

config.create_user_script = '/etc/create-user.sh';

/* Uncomment to enable CouchDB:
config.couchdb = {
    'options': {
        'auth': {
            'username':'admin',
            'password':'bU7qVSgy'
        }
    }
};
*/

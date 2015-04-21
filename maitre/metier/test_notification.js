var messenger = require('messenger');
 
server = messenger.createListener(9205);
 
server.on('give it to me', function(message, data){
  message.reply({'you':'got it'})
});
 

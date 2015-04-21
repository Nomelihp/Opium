var messenger = require('messenger');

var client = messenger.createSpeaker(9205);
setTimeout(function(){
  client.request('notification', {hello:'world'}, function(data){
    console.log(data);
  });
}, 1000);

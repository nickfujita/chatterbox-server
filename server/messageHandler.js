// var uuid = require('node-uuid');
var _ = require('underscore');

var _storage = [];

var insertNewMessage = function(message) {
  message.createdAt = new Date();
  // message.objectId = uuid.v1();
  message.roomname = message.roomname || 'lobby';
  _storage.push(message);
};

var formatMessage = function(message) {
  message.createdAt = new Date();
  // message.objectId = uuid.v1();
  message.roomname = message.roomname || 'lobby';
  return message;
};

var getMessages = function(room) {
  
  if(!room) {
  	return {'results': _storage};
  }

  var msgArr =  _.filter(_storage, function(value, key, list){
    return value.roomname === room;
  });

  return {'results': msgArr};
};

insertNewMessage({
      username: 'nick',
      text: 'hello everyone',
      roomname: 'homeroom'
    });

insertNewMessage({
      username: 'ying',
      text: 'bye everyone',
      roomname: 'room1'
    });

exports.getMessages = getMessages;
exports.formatMessage = formatMessage;
exports.insertNewMessage = insertNewMessage;
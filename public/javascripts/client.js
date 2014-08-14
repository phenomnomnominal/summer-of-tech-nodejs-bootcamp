(function() {
  $(function() {
    var $changeName, $chatForm, $chatInput, $chatMessages, $displayName, $login, $loginForm, $usernameInput, addUsername, changeUsername, getUsername, messageRecieved, removeUsername, saveUsername, socket, userJoined, userLeft;
    saveUsername = function(username) {
      if (localStorage) {
        return localStorage.setItem('username', username);
      }
    };
    removeUsername = function() {
      if (localStorage) {
        return localStorage.removeItem('username');
      }
    };
    getUsername = function() {
      var username;
      if (localStorage) {
        return username = localStorage.getItem('username');
      }
    };
    addUsername = function(username) {
      $login.hide();
      $changeName.show();
      return $displayName.show().text("Hi " + username + "!");
    };
    changeUsername = function() {
      removeUsername();
      $changeName.hide();
      $displayName.hide();
      $login.show();
      return $usernameInput.focus();
    };
    userJoined = function(data) {
      var $joined, $time, $userJoinedItem;
      $time = $('<span>', {
        "class": 'time',
        text: new Date(data.time).toString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, '$1')
      });
      $joined = $('<span>', {
        "class": 'username',
        text: "" + data.username + " joined."
      });
      $userJoinedItem = $('<li>', {
        "class": 'joined'
      });
      $userJoinedItem.append($time, $joined);
      return $chatMessages.prepend($userJoinedItem);
    };
    userLeft = function(data) {
      var $joined, $time, $userLeftItem;
      $time = $('<span>', {
        "class": 'time',
        text: new Date(data.time).toString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, '$1')
      });
      $joined = $('<span>', {
        "class": 'username',
        text: "" + data.username + " left."
      });
      $userLeftItem = $('<li>', {
        "class": 'left'
      });
      $userLeftItem.append($time, $joined);
      return $chatMessages.prepend($userLeftItem);
    };
    messageRecieved = function(data) {
      var $joined, $message, $time, $userMessageItem;
      $time = $('<span>', {
        "class": 'time',
        text: new Date(data.time).toString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, '$1')
      });
      $joined = $('<span>', {
        "class": 'username',
        text: data.username === getUsername() ? 'You said:' : "" + data.username + " says:"
      });
      $message = $('<span>', {
        "class": 'message',
        text: "" + data.message
      });
      $userMessageItem = $('<li>');
      $userMessageItem.append($time, $joined, $message);
      return $chatMessages.prepend($userMessageItem);
    };
    $login = $('.overlay');
    $loginForm = $('#UsernameForm');
    $usernameInput = $loginForm.find('input[type=text]');
    $displayName = $('#Hi');
    $changeName = $('#ChangeName');
    $chatForm = $('#ChatForm');
    $chatInput = $chatForm.find('input[type=text]');
    $chatMessages = $('#ChatMessages');
    $changeName.on('click', function() {
      removeUsername();
      changeUsername();
      return socket.emit('leave-chat');
    });
    $loginForm.on('submit', function() {
      var username;
      username = $usernameInput.val().replace(/^\s+|\s+$/g, '');
      if (username.length > 0) {
        socket.emit('join-chat', username);
        saveUsername(username);
        return addUsername(username);
      }
    });
    $chatForm.on('submit', function() {
      var chat;
      chat = $chatInput.val().replace(/^\s+|\s+$/g, '');
      if (chat.length > 0) {
        socket.emit('send-message', $('<div>', {
          text: chat
        }).html());
        return $chatInput.val('');
      }
    });
    $(window).on('storage', function(e) {
      var username;
      username = e.originalEvent.newValue;
      if (username != null) {
        return addUsername(username);
      } else {
        return changeUsername();
      }
    });
    socket = io.connect('http://localhost');
    return $.getJSON('/history').done(function(data) {
      return data.forEach(messageRecieved);
    }).fail(function() {
      if ((typeof console !== "undefined" && console !== null ? console.clear : void 0) != null) {
        return console.clear();
      }
    }).always(function() {
      var username;
      socket.on('user-joined', userJoined);
      socket.on('user-left', userLeft);
      socket.on('message-recieved', messageRecieved);
      username = getUsername();
      if (username != null) {
        addUsername(username);
      } else {
        changeUsername();
      }
      if (username != null) {
        return socket.emit('join-chat', username);
      }
    });
  });

}).call(this);

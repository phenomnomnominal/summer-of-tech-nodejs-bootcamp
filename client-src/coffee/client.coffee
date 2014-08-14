$ ->
  saveUsername = (username) ->
    if localStorage
      localStorage.setItem 'username', username

  removeUsername = ->
    if localStorage
      localStorage.removeItem 'username'

  getUsername = ->
    if localStorage
      username = localStorage.getItem 'username'

  addUsername = (username) ->
    $login.hide()
    $changeName.show()
    $displayName.show().text "Hi #{username}!"

  changeUsername = ->
    removeUsername()
    $changeName.hide()
    $displayName.hide()
    $login.show()
    $usernameInput.focus()

  userJoined = (data) ->
    $time = $ '<span>', class: 'time', text: new Date(data.time).toString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, '$1')
    $joined = $ '<span>', class: 'username', text: "#{data.username} joined."
    $userJoinedItem = $ '<li>', class: 'joined'
    $userJoinedItem.append $time, $joined
    $chatMessages.prepend $userJoinedItem

  userLeft = (data) ->
    $time = $ '<span>', class: 'time', text: new Date(data.time).toString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, '$1')
    $joined = $ '<span>', class: 'username', text: "#{data.username} left."
    $userLeftItem = $ '<li>', class: 'left'
    $userLeftItem.append $time, $joined
    $chatMessages.prepend $userLeftItem

  messageRecieved = (data) ->
    $time = $ '<span>', class: 'time', text: new Date(data.time).toString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, '$1')
    $joined = $ '<span>', class: 'username', text: if data.username is getUsername() then 'You said:' else "#{data.username} says:"
    $message = $ '<span>', class: 'message', text: "#{data.message}"
    $userMessageItem = $ '<li>'
    $userMessageItem.append $time, $joined, $message
    $chatMessages.prepend $userMessageItem

  $login = $ '.overlay'
  $loginForm = $ '#UsernameForm'
  $usernameInput = $loginForm.find 'input[type=text]'
  $displayName = $ '#Hi'
  $changeName = $ '#ChangeName'
  $chatForm = $ '#ChatForm'
  $chatInput = $chatForm.find 'input[type=text]'
  $chatMessages = $ '#ChatMessages'

  $changeName.on 'click', ->
    removeUsername()
    changeUsername()
    socket.emit 'leave-chat'

  $loginForm.on 'submit', ->
    username = $usernameInput.val().replace /^\s+|\s+$/g, ''
    if username.length > 0
      socket.emit 'join-chat', username
      saveUsername username
      addUsername username

  $chatForm.on 'submit', ->
    chat = $chatInput.val().replace /^\s+|\s+$/g, ''
    if chat.length > 0
      socket.emit 'send-message', $('<div>', text: chat).html()
      $chatInput.val ''

  $(window).on 'storage', (e) ->
    username = e.originalEvent.newValue
    if username? then addUsername(username) else changeUsername()

  socket = io.connect 'http://localhost'

  $.getJSON('/history').done((data) ->
      data.forEach messageRecieved
    ).fail(->
      if console?.clear?
        console.clear()
    ).always ->
      socket.on 'user-joined', userJoined
      socket.on 'user-left', userLeft
      socket.on 'message-recieved', messageRecieved

      username = getUsername()
      if username? then addUsername(username) else changeUsername()
      if username? then socket.emit 'join-chat', username

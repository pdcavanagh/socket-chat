# socket-chat
![Socket-chat github dependency status](https://david-dm.org/pdcavanagh/socket-chat.svg)

##React based chat application using socket.io

This application is a demonstration of using React to design the UI for a simple chat application that uses websockets to handle messaging and announcements.

## Installation
`npm install`

`webpack` (assumes webpack 2 is installed globally)

`node server.js`

## React Design

![ui deconstruction](https://github.com/pdcavanagh/socket-chat/blob/master/chatUI.png)

Component based design

1. App (red): contains chat application
2. MessageBox (blue): displays all messages
3. MessageForm (green): receives user message
4. MessageJoin (purple): displays row when user arrives
5. MessageLeave (turquoise): displays row when user leaves
6. Message (red): displays row for user and message
7. JoinForm (not shown)

### Hierarchy

* App (red): contains chat application
  * JoinForm (not shown)
  * MessageForm (green): receives user message
  * MessageBox (blue): displays all messages
    * MessageJoin (purple): displays row when user arrives
    * MessageLeave (turquoise): displays row when user leaves
    * Message (red): displays row for user and message

### 
The UI is based on two presentations: 1) the login screen and 2) the chat interface.

![login form](https://github.com/pdcavanagh/socket-chat/blob/master/loginForm.png)

Upon loading the application, the client see the login screen that requests a username. The LoginForm component submit 
calls an App prop function returning the user name to the App component and two states are updated: `isLoggedIn` and `username`.
Based on the change in the `isLoggedIn` state, the `render()` method of the App component conditionally renders the 
chat interface instead of the login.

![chat dialog screen](https://github.com/pdcavanagh/socket-chat/blob/master/chatDialog.png)

## socket.io Design

The chat application is based on two main pathways of communication between the server and client:

1. Communication from the server is all in the form on 'announcements', e.g. updates to the message window
2. Communication from the client is divided in three types: 
 1. client sends a message
 2. client joins
 3. client leaves - indicated by the disconnection of the websocket


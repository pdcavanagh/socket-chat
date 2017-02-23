import React, { Component } from 'react';

/*---------------------------------------------------------------------------*/
/* Chat Application Component                                                */
/*---------------------------------------------------------------------------*/
class App extends Component {
  constructor(props){
    super(props);

    /* States */    
    this.state = {
      isLoggedIn: false,
      username: ''
    };

    /* Bindings */
    this.handleUsernameSubmit = this.handleUsernameSubmit.bind(this);
  }

  componentDidMount() {
    console.log('Chat App component mounted');
  }

  /* Form handlers */
  handleUsernameSubmit(data) {
    this.setState({isLoggedIn: true, username: data});
    socket.emit('join', { userId: data, time: getCurrentTime() });
  }

  render() {
    const isLoggedIn = this.state.isLoggedIn;
    if (isLoggedIn) {
      return (
        <div className="App">
          <MessageBox messages={[]}/>
          <MessageForm name={this.state.username} />
        </div>
      );
    }
    return (
      <div className="App">
        <LoginForm updateName={this.handleUsernameSubmit} />
      </div>
    );
  }
}

/*---------------------------------------------------------------------------*/
/* Login Form Component                                                      */
/*---------------------------------------------------------------------------*/
class LoginForm extends Component {
  constructor(props) {
    super(props);

    /* States */
    this.state = {value: ''};

    /* Bindings */
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  /* Form handlers */
  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit (event) {
    console.log(this.state.value);
    this.props.updateName(this.state.value);
    event.preventDefault();
  }

  render() {
    return (
      <div className="LoginForm">
        <form onSubmit={this.handleSubmit} 
          className="loginForm" 
          id="form_login" action="" 
          autoComplete="off"
        >
          <input type="text" 
            className="loginInput"
            value={this.state.value} 
            onChange={this.handleChange} 
            id="input_login" 
            placeholder="Enter your display name." 
          />
          <button 
            type="submit" 
            className="loginBtn" 
            id="button_login"
          >Login</button>
        </form>
      </div>
    );
  }
}

/*---------------------------------------------------------------------------*/
/* Chat Message Form Component                                               */
/*---------------------------------------------------------------------------*/
class MessageForm extends Component {
  constructor(props) {
    super(props);

    /* States */
    this.state = {value: ''};

    /* Bindings */
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  /* Form handlers */
  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit (event) {
    let msg = this.state.value;
    socket.emit('message', { 
      userId: this.props.name, 
      time: getCurrentTime(), 
      message: msg
    });
    this.setState({value: ''});
    event.preventDefault();
  }

  render() {
    return (
      <form className="msgForm" 
        onSubmit={this.handleSubmit} 
        id="sendMsg" action="" 
        autoComplete="off">
        <input 
          type="text" 
          value={this.state.value} 
          onChange={this.handleChange} 
          id="txt_message" 
        />
        <button type="submit" id="sendBtn">Send</button>
      </form>
    );
  }
}

/*---------------------------------------------------------------------------*/
/* Chat Message Window Component                                             */
/*---------------------------------------------------------------------------*/
class MessageBox extends Component {
  constructor(props) {
    super(props);

    /* States */
    this.state = {
      messages: []
    };

    /* Bindings */
    this.handleNewMessage = this.handleNewMessage.bind(this);
  }

  /* Updates the messages state to reflect new incoming announcements */
  handleNewMessage(data) {
    //console.log('Got announcement:', data.message);
    var newArray = this.state.messages.slice();    
    newArray.push({
      name: data.name,
      time: data.time,
      message: data.message
    });   
    this.setState({messages: newArray});
  }

  componentDidMount() {
    console.log('MessageBox mounted');
    socket.on('announcements', this.handleNewMessage);
  }

  render() {
    var rows = [];
    this.state.messages.forEach( function(msg) {
      console.log(msg);
      rows.push(<Message name={msg.name} text={msg.message} time={msg.time} key={msg.time.toString()}/>);
    });
    console.log(this.state.messages);
    return (
      <div className="messages-box" id="container-messages">
        {rows}
      </div>
    );
  }
}

/*---------------------------------------------------------------------------*/
/* Chat Message Component                                                    */
/*---------------------------------------------------------------------------*/
class Message extends Component {
  render() {
    return(
      <div className="message">
        <span className="msgName"><strong>{this.props.name}</strong> </span>
        <span className="msgTime">{this.props.time}</span>
        <span>: </span>
        <span className="msgText">{this.props.text}</span>
      </div>
    );
  }
}

/*---------------------------------------------------------------------------*/
/* Chat Join Announcement Component                                          */
/*  (may be abstracted to single message component)                          */
/*---------------------------------------------------------------------------*/
class MessageJoin extends Component {
  render() {
    return(
      <span>User has joined</span>
    );
  }
}

/*---------------------------------------------------------------------------*/
/* Chat Leave Announcement Component                                         */
/*  (may be abstracted to single message component)                          */
/*---------------------------------------------------------------------------*/
class MessageLeave extends Component {
  render() {
    return(
      <span>User has left.</span>
    );
  }
}

/*---------------------------------------------------------------------------*/
/* Utility Functions                                                         */
/*---------------------------------------------------------------------------*/
function getCurrentTime() {
  var today = new Date();
  let amPmFlag = false;
  let hour = today.getHours();
  if(hour >= 12) {
    amPmFlag = true;
    hour = hour-12;
  } else {
    if(hour === 0) {
      hour = 12;
    }
  }
  var time = "(" + pad(hour,2) + ":" + pad(today.getMinutes(),2) + ":" + pad(today.getSeconds(),2) + ' ' + (amPmFlag ? 'PM' : 'AM') + ")";

  return time; /* returns time in (HH:MM:SS XM) format */
}

function pad(num, size) {
    var s = num+"";
    while (s.length < size) s = "0" + s;
    return s;
}

export default App;

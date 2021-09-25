import React from 'react';
import logo from './images/salmoncow.png';
import './App.css';
import SignUpFormFunc from './SignUp';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
      </header>

      <SignUpFormFunc />
      
      <Welcome name="Tyler D" />

    </div>
  );
}

export default App;

// (A) function approach to Welcome
function Welcome(props) {
  return <h1>Hello, {props.name}</h1>;
}

// (B) class approach to Welcome
// class Welcome extends React.Component {
//   render() {
//     return <h1>Hello, {this.props.name}</h1>;
//   }
// }

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

// this is equivalent to class Welcome below
function Welcome(props) {
  return <h1>Hello, {props.name}</h1>;
}

// class Welcome extends React.Component {
//   render() {
//     return <h1>Hello, {this.props.name}</h1>;
//   }
// }

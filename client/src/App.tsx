import React from 'react';
import './App.css';

function App() {
  
  function sayHello() {
    console.log('hello');
  }
  
  return (
    <div className="App">
        <h1>
          Hello World
        </h1>
        <button onClick={sayHello}>Yo babe</button>
    </div>
  );
}

export default App;

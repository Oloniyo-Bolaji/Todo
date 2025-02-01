import React from 'react';
import {TodoProvider} from './Context'
import './App.css';
import Todo from './Todo'


const App = () => {
  return (
    <TodoProvider>
     <Todo />
    </TodoProvider>
  );
}

export default App;

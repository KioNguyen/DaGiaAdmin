import React from 'react';
import logo from './logo.svg';
import 'antd/dist/antd.css';
import './App.css';
import Main from './Components/Main'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <div className="App">
        {/* <Header /> */}
        <Switch>
          <Route path="/" component={Main} />
        </Switch>
        {/* <Footer className='Footer' style={{ textAlign: 'center' }}>DAGIA - SYSTEM ©2020 Created by Hung - Hao</Footer> */}
      </div>
    </Router>
  );
}

export default App;

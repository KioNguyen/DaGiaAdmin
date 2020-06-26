import React from 'react';
import logo from './logo.svg';
import 'antd/dist/antd.css';
import './App.css';
import Main from './Components/Main'

import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import productReducers from '../src/store/reducers/productReducers';

const rootReducers = combineReducers({
  products: productReducers
});

const store = createStore(rootReducers, applyMiddleware(thunk));

window.store = store;
function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="App">
          <Switch>
            <Route path="/" component={Main} />
          </Switch>
          {/* <Header /> */}
          {/* <Footer className='Footer' style={{ textAlign: 'center' }}>DAGIA - SYSTEM ©2020 Created by Hung - Hao</Footer> */}
        </div>
      </Router>
    </Provider>
  );
}

export default App;

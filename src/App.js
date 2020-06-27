import React from 'react';
import logo from './logo.svg';
import 'antd/dist/antd.css';
import './App.css';
import Main from './Components/Main'
import Login from './Components/Login'

import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import { Provider } from 'react-redux';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import productReducers from '../src/store/reducers/productReducers';
import authReducers from '../src/store/reducers/authReducers'
import userReducers from '../src/store/reducers/userReducers'
const rootReducers = combineReducers({
  products: productReducers,
  auth: authReducers,
  users: userReducers
});

const store = createStore(rootReducers, applyMiddleware(thunk));

window.store = store;
function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="App">
          <Switch>
            <Route exact path="/login" component={Login} />
            <PrivateRoute path="/" component={Main} />
          </Switch>
        </div>
      </Router>
    </Provider>
  );
}

export default App;

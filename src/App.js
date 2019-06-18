import React from "react";
import history from './history';
import {Router, Route, Switch} from "react-router-dom";
import Home from './Components/Home.js';
import API from './Components/RestAPIJson.js';
import Login from './Components/Login.js'
import TableComponent from './Components/Table';
import './App.css';
import 'semantic-ui-css/semantic.min.css';

class App extends React.Component {
    state = {
        homeBorder: '0px',
        tableBorder: '0px',
        apiBorder: '0px',
        loginBorder: '0px'
    }

    home = () => {
        history.push('/home');
        this.setState({
            homeBorder: '3px',
            tableBorder: '0px',
            apiBorder: '0px',
            loginBorder: '0px'
        })
    }

    table = () => {
        history.push('/table');
        this.setState({
            homeBorder: '0px',
            tableBorder: '3px',
            apiBorder: '0px',
            loginBorder: '0px'
        })
    }

    api = () => {
        history.push('/restapi');
        this.setState({
            homeBorder: '0px',
            tableBorder: '0px',
            apiBorder: '3px',
            loginBorder: '0px'
        })
    }
    login = () => {
        history.push('/login');
        this.setState({
            homeBorder: '0px',
            tableBorder: '0px',
            apiBorder: '0px',
            loginBorder: '3px'
        })
    }

    componentWillMount() {

        if (window.location.pathname === '/login')
            this.setState({
                homeBorder: '0px',
                tableBorder: '0px',
                apiBorder: '0px',
                loginBorder: '3px'
            });
        else if (window.location.pathname === '/table')
            this.setState({
                homeBorder: '0px',
                tableBorder: '3px',
                apiBorder: '0px',
                loginBorder: '0px'
            });
        else if (window.location.pathname === '/restapi')
            this.setState({
                homeBorder: '0px',
                tableBorder: '0px',
                apiBorder: '3px',
                loginBorder: '0px'
            })
        else
            this.setState({
                homeBorder: '3px',
                tableBorder: '0px',
                apiBorder: '0px',
                loginBorder: '0px'
            })
    }

    render() {
        return (
            <div>
                <div className="nav-bar">
                    <nav>
                        <ul>
                            <li><span onClick={this.home}
                                      style={{borderBottom: `${this.state.homeBorder} solid white`}}>Home</span></li>
                            <li><span onClick={this.table}
                                      style={{borderBottom: `${this.state.tableBorder} solid white`}}>Table</span></li>
                            <li><span onClick={this.api}
                                      style={{borderBottom: `${this.state.apiBorder} solid white`}}>RestApi</span></li>
                            <li><span onClick={this.login}
                                      style={{borderBottom: `${this.state.loginBorder} solid white`}}>Login</span></li>
                        </ul>
                    </nav>
                </div>
                <div>
                    <Router history={history}>
                        <Switch>
                            <Route
                                exact
                                strict
                                path="/"
                                component={Home}
                            />
                            <Route exact
                                   strict
                                   path="/restapi"
                                   component={API}
                            />
                            <Route exact
                                   strict
                                   path="/login"
                                   component={Login}
                            />
                            <Route
                                default
                                path="/home"
                                component={Home}
                            />
                            <Route
                                exact
                                path="/table"
                                component={TableComponent}
                            />
                        </Switch>
                    </Router>
                </div>
            </div>
        );
    }
}

export default App;

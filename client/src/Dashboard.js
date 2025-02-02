import React, { Component } from 'react';
import './App.css';
import Gandalf from './assets/gandalf.png'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Col, Button, Navbar } from 'react-bootstrap';
import setAuthToken from "./setAuthToken"

class Dashboard extends Component {
  onClick= event => {
    localStorage.removeItem("jwtToken");
    // Remove Auth headers from axios request
    setAuthToken(false);
    this.props.history.push('/login')
  };
    render() {
        return (
          <Col>
            <Navbar className="justify-content-end">
                <Button variant="outline-primary" onClick={this.onClick}>
                  Logout
                </Button>
            </Navbar>
            <Col className="gandalf_col">
              {/* <h1>Hello User!</h1> */}
              <div className="gandalf_div">
                <p className="gandalf_text">"Oh, it's quite simple. If you are a friend, you speak the password, and the doors will open."</p>
                <p className="gandalf">- Gandalf</p>
              </div>
            </Col>
            <img className="gandalf_pic" src={Gandalf} alt="gandalf"></img>
          </Col>
        )
    }
}

export default Dashboard;
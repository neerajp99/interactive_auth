import React, { Component } from 'react';
import './App.css';
import './fonts/DIN Next LT Pro Medium.ttf';
import './fonts/Lato-Bold.ttf';
import logill from './assets/Login_Illustration.png'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Col, Row, Form, Button } from 'react-bootstrap';
import axios from 'axios';
import setAuthToken from "./setAuthToken";
import jwt_decode from "jwt-decode";
import { Link } from "react-router-dom";


class Login extends Component {
    state = {
        email: "",
        password: ""
      }

      componentDidMount() {
        if (localStorage.jwtToken){
          this.props.history.push('/')
        }
      }

      onChange = event => {
        this.setState({
          [event.target.name]: event.target.value
        });
      };
    
      onSubmit = event => {
        event.preventDefault();
        const newUser = {
          email: this.state.email,
          password: this.state.password
        }
    
        axios.post('/api/userAuth/login', newUser)
        .then(res => {
          console.log(res)
          // Save the incoming data to local storage
          const { token } = res.data;
          // Set token to localstorage
          localStorage.setItem("jwtToken", token);
          // Set auth token to auth header
          setAuthToken(token);
          // Decode the access token to get user data
          const decodedToken = jwt_decode(token);
          localStorage.setItem("decodedToken", decodedToken)
          this.props.history.push("/")
        })
        .catch(error => {
          console.log(error)
        })
    
      }
    render() {
        return (
            <div>
                 <Row>
                    <Col xs={8} className="image_col">
                        <img className="log_ill" src={logill} alt="login"></img>
                    </Col>

                    <Col className="content_col">
                        <div className="form_box">
                        <h2 className="login-heading">Welcome Back</h2>
                        <p className="login-subheading">To log in please enter your email and password</p>
                        <Form className="new_form"  onSubmit={this.onSubmit}> 
                            <Form.Group controlId="formBasicEmail">
                            <Form.Control className="form_text" type="email" placeholder="Email" value = {this.state.email} onChange={this.onChange} name="email"/>
                            <Form.Text className="text-muted">
                            <p className="caption">We'll never share your email with anyone else.</p>
                            </Form.Text>
                        </Form.Group>

                        <Form.Group controlId="formBasicPassword">
                            <Form.Control className="form_text" type="password" placeholder="Password" value={this.state.password} onChange={this.onChange} name="password"/>
                        </Form.Group>
                        <Button className="form_button" variant="primary" type="submit">
                            Login
                        </Button>
                        </Form>
                        <p className="check_test">First Time? <Link to="/signup">Sign Up</Link></p>
                        </div>
                    </Col>
                 </Row>
            </div>
        )
    }
}

export default Login;
import './App.css';
import './fonts/DIN Next LT Pro Medium.ttf';
import './fonts/Lato-Bold.ttf';
import logill from './assets/SignUp_Illustration.png'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Col, Row, Form, Button } from 'react-bootstrap';
import axios from 'axios';
import React from "react";

class Signup extends React.Component {
  state = {
    email: "",
    password: ""
  }
  onChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  componentDidMount() {
    if (localStorage.jwtToken){
      this.props.history.push('/')
    }
  }

  onSubmit = event => {
    event.preventDefault();
    const newUser = {
      email: this.state.email,
      password: this.state.password
    }

    axios.post('/api/userAuth/register', newUser)
    .then(res => {
      this.props.history.push("/login")
    })
    .catch(error => {
      console.log(error)
    })

  }
  render(){
  return (
    <React.Fragment>
    <Row>
      <Col xs={8} className="image_col">
        <img className="log_ill" src={logill} alt="login"></img>
      </Col>

      <Col>
        <div className="form_box">
          <h2 className="login-heading">Welcome New User</h2>
          <p className="login-subheading">To sign up please enter your email and password</p>
          <Form className="new_form" onSubmit={this.onSubmit}>
            <Form.Group controlId="formBasicEmail">
            <Form.Control className="form_text" type="email" placeholder="Email" value = {this.state.email} onChange={this.onChange} name="email"/>
            <Form.Text className="text-muted">
              <p className="caption">We'll never share your email with anyone else.</p>
            </Form.Text>
          </Form.Group>

          <Form.Group controlId="formBasicPassword">
            <Form.Control className="form_text" type="password" placeholder="Password" value={this.state.password} onChange={this.onChange} name="password"/>
          </Form.Group>

          {/* <Form.Group controlId="formBasicPassword">
            <Form.Control className="form_text" type="password" placeholder="Confirm Password" value={this.state.password1} onChange={this.onChange} name="password1"/>
          </Form.Group> */}

          <Button className="form_button" variant="primary" type="submit">
           Register
          </Button>
        </Form>
        </div>
      </Col>
    </Row>
    </React.Fragment>
  );
  }
}

export default Signup;
import './App.css';
import './fonts/DIN Next LT Pro Medium.ttf';
import './fonts/Lato-Bold.ttf';
import logill from './assets/Login_Illustration.png'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Col, Row, Form, Button } from 'react-bootstrap';

function App() {
  return (
    <Row>
      <Col xs={8} className="image_col">
        <img className="log_ill" src={logill} alt="login"></img>
      </Col>

      <Col>
        <div className="form_box">
          <h2 className="login-heading">Welcome Back</h2>
          <p className="login-subheading">To log in please enter your email and password</p>
          <Form className="new_form">
            <Form.Group controlId="formBasicEmail">
            <Form.Control className="form_text" type="email" placeholder="Email" />
            <Form.Text className="text-muted">
              <p className="caption">We'll never share your email with anyone else.</p>
            </Form.Text>
          </Form.Group>

          <Form.Group controlId="formBasicPassword">
            <Form.Control className="form_text" type="password" placeholder="Password" />
          </Form.Group>
          <Button className="form_button" variant="primary" type="submit">
            Login
          </Button>
        </Form>
        <p className="check_test">First Time? <a classname="link" href={"https://google.com/"}>Sign Up</a></p>
        </div>
      </Col>
    </Row>
  );
}

export default App;
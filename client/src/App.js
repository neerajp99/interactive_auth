import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Login from "./Login"
import SignUp from "./Signup"
import Dashboard from "./Dashboard"
import setAuthToken from "./setAuthToken"
import jwt_decode from "jwt-decode"


if (localStorage.jwtToken) {
  // Set auth token header auth
  setAuthToken(localStorage.jwtToken);
  //Decode the tokens ang get user infe ormation
  const decodedToken = jwt_decode(localStorage.jwtToken);
  //Check for expired tokens
  const currentTime = Date.now() / 1000;
  if (decodedToken.exp < currentTime) {
    // log out user
    localStorage.removeItem("jwtToken");
    // Remove Auth headers from axios request
    setAuthToken(false);
    // Set profile to null
    // store.dispatch(clearProfile());
    // clear current Profile
    // TODO:::TODO
    // Redirect to login
    window.alert("Session expired, please login again.");
    window.location.href = "/login";
  }
}


function App() {
  return (
    <Router>
          <div className="App">
          <Route exact path="/" component={Dashboard} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/signup" component={SignUp} />
          </div>
    </Router>
  );
}

export default App;
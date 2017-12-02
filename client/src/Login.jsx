import React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import Paper from 'material-ui/Paper';


class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loginUsername: '',
      loginPassword: '',
      signupUsername: '',
      signupPassword: '',
      signupPassword2: '',
      loginView: true
    }
    this.elementChange = this.elementChange.bind(this);
    this.changeLoginView = this.changeLoginView.bind(this);
    this.resetLoginFields = this.resetLoginFields.bind(this);
    this.handleSignupClick = this.handleSignupClick.bind(this);
  }

  elementChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    })
  }
  changeLoginView() {
    this.setState({
      loginView: !this.state.loginView
    });
  }

  handleSignupClick() {
    if (this.state.signupPassword !== this.state.signupPassword2) {
      alert('Password entries must match');
      this.resetLoginFields();
    } else {
      this.props.signup(this.state.signupUsername, this.state.signupPassword);
    }
  }

  resetLoginFields() {
    this.setState({
      loginUsername: '',
      loginPassword: '',
      signupUsername: '',
      signupPassword: '',
      signupPassword2: ''
    });
  }

  render() {
    const style = {
      sign: {
        height: 300,
        width: 300,
        margin: '0 auto',
        textAlign: 'center',
        display: 'inline-block'
      },
      login: {
        height: 200,
        width: 300,
        margin: '0 auto',
        textAlign: 'center',
        display: 'inline-block'
      }
    };

    let loginOrSignupView
    if (this.state.loginView) {
      loginOrSignupView = <div >
              <Paper style={style.login} zDepth={1}>
                <TextField
                  hintText="Enter Username"
                  floatingLabelText="Username"
                  name="loginUsername"
                  value={this.state.loginUsername}
                  onChange={this.elementChange}
                 />
                 <br />
                <TextField
                  type="password"
                  hintText="Enter Password"
                  floatingLabelText="Password"
                  name="loginPassword"
                  value={this.state.loginPassword}
                  onChange={this.elementChange}
                 />
                 <br />
                <RaisedButton label="LOGIN" primary={true} onClick={this.props.login.bind(this, this.state.loginUsername, this.state.loginPassword)} />
                <RaisedButton label="Signup as new user" primary={true} onClick={this.changeLoginView} />
              </Paper>
            </div>
    } else {
      loginOrSignupView = <div >
              <Paper style={style.sign} zDepth={1}>
                <TextField
                  hintText="Enter Username"
                  floatingLabelText="Username"
                  name="signupUsername"
                  value={this.state.signupUsername}
                  onChange={this.elementChange}
                />
                <br />
                <TextField
                  type="password"
                  hintText="Enter Password"
                  floatingLabelText="Password"
                  name="signupPassword"
                  value={this.state.signupPassword}
                  onChange={this.elementChange}
                />
                <br />
                <TextField
                  type="password"
                  hintText="Verify Password"
                  floatingLabelText="Re-enter Password"
                  name="signupPassword2"
                  value={this.state.signupPassword2}
                  onChange={this.elementChange}
                />
                <br />
                <RaisedButton label="SIGNUP" primary={true} onClick={this.handleSignupClick}/>
                <RaisedButton label="Go back to login" primary={true} onClick={this.changeLoginView} />
              </Paper>
            </div>
    }
    return (
      <MuiThemeProvider muiTheme={this.props.muiTheme}>
        <div>
          <div className="row loginSignup">
            <h1>Get Started</h1>
            {loginOrSignupView}
            <div className="col-md-4 icon">

            </div>
          </div>
          <div className="quote">
            <h1>"He who controls others may be powerful, but he who has mastered himself is mightier still."</h1>
            <br />
            <h3>-Lao Tzu</h3>
          </div>
          <div className="row highlights">
            <div className="col-md-4 use">
              <h2>Improve Yourself</h2>
                <p>Set goals and limits for yourself</p>
                <p>Improve your habits</p>
                <p>Track your success</p>
            </div>
            <div className="col-md-4 icon">
              <img src="https://www.analyticsinsight.net/wp-content/uploads/2017/09/data-visualization-tools-concept.png" />
            </div>
            <div className="col-md-4 features">
              <h2>Features</h2>
              <p>Track habits by date</p>
              <p>Easily visualize your habits</p>
            </div>
          </div>
        </div>
      </MuiThemeProvider>
    )
  }
}

export default Login;
import React from 'react';
import ReactDOM from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import TopBar from './TopBar.jsx';
import MuiTable from './Table.jsx';
import Chart from './Chart.jsx';
import DataLogger from './DataLogger.jsx';
import Auth from './Auth/Auth.jsx';
import axios from 'axios';
import Login from './Login.jsx';
import EventCreator from './EventCreator.jsx';
import EventSelector from './EventSelector.jsx';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      habits: [],
      username: null,
      viewData: false,
      viewHabit: '',
      errorText: '',
      createHabitView: false
    }
    this.login = this.login.bind(this);
    this.signup = this.signup.bind(this);
    this.logout = this.logout.bind(this);
    this.getUserData = this.getUserData.bind(this);
    this.getHabitsInfo = this.getHabitsInfo.bind(this);
    this.logHabit = this.logHabit.bind(this);
    this.createHabit = this.createHabit.bind(this);
    this.selectHabit = this.selectHabit.bind(this);
    this.checkFields = this.checkFields.bind(this);
    this.changeCreateHabitView = this.changeCreateHabitView.bind(this);
  }

  login(username, password) {
    axios.post('/login', {username: username, password: password})
      .then((res) => {
        console.log('cliend index.js login');
        console.log(res.data);
        if (res.data) {
          this.setState({
            username: res.data}, function() {
              this.getUserData();
            });
        } else {
          alert('Incorrect Credentials');
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }

  signup(username, password) {
    if (username.length < 4 || password.length < 4) {
      alert('Username and password must be at least 4 characters.');
    } else {
      axios.post('/signup', {username: username, password: password})
        .then((res) => {
          if (res.data) {
            this.setState({
              username: res.data,
            });
          } else {
            alert('Failed to sign up. Username possibly taken.');
          }
        })
        .catch((err) => {
          console.error(err);
        });
      }
  }

  logout() {
    console.log('inside logout function', this);
    axios.get('/logout')
      .then((res) => {
        console.log('response: ', res);
        this.setState({
          habits: [],
          username: null,
          viewData: false,
          viewHabit: '',
        });
      })
      .catch((err) => {
        console.error(err);
      });
  }

  // retrieve user's habits and set as state for other components
  getUserData() {
    let username = this.state.username;
    axios.get(`/users/${username}`)
      .then((res) => {
        this.setState({
          habits: res.data,
        })
      })
      .catch((err) => {
        console.error(err);
      });
  }

  // retrieve occurrences information for specific habit of user
  getHabitsInfo(habit) {
    let username = this.state.username;
    axios.get(`/api/${username}/${habit}`)
      .then((res) => {
        this.setState({
          timeframe: res.data.timeframe,
          unit: res.data.unit,
          limit: res.data.limit,
          occurrences: res.data.occurrences,
          viewData: true,
        });
      })
      .catch((err) => {
        console.error(err);
      });
  }

  // used in dataLogger to record occurrence in database (POST)
  logHabit(event, time, quantity) {
    let fieldsFilled = this.checkFields(event, quantity);
    if(fieldsFilled) {
      let occurrence = {
        username: this.state.username,
        habit: event,
        occurrence: {
          timestamp: time,
          value: quantity,
        },
      };
      axios.post(`/api/${this.state.username}/log`, occurrence)
      .then((res) => {
        this.selectHabit(event);
        // can re-factor to use occurrence object returned by the request
      })
      .catch((err) => {
        console.error(err);
      });
    } else {
      this.setState({ errorText: 'Required' });
    }
  }

  // used to ensure input fields are filled in for data logger
  checkFields(event, quantity) {
    return event && quantity.length > 0;
  }

  //used by EventCreator to add habits to user's list of habits in database
  createHabit(name, unit, limit, timeframe) {
    let habit = {
      username: this.state.username,
      habit: name,
      limit: limit,
      unit: unit,
      timeframe: timeframe,
    };
    axios.post(`/api/${this.state.username}/habit`, habit)
    .then((res) => {
      this.getUserData();
    })
    .catch((err) => {
      console.error(err);
    });
  }

  // select habit to be displayed in chart and table
  selectHabit(habitName) {
    this.setState({
      viewHabit: habitName,
    });
    this.getHabitsInfo(habitName);
  }

  componentDidMount() {
    let that = this;
    axios.get('/checkSession')
    .then((res) => {
      if (res.data) {
        this.setState({
          username: res.data
        }, function() {
          this.getUserData();
        });
      }
    })
    .catch((err) => {
      console.log(err);
    });
  }
  changeCreateHabitView() {
    const newView = !this.state.createHabitView
    this.setState({
      createHabitView: newView
    });
  }

  // all MUI components must be wrapped by MuiThemeProvider
  render() {
    let habitCreateOrDataLogger;
    if (this.state.createHabitView) {
      habitCreateOrDataLogger = <EventCreator createHabit={this.createHabit} changeCreateHabitView={this.changeCreateHabitView} />
    } else {
      habitCreateOrDataLogger = <DataLogger habits={this.state.habits}
                            occurrences={this.state.occurrences}
                            errorText={this.state.errorText}
                            getHabitsInfo={this.getHabitsInfo.bind(this)}
                            logHabit={this.logHabit}
                            changeCreateHabitView={this.changeCreateHabitView} />
    }
    return (
      <div className="container-fluid">
        <MuiThemeProvider>
          <TopBar logout={this.logout} loggedIn={this.state.username} />
        </MuiThemeProvider>
        {!this.state.username ?
        <Login login={this.login} signup={this.signup} />
        : null}
        {this.state.username ?
          <div className="main">
            <div className="row rowA">
              <MuiThemeProvider>
                {habitCreateOrDataLogger}
              </MuiThemeProvider>

              <MuiThemeProvider>
                <EventSelector habits={this.state.habits} selectHabit={this.selectHabit}/>
              </MuiThemeProvider>
            </div>
            <div className="row rowB">
              <MuiThemeProvider>
              {this.state.viewData ?
                <MuiTable habit={this.state.viewHabit} timeframe={this.state.timeframe} unit={this.state.unit} limit={this.state.limit} occurrences={this.state.occurrences} /> : null}
              </MuiThemeProvider>
            </div>
            <div className="row rowC">
              {this.state.viewData ?
                <Chart habit={this.state.viewHabit} timeframe={this.state.timeframe} unit={this.state.unit} limit={this.state.limit} occurrences={this.state.occurrences} /> : null}
            </div>
          </div>
          : null}
      </div>
    )
  }
}


ReactDOM.render(<App />, document.getElementById('app'));
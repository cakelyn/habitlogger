import React from 'react';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';
import moment from 'moment';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';

class MuiTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      height: '300px',
      time: '',
      showUpdateDelete: false,
    }
  }

  handleRowClick(e) {
    let parent = e.target.parentNode.parentNode.parentNode;
    this.setState({ time: parent.childNodes[1] });
  }

  handleModify() {
    // show number input field
    // show update button
    // show delete button
    // query: username, habit name, timestamp
  }

  render() {
    return (
      <div className="table">
        <h1 className="tableName">{this.props.habit}</h1>
        <h2 className="limitInfo">You set your goal to {this.props.limit} {this.props.unit} per {this.props.timeframe}</h2>
        <Table height={this.state.height} width={this.state.width}>
          <TableHeader displaySelectAll={false}>
            <TableRow>
              <TableHeaderColumn>Date</TableHeaderColumn>
              <TableHeaderColumn>{this.props.unit}</TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody>
            {
              this.props.occurrences.map((occurence, index) => {
                let momentDate = moment(occurence.timestamp).format('MMM Do YYYY');
                return (
                  <TableRow id="test" key={occurence._id} onChange={this.handleRowClick}>
                    <TableRowColumn>{momentDate}</TableRowColumn>
                    <TableRowColumn>{occurence.value}</TableRowColumn>
                  </TableRow>
                )
              })
            }
          </TableBody>
        </Table>

        <RaisedButton label="Modify" primary={true} onClick={this.handleModify} />
        {this.state.showUpdateDelete ?
          <UpdateDelete />
          : null
        }
      </div>
    )
  }
};

export default MuiTable;
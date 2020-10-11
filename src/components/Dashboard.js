import React from "react";
import "./dashboard.css";
import WidgetText from "./WidgetText";
import WidgetBar from "./WidgetBar";
import WidgetDonut from "./WidgetDonut";
import WidgetColumn from "./WidgetColumn";
import WidgetArea from "./WidgetArea";
import Dropdown from "react-dropdown";
import { Container, Row, Col } from "react-bootstrap";
import "react-dropdown/style.css";

const config = {
  apiKey: "AIzaSyDMu-Vw30ykPPmFT3cXeunzKEi4EahzglI",
  spreadsheetId: "1vcDPrMexD8bxNwwzK9IxF8wch6Hfezq2eooJACDiqgg"
};
const url = `https://sheets.googleapis.com/v4/spreadsheets/${config.spreadsheetId}/values:batchGet?ranges=Sheet1&majorDimension=ROWS&key=${config.apiKey}`;

export default class Dashboard extends React.Component {
  constructor() {
    super();
    this.state = {
      items: [],
      dropdownOptions: [],
      selectedValue: null,
      organicSource: null,
      directSource: null,
      referralSource: null,
      pageViews: null,
      users: null,
      newUsers: null,
      sourceArr: [],
      viewArr: [],
      sessionArr: [],
      socialArr: []
    };
  }
  getData = (arg) => {
    const arr = this.state.items;
    const arrLength = arr.length;
    let organicSource = 0;
    let directSource = 0;
    let referralSource = 0;
    let pageViews = 0;
    let users = 0;
    let newUsers = 0;
    let selectedValue = null;
    let sourceArr = [];
    let viewArr = [];
    let sessionArr = [];
    let socialArr = [];
    for (let i = 0; i < arrLength; i++) {
      if (arg === arr[i]["month"]) {
        organicSource = arr[i].organic_source;
        directSource = arr[i].direct_source;
        referralSource = arr[i].referral_source;
        pageViews = arr[i].page_views;
        users = arr[i].users;
        newUsers = arr[i].new_users;
        sourceArr.push(
          {
            label: "Organic Source",
            value: arr[i].organic_source
          },
          {
            label: "Direct Source",
            value: arr[i].direct_source
          },
          {
            label: "Referral Source",
            value: arr[i].referral_source
          }
        );
        viewArr.push(
          {
            label: "Users",
            value: arr[i].users
          },
          {
            label: "New Users",
            value: arr[i].new_users
          }
        );
        sessionArr.push(
          {
            label: "Sessions",
            value: arr[i].sessions
          },
          {
            label: "Session Per User",
            value: arr[i].number_of_sessions_per_users
          },
          {
            label: "Average Sessions",
            value: arr[i].avg_session_time
          }
        );
        socialArr.push(
          {
            label: "Social Source",
            value: arr[i].social_source
          },
          {
            label: "Email Source",
            value: arr[i].email_source
          }
        );
      }
    }
    selectedValue = arg;
    this.setState(
      {
        organicSource: organicSource,
        directSource: directSource,
        referralSource: referralSource,
        pageViews: pageViews,
        users: users,
        newUsers: newUsers,
        sourceArr: sourceArr,
        viewArr: viewArr,
        sessionArr: sessionArr,
        socialArr: socialArr
      }
      // () => {
      //   console.log(this.state.organicSource);
      // }
    );
  };
  updateDashboard = (event) => {
    this.getData(event.value);
    this.setState({ selectedValue: event.value });
  };
  componentDidMount() {
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        let batchRowValues = data.valueRanges[0].values;

        const rows = [];

        for (let i = 1; i < batchRowValues.length; i++) {
          let rowObject = {};
          for (let j = 0; j < batchRowValues[i].length; j++) {
            rowObject[batchRowValues[0][j]] = batchRowValues[i][j];
          }
          rows.push(rowObject);
        }
        // console.log(rows);
        // dropdown options
        let dropdownOptions = [];

        for (let i = 0; i < rows.length; i++) {
          dropdownOptions.push(rows[i].month);
        }

        dropdownOptions = Array.from(new Set(dropdownOptions)).reverse();
        this.setState(
          {
            items: rows,
            dropdownOptions: dropdownOptions,
            selectedValue: "Jan 2018"
          },
          () => this.getData("Jan 2018")
        );
      });
  }
  render() {
    return (
      <div>
        <Container fluid>
          <Row className="top-header">
            <Col>Dashboard</Col>
            <Col>
              {" "}
              <div className="dropdown">
                <Dropdown
                  options={this.state.dropdownOptions}
                  onChange={this.updateDashboard}
                  value={this.state.selectedValue}
                  placeholder="Select an option"
                />
              </div>
            </Col>
          </Row>
        </Container>
        <Container className="main-dashboard">
          <Row>
            <Col>
              {" "}
              <WidgetText
                title="Organic Source"
                value={this.state.organicSource}
              />
            </Col>
            <Col>
              <WidgetText
                title="Direct Source"
                value={this.state.directSource}
              />
            </Col>
            <Col>
              <WidgetText
                title="Referral Source"
                value={this.state.referralSource}
              />
            </Col>
            <Col>
              <WidgetText title="Page Views" value={this.state.pageViews} />
            </Col>
          </Row>
          <Row>
            <Col>
              {" "}
              <WidgetText
                title="User"
                value={this.state.users}
                description="Current Users"
              />
            </Col>
            <Col>
              <WidgetText
                title="New Users"
                value={this.state.newUsers}
                description="Users Joined"
              />
            </Col>
          </Row>
        </Container>
        <Container>
          <Row>
            <Col>
              <WidgetBar
                title="source comparision"
                data={this.state.sourceArr}
              />
            </Col>
            <Col>
              <WidgetDonut title="User Comparision" data={this.state.viewArr} />
            </Col>
          </Row>
        </Container>
        <Container>
          <Row>
            <Col>
              <WidgetArea title="Social" data={this.state.socialArr} />
            </Col>
            <Col>
              <WidgetColumn title="Sessions" data={this.state.sessionArr} />
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

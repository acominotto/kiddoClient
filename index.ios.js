/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

var MOCKED_MOVIES_DATA = [
  {title: 'Title', year: '2015', posters: {thumbnail: 'http://i.imgur.com/UePbdph.jpg'}},
];

 var React = require('react-native');
 var { AppRegistry, Image, ListView, StyleSheet, Text, View, TouchableHighlight, StatusBarIOS, TextInput } = React;
var statusbar = require('./lib/statusbar')
var Button = require('react-native-button')
var { Icon } = require('react-native-icons');
var TimerMixin = require('react-timer-mixin');
var {RadioButtons, SegmentedControls} = require('react-native-radio-buttons');

var { TabBarIOS } = require('react-native-icons');
var TabBarItemIOS = TabBarIOS.Item;
var CheckBoxItem = require('react-native-item-checkbox')


var hours = [[{hour: '07.00 AM', places: 12}, {hour: '07.20 AM', places: 0}, {hour: '07.40 AM', places: 12}],
             [{hour: '08.00 AM', places: 12}, {hour: '08.20 AM', places: 12}, {hour: '08.40 AM', places: 12}],
             [{hour: '09.00 AM', places: 12}, {hour: '09.20 AM', places: 12}, {hour: '09.40 AM', places: 12}]];

var leavingHours = [[{hour: '05.00 PM', places: 12}, {hour: '05.20 PM', places: 12}, {hour: '05.40 PM', places: 0}],
            [{hour: '06.00 PM', places: 12}, {hour: '06.20 PM', places: 0}, {hour: '06.40 PM', places: 12}],
            [{hour: '07.00 PM', places: 12}, {hour: '07.20 PM', places: 12}, {hour: '07.40 PM', places: 12}]];

var BookingTab = React.createClass({
  mixins: [TimerMixin],
  getInitialState: function(){
    return {
      hours: hours,
      chosenDay: 'monday',
      hourChosen: {},
      leaveHourChosen: {},
      timeouts: [],
      disabledHours: {}
    };
  },
  clearTimeouts: function(){
    this.state.timeouts.map(x => this.clearTimeout(x))
    this.state.timeouts = []
  },
  setChosenDay: function(day){
    this.setState({chosenDay: day})
  },
  setHourChosen: function(hour){
    this.clearTimeouts();
    var hour = hour.hour;
    var newHours = this.state.hourChosen
    var unbooking = newHours[this.state.chosenDay] === hour;
    if(unbooking){
      newHours[this.state.chosenDay] = null;
      this.state.timeouts.push(this.setTimeout(() => this.setState({unbooking: false}), 2000))
    } else {
      newHours[this.state.chosenDay] = hour;
      this.state.timeouts.push(this.setTimeout(() => this.setState({booking: false}), 2000))
    }
    this.setState({
      hourChosen: newHours,
      booking: !unbooking,
      unbooking: unbooking
    })
  },
  setLeaveHourChosen: function(hour){
    var hour = hour.hour;
    this.clearTimeouts();
    var newHours = this.state.leaveHourChosen;
    var unbooking = newHours[this.state.chosenDay] === hour;
    if(unbooking){
      newHours[this.state.chosenDay] = null;
      this.state.timeouts.push(this.setTimeout(() => this.setState({unbooking: false}), 2000))
    } else {
      newHours[this.state.chosenDay] = hour;
      this.state.timeouts.push(this.setTimeout(() => this.setState({booking: false}), 2000));
    }
    this.setState({
      leaveHourChosen: newHours,
      booking: !unbooking,
      unbooking: unbooking
    })
  },
  hourStyle: function(hour){
    if(hour.places == 0)
      return styles.disableHours;
    if(this.isHourChosen(hour) || this.isLeaveHourChosen(hour))
      return styles.hourChosen;
    return styles.hour;
  },
  isDisabledHour: function(h){
    return !h.places;
  },
  isHourChosen: function(h){
      var chosenDay = this.state.chosenDay;
      return this.state.hourChosen[chosenDay] == h.hour
  },
  isLeaveHourChosen: function(h){
      var chosenDay = this.state.chosenDay;
      return this.state.leaveHourChosen[chosenDay] == h.hour
  },
  renderBooked: function(should){
    if(!should) return null;
    return (<Text style={styles.bookingBook}>Booked!</Text>);
  },
  renderUnbooked: function(should){
    if(!should) return null;
    return (<Text style={styles.bookingUnbook}>Unbooked!</Text>);
  },
  renderIcon: function(should, icon){
    if(should)
      return (<Icon
        name={icon}
        size={24}
        color='black'
        style={styles.icon}
      />);
    else {
      return null;
    }
  },
  render: function(){
    if(this.state.overview)
      return (
        <View style={ styles.container }>
          <View style={ styles.header }>
            <Image style={styles.headerImage} source={require('./logo.png')} />
          </View>
          <View style={styles.content}>
            <View style={styles.overviewBar}>
              <Button onPress={() => {
                this.setState({
                  overview: false
                });
              }}>Edition</Button>
            </View>
              <View style={styles.column}>
                <View style={styles.dayOverview}>
                  <Text style={styles.dayOverviewText}>Monday: </Text>
                    {this.renderIcon(this.state.hourChosen['monday'],'ion|model-s')}
                    <Text style={styles.dayOverviewTrip}>
                       {this.state.hourChosen['monday']}
                    </Text>
                    <Text style={styles.dayOverviewTrip}> {this.state.leaveHourChosen['monday']}</Text>
                    {this.renderIcon(this.state.leaveHourChosen['monday'],'ion|ios-home')}
                </View>
                <View style={styles.dayOverview}>
                  <Text style={styles.dayOverviewText}>Tuseday: </Text>
                  {this.renderIcon(this.state.hourChosen['tuesday'],'ion|model-s')}
                  <Text style={styles.dayOverviewTrip}>{this.state.hourChosen['tuesday']}</Text>
                  <Text style={styles.dayOverviewTrip}> {this.state.leaveHourChosen['tuesday']}</Text>
                  {this.renderIcon(this.state.leaveHourChosen['tuesday'],'ion|ios-home')}
                </View>
                <View style={styles.dayOverview}>
                  <Text style={styles.dayOverviewText}>Wednesday: </Text>
                  {this.renderIcon(this.state.hourChosen['wednesday'],'ion|model-s')}
                  <Text style={styles.dayOverviewTrip}>{this.state.hourChosen['wednesday']} </Text>
                  <Text style={styles.dayOverviewTrip}> {this.state.leaveHourChosen['wednesday']}</Text>
                  {this.renderIcon(this.state.leaveHourChosen['wednesday'],'ion|ios-home')}
                </View>
                <View style={styles.dayOverview}>
                  <Text style={styles.dayOverviewText}>Thursday: </Text>
                  {this.renderIcon(this.state.hourChosen['thursday'],'ion|model-s')}
                  <Text style={styles.dayOverviewTrip}>{this.state.hourChosen['thursday']} </Text>
                  <Text style={styles.dayOverviewTrip}> {this.state.leaveHourChosen['thursday']}</Text>
                  {this.renderIcon(this.state.leaveHourChosen['thursday'],'ion|ios-home')}
                </View>
                <View style={styles.dayOverview}>
                  <Text style={styles.dayOverviewText}>Friday: </Text>
                  {this.renderIcon(this.state.hourChosen['friday'],'ion|model-s')}
                  <Text style={styles.dayOverviewTrip}>{this.state.hourChosen['friday']} </Text>
                  <Text style={styles.dayOverviewTrip}> {this.state.leaveHourChosen['friday']}</Text>
                  {this.renderIcon(this.state.leaveHourChosen['friday'],'ion|ios-home')}
                </View>
              </View>
          </View>
        </View>
      );

    return (
      <View style={ styles.container }>
        <View style={ styles.header }>
          <Image style={styles.headerImage} source={require('./logo.png')} />
        </View>
        <View style={styles.content}>
          <View style={styles.overviewBar}>
            <Button onPress={() => {
              this.setState({
                overview: true
              });
            }}>Overview</Button>
          </View>
          <View style={styles.bookingContent}>
            <View style={styles.daysBar}>
              <Button style={this.state.chosenDay === 'monday' ? styles.chosenDay: styles.day} onPress={() => {this.setChosenDay('monday')}}>Monday</Button>
              <Button style={this.state.chosenDay === 'tuesday' ? styles.chosenDay: styles.day} onPress={() => {this.setChosenDay('tuesday')}}>Tuesday</Button>
              <Button style={this.state.chosenDay === 'wednesday' ? styles.chosenDay: styles.day} onPress={() => {this.setChosenDay('wednesday')}}>Wednesday</Button>
              <Button style={this.state.chosenDay === 'thursday' ? styles.chosenDay: styles.day} onPress={() => {this.setChosenDay('thursday')}}>Thursday</Button>
              <Button style={this.state.chosenDay === 'friday' ? styles.chosenDay: styles.day} onPress={() => {this.setChosenDay('friday')}}>Friday</Button>
            </View>
            <View style={styles.hoursContent}>
              <View><Text style={styles.hoursTitle}>Morning</Text>
                {hours.map(x =>
                  <View style={styles.hours}>
                    {x.map(y =>
                      <Button
                        style={this.hourStyle(y)}
                        onPress={() => {if(!this.isDisabledHour(y)) this.setHourChosen(y)}}>
                          {y.hour}
                        </Button>)}
                  </View>)
                }
              </View>
              <View style={styles.booking}>
                {this.renderBooked(this.state.booking)}
                {this.renderUnbooked(this.state.unbooking)}
              </View>
              <View style={styles.leavingHours}><Text style={styles.hoursTitle}>Evening</Text>
                {leavingHours.map(x =>
                  <View style={styles.hours}>
                    {x.map(y =>
                      <Button
                        style={this.hourStyle(y)}
                        onPress={() => {if(!this.isDisabledHour(y)) this.setLeaveHourChosen(y)}}>
                          {y.hour}
                        </Button>)}
                  </View>)
                }
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  }
});
var ChildrenTab = React.createClass({
  render: function(){
    return (
      <View style={styles.container}>
        <View style={ styles.header }>
          <Image style={styles.headerImage} source={require('./logo.png')} />
        </View>
        <View style={styles.column}>
          <View style={styles.row}>
            <Image style={styles.babyPhoto} source={require('./baby.png')} />
            <View style={styles.babyInfo}>
              <Text style={styles.babyInfoItem}>Maxime</Text>
              <Text style={styles.babyInfoItem}>Schmidt</Text>
              <Text style={styles.babyInfoItem}>3 years old</Text>
              <Text style={styles.babyInfoItem}>72, chemin des prés</Text>
              <Text style={styles.babyInfoItem}>18225 Petange</Text>
              <Text style={styles.babyInfoItem}>LUXEMBOURG</Text>
            </View>
          </View>
          <View>
            <View style={styles.additionalInfoItem}>
              <Text style={styles.additionalInfoItemKey}>Nursery</Text>
              <Text style={styles.additionalInfoItemValue}>Les p'tits bouts d'choux (+352 1825361)</Text>
            </View>
            <View style={styles.additionalInfoItem}>
              <Text style={styles.additionalInfoItemKey}>Mother</Text>
              <Text style={styles.additionalInfoItemValue}>[KPMG] Letizia Ramos (+352 62133456)</Text>
              </View>
            <View style={styles.additionalInfoItem}>
              <Text style={styles.additionalInfoItemKey}>Father</Text>
              <Text style={styles.additionalInfoItemValue}>[Clearstream] Bernard Schmidt (+352 52019432)</Text>
              </View>
            <View style={styles.additionalInfoItem}>
              <Text style={styles.additionalInfoItemKey}>RegularMD</Text>
              <Text style={styles.additionalInfoItemValue}>Dr JC Dus (+352 3069442)</Text>
              </View>
            <View style={styles.additionalInfoItem}>
              <Text style={styles.additionalInfoItemKey}>Allergies</Text>
              <Text style={styles.additionalInfoItemValue}>Everything, basically</Text>
              </View>
            <View style={styles.additionalInfoItem}>
              <Text style={styles.additionalInfoItemKey}>Sicknesses</Text>
              <Text style={styles.additionalInfoItemValue}>Asthma</Text>
              </View>
            <View style={styles.additionalInfoItem}>
              <Text style={styles.additionalInfoItemKey}>Additional Informations</Text>
              <Text style={styles.additionalInfoItemValue}>Needs his teddybear to sleep</Text>
              </View>
          </View>
        </View>
      </View>
    );
  }
});
var SettingsTab = React.createClass({
  setSelectedOption: function(selectedOption){
    this.setState({
      selectedOption
    });
  },

  renderOption: function(option, selected, onSelect, index){
    const style = selected ? { fontWeight: 'bold'} : {}

    return (
      <TouchableWithoutFeedback onPress={onSelect} key={index}>
        <Text style={style}>{option}</Text>
      </TouchableWithoutFeedback>
    );
  },

  renderContainer: function(optionNodes){
    return <View>{optionNodes}</View>;
  },

  getInitialState: function(){
    return {
      selectedOption: '  Classic  '
    }
  },

  render: function(){
    const options = [
    "   Cosy   ",
    "  Classic  "
  ];

    return (
      <View style={styles.container}>
        <View style={ styles.header }>
          <Image style={styles.headerImage} source={require('./logo.png')} />
        </View>
        <View style={styles.setting}>
          <View style={styles.column}>
            <Text style={styles.settingLabel}>Notifications</Text>
          </View>
          <View style={styles.column}>
            <View style={styles.settingValue}>
              <CheckBoxItem checked={true}/>
              <Text style={styles.settingValueText}>Departure</Text>
            </View>
            <View style={styles.settingValue}>
              <CheckBoxItem checked={true}/>
              <Text style={styles.settingValueText}>Arrival</Text>
            </View>
            <View style={styles.settingValue}>
              <CheckBoxItem />
              <Text style={styles.settingValueText}>Latency</Text>
            </View>
          </View>
        </View>
        <View style={styles.setting}>
          <View style={styles.column}>
            <Text style={styles.settingLabel}>Baby Seat</Text>
          </View>
          <View style={styles.settingValue}>
            <SegmentedControls
              options={ options }
              onSelection={ this.setSelectedOption.bind(this) }
              selectedOption={ this.state.selectedOption }
            />
          </View>
        </View>
      </View>
    );
  }
});
var TrackingTab = React.createClass({
  render: function(){
    return (
      <View style={styles.container}>
        <View style={ styles.header }>
          <Image style={styles.headerImage} source={require('./logo.png')} />
        </View>
        <Image style={styles.logo} source={require('./tracking.png')} />
      </View>
    );
  }
});
var NotificationsTab = React.createClass({
  getInitialState: function() {
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    return { dataSource: ds.cloneWithRows([
      { date: {day: 'MON', time: '07:40AM'}, message: 'Maxime has departed from KPMG Kirchberg'},
      { date: {day: 'MON', time: '08:21AM'}, message: 'Maxime has arrived at "Les p\'tits bouts d\'choux"'},
      { date: {day: 'MON', time: '05:15PM'}, message: 'Maxime has left "Les p\'tits bouts d\'choux"'},
      { date: {day: 'MON', time: '06:33PM'}, message: 'Maxime has arrived at KPMG Kirchberg'}
    ]) };
  },
  render: function(){
    return (
      <View  style={styles.container}>
        <View style={ styles.header }>
          <Image style={styles.headerImage} source={require('./logo.png')} />
        </View>
        <ListView style={styles.notifications} dataSource={this.state.dataSource} renderRow={(rowData) =>
            <View style={styles.notification}>
              <View style={styles.notificationDate}>
                <Text style={styles.notificationDateDate}>{rowData.date.day}</Text>
                <Text style={styles.notificationDateTime}>{rowData.date.time}</Text>
              </View>
              <View style={styles.notificationMessage}>
                <Text>{rowData.message}</Text>
              </View>
            </View>
          } />
      </View>
    );
  }
});

var KiidoClient = React.createClass({
  getInitialState: function() {
    return { selectedTab: 'bookingTab', notifCount: 0, presses: 0, };
},
  render: function() {
    var movie = MOCKED_MOVIES_DATA[0];
    return (

      <TabBarIOS
        selectedTab={this.state.selectedTab}>
        <TabBarItemIOS
          name="Book"
          title={"Book"}
          iconName={'ion|ios-bookmarks-outline'}
          selectedIconName={'ion|ios-bookmarks'}
          iconSize={32}
          accessibilityLabel="Booking Tab"
          selected={this.state.selectedTab === 'bookingTab'}
          onPress={() => {
            this.setState({
              selectedTab: 'bookingTab',
            });
          }}>
          <BookingTab />
        </TabBarItemIOS>
        <TabBarItemIOS
          title={"Children"}
          iconName={'ion|ios-people-outline'}
          selectedIconName={'ion|ios-people'}
          style={styles.pageView}
          selected={this.state.selectedTab === 'childrenTab'}
          onPress={() => {
            this.setState({
              selectedTab: 'childrenTab'
            });
          }}>
          <ChildrenTab />
        </TabBarItemIOS>
        <TabBarItemIOS
          title={"Tracking"}
          iconName={'ion|ios-world-outline'}
          selectedIconName={'ion|ios-world'}
          style={styles.pageView}
          badgeValue={'1'}
          selected={this.state.selectedTab === 'trackingTab'}
          onPress={() => {
            this.setState({
              selectedTab: 'trackingTab'
            });
          }}>
          <TrackingTab />
        </TabBarItemIOS>
        <TabBarItemIOS
          name="settings"
          title={"Settings"}
          iconName={'ion|ios-gear-outline'}
          selectedIconName={'ion|ios-gear'}
          style={styles.pageView}
          selected={this.state.selectedTab === 'settingsTab'}
          onPress={() => {
            this.setState({
              selectedTab: 'settingsTab'
            });
          }}>
          <SettingsTab />
        </TabBarItemIOS>
        <TabBarItemIOS
          title={"Notifications"}
          iconName={'ion|ios-bell-outline'}
          selectedIconName={'ion|ios-bell'}
          style={styles.pageView}
          badgeValue={'4'}
          selected={this.state.selectedTab === 'notificationsTab'}
          onPress={() => {
            this.setState({
              selectedTab: 'notificationsTab',
            });
          }}>
          <NotificationsTab />
        </TabBarItemIOS>
      </TabBarIOS>
    );
  }
});

var styles = StyleSheet.create({
  toolBarTitle: {
    fontSize:50
  },
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  content: {
    flex:1,
    flexDirection: 'column'
  },
  items: { flex: 1, alignItems: 'center'},
  thumbnail: {
    width: 53,
    height: 81,
  },
  tabContent: {
    flex: 1,
    alignItems: 'center',
  },
  tabText: {
    color: 'white',
    margin: 50,
  },
  pageView: {
    backgroundColor: '#fff',
    flex: 1
  },
  header: {
    height: 50,
    backgroundColor: '#7cdef2',
    paddingTop: 20,
    alignItems: 'center',
    justifyContent: 'center'
  },
  headerText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold'
  },
  bookingContent: {
    flex:1,
    flexDirection: 'row'
  },
  daysBar: {
    flexDirection: 'column',
    alignItems: 'center',
    paddingLeft: 5,
    paddingRight: 5,
    borderRightWidth: 1
  },
  day:{
    alignItems: 'center',
    paddingTop: 50,
  },
  chosenDay: {
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 10,
    color: 'green'
  },
  overviewBar: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    padding: 10,
    borderBottomWidth: 1
  },
  hoursContent: {
    flex:1,
    flexDirection: 'column',
    alignItems: 'center'
  },
  hours: {
    flexDirection: 'row',
  },
  hour: {
    padding: 20,
    paddingLeft: 7,
    paddingRight: 7
  },
  hourChosen: {
    padding: 20,
    paddingLeft: 7,
    paddingRight: 7,
    color: 'green'
  },
  disableHours: {
    padding: 20,
    paddingLeft: 7,
    paddingRight: 7,
    color: 'grey'
  },
  dayOverview: {
    flex: 1,
    flexDirection: 'row'
  },
  leavingHours: {
  },
  notifications:{
    flex: 1,
    flexDirection: 'column'
  },
  notification: {
    flex: 1,
    flexDirection: 'row',
    marginLeft: 15,
    marginBottom: 5,
    backgroundColor: '#c9eaf5',
    justifyContent: 'center'
  },
  notificationDate: {
    alignItems: 'center',
    padding: 5,
    width: 60
  },
  notificationDateDate: {
    fontWeight: 'bold'
  },
  notificationDateTime: {
    fontSize: 10
  },
  notificationMessage: {
    flex: 1,
    padding: 5,
    borderLeftWidth: 1
  },
  logo: {
    flex: 1
  },
  doge: {
    marginTop: 0,
    width: 380,
    height: 380
  },
  babyPhoto: {
    height: 200,
    width: 200
  },
  row: {
    flexDirection: 'row'
  },
  column: {
    flexDirection: 'column'
  },
  babyInfo: {
    padding: 10
  },
  babyInfoItem: {
    flex: 1,
    flexDirection: 'column',
    fontWeight: 'bold',
    fontSize: 16,
    lineHeight: 30
  },
  additionalInfoItem: {
    flex: 1,
    flexDirection: 'row',
    marginTop: 10,
    backgroundColor: '#f5f9fa'
  },
  additionalInfoItemKey: {
    padding: 5,
    width: 100,
    fontWeight: 'bold'
  },
  additionalInfoItemValue: {
    padding: 5,
    flex: 1
  },
  icon: {
    padding: 0,
    height: 22,
    width: 22
  },
  dayOverview: {
    flex: 1,
    flexDirection: 'row',
    padding: 10,
    paddingTop: 30

  },
  dayOverviewText: {
    fontSize: 20,
    width: 115
  },
  dayOverviewTrip: {
    fontSize: 18,
    paddingLeft:5,
    paddingRight: 5,
    justifyContent: 'center',
    textAlign: 'center'
  },
  booking: {
    height: 70,
    textAlign: 'center',
    justifyContent: 'center'
  },
  bookingBook: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'green'
  },
  bookingUnbook: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'red'
  },
  hoursTitle: {
    fontSize: 18,
    fontWeight: 'bold'
  },
  headerImage: {
    paddingBottom: 10
  },
  column: {
    flex: 1,
    flexDirection: 'column'
  },
  setting: {
    flexDirection: 'row',
    padding: 10
  },
  settingLabel: {
    fontSize: 20,
    fontWeight: 'bold'
  },
  settingValue: {
    flex: 1,
    flexDirection: 'row',
    padding: 10
  },
  settingValueText: {
    fontSize: 20,
    marginLeft: 10
  },


});

AppRegistry.registerComponent('KiidoClient', () => KiidoClient);

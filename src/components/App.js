import React from 'react';
import Header from './Header';
import Order from './Order';
import Inventory from './Inventory';
import sampleFishes from '../sample-fishes';
import Fish from './Fish';
import base from '../base';

class App extends React.Component {
  constructor() {
    super();

    this.addFish = this.addFish.bind(this);
    //.loadSamples = this.loadSamples.bind(this);
    this.addToOrder = this.addToOrder.bind(this);

    this.updateFish = this.updateFish.bind(this);
    this.removeFish = this.removeFish.bind(this);
    this.removeItem = this.removeItem.bind(this);

    this.state = {
      fishes: {},
      order: {}
    };
  }
// life cycle hooks
  componentWillMount() {
    this.ref = base.syncState(`${this.props.params.storeId}/fishes`, {
      context: this,
      state: 'fishes'
    });
    // any thing in localStorage
    const localStorageRef = localStorage.getItem(`order-${this.props.params.storeId}`);
    if (localStorageRef) {
      this.setState({
        order: JSON.parse(localStorageRef)
      });
    }
  }

  componentWillUpdate(nextProps, nextState) {
    localStorage.setItem(`order-${this.props.params.storeId}`, JSON.stringify(nextState.order));
    // console.log('something changed');
    // console.log({ nextProps, nextState });
  }

  componentWillUnMount() {
    base.removeBinding(this.ref);
  }
  updateFish(key, updatedFish) {
    const fishes = {
      ...this.state.fishes
    };
    fishes[key] = updatedFish;
    this.setState({fishes});
  }
  addFish(fish) {
    const fishes = {
      ...this.state.fishes
    };
    const timestamp = Date.now();
    fishes[`fish-${timestamp}`] = fish;
    this.setState({fishes});
  }
  removeFish(key) {
    const fishes = {
      ...this.state.fishes
    };
    //must set to null for firebase
    fishes[key] = null;
    this.setState({ fishes });
  }
  removeItem(key) {
    const order = {
      ...this.state.order
    };
    delete order[key];
    this.setState({ order });
  }
// stage 2
  loadSamples = () =>{
    this.setState({ fishes: sampleFishes });
  };
  addToOrder(key) {
    // copy of state
    const order = {
      ...this.state.order
    };
    order[key] = order[key] + 1 || 1;
    this.setState({ order });
  }
  render() {
    return (
      <div className="catch-of-the-day">
        <div className="menu">
          <Header age="5000" cool={true} tagline='fish store'></Header>
          <ul className="list-of-fishes">
            {Object
              .keys(this.state.fishes)
              .map(key =>
                <Fish
                  key={key} index={key}
                  details={this.state.fishes[key]}
                  addToOrder={this.addToOrder}
                />)
            }
          </ul>
        </div>
        <Order fishes={this.state.fishes}
          order={this.state.order}
          params={this.props.params}
          removeItem={this.removeItem}
        />
        <Inventory
          addFish={this.addFish}
          updateFish={this.updateFish}
          removeFish={this.removeFish}
          fishes={this.state.fishes}
          loadSamples={this.loadSamples}
          storeId={this.props.params.storeId}
        />
      </div>
    );
  }
}
App.propTypes ={
  params: React.PropTypes.object.isRequired
}
export default App;

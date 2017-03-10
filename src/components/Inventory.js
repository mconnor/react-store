import React from 'react';
import AddFishForm from './AddFishForm';
import base from '../base';


class Inventory extends React.Component {
  constructor() {
    super();
    this.renderInventory = this.renderInventory.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.renderLogin = this.renderLogin.bind(this);
    this.authenticate = this.authenticate.bind(this);
    this.authHandler = this.authHandler.bind(this);
    this.logout = this.logout.bind(this);

    this.state = {
      uid: null,
      owner: null,
    };
  }

  componentDidMount() {
    base.onAuth((user) => {
      if (user) {
        this.authHandler(null, { user });
      }
    });
  }

  handleChange(e, key) {
    const fish = this.props.fishes[key];
    const updatedFish = {
      ...fish,
      [e.target.name]: e.target.value,
    };
    this.props.updateFish(key, updatedFish);
  }

  renderLogin() {
    return (
      <nav className="login">
        <h2>Inventory</h2>
        <p>Sign in to mange store inventor</p>
        <button className="github" onClick={() => this.authenticate('github')}>Log In with Github</button>
        <button className="github" onClick={() => this.authenticate('facebook')}>Log In with facebook</button>
        <button className="github" onClick={() => this.authenticate('twitter')}>Log In with twitter</button>
      </nav>
    )
  }

  authenticate(provider) {
    console.log(`trying to log in with ${provider}`);
    base.authWithOAuthPopup(provider, this.authHandler);
  }

  logout() {
    base.unauth();
    this.setState({uid:null});
  }

  authHandler(err, authData) {
    console.log('authHandler');
    console.log(authData);
    if (err) {
      console.error(err);
      return;
    }
    //grab store info...connect to firebase
    const storeRef = base.database().ref(this.props.storeId);

    //query firebase once for the store data
    storeRef.once('value', (snapshot) => {
      const data = snapshot.val() || {};
      console.log(data);

      if (!data.owner) {
        storeRef.set({
          owner: authData.user.uid,
        });
      }
      this.setState({
        uid: authData.user.uid,
        owner: data.owner || authData.user.uid,
      });
    });
  }


  renderInventory(key) {
    const fish = this.props.fishes[key];
    return (
      <div className="fish-edit" key={key}>
        <input type="text" name="name" value={fish.name} placeholder="Fish"
           onChange={(e)=> this.handleChange(e,key)}/>
        <input type="text" name="price" value={fish.price} placeholder="Fish" onChange={(e)=> this.handleChange(e,key)} />
        <select type="text" name="status" value={fish.status} placeholder="Fish" onChange={(e)=> this.handleChange(e,key)}>
          <option value="available">fresh</option>
          <option value="unavailable">sold out</option>
        </select>
        <textarea type="text" name="desc" value={fish.desc}  placeholder="Fish desc" onChange={(e)=> this.handleChange(e,key)} />
        <input type="text" name="image" value={fish.image} placeholder="Fish" onChange={(e)=> this.handleChange(e,key)} />
        <button onClick={() => this.props.removeFish(key)}>Remove Fish</button>
      </div>
    )
  }
  render() {
    //onclick is simplified because not passingtower args...?
    //const logout = <button onClick={ () => this.logout() }>Log out</button>
    const logout = <button onClick={this.logout}>Log out</button>
    if (!this.state.uid) {
      return <div>{this.renderLogin()}</div>
    }

    if (this.state.uid !== this.state.owner) {
      return (<div>
        <p>sorry you aren't the owner of this stoere</p>
        {logout}
        </div>
      );
    }
    return (
      <div>
        <h2>Inventory</h2>
          {logout}
        {Object.keys(this.props.fishes).map(this.renderInventory)}

        <AddFishForm addFish={this.props.addFish} />
        <button onClick={this.props.loadSamples}>load fishes</button>
      </div>
    );
  }
}
Inventory.propTypes ={
  fishes: React.PropTypes.object.isRequired,
  addFish: React.PropTypes.func.isRequired,
  loadSamples: React.PropTypes.func.isRequired,
  updateFish: React.PropTypes.func.isRequired,
  removeFish: React.PropTypes.func.isRequired,
  storeId: React.PropTypes.string.isRequired,
};
export default Inventory;

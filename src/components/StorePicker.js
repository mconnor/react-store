import React from 'react';
import { getFunName } from '../helpers';

class StorePicker extends React.Component {

  // do this or
  // constructor() {
  //   super();
  //   this.goToStore =this.goToStovare.bind(this);
  // }
  goToStore(e) {
    e.preventDefault();
    const val= `store/${this.storeInput.value}`;
    this.context.router.transitionTo(val);
  }
  render() {
    return (
      <form action="" className="store-selector" onSubmit={this.goToStore.bind(this)}>
        <input type="text" required placeholder="store name"
          defaultValue={getFunName()}
          ref={(input) => { this.storeInput = input; }} />
        <button type="submit">visit store</button>
      </form>
    );
  }
}
StorePicker.contextTypes = {
  router: React.PropTypes.object,
};

export default StorePicker;

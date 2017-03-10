import React from 'react';

const Header = (props) => {
  return (
    <header className="top">
      <h1>catch
        <span className="ofThe">
          <span>of</span>
          <span>the</span>
        </span>
        day</h1>
      <h3 className="tagline">{props.tagline}</h3>
    </header>
  )
}


Header.propTypes = {
  tagline: React.PropTypes.string.isRequired
}
export default Header;

import React from "react"
import { Link } from "gatsby"

const logoStyle = {
    width: '100px',
    float: 'left',
};

const linkStyle = {
    float: 'right',
    lineHeight: '100px',
};

const Logo = (props) => (
  <div className="site-logo">
    <Link to="/">
        <img src={props.image} style={logoStyle}/>
        <span style={linkStyle}>{props.title}</span>
    </Link>
  </div>
);

export default Logo;
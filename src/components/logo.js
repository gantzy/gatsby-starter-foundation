import React from "react"
import { Link } from "gatsby"

const Logo = (props) => (
  <div className="site-logo">
    <img src={props.image} />
    <Link to="/">{props.title}</Link>
  </div>
)

export default Logo
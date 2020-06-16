import React from "react"
import { Link } from "gatsby"
import styles from "./layout.module.css"

console.log(styles)

const ListLink = props => (
  <li style={{ display: `inline-block`, marginRight: `1rem`}}>
    <Link to={props.to} activeClassName={styles.active}>
      {props.children}
    </Link>
  </li>
)

const NavBar = props => (
  <header style={{ marginBottom: `1.5rem` }}>
    <Link to="/" style={{ textShadow: `none`, backgroundImage: `none` }}>
      <h1 style={{ display: `inline` }}>Tommy's Cool Website</h1>
    </Link>
    <ul style={{ listStyle: `none`, float: `right`}}>
      <ListLink to="/">Home</ListLink>
      <ListLink to="/about/">About</ListLink>
    </ul>
  </header>
)

const Footer = props => (
  <footer>
    <hr />
    <p style={{fontSize:`8px`}}>Test Footer!</p>
  </footer>
)

export default function Layout({ children }) {
  return (
    <div style={{ margin: `3rem auto`, maxWidth: 650, padding: `0 1rem` }}>
      <NavBar />
      {children}
      <Footer />
    </div>
  )
}

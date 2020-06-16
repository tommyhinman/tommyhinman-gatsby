import React, { Component } from "react"
import Link from "gatsby-link"
import "../mystyles.scss"
import "./navbar.scss"

class Navbar extends Component {
  state = {
    //This sets the state of Bulma elements
    navbarDropdownIsActive: false,
    navbarDropdownActiveClass: "navbar-item has-dropdown is-hoverable",

    navbarMenuIsActive: false,
    navbarMenuActiveClass: "navbar-menu",
  }


  navbarDropdownToggle = () => {
    if(this.state.navbarDropdownIsActive) {
      this.setState({
        navbarDropdownIsActive: false,
        navbarDropdownActiveClass: "navbar-item has-dropdown is-hoverable",
      })
    } else {
      this.setState({
        navbarDropdownIsActive: true,
        navbarDropdownActiveClass: "navbar-item has-dropdown is-hoverable is-active"
      })
    }
  }

  navbarDropdownHide = () => {
    this.setState({
      navbarDropdownIsActive: false,
      navbarDropdownActiveClass: "navbar-item has-dropdown is-hoverable",
    })
  }

  navbarMenuToggle = () => {
    if(this.state.navbarMenuIsActive) {
      this.setState({
        navbarMenuIsActive: false,
        navbarMenuActiveClass: "navbar-menu",
      })
    } else {
      this.setState({
        navbarMenuIsActive: true,
        navbarMenuActiveClass: "navbar-menu is-active",
      })
    }
  }

  render() {
    return (
      <div>
        <nav
          className="navbar is-transparent is-success"
          role="navigation"
          aria-label="dropdown navigation"
        >

          <div className="navbar-brand">
            <div className="navbar-item" >
              <Link to="/">
                <h1 class="title">Tommy</h1>
              </Link>
              {/*}<img src="https://bulma.io/images/bulma-logo.png" width="112" height="28" />*/}
            </div>

            <a
              role="button"
              className="navbar-burger burger"
              aria-label="menu"
              aria-expanded="false"
              data-target="navbarBasicExample"
              onClick={this.navbarMenuToggle}
            >
              <span aria-hidden="true"></span>
              <span aria-hidden="true"></span>
              <span aria-hidden="true"></span>
            </a>
          </div>

          <div id="navbarBasicExample" className={this.state.navbarMenuActiveClass}>
            <div className="navbar-start">

              <Link to="about" className="navbar-item">
              About
              </Link>

              <div
                className={this.state.navbarDropdownActiveClass}
                onClick={this.navbarDropdownToggle}
                onMouseLeave={this.navbarDropdownHide}
              >
                <a className="navbar-link">
                More
                </a>

                <div className="navbar-dropdown">
                  <Link to="about" className="navbar-item">
                  About
                  </Link>
                  <a className="navbar-item">
                  Jobs
                  </a>
                  <a className="navbar-item">
                  Contact
                  </a>
                  <hr className="navbar-divider" />
                  <a className="navbar-item">
                  Report an issue
                  </a>
                </div> {/* navbar-dropdown  */}
              </div> {/* navbar-item  */}
            </div> {/* navbar-start  */}

            <div className="navbar-end">
              <div className="navbar-item">
                <div className="buttons">
                  <a className="button is-primary">
                    <strong>Sign up</strong>
                  </a>
                  <a className="button is-light">
                  Log in
                  </a>
                </div> {/* buttons */}
              </div> {/* navbar-item  */}
            </div> {/* navbar-end  */}
          </div> {/* navbar-menu  */}
        </nav>
      </div>
    )
  }
}

export default Navbar

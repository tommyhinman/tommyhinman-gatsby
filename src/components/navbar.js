import React, { Component } from "react"
import { StaticQuery, Link, graphql } from "gatsby"
import { RiMacbookLine } from "react-icons/ri"
import "../mystyles.scss"
import "./navbar.scss"
const util = require('util')

class Navbar extends Component {
  constructor(props) {
    super(props)
    this.state = {
      //This sets the state of Bulma elements
      navbarDropdownIsActive: false,
      navbarDropdownActiveClass: "navbar-item has-dropdown is-hoverable",

      navbarMenuIsActive: false,
      navbarMenuActiveClass: "navbar-menu",
    }
  }

  navbarDropdownToggle = () => {
    if (this.state.navbarDropdownIsActive) {
      this.setState({
        navbarDropdownIsActive: false,
        navbarDropdownActiveClass: "navbar-item has-dropdown is-hoverable",
      })
    } else {
      this.setState({
        navbarDropdownIsActive: true,
        navbarDropdownActiveClass:
          "navbar-item has-dropdown is-hoverable is-active",
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
    if (this.state.navbarMenuIsActive) {
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
    console.log(util.inspect(this.props, false, null, true /* enable colors */));
    return (
      <div>
        <nav
          className="navbar is-transparent is-success"
          role="navigation"
          aria-label="dropdown navigation"
        >
          <div className="navbar-brand">
            <div className="navbar-item">
              <Link to="/">
                <RiMacbookLine class="has-text-black" size={32} />
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
          <div
            id="navbarBasicExample"
            className={this.state.navbarMenuActiveClass}
          >
            <div className="navbar-start">
              <div
                className={this.state.navbarDropdownActiveClass}
                onClick={this.navbarDropdownToggle}
                onMouseLeave={this.navbarDropdownHide}
              >
                <a className="navbar-link">Music</a>
                <div className="navbar-dropdown">
                  {this.props.years.map( (year) => (
                    <Link to={year.context.slug} className="navbar-item">
                      Best Albums {year.context.aotyYear}
                    </Link>
                  ))}
                  <hr className="navbar-divider"/>
                  <a href="https://docs.google.com/spreadsheets/d/1sMt1AlNPOb1MYUlfPD6Gv65Y75rodJeF8nDOQPq_R-s" className="navbar-item">
                    Meta Album List
                  </a>
                </div>{" "}
                {/* navbar-dropdown  */}
              </div>{" "}
              <Link to="about" className="navbar-item">
                About
              </Link>
              {/* navbar-item  */}
            </div>{" "}
            {/* navbar-start  */}
            <div className="navbar-end" />
          </div>{" "}
          {/* navbar-menu  */}
        </nav>
      </div>
    )
  }
}

export default () => (
  <StaticQuery
    query={graphql`
      query {
        allSitePage(filter: {context: {aotyYear: {gt: "0"}}}, sort: {fields: context___aotyYear, order: DESC}) {
          nodes {
            context {
              slug
              aotyYear
            }
          }
        }
      }
    `}
    render={data => <Navbar years={data.allSitePage.nodes} />}
  />
)

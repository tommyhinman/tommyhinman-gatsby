import React, { Component } from "react"
import { StaticQuery, Link, graphql } from "gatsby"
import { AiOutlineRobot } from "react-icons/ai"
import { IconContext } from "react-icons"
import "../mystyles.scss"
import "./navbar.scss"

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
    const years = this.props.years.sort(
      (a, b) => b.pageContext.aotyYear - a.pageContext.aotyYear
    )
    return (
      <div>
        <nav
          className="navbar  is-success"
          role="navigation"
          aria-label="dropdown navigation"
        >
          <div className="navbar-brand">
            <div className="navbar-item">
              <Link to="/">
                <IconContext.Provider
                  value={{
                    className: "has-text-white is-size-3 is-vertical-center",
                  }}
                >
                  <div>
                    <AiOutlineRobot />
                  </div>
                </IconContext.Provider>
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
                {/* Loop thru all AOTY years, add a link for each */}
                <div className="navbar-dropdown">
                  {years.map((year, index) => (
                    <Link
                      to={year.pageContext.slug}
                      className="navbar-item"
                      key={index}
                    >
                      Best Albums {year.pageContext.aotyYear}
                    </Link>
                  ))}
                  <hr className="navbar-divider" />
                  <a
                    href="https://docs.google.com/spreadsheets/d/1sMt1AlNPOb1MYUlfPD6Gv65Y75rodJeF8nDOQPq_R-s"
                    className="navbar-item"
                  >
                    Meta Music List
                  </a>
                </div>{" "}
                {/* navbar-dropdown  */}
              </div>{" "}
              <Link to="/projects" className="navbar-item">
                Projects
              </Link>
              <Link to="/about" className="navbar-item">
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
        allSitePage(filter: { path: { regex: "/aoty/" } }) {
          nodes {
            pageContext
          }
        }
      }
    `}
    render={data => <Navbar years={data.allSitePage.nodes} />}
  />
)

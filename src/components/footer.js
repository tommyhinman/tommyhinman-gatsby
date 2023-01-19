import React, { Component } from "react"
import Link from "gatsby-link"
import "../mystyles.scss"

class Footer extends Component {
  render() {
    return (
      <footer className="footer sticky">
        <div className="content has-text-centered">
          <p className="is-size-7">
            2023 - tommy hinman. source at{" "}
            <a href="https://github.com/tommyhinman/tommyhinman-gatsby">
              github
            </a>
            .
          </p>
        </div>
      </footer>
    )
  }
}

export default Footer

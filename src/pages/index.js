import React from "react"
import "../mystyles.scss"
import * as styles from "./index.module.css"
import Layout from "../components/layout"
import { Helmet } from "react-helmet"
import { IoIosGitBranch } from "react-icons/io"
import { FaLastfm } from "react-icons/fa"
import { MdMailOutline } from "react-icons/md"
import { RiGamepadLine, RiBook3Line, RiFilmLine } from "react-icons/ri"
import { GiSittingDog } from "react-icons/gi"
import classNames from "classnames"

export default function Home() {
  const buttonTileClasses = classNames("tile", "is-parent", styles.buttonTile)

  return (
    <div>
      <Helmet>
        <meta charSet="utf-8" />
        <title>home | tommyhinman.com</title>
      </Helmet>
      <Layout>
        <div className="content">
          <h1 className="title is-size-2-desktop is-size-3-mobile has-text-centered-mobile">
            tommy hinman
          </h1>
          <hr />
          <div className="tile is-ancestor">
            {/* <div className={buttonTileClasses}>
              <a
                href="mailto:tommyhinman@gmail.com"
                className="button is-medium is-fullwidth"
              >
                <span className="icon">
                  <MdMailOutline />
                </span>
                <span>contact</span>
              </a>
            </div> */}
            <div className={buttonTileClasses}>
              <a
                href="https://github.com/tommyhinman"
                className="button is-medium is-fullwidth"
              >
                <span className="icon">
                  <IoIosGitBranch />
                </span>
                <span>github</span>
              </a>
            </div>
            <div className={buttonTileClasses}>
              <a
                href="https://last.fm/user/tommyhinman"
                className="button is-medium is-fullwidth"
              >
                <span className="icon">
                  <FaLastfm />
                </span>
                <span>last.fm</span>
              </a>
            </div>
            <div className={buttonTileClasses}>
              <a
                href="https://www.goodreads.com/user/show/39909302-tommy"
                className="button is-medium is-fullwidth"
              >
                <span className="icon">
                  <RiBook3Line />
                </span>
                <span>goodreads</span>
              </a>
            </div>
            <div className={buttonTileClasses}>
              <a
                href="https://letterboxd.com/tommyhinman/"
                className="button is-medium is-fullwidth"
              >
                <span className="icon">
                  <RiFilmLine />
                </span>
                <span>letterboxd</span>
              </a>
            </div>
            <div className={buttonTileClasses}>
              <a
                href="https://gooddogs.tommyhinman.com"
                className="button is-medium is-fullwidth"
              >
                <span className="icon">
                  <GiSittingDog />
                </span>
                <span>good dogs</span>
              </a>
            </div>
          </div>
        </div>
      </Layout>
    </div>
  )
}

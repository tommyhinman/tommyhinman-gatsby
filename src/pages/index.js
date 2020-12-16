import React from "react"
import "../mystyles.scss"
import styles from "./index.module.css"
import Layout from "../components/layout"
import { Helmet } from "react-helmet"
import { IoIosGitBranch } from "react-icons/io"
import { FaLastfm } from "react-icons/fa"
import { MdMailOutline } from "react-icons/md"
import { RiGamepadLine, RiTwitterLine, RiBook3Line } from "react-icons/ri"
import classNames from 'classnames';

export default function Home() {
  const buttonTileClasses = classNames('tile', 'is-parent', styles.buttonTile);

  return (
    <div>
      <Helmet>
        <meta charSet="utf-8" />
        <title>home | tommyhinman.com</title>
      </Helmet>
      <Layout>
        <div className="content">
          <h1 class="title is-size-2-desktop is-size-3-mobile has-text-centered-mobile">tommy hinman</h1>
          <hr />
          <div class="tile is-ancestor">
            <div className={buttonTileClasses}>
              <a
                href="mailto:tommyhinman@gmail.com"
                class="button is-medium is-fullwidth"
              >
                <span class="icon">
                  <MdMailOutline />
                </span>
                <span>contact</span>
              </a>
            </div>
            <div className={buttonTileClasses}>
              <a
                href="http://twitter.com/tommyhinman"
                class="button is-medium is-fullwidth"
              >
                <span class="icon">
                  <RiTwitterLine />
                </span>
                <span>twitter</span>
              </a>
            </div>
            <div className={buttonTileClasses}>
              <a
                href="https://github.com/tommyhinman"
                class="button is-medium is-fullwidth"
              >
                <span class="icon">
                  <IoIosGitBranch />
                </span>
                <span>github</span>
              </a>
            </div>
            <div className={buttonTileClasses}>
              <a
                href="https://last.fm/user/tommyhinman"
                class="button is-medium is-fullwidth"
              >
                <span class="icon">
                  <FaLastfm />
                </span>
                <span>last.fm</span>
              </a>
            </div>
            <div className={buttonTileClasses}>
              <a
                href="https://www.goodreads.com/user/show/39909302-tommy"
                class="button is-medium is-fullwidth"
              >
                <span class="icon">
                  <RiBook3Line />
                </span>
                <span>goodreads</span>
              </a>
            </div>
          </div>
        </div>
      </Layout>
    </div>
  )
}

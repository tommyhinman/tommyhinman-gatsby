import React, { useState, useEffect } from "react"
import Layout from "../components/layout"
import styles from "./projects.module.css"
import { Helmet } from "react-helmet"
import { Link } from "gatsby"
import Amplify, { Analytics } from 'aws-amplify';

export default function Projects() {

  // Record page analytics
  useEffect( () => { Analytics.record({ name: 'pagevisit-projects' }); }, []);

  return (

    <div>
    <Helmet>
      <meta charSet="utf-8" />
      <title>projects | tommyhinman</title>
    </Helmet>
    <Layout>

      <div className="content">
        <h1>Projects</h1>
        This page is a collection of personal projects.

        <hr />

          <div className="container">
            <div className="block">
              <h1 className="title is-4">
                <Link to="/projects/newmusic">
                  New Music Scanner
                </Link>
              </h1>
              <div className="content">
                <p>
                  Scans and stores albums from Spotify daily, and produces a list of
                  new albums from artists I'm tracking.
                </p>

                <p>
                  Source:
                  <a href="https://github.com/tommyhinman/tommyhinman-gatsby/blob/master/src/pages/projects/newmusic.js"
                     target="_blank">
                     front-end
                  </a>
                  /
                  <a href="https://github.com/tommyhinman/newmusicscanner"
                     target="_blank">
                     back-end
                  </a>
                </p>
              </div>
            </div>
            <hr />
            <div className="block">
              <h1 className="title is-4">
                <Link to="/projects/scattergories">
                  Scattergories
                </Link>
              </h1>
              Random scattergories cards seeded by the URL, for friends!
            </div>
            <hr />
            <div className="block">
              <h1 className="title is-4">
                <Link to="/app">
                  Pinboard Experiments
                </Link>
              </h1>
              Some experiments with the API from <a href="http://pinboard.in" target="_blank">pinboard.in</a>.
              Not available publicly for now!
            </div>
            <hr />
          </div>
      </div>

    </Layout>
    </div>
  )
}

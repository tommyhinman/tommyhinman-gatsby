import React, { useState, useEffect } from "react"
import Layout from "../components/layout"
import * as styles from "./projects.module.css"
import { Helmet } from "react-helmet"
import { Link } from "gatsby"
import Project from "../components/project"

export default function Projects() {
  return (
    <div>
      <Helmet>
        <meta charSet="utf-8" />
        <title>projects | tommyhinman</title>
      </Helmet>
      <Layout>
        <div className="content mb-6">
          <h1 className="title is-size-2-desktop is-size-3-mobile">Projects</h1>
          <hr />
          <div className="container">
            <Project
              internalLink="/projects/newmusic"
              projectName="New Music Scanner"
            >
              <p>
                Scans and stores albums from Spotify daily, and produces a list
                of new albums from artists I'm tracking.
              </p>
              <p className="content">
                Source:&nbsp;
                <a
                  href="https://github.com/tommyhinman/tommyhinman-gatsby/blob/master/src/pages/projects/newmusic.js"
                  target="_blank"
                >
                  front-end
                </a>
                &nbsp;/&nbsp;
                <a
                  href="https://github.com/tommyhinman/newmusicscanner"
                  target="_blank"
                >
                  back-end
                </a>
              </p>
            </Project>
            <hr />
            <Project
              internalLink="/projects/scattergories/"
              projectName="Scattergories"
            >
              <p>
                Random scattergories cards seeded by URL, to play online with
                friends!
              </p>

              <p>
                <a
                  href="https://github.com/tommyhinman/tommyhinman-gatsby/blob/master/src/pages/projects/scattergories.js"
                  target="_blank"
                >
                  Source
                </a>
              </p>
            </Project>
            <hr />
            <Project
              externalLink="https://longwave.tommyhinman.com"
              projectName="Wavelength/Longwave"
            >
              A hosted fork of Longwave - an open/online version of Wavelength.
              No contributions (yet), just self-hosting!
            </Project>
            <hr />
            <Project internalLink="/app" projectName="Pinboard Experiments">
              Some experiments with the API from pinboard.in . Not available
              publicly for now!
            </Project>
            <hr />
            <Project internalLink="/projects/gooddogs" projectName="Good Dogs">
              Good dogs
            </Project>
            <hr />
            <Project
              internalLink="/projects/music-library"
              projectName="Music Library"
            >
              Music Library
            </Project>
            <hr />
            <Project
              internalLink="/projects/fruit-balls"
              projectName="Fruit Balls"
            >
              Fruit Balls
            </Project>
            <hr />
            <Project internalLink="/projects/movies" projectName="Movies">
              movie game
            </Project>
          </div>
        </div>
      </Layout>
    </div>
  )
}

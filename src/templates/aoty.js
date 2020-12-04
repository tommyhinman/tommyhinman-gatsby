import React from "react"
import { graphql } from "gatsby"
import Layout from "../components/layout"
import { Helmet } from "react-helmet"
import Album from "../components/album"
import { RiPlayListLine, RiDatabaseLine } from "react-icons/ri"

export default function Aoty({ data }) {
  return (
    <div>
    <Helmet>
      <meta charSet="utf-8" />
      <title>AOTY - {data.aotyJson.name} | tommyhinman</title>
    </Helmet>
    <Layout>
      <h1 className="title is-size-1-desktop is-size-3-mobile">
        Best Albums of {data.aotyJson.name}
      </h1>

      <div class="tile is-ancestor">
        <div class="tile is-parent">
          <a
            href={data.aotyJson.samplerPlaylist}
            class="button is-medium is-fullwidth"
            target="_blank"
          >
            <span class="icon">
              <RiPlayListLine />
            </span>
            <span>playlist</span>
          </a>
        </div>
        <div class="tile is-parent">
          <a
            href={data.aotyJson.link}
            class="button is-medium is-fullwidth"
            target="_blank"
          >
            <span class="icon">
              <RiDatabaseLine />
            </span>
            <span>ratings</span>
          </a>
        </div>
      </div>


      <hr className="is-hidden-tablet" />

      <div className="tile is-ancestor">
        <div className="tile is-vertical is-parent">
          {data.aotyJson.albums.map((album, index) => (
            <div className="tile is-child ">
              <Album album={album}/>
            </div>
          ))}
        </div>
      </div>
    </Layout>
    </div>
  )
}

export const query = graphql`
  query($aotyYear: Date!) {
    aotyJson(name: {eq: $aotyYear}) {
      name
      link
      samplerPlaylist
      albums {
        albumName
        artistName
        place
        albumImage
        albumImageFilename
        albumSpotifyLink
      }
    }
  }
`

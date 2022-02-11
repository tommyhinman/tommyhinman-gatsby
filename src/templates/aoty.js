import React from "react"
import { graphql } from "gatsby"
import Layout from "../components/layout"
import { Helmet } from "react-helmet"
import Album from "../components/album"
import { RiPlayListLine, RiDatabaseLine } from "react-icons/ri"

export default function Aoty({ data }) {

  const AotyInfoButton = (props) => {
    if (props.linkHref != null && props.linkHref.length > 0) {
      return (
        <a
          className="button is-medium is-fullwidth"
          href={props.linkHref}
          target="_blank"
        >
          {props.children}
        </a>
      )
    } else {
      return (
        <a
          className="button is-medium is-fullwidth"
          disabled
        >
          {props.children}
        </a>
      )
    }
  }

  return (
    <div>
    <Helmet>
      <meta charSet="utf-8" />
      <title>AOTY - {data.aotyJson.name} | tommyhinman</title>
    </Helmet>
    <Layout>
      <h1 className="title is-size-2-desktop is-size-3-mobile">
        Best Albums of {data.aotyJson.name}
      </h1>

      <div className="columns">
        <div className="column is-half">
          <AotyInfoButton linkHref={data.aotyJson.samplerPlaylist}>
            <span className="icon">
              <RiPlayListLine />
            </span>
            <span>playlist</span>
          </AotyInfoButton>
        </div>
        <div className="column is-half">
          <AotyInfoButton linkHref={data.aotyJson.link}>
            <span className="icon">
              <RiDatabaseLine />
            </span>
            <span>ratings</span>
          </AotyInfoButton>
        </div>
      </div>

      <div className="tile is-ancestor">
        <div className="tile is-vertical is-parent">
          {data.aotyJson.albums.map((album, index) => (
            <div className="tile is-child "  key={index}>
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
        albumImageFilename
        albumSpotifyLink
      }
    }
  }
`

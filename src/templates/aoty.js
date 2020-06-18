import React from "react"
import { graphql } from "gatsby"
import Layout from "../components/layout"
import { Helmet } from "react-helmet"
import Album from "../components/album"

export default function Aoty({ data }) {
  return (
    <div>
    <Helmet>
      <meta charSet="utf-8" />
      <title>AOTY - {data.aotyJson.name} | tommyhinman</title>
    </Helmet>
    <Layout>
      <div class="section">

      <h1 className="title is-size-1-desktop is-size-3-mobile">
        Best Albums of {data.aotyJson.name}
      </h1>

      <hr className="is-hidden-tablet" />

      <div className="tile is-ancestor">
        <div className="tile is-vertical is-parent">
          {data.aotyJson.albums.map((album, index) => (
            <div className="tile is-child box">
              <Album album={album}/>
            </div>
          ))}
        </div>
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
      albums {
        albumName
        artistName
        place
        albumImage
      }
    }
  }
`

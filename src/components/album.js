import React from "react"
import "../mystyles.scss"

export default function Album({ album }) {
  return (

    <div className="container">
      {/*Desktop View*/}
      <div className="is-hidden-mobile">
        <h1 className="title is-size-1 has-text-info">
          {album.place}
        </h1>
        <hr/>
        <div className="columns">
          <div className="column is-6 content">
            <h1 className="is-size-3">{album.artistName}</h1>
            <p className="is-size-4">{album.albumName}</p>
          </div>
          <div className="column is-5 is-offset-1" align="right">
            <a href={album.albumSpotifyLink} target="_blank">
              <figure className="image is-256x256">
                  <img src={'https://tommyhinman-albums.s3-us-west-2.amazonaws.com/512/' + album.albumImageFilename} />
              </figure>
            </a>
          </div>
        </div>
      </div>

      {/*Mobile View*/}
      <div className="is-hidden-tablet">
        <h1 className="title is-size-2 has-text-info">
          {album.place}
        </h1>
        <hr/>
        <div className="columns is-mobile">
          <div className="column is-6 is-marginless content">
            <h2 className="is-size-5">{album.artistName}</h2>
            <p className="is-size-6">{album.albumName}</p>
          </div>
          <div className="column is-4 is-offset-1" align="right">
            <figure className="image is-96x96">
                <img src={'https://tommyhinman-albums.s3-us-west-2.amazonaws.com/256/' + album.albumImageFilename} />
            </figure>
          </div>
        </div>
      </div>
    </div>


  )
}

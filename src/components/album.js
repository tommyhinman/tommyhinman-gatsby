import React from "react"
import "../mystyles.scss"

export default function Album({ album }) {
  return (

    <div className="box container pr-3 py-3 my-2">
      {/*Desktop View*/}
      <div className="is-hidden-mobile">

        <div className="columns">
          <div className="column is-6 content">
            {album.place.length > 0 && (<>
              <h1 className="title is-size-1 has-text-info">
                {album.place}
              </h1>
              <hr />
            </>)}
            <h1 className="is-size-3">{album.artistName}</h1>
            <p className="is-size-4">{album.albumName}</p>
          </div>
          <div className="column is-5 is-offset-1 px-0 py-0" align="right">
            <a href={album.albumSpotifyLink} target="_blank">
              <figure className="image is-300x300">
                  <img src={'https://tommyhinman-albums.s3-us-west-2.amazonaws.com/512/' + album.albumImageFilename} />
              </figure>
            </a>
          </div>
        </div>
      </div>

      {/*Mobile View*/}
      <div className="is-hidden-tablet">
        <div className="columns is-mobile">
          <div className="column is-6 is-marginless content">
            <h1 className="subtitle is-size-3 has-text-info is-marginless">
              {album.place}
            </h1>
            <hr className="mt-1 mb-1" />
            <h2 className="is-size-6 mt-0.5">{album.artistName}</h2>
            <p className="is-size-7">{album.albumName}</p>
          </div>
          <div className="column is-6" align="right">
            <figure className="image is-150x150">
                <img src={'https://tommyhinman-albums.s3-us-west-2.amazonaws.com/256/' + album.albumImageFilename} />
            </figure>
          </div>
        </div>
      </div>
    </div>


  )
}

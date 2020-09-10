import React, { useState, useEffect } from "react"
import Layout from "../components/layout"
import { Helmet } from "react-helmet"
import useDataApi from '../components/dataApi.js'
import axios from "axios";

export default function Projects() {

  const [{data, isLoading, isError}, searchUrl, doFetch] = useDataApi(
    "https://7j2apoxwhf.execute-api.us-west-2.amazonaws.com/Prod/latestRequest?format=json",
    []
  );

  const Artist = ({artistData}) => {
    console.log("hi!");
    return (
      <div>
        <b>{artistData.artistName}</b>
        <ul>
          {artistData.albums.map(album => (
            <div>
              <a href={album.albumUri}>{album.albumName} ({album.albumType})</a>
            </div>
          ))}
        </ul>
      </div>
    )
  }

  return (
    <div>
    <Helmet>
      <meta charSet="utf-8" />
      <title>Projects | tommyhinman</title>
    </Helmet>
    <Layout>


      <div class="content">
        <h1>Newly Released Albums</h1>
        {isLoading ?
          (
            <div>Loading!</div>
          ) : (
            <div>
              {data.map(artist => (
                <Artist artistData={artist} />
              ))}
            </div>
          )
        }


      </div>

    </Layout>
    </div>
  )
}

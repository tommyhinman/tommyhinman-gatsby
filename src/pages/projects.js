import React, { useState, useEffect } from "react"
import Layout from "../components/layout"
import { Helmet } from "react-helmet"
import useDataApi from '../components/dataApi.js'
import axios from "axios";
import moment from "moment-timezone";

export default function Projects() {

  const [{data, isLoading, isError}, searchUrl, doFetch] = useDataApi(
    // "https://7j2apoxwhf.execute-api.us-west-2.amazonaws.com/Prod/latestRequest?format=json",
    "http://localhost:3000/latestRequest?format=json",
    {
      "albums": [],
      "request": {"requestId": ""}
    }
  );

  const Artist = ({artistData}) => {
    return (
        <li>
          {artistData.albums.map(album => (
            <div>
              {artistData.artistName} - <a href={album.albumUri}>{album.albumName} ({album.albumType})</a>
            </div>
          ))}
        </li>
    )
  }

  const RequestInfo = ({request}) => {
    const formattedDate = moment(request.requestTime).tz('America/Los_Angeles').format("LLL");
    return (
      <div>Latest Scan Request, on {formattedDate}, with ID {request.requestId}</div>
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
              <RequestInfo request={data.request}/>
              <ul>
                {data.albums.map(artist => (
                  <Artist artistData={artist} />
                ))}
              </ul>
            </div>
          )
        }


      </div>

    </Layout>
    </div>
  )
}

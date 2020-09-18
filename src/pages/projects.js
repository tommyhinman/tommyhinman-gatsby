import React, { useState, useEffect } from "react"
import Layout from "../components/layout"
import { Helmet } from "react-helmet"
import useDataApi from '../components/dataApi.js'
import axios from "axios";
import moment from "moment-timezone";

export default function Projects() {

  // Currently just a local constant. Will pass this in as a var at some point to the query.
  const numberOfRequests = 10;
  const requestDataUrlTemplate = "https://7j2apoxwhf.execute-api.us-west-2.amazonaws.com/Prod/request?format=json&requestId=REQUEST_ID";

  const [currentRequestId, setCurrentRequestId] = useState("");
  const [currentRequestIndex, setCurrentRequestIndex] = useState(0);

  const [recentRequestsQuery, recentRequestsUrl, recentRequestsFetch] = useDataApi(
    "https://7j2apoxwhf.execute-api.us-west-2.amazonaws.com/Prod/recentRequests",
    [
      {
        requestId: "",
        requestTime: ""
      }
    ]
  );

  useEffect( () => {
    const currentRequestUrl = requestDataUrlTemplate.replace("REQUEST_ID", recentRequestsQuery.data[currentRequestIndex].requestId);
    requestFetch(currentRequestUrl);
  }, [recentRequestsQuery.data[currentRequestIndex]]);

  // const [{datax, requestIsLoading, requestIsError}, requestSearchUrl, requestFetch] = useDataApi(
  const [scanRequestQuery, requestSearchUrl, requestFetch] = useDataApi(
    // TODO: Find a way to put this in a config so you don't accidentally check-in calling localhost!
    "https://7j2apoxwhf.execute-api.us-west-2.amazonaws.com/Prod/request?format=json&requestId=23f61801-b88c-4f3a-bca9-46440bb7d807",
    // "http://localhost:3000/latestRequest?format=json",
    {
      "albums": {
        "highPriorityAlbums": [],
        "lowPriorityAlbums": [],
      },
      "request": {"requestId": ""}
    }
  );

  function previousRequestId() {
    if (currentRequestIndex < (numberOfRequests - 1)) {
      setCurrentRequestIndex(currentRequestIndex + 1);
    }
  }

  function nextRequestId() {
    if (currentRequestIndex > 0) {
      setCurrentRequestIndex(currentRequestIndex - 1);
    }
  }

  function areAnyMainArtistsInPrimaryArtists(albumArtists, primaryArtistIds) {
    var primaryArtistsInMainArtists = 0;

    albumArtists.forEach( (mainArtist) => {
      if(primaryArtistIds.includes(mainArtist.id)) {
        primaryArtistsInMainArtists++;
      }
    })

    return primaryArtistsInMainArtists > 0;
  }

  const Artist = ({artistData, primaryArtists}) => {
    const isPrimaryArtist = primaryArtists.includes(artistData.id);
    return (
      <>
      { isPrimaryArtist ?
        <b>{artistData.name}</b> : <>{artistData.name}</>
      }
      </>
    )
  }

  const ArtistsList = ( {albumArtists, primaryArtists} ) => {
    return (
      <>
      {albumArtists.map( (artist, index) => (
        <span>
          { (index ? ' & ' : '') }<Artist artistData={artist} primaryArtists={primaryArtists} />
        </span>
      ))}
      </>
    )
  }

  const FeaturingArtistsList = ( {primaryArtists} ) => {
    const primaryArtistsStr = primaryArtists.map( (artist) => { return artist.name; }).join(" & ");
    return (
      <>
      {'Features: '}
      {primaryArtistsStr}
      </>
    )
  }

  const Album = ({albumData}) => {

    const primaryArtistIds = albumData.primaryArtists.map( (primaryArtist) => { return primaryArtist.id; });
    const mainArtists = albumData.albumArtists.map( (artist) => {return artist.id})
    const mainArtistsNotPrimaryArtists = !areAnyMainArtistsInPrimaryArtists(albumData.albumArtists, primaryArtistIds);

    return (
        <li>
            <span>
              <ArtistsList albumArtists={albumData.albumArtists} primaryArtists={primaryArtistIds} />
              {' - '}
              <a href={albumData.albumUri}>{albumData.albumName} ({albumData.albumType})</a>
              {mainArtistsNotPrimaryArtists &&
                <>
                  {' '}
                  <FeaturingArtistsList primaryArtists={albumData.primaryArtists} />
                </>
              }
            </span>
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
        {recentRequestsQuery.isLoading ?
          (
            <div>Loading!</div>
          ) : (
            <div>
              <div>
                <div>Current request index: {currentRequestIndex}</div>
                <div>Request: {recentRequestsQuery.data[currentRequestIndex].requestId}</div>
                <button type="button" onClick={() => previousRequestId()}>Previous</button>
                <button type="button" onClick={() => nextRequestId()}>Next</button>
              </div>
            </div>
          )
        }
        <hr />
        {scanRequestQuery.isLoading ?
          (
            <div>Loading!</div>
          ) : (
            <div>
              <RequestInfo request={scanRequestQuery.data.request}/>
              <ul>
                {scanRequestQuery.data.albums.highPriorityAlbums.map(album => (
                  <Album albumData={album} />
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

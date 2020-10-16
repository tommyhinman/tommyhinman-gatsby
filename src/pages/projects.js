import React, { useState, useEffect } from "react"
import Layout from "../components/layout"
import { Helmet } from "react-helmet"
import useDataApi from '../components/dataApi.js'
import axios from "axios";
import moment from "moment-timezone";
import { HiArrowLeft, HiArrowRight, HiExternalLink } from "react-icons/hi"
import { FaSpotify } from "react-icons/fa"

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
    const openSpotifyLink = albumData.albumUri.replace("https://open.spotify.com/", "spotify://");

    return (

          <div class="panel-block">
            <p class="control columns is-vcentered">
              <div class="column is-four-fifths">
                <ArtistsList albumArtists={albumData.albumArtists} primaryArtists={primaryArtistIds} />
                {' - '}
                {albumData.albumName} ({albumData.albumType})
                {mainArtistsNotPrimaryArtists &&
                  <>
                    {' '}
                    <FeaturingArtistsList primaryArtists={albumData.primaryArtists} />
                  </>
                }
              </div>
              <div class="column">
                <div class="buttons has-addons is-right">
                  <a href={albumData.albumUri} target="_blank">
                    <button class="button" >
                      <span class="icon">
                        <HiExternalLink />
                      </span>
                    </button>
                  </a>
                  <a href={openSpotifyLink}>
                    <button class="button">
                      <span class="icon">
                        <FaSpotify />
                      </span>
                    </button>
                  </a>
                </div>

              </div>
            </p>
          </div>
    )
  }

  const RequestInfo = ({request}) => {
    if (recentRequestsQuery.isLoading) {
      return (<div>Loading</div>);
    } else {
      const formattedDate = moment(request.requestTime).tz('America/Los_Angeles').format("llll");
      return (
        <div>{formattedDate}<span hidden> ID {request.requestId}</span></div>
      )
    }
  }

  return (
    <div>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Projects | tommyhinman</title>
      </Helmet>
      <Layout>
        <div>
          <nav class="panel">
            <p class="panel-heading">
              <div class="level">
                <button class="button" onClick={() => previousRequestId()}>
                  <span class="icon">
                    <HiArrowLeft />
                  </span>
                </button>

                <RequestInfo request={scanRequestQuery.data.request}/>

                <button class="button" onClick={() => nextRequestId()}>
                  <span class="icon">
                    <HiArrowRight />
                  </span>
                </button>
              </div>
            </p>

            {scanRequestQuery.isLoading ?
              (
                <div class="panel-block">Loading!</div>
              ) : (
                <div>
                {scanRequestQuery.data.albums.highPriorityAlbums.map(album => (
                  <Album albumData={album} />
                ))}
                </div>
              )
            }
          </nav>
        </div>
      </Layout>
    </div>
  )
}

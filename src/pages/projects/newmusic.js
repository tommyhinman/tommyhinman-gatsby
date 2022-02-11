import React, { useState, useEffect } from "react"
import Layout from "../../components/layout"
import * as styles from "./newmusic.module.css"
import { Helmet } from "react-helmet"
import useDataApi from '../../components/dataApi.js'
import moment from "moment-timezone";
import { IconContext } from "react-icons";
import { HiArrowLeft, HiArrowRight, HiExternalLink } from "react-icons/hi"
import { FaSpotify } from "react-icons/fa"
import { SiAframe } from "react-icons/si"
import { MdAlbum, MdMusicNote } from "react-icons/md"
import { BiCoinStack } from "react-icons/bi"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'

export default function Newmusic() {

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

  const AlbumIcon = ({albumType}) => {
    if (albumType == "album") {
      return (
        <span className="icon is-medium">
          <IconContext.Provider
            value={{ className: "is-size-4", }}
          >
            <MdAlbum />
          </IconContext.Provider>
        </span>
      )
    } else if (albumType == "single") {
      return (
        <span className="icon is-medium">
          <IconContext.Provider
            value={{ className: "is-size-4", }}
          >
            <MdMusicNote />
          </IconContext.Provider>
        </span>
      )
    } else if (albumType == "compilation") {
      return (
        <span className="icon is-medium">
          <IconContext.Provider
            value={{ className: "is-size-4", }}
          >
            <BiCoinStack />
          </IconContext.Provider>
        </span>
      )
    }
  };

  const AlbumControls = ({albumData}) => {
    const openSpotifyLink = albumData.albumUri.replace("https://open.spotify.com/", "spotify://");
    const aotyLink = "https://www.albumoftheyear.org/search/albums/?q=" + albumData.albumName;

    return (
      <div className="field has-addons">
        <p className="control">
        <a href={aotyLink} target="_blank">
          <button className="button">
            <span className="icon">
              <SiAframe />
            </span>
          </button>
        </a>
        </p>
        <p className="control">
        <a href={albumData.albumUri} target="_blank">
          <button className="button">
            <span className="icon">
              <HiExternalLink />
            </span>
          </button>
        </a>
        </p>
        <p className="control">
        <a href={openSpotifyLink}>
          <button className="button">
            <span className="icon">
              <FaSpotify />
            </span>
          </button>
        </a>
        </p>
      </div>
    )
  }

  const Album = ({albumData}) => {

    const primaryArtistIds = albumData.primaryArtists.map( (primaryArtist) => { return primaryArtist.id; });
    const mainArtists = albumData.albumArtists.map( (artist) => {return artist.id})
    const mainArtistsNotPrimaryArtists = !areAnyMainArtistsInPrimaryArtists(albumData.albumArtists, primaryArtistIds);


    return (

          <div className="panel-block">
            <p className="control columns is-vcentered is-mobile">
              <div className="column is-1 is-hidden-mobile">
                <div className={styles.albumTypeIcon}>
                  <AlbumIcon albumType={albumData.albumType} />
                </div>
              </div>
              <div className="column is-three-quarters-tablet is-three-fifths-mobile">
                  <ArtistsList albumArtists={albumData.albumArtists} primaryArtists={primaryArtistIds} />
                  <span className="is-hidden-tablet"><br /></span>
                  <span className="is-hidden-mobile">{' - '}</span>
                  <span className="is-size-7-mobile">
                    {albumData.albumName}
                    {mainArtistsNotPrimaryArtists &&
                      <>
                        {' '}
                        <FeaturingArtistsList primaryArtists={albumData.primaryArtists} />
                      </>
                    }
                  </span>
              </div>
              <div className="column is-2 is-3-mobile">
                <div className="">
                  <AlbumControls albumData={albumData} />
                </div>
              </div>
            </p>
          </div>
    )
  }

  const RequestInfo = ({request}) => {
    var formattedDate = "";
    if (request.requestTime != null) {
      formattedDate = moment(request.requestTime).tz('America/Los_Angeles').format("llll");
    }
    return (
      <div className="is-size-6-mobile">{formattedDate}<span hidden> ID {request.requestId}</span></div>
    )
  }

  return (
    <div>
      <Helmet>
        <meta charSet="utf-8" />
        <title>new music scanner | tommyhinman</title>
      </Helmet>
      <Layout>
        <h1 className="title">New Music Scanner</h1>
        { (recentRequestsQuery.data.length > 1 && !recentRequestsQuery.isLoading) &&
            <nav className="panel mb-5 mx-0">
              <p className="panel-heading">
                <div className="level is-mobile">
                  <button className="button" onClick={() => previousRequestId()} disabled={currentRequestIndex == (numberOfRequests - 1)}>
                    <span className="icon">
                      <HiArrowLeft />
                    </span>
                  </button>

                  <RequestInfo request={scanRequestQuery.data.request}/>

                  <button className="button" onClick={() => nextRequestId()} disabled={currentRequestIndex == 0}>
                    <span className="icon">
                      <HiArrowRight />
                    </span>
                  </button>
                </div>
              </p>

              {scanRequestQuery.isLoading ?
                (
                  <div className="panel-block">
                    <div className="control columns is-centered">
                      <div className="column is-1">
                        <span className="icon is-medium">
                          <FontAwesomeIcon icon={faSpinner} size="lg" pulse />
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                  {scanRequestQuery.data.albums.highPriorityAlbums.map(album => (
                    <Album albumData={album} />
                  ))}
                  </div>
                )
              }
            </nav>
        }
      </Layout>
    </div>
  )
}

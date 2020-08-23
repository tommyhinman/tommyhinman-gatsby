import React, { Fragment, useState, useEffect } from "react"
import useDataApi from './dataApi.js'
import useUserUtil from './userUtil'
import PinboardPost from './pinboardPost'

export default function Pinboard() {



  // For now, this will display the 15 most-recent pinboard posts marked to-read.

  const [{data, isLoading, isError}, searchUrl, doFetch] = useDataApi(
    "",
    {posts: []}
  );

  // Using a heroku-hosted mirror to get past pinboard's disabled CORS.
  const pinboardRecentPostsTemplate = "https://sleepy-mesa-54715.herokuapp.com/" +
    "https://api.pinboard.in/v1/posts/recent" +
    "?auth_token=PINBOARDKEY&format=json&tag=to-read&count=20";
  const pinboardUpdatePostTemplate = "https://sleepy-mesa-54715.herokuapp.com/" +
    "https://api.pinboard.in/v1/posts/add" +
    "?auth_token=PINBOARDKEY&url=URL&description=DESCRIPTION&extended=EXTENDED" +
    "&tags=TAGS&dt=DT&replace=yes&shared=no&toread=no";
  const [username, pinboardKey] = useUserUtil();

  // Asynchronously grab the pinboard API key from Cognito user attributes and
  // stick it into the URL. Is there a simpler way to do this?
  useEffect( () => {
    let didCancel = false;

    const setUrl = async () => {
      if(pinboardKey != "") {
        const newUrl = pinboardRecentPostsTemplate.replace("PINBOARDKEY", pinboardKey);
        doFetch(newUrl);
      }
    }
    setUrl();

    return () => {
      didCancel = true;
    };
  }, [pinboardKey])

  return (
    <div>
      <h1>Pinboard To-Read List</h1>
      {isError && <div>Error when requesting data from Pinboard.</div>}

      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <div>
          {/* For each pin, display the link & description. */}
          {data.posts.map(post => (
            <PinboardPost post={post} pinboardKey={pinboardKey} key={post.hash}/>
          ))}
        </div>
      )}
    </div>
  )
}

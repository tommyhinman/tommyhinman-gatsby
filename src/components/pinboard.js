import React, { Fragment, useState, useEffect } from "react"
import useDataApi from './dataApi.js'
import useUserUtil from './userUtil'

export default function Pinboard() {

  // For now, this will display the 15 most-recent pinboard posts marked to-read.

  const [{data, isLoading, isError}, searchUrl, doFetch] = useDataApi(
    "",
    {posts: []}
  );

  // Using a heroku-hosted mirror to get past pinboard's disabled CORS.
  const pinboardUrlTemplate = "https://sleepy-mesa-54715.herokuapp.com/" +
    "https://api.pinboard.in/v1/posts/recent" +
    "?auth_token=pinboardKey&format=json&tag=to-read";
  const [username, pinboardKey] = useUserUtil();

  // Asynchronously grab the pinboard API key from Cognito user attributes and
  // stick it into the URL. Is there a simpler way to do this?
  useEffect( () => {
    let didCancel = false;

    const setUrl = async () => {
      if(pinboardKey != "") {
        const newUrl = pinboardUrlTemplate.replace("pinboardKey", pinboardKey);
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
        <ul>
          {/* For each pin, display the link & description. */}
          {data.posts.map(item => (
            <li key={item.hash}>
              <a href={item.href}>{item.description}</a>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

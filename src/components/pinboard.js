import React, { Fragment, useState } from "react"
import useDataApi from './dataApi.js'

export default function Pinboard() {

  // For now, this will display the 15 most-recent pinboard posts marked to-read.

  // Requiring input of pinboard API token for now, until I figure out how to
  // get secrets into Amplify.
  const [pinboardKey, setPinboardKey] = useState('x');

  // Using a heroku-hosted mirror to get past pinboard's disabled CORS.
  const pinboardUrlTemplate = `https://sleepy-mesa-54715.herokuapp.com/https://api.pinboard.in/v1/posts/recent?auth_token=${pinboardKey}&format=json&tag=to-read`
  const [{data, isLoading, isError}, searchUrl, doFetch] = useDataApi(
    pinboardUrlTemplate,
    {posts: []}
  );

 return (
   <Fragment>
    <div>
      <form
        onSubmit={(event) => {
          doFetch(pinboardUrlTemplate);
            event.preventDefault();
        }}
      >
        <input type="text" value={pinboardKey} onChange={event => setPinboardKey(event.target.value)} />
        <button type="submit">Get Posts</button>
      </form>
      {isError && <div>Error when requesting data from Pinboard.</div>}

      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <ul>
          {data.posts.map(item => (
            <li key={item.hash}>
              <a href={item.href}>{item.description}</a>
            </li>
          ))}
        </ul>
      )}
    </div>
   </Fragment>
 )

}

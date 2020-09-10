import React, { Fragment, useState, useEffect } from "react"
import axios, {CancelToken} from "axios";
import { AiOutlineRead, AiFillRead, AiOutlinePushpin } from "react-icons/ai"




export default function PinboardPost({post, pinboardKey}) {

  //const url2 = "hi";
  const [isLoading, setIsLoading] = useState(false);
  const [markedAsRead, setMarkedAsRead] = useState(false);
  //setUpdatePostUrl("www.google.com");

  const updatePostUrlTemplate = "https://sleepy-mesa-54715.herokuapp.com/" +
    "https://api.pinboard.in/v1/posts/add" +
    "?auth_token=PINBOARDKEY&url=URL&description=DESCRIPTION&extended=EXTENDED" +
    "&tags=TAGS&dt=DT&replace=yes&shared=no&toread=no";

  const queryDescription = post.description.split(" ")
                                           .filter(word => !word.includes("-"))
                                           .join(" ");
  const viewPostUrl = "https://pinboard.in/search/u:tommyhinman?query=TAGS DESCRIPTION"
                        .replace("TAGS", post.tags)
                        .replace("DESCRIPTION", queryDescription);

  const formattedDate = new Date(post.time).toLocaleDateString();


  return (
    <div className="box" key={post.hash}>

      <h4><a href={post.href}>{post.description}</a></h4>

      <level><span><b>Date: </b>{formattedDate} | <b>Tags: </b>{post.tags}</span></level>




      <div className="buttons mt-4">
            <MarkAsReadButton />
            <a className="button" href={viewPostUrl}>
                <span className="icon"><AiOutlinePushpin /></span>
                <span>Pinboard</span>
            </a>
      </div>
    </div>
  )

  function MarkAsReadButton() {
    if (isLoading) {
      return (
        <button className="button" disabled>Loading...</button>
      );
    } else if(markedAsRead) {
      return (
        <button className="button" disabled>
          <span className="icon"><AiFillRead /></span>
          <span>Marked as Read</span>
        </button>
      );
    } else {
      return (
        <button className="button" onClick={() => testButton()}>
          <span className="icon"><AiOutlineRead /></span>
          <span>Mark as Read</span>
        </button>
      );
    }
  }

  async function testButton() {

    const updatedTags = post.tags.split(" ")
                                 .filter(tag => tag !== "to-read")
                                 .join(" ");
    // alert(updatedTags);
    const updatePostUrl = updatePostUrlTemplate
                              .replace("PINBOARDKEY", pinboardKey)
                              .replace("URL", post.href)
                              .replace("DESCRIPTION", post.description)
                              .replace("EXTENDED", post.extended)
                              .replace("TAGS", updatedTags)
                              .replace("DT", post.dt);

    setIsLoading(true);
    await axios(updatePostUrl);
    setIsLoading(false);
    setMarkedAsRead(true);
    // const result = await axios(updatePostUrl);
    // alert(result);
  }
}

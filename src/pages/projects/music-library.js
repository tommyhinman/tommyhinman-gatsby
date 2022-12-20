import React, { useState, useEffect } from "react"
import Layout from "../../components/layout"
import * as styles from "./music-library.module.css"
import { Helmet } from "react-helmet"
import classNames from "classnames"
import useDataApi from "../../components/dataApi"
import { FaSpotify } from "react-icons/fa"
import { HiExternalLink } from "react-icons/hi"

const LibraryItem = ({ index, item }) => {
  const {
    primaryText,
    secondaryText,
    imageLink = "https://tommyhinman-albums.s3-us-west-2.amazonaws.com/512/corrupted-garten-der-unbewusstheit.jpg",
    spotifyLink,
    externalLink,
  } = item
  return (
    <>
      <a
        className={classNames("box", "is-clickable", styles.itemBox)}
        href={externalLink}
        target="_blank"
        key={"item-" + index}
      >
        <figure className="image is-100x100">
          <img src={imageLink} />
        </figure>
        <div>
          <div className="mt-2 is-size-5">{primaryText}</div>
          <div className="is-size-6">{secondaryText}</div>
        </div>
        <div
          className={classNames(
            "columns",
            "is-centered",
            "mt-2",
            styles.itemButtonGroup
          )}
        >
          <div className="field has-addons">
            <p className="control">
              <a href={spotifyLink}>
                <button className="button" disabled={!spotifyLink}>
                  <span className="icon is-small">
                    <FaSpotify />
                  </span>
                </button>
              </a>
            </p>
            <p className="control">
              <a href={externalLink} target="_blank">
                <button className="button" disabled={!externalLink}>
                  <span className="icon is-small">
                    <HiExternalLink />
                  </span>
                </button>
              </a>
            </p>
          </div>
        </div>
      </a>
    </>
  )
}

const dataUrl =
  "https://mqze13mg7g.execute-api.us-west-2.amazonaws.com/Prod/libraryItems"

const TagButton = ({ tagName, isSelected, onClick }) => {
  const buttonClasses = classNames({
    button: true,
    "is-success": isSelected,
  })

  return (
    <button className={buttonClasses} onClick={onClick}>
      {tagName}
    </button>
  )
}

export default function MusicLibrary() {
  const [libraryDataQuery, libraryDataUrl, requestFetch] = useDataApi(
    dataUrl,
    []
  )

  const [tags, setTags] = useState({
    instrumental: false,
    party: false,
    jazz: false,
    rock: false,
    metal: false,
  })
  const [stateTest, setStateTest] = useState(1)

  const filterData = data => {
    const enabledTags = Object.keys(tags).filter(currentTag => tags[currentTag])
    const filteredData = data.filter(item => {
      if (enabledTags.length > 0) {
        return (
          item.tags &&
          item.tags.filter(tag => enabledTags.includes(tag)).length > 0
        )
      } else {
        return true
      }
    })
    return filteredData
  }
  const items = filterData(libraryDataQuery.data)
  console.log(JSON.stringify(items))

  const tagButtonClicked = tagName => {
    setTags({ ...tags, [tagName]: !tags[tagName] })
  }

  const tagNames = ["instrumental", "party", "jazz", "rock", "metal"]

  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>music library | tommyhinman</title>
      </Helmet>
      <Layout width="wide">
        <h1 className="title">Music Library</h1>
        <div className="buttons">
          {tagNames.map(tag => (
            <TagButton
              tagName={tag}
              isSelected={tags[tag]}
              onClick={() => tagButtonClicked(tag)}
            />
          ))}
        </div>
        {!libraryDataQuery.isLoading && items != null && (
          <>
            <div className="columns is-multiline mb-5">
              {items.map((item, index) => (
                <div
                  key={"col-" + index}
                  className={classNames(
                    "column",
                    "is-one-fifth",
                    styles.itemColumn
                  )}
                >
                  <LibraryItem index={index} item={item} />
                </div>
              ))}
            </div>
          </>
        )}
      </Layout>
    </>
  )
}

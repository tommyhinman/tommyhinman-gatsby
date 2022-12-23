import React, { useState, useEffect } from "react"
import Layout from "../../components/layout"
import * as styles from "./music-library.module.css"
import { Helmet } from "react-helmet"
import classNames from "classnames"
import useDataApi from "../../components/dataApi"
import { FaEdit, FaSpotify } from "react-icons/fa"
import { HiExternalLink } from "react-icons/hi"
import AddItemModal from "./music-library/addItemModal"
import EditItemModal from "./music-library/editItemModal"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSpinner } from "@fortawesome/free-solid-svg-icons"

const DATA_API_URL =
  "https://mqze13mg7g.execute-api.us-west-2.amazonaws.com/Prod/libraryItems"

const LibraryItem = ({ index, item, editAction }) => {
  const {
    primaryText,
    secondaryText,
    imageLink = "https://tommyhinman-albums.s3-us-west-2.amazonaws.com/512/corrupted-garten-der-unbewusstheit.jpg",
    spotifyLink,
    externalLink,
  } = item
  return (
    <>
      <div
        className={classNames("box", styles.itemBox)}
        // href={externalLink}
        // target="_blank"
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
                <button className="button  is-success" disabled={!spotifyLink}>
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
            <p className="control">
              <button className="button" onClick={e => editAction(item)}>
                <span className="icon is-small">
                  <FaEdit />
                </span>
              </button>
            </p>
          </div>
        </div>
      </div>
    </>
  )
}

const TagButton = ({ tagName, isSelected, onClick }) => {
  const buttonClasses = classNames({
    button: true,
    "is-info": isSelected,
  })

  return (
    <button className={buttonClasses} onClick={onClick}>
      {tagName}
    </button>
  )
}

export default function MusicLibrary() {
  const [libraryDataQuery, libraryDataUrl, libraryDataFetch] = useDataApi(
    DATA_API_URL,
    []
  )

  const initialTagState = {
    instrumental: false,
    party: false,
    jazz: false,
    rock: false,
    metal: false,
  }
  const [tags, setTags] = useState(initialTagState)
  const [isAddItemModalActive, setIsAddItemModalActive] = useState(false)
  const [isEditItemModalActive, setIsEditItemModalActive] = useState(false)
  const [currentlyEditingItemData, setCurrentlyEditingItemData] = useState()

  const toggleAddItemModal = () => {
    setIsAddItemModalActive(!isAddItemModalActive)
  }

  const openEditItemModal = itemData => {
    console.log("opening edit for: " + JSON.stringify(itemData))
    setIsEditItemModalActive(true)
    setCurrentlyEditingItemData(itemData)
  }

  const closeEditItemModal = () => {
    setIsEditItemModalActive(false)
  }

  const filterData = data => {
    const enabledTags = Object.keys(tags).filter(currentTag => tags[currentTag])
    const filteredData = data
      .sort((a, b) => a.secondaryText.localeCompare(b.secondaryText))
      .sort((a, b) => a.primaryText.localeCompare(b.primaryText))
      .filter(item => {
        if (enabledTags.length > 0) {
          return (
            item.tags &&
            item.tags != "" &&
            item.tags.filter(tag => enabledTags.includes(tag)).length > 0
          )
        } else {
          return true
        }
      })
    return filteredData
  }
  const [items, setItems] = useState([])
  useEffect(() => {
    if (libraryDataQuery.data) {
      setItems(filterData(libraryDataQuery.data))
    }
  }, [libraryDataQuery.data, tags])
  console.log(JSON.stringify(items))

  const tagButtonClicked = tagName => {
    setTags({ ...initialTagState, [tagName]: !tags[tagName] })
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
        <button
          className="button is-primary"
          onClick={() => toggleAddItemModal()}
        >
          Add Item
        </button>
        <hr />
        {/* {!libraryDataQuery.isLoading && items != null && ( */}
        {libraryDataQuery.isLoading ? (
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
                  <LibraryItem
                    index={index}
                    item={item}
                    editAction={openEditItemModal}
                  />
                </div>
              ))}
            </div>
          </>
        )}
      </Layout>
      <AddItemModal
        isActive={isAddItemModalActive}
        closeAction={toggleAddItemModal}
        dataApiUrl={DATA_API_URL}
        fetchData={libraryDataFetch}
      />
      <EditItemModal
        isActive={isEditItemModalActive}
        closeAction={closeEditItemModal}
        dataApiUrl={DATA_API_URL}
        initialData={currentlyEditingItemData}
        fetchData={libraryDataFetch}
      />
    </>
  )
}

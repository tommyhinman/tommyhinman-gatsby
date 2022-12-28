import React, { useState, useEffect } from "react"
import Layout from "../../components/layout"
import * as styles from "./music-library.module.css"
import { Helmet } from "react-helmet"
import classNames from "classnames"
import useDataApi from "../../components/dataApi"
import { FaEdit, FaSearch, FaSpotify } from "react-icons/fa"
import { HiExternalLink } from "react-icons/hi"
import AddItemModal from "./music-library/addItemModal"
import EditItemModal from "./music-library/editItemModal"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSpinner } from "@fortawesome/free-solid-svg-icons"
import { genreTagNames, moodTagNames } from "./music-library/tagData"

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
        className={"box is-flex is-flex-direction-column"}
        key={"item-" + index}
      >
        <figure className="image is-100x100">
          <img src={imageLink} />
        </figure>
        <div className="mb-2">
          <div className="mt-2 is-size-5">{primaryText}</div>
          <div className="is-size-6">{secondaryText}</div>
        </div>
        <div className={"mt-auto"}>
          <div className="field has-addons has-addons-centered">
            <p className="control">
              <a href={spotifyLink}>
                <button className="button is-success" disabled={!spotifyLink}>
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

  const initialTagState = tagNames => {
    return tagNames.reduce((acc, tag) => {
      acc[tag] = false
      return acc
    }, {})
  }

  const [genreTags, setGenreTags] = useState(initialTagState(genreTagNames))
  const [moodTags, setMoodTags] = useState(initialTagState(moodTagNames))
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
    setCurrentlyEditingItemData(null)
  }

  const [search, setSearch] = useState("")
  const handleSearchChange = event => {
    setSearch(event.target.value)
  }

  const filterData = data => {
    const enabledGenreTags = Object.keys(genreTags).filter(
      currentTag => genreTags[currentTag]
    )
    const enabledMoodTags = Object.keys(moodTags).filter(
      currentTag => moodTags[currentTag]
    )
    const enabledTags = enabledGenreTags.concat(enabledMoodTags)
    const filteredData = data
      .sort((a, b) => a.secondaryText.localeCompare(b.secondaryText))
      .sort((a, b) => a.primaryText.localeCompare(b.primaryText))
      .filter(
        item =>
          item.primaryText.toLowerCase().includes(search) ||
          item.secondaryText.toLowerCase().includes(search)
      )
      .filter(item => {
        if (enabledTags.length > 0) {
          return (
            item.tags &&
            item.tags != "" &&
            enabledTags.filter(tag => item.tags.includes(tag)).length ==
              enabledTags.length
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
  }, [libraryDataQuery.data, genreTags, moodTags, search])
  console.log(JSON.stringify(items))

  const genreTagButtonClicked = tagName => {
    setGenreTags({
      ...initialTagState(genreTagNames),
      [tagName]: !genreTags[tagName],
    })
  }

  const moodTagButtonClicked = tagName => {
    setMoodTags({
      ...initialTagState(moodTagNames),
      [tagName]: !moodTags[tagName],
    })
  }

  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>music library | tommyhinman</title>
      </Helmet>
      <Layout width="wide">
        <h1 className="title">Music Library</h1>
        <div className="columns">
          <div className="column is-four-fifths">
            <div className="field">
              <div className="control has-icons-left">
                <input
                  type="text"
                  className="input"
                  name="search"
                  value={search}
                  onChange={e => handleSearchChange(e)}
                />
                <span class="icon is-small is-left">
                  <FaSearch />
                </span>
              </div>
            </div>
          </div>
          <div className="column is-one-fifth">
            <button
              className="button is-primary is-fullwidth"
              onClick={() => toggleAddItemModal()}
            >
              Add Item
            </button>
          </div>
        </div>
        <div className="level">
          <div className="level-left">
            <div className="is-align-items-center is-flex mr-3 is-hidden-mobile">
              <label className="label level-item is-size-5 is-flex">
                Genre
              </label>
            </div>
            <div className="buttons level-item">
              {genreTagNames.map(tag => (
                <TagButton
                  tagName={tag}
                  isSelected={genreTags[tag]}
                  onClick={() => genreTagButtonClicked(tag)}
                />
              ))}
            </div>
          </div>
        </div>
        <div className="level">
          <div className="level-left">
            <div className="is-align-items-center is-flex mr-3 is-hidden-mobile">
              <label className="label level-item is-size-5 is-flex">Mood</label>
            </div>
            <div className="buttons level-item">
              {moodTagNames.map(tag => (
                <TagButton
                  tagName={tag}
                  isSelected={moodTags[tag]}
                  onClick={() => moodTagButtonClicked(tag)}
                />
              ))}
            </div>
          </div>
        </div>

        <hr />
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
            <div className="columns is-multiline is-mobile mb-5">
              {items.map((item, index) => (
                <div
                  key={"col-" + index}
                  className={classNames(
                    "column",
                    "is-one-fifth-desktop",
                    "is-half-mobile",
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

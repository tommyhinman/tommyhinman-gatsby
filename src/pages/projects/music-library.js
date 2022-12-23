import React, { useState, useEffect } from "react"
import Layout from "../../components/layout"
import * as styles from "./music-library.module.css"
import { Helmet } from "react-helmet"
import classNames from "classnames"
import useDataApi from "../../components/dataApi"
import { FaSpotify } from "react-icons/fa"
import { HiExternalLink } from "react-icons/hi"
import axios from "axios"
const { v4: uuidv4 } = require("uuid")

const DATA_API_URL =
  "https://mqze13mg7g.execute-api.us-west-2.amazonaws.com/Prod/libraryItems"

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

const AddItemModal = ({ closeAction, isActive, fetchData }) => {
  const EMPTY_FORM_STATE = {
    primaryText: "",
    secondaryText: "",
    spotifyLink: "",
    externalLink: "",
    imageLink: "",
  }

  const [formState, setFormState] = useState(EMPTY_FORM_STATE)
  const [formError, setFormError] = useState()

  const handleChange = event => {
    setFormState({
      ...formState,
      [event.target.name]: event.target.value,
    })
  }

  const handleSubmit = event => {
    event.preventDefault()
    const result = axios
      .post(DATA_API_URL, formState)
      .then(() => {
        // I'm using the dataApi in a way that isn't supported yet where the URL doesn't change
        // For now, add a random value to the end to get this working - I'll refactor this later.
        const randomString = uuidv4()
        fetchData(DATA_API_URL + "?" + randomString)
        setFormState(EMPTY_FORM_STATE)
        closeAction()
      })
      .catch(err => {
        setFormError("Error creating item :(")
      })
  }

  return (
    <div class={classNames("modal", { "is-active": isActive })}>
      <div class="modal-background" onClick={() => closeAction()}></div>
      <div class="modal-content">
        <div className="box">
          <h2 className="title">Add New Item</h2>
          {formError ? (
            <div className="notification is-danger">{formError}</div>
          ) : (
            ""
          )}
          <form onSubmit={e => handleSubmit(e)}>
            <div className="field">
              <label className="label">Primary Text</label>
              <div className="control">
                <input
                  className="input"
                  type="text"
                  name="primaryText"
                  value={formState.primaryText}
                  onChange={e => handleChange(e)}
                />
              </div>
            </div>
            <div className="field">
              <label className="label">Secondary Text</label>
              <div className="control">
                <input
                  className="input"
                  type="text"
                  name="secondaryText"
                  value={formState.secondaryText}
                  onChange={e => handleChange(e)}
                />
              </div>
            </div>
            <div className="field">
              <label className="label">Spotify Link</label>
              <div className="control">
                <input
                  className="input"
                  type="text"
                  name="spotifyLink"
                  value={formState.spotifyLink}
                  onChange={e => handleChange(e)}
                />
              </div>
            </div>
            <div className="field">
              <label className="label">External Link</label>
              <div className="control">
                <input
                  className="input"
                  type="text"
                  name="externalLink"
                  value={formState.externalLink}
                  onChange={e => handleChange(e)}
                />
              </div>
            </div>
            <div className="field">
              <label className="label">Image Link</label>
              <div className="control">
                <input
                  className="input"
                  type="text"
                  name="imageLink"
                  value={formState.imageLink}
                  onChange={e => handleChange(e)}
                />
              </div>
            </div>
            <div className="control">
              <input
                className="button is-primary"
                type="submit"
                value="Create"
              />
            </div>
          </form>
        </div>
      </div>
      <button
        class="modal-close is-large"
        aria-label="close"
        onClick={() => closeAction()}
      ></button>
    </div>
  )
}

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
  const [libraryDataQuery, libraryDataUrl, libraryDataFetch] = useDataApi(
    DATA_API_URL,
    []
  )

  const [tags, setTags] = useState({
    instrumental: false,
    party: false,
    jazz: false,
    rock: false,
    metal: false,
  })
  const [isAddItemModalActive, setIsAddItemModalActive] = useState(false)

  const toggleAddItemModal = () => {
    setIsAddItemModalActive(!isAddItemModalActive)
  }

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
  // const items = filterData(libraryDataQuery.data)
  const [items, setItems] = useState([])
  useEffect(() => {
    if (libraryDataQuery.data) {
      setItems(filterData(libraryDataQuery.data))
    }
  }, [libraryDataQuery.data, tags])
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
        <button
          className="button is-primary"
          onClick={() => toggleAddItemModal()}
        >
          Add Item
        </button>
        <hr />
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
      <AddItemModal
        isActive={isAddItemModalActive}
        closeAction={toggleAddItemModal}
        fetchData={libraryDataFetch}
      />
    </>
  )
}

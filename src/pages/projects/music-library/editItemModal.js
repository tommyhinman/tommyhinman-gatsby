import React, { useEffect, useState } from "react"
import classNames from "classnames"

import axios from "axios"
import { allTagNames, genreTagNames, moodTagNames } from "../../../data/tagData"
const { v4: uuidv4 } = require("uuid")

export default function EditItemModal({
  closeAction,
  isActive,
  initialData,
  dataApiUrl,
  fetchData,
}) {
  const EMPTY_FORM_STATE = {
    primaryText: "",
    secondaryText: "",
    spotifyLink: "",
    externalLink: "",
    imageLink: "",
    tags: "",
    genreTags: {},
    moodTags: {},
  }

  const [formState, setFormState] = useState(EMPTY_FORM_STATE)
  const [formError, setFormError] = useState()
  useEffect(() => {
    setFormState({
      ...formState,
      ...initialData,
      ["genreTags"]:
        initialData && initialData.tags
          ? genreTagNames.reduce((acc, tagName) => {
              acc[tagName] = initialData.tags.includes(tagName)
              return acc
            }, {})
          : {},
      ["moodTags"]:
        initialData && initialData.tags
          ? moodTagNames.reduce((acc, tagName) => {
              acc[tagName] = initialData.tags.includes(tagName)
              return acc
            }, {})
          : {},
    })
  }, [initialData])

  const handleChange = event => {
    if (event.target.name.includes("genreTag-")) {
      const currentGenreTags = formState.genreTags
      const currentTagName = event.target.name.split("genreTag-")[1]
      const newGenreTags = {
        ...currentGenreTags,
        [currentTagName]: event.target.checked,
      }

      let combinedTags = allTagNames.reduce((acc, curTagName) => {
        if (newGenreTags[curTagName] || formState.moodTags[curTagName]) {
          acc.push(curTagName)
        }
        return acc
      }, [])

      setFormState({
        ...formState,
        ["tags"]: combinedTags,
        ["genreTags"]: newGenreTags,
      })
    } else if (event.target.name.includes("moodTag-")) {
      const currentMoodTags = formState.moodTags
      const currentTagName = event.target.name.split("moodTag-")[1]
      const newMoodTags = {
        ...currentMoodTags,
        [currentTagName]: event.target.checked,
      }

      let combinedTags = allTagNames.reduce((acc, curTagName) => {
        if (newMoodTags[curTagName] || formState.genreTags[curTagName]) {
          acc.push(curTagName)
        }
        return acc
      }, [])

      setFormState({
        ...formState,
        ["tags"]: combinedTags,
        ["moodTags"]: newMoodTags,
      })
    } else {
      setFormState({
        ...formState,
        [event.target.name]: event.target.value,
      })
    }
  }

  const handleClose = () => {
    setFormState({ ...EMPTY_FORM_STATE })
    closeAction()
  }

  const handleSubmit = event => {
    event.preventDefault()
    const editUrl = dataApiUrl + "/" + formState.itemId
    const patchData = {
      primaryText: formState.primaryText,
      secondaryText: formState.secondaryText,
      spotifyLink: formState.spotifyLink,
      externalLink: formState.externalLink,
      imageLink: formState.imageLink,
      tags: formState.tags,
    }
    const result = axios
      .patch(editUrl, patchData)
      .then(() => {
        // I'm using the dataApi in a way that isn't supported yet where the URL doesn't change
        // For now, add a random value to the end to get this working - I'll refactor this later.
        const randomString = uuidv4()
        fetchData(dataApiUrl + "?" + randomString)
        handleClose()
      })
      .catch(err => {
        setFormError("Error creating item :(")
      })
  }

  return (
    <div class={classNames("modal", { "is-active": isActive })}>
      <div class="modal-background" onClick={() => handleClose()}></div>
      <div class="modal-content">
        <div className="box">
          <h2 className="title">Edit Item</h2>
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
            <div className="field">
              <label className="label">Tags</label>
              <div className="control">
                <input
                  className="input"
                  type="text"
                  name="tags"
                  value={formState.tags}
                  onChange={e => handleChange(e)}
                />
              </div>
            </div>
            <div className="field">
              <label className="label">Genre Tags</label>
              <div className="field-body">
                {genreTagNames.map(tagName => {
                  const checkboxName = "genreTag-" + tagName
                  return (
                    <div className="control mr-2">
                      <label className="checkbox">
                        <input
                          type="checkbox"
                          className="mr-1"
                          name={checkboxName}
                          checked={formState.genreTags[tagName]}
                          onChange={e => handleChange(e)}
                        />
                        {tagName}
                      </label>
                    </div>
                  )
                })}
              </div>
            </div>
            <div className="field">
              <label className="label">Mood Tags</label>
              <div className="field-body">
                {moodTagNames.map(tagName => {
                  const checkboxName = "moodTag-" + tagName
                  return (
                    <div className="control mr-2">
                      <label className="checkbox">
                        <input
                          type="checkbox"
                          className="mr-1"
                          name={checkboxName}
                          checked={formState.moodTags[tagName]}
                          onChange={e => handleChange(e)}
                        />
                        {tagName}
                      </label>
                    </div>
                  )
                })}
              </div>
            </div>
            <div className="control">
              <input
                className="button is-primary"
                type="submit"
                value="Submit"
              />
            </div>
          </form>
        </div>
      </div>
      <button
        class="modal-close is-large"
        aria-label="close"
        onClick={() => handleClose()}
      ></button>
    </div>
  )
}

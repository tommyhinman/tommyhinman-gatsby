import React, { useEffect, useState } from "react"
import classNames from "classnames"

import axios from "axios"
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
  }

  const [formState, setFormState] = useState(EMPTY_FORM_STATE)
  const [formError, setFormError] = useState()
  useEffect(() => {
    setFormState({
      ...formState,
      ...initialData,
      ["tags"]:
        initialData && initialData.tags ? initialData.tags.join(",") : "",
    })
  }, [initialData])

  const handleChange = event => {
    setFormState({
      ...formState,
      [event.target.name]: event.target.value,
    })
  }

  const handleClose = () => {
    setFormState({ ...EMPTY_FORM_STATE })
    closeAction()
  }

  const handleSubmit = event => {
    event.preventDefault()
    const editUrl = dataApiUrl + "/" + formState.itemId
    const patchData = {
      ...formState,
      ["tags"]: formState.tags.split(",").map(tag => tag.trim().toLowerCase()),
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

import React, { useEffect, useState } from "react"
import { Helmet } from "react-helmet"
import Layout from "../../components/layout"
import { getDogs } from "../../data/dogs"
import * as styles from "./gooddogs.module.css"

const isMobileWidth = width => {
  return width <= 768
}

const Dog = ({ dogData, onImageClick }) => {
  return (
    <div className=" container">
      <span className="subtitle is-3">{dogData.title}</span>
      <img
        className={styles.dog}
        src={dogData.imageUrl}
        onClick={() => onImageClick(dogData.imageUrl)}
      />
    </div>
  )
}

export default function Gooddogs() {
  const dogs = getDogs()

  const [isModalEnabled, setIsModalEnabled] = useState(false)
  const [modalImageUrl, setModalImageUrl] = useState("")
  const [isMobile, setIsMobile] = useState(false)

  const openModal = url => {
    if (!isMobile) {
      setIsModalEnabled(true)
      setModalImageUrl(url)
    }
  }

  const closeModal = url => {
    setIsModalEnabled(false)
  }

  function handleWindowSizeChange() {
    setIsMobile(isMobileWidth(window.innerWidth))
  }

  useEffect(() => {
    if (typeof window !== "undefined") {
      handleWindowSizeChange()
    }
  })

  useEffect(() => {
    window.addEventListener("resize", handleWindowSizeChange)
    return () => {
      window.removeEventListener("resize", handleWindowSizeChange)
    }
  }, [])

  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>good dogs | tommyhinman</title>
        <html className={isModalEnabled ? styles.scrollingLocked : ""}></html>
        <body className={isModalEnabled ? styles.scrollingLocked : ""}></body>
      </Helmet>
      <Layout>
        <h1 className="title is-size-2-desktop is-size-3-mobile">Good Dogs</h1>
        <div className="notification is-info">
          Now being updated at{" "}
          <a href="https://gooddogs.tommyhinman.com">
            gooddogs.tommyhinman.com
          </a>
          !
        </div>
        <div className=" mt-0 mb-5">
          {dogs.map((dog, index, arr) => (
            <>
              <Dog dogData={dog} key={index} onImageClick={openModal} />
              {index === arr.length - 1 ? "" : <hr />}
            </>
          ))}
        </div>
      </Layout>
      <div className={isModalEnabled ? "modal is-active" : "modal"}>
        <div className="modal-background" onClick={closeModal}></div>
        <div className="modal-content" onClick={closeModal}>
          <p className="image is-large">
            <img src={modalImageUrl} alt="" />
          </p>
        </div>
        <button
          className="modal-close is-large"
          aria-label="close"
          onClick={closeModal}
        ></button>
      </div>
    </>
  )
}

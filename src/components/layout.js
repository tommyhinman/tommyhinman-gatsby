import React from "react"
import "../mystyles.scss"
import styles from "./layout.module.scss"
import Navbar from "../components/navbar"
import Footer from "../components/footer"

export default function Layout({ children }) {
  return (
    <div className={styles.parentContainer} >
      <Navbar />
      <div className="section mt-3 mx-1 is-hidden-tablet">
        <div className="columns is-centered">
          <div className="column is-8-desktop is-full-mobile">
            {children}
          </div>
        </div>
      </div>
      <div className="mt-6 mx-6 is-hidden-mobile">
        <div className="columns is-centered">
          <div className="column is-8-desktop is-full-mobile">
            {children}
          </div>
        </div>
      </div>
      <div className={styles.spaceFiller} /> {/*Flexible Invisible Space Filler!*/}
      <Footer />
    </div>
  )
}

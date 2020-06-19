import React from "react"
import "../mystyles.scss"
import styles from "./layout.module.scss"
import Navbar from "../components/navbar"
import Footer from "../components/footer"

export default function Layout({ children }) {
  return (
    <div className={styles.parentContainer} >
      <Navbar />
      <div className={styles.layoutBody}>
        <div className="columns is-centered">
          <div className="column is-three-fifths-desktop is-full-mobile">
            {children}
          </div>
        </div>
      </div>
      <div className={styles.spaceFiller} /> {/*Flexible Invisible Space Filler!*/}
      <Footer />
    </div>
  )
}

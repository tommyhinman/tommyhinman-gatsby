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
        {children}
      </div>
      <div className={styles.spaceFiller} /> {/*Flexible Invisible Space Filler!*/}
      <Footer />
    </div>
  )
}

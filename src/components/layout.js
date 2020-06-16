import React from "react"
import "../mystyles.scss"
import styles from "./layout.module.css"
import Navbar from "../components/navbar"
import Footer from "../components/footer"



export default function Layout({ children }) {
  return (
    <div>
      <Navbar />
      <div style={{ margin: `3rem auto`, maxWidth: 900, padding: `0 1rem` }}>
        {children}
      </div>
      <Footer />
    </div>
  )
}

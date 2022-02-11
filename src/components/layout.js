import React from "react"
import { Helmet } from "react-helmet"
import "../mystyles.scss"
import * as styles from "./layout.module.scss"
import Navbar from "../components/navbar"
import Footer from "../components/footer"


export const Layout = ({ children }) => {
  return (
    <>
      {/* Only add the cloudflare analytics tag in production, since it checks CORS. */}
      {process.env.NODE_ENV != "development" && (
        <Helmet>
          <script defer src="https://static.cloudflareinsights.com/beacon.min.js" data-cf-beacon="{&quot;token&quot;: &quot;3aa680a9c3c44e04a8a33c6d45116289&quot;}"></script>
        </Helmet>
      )}
      <div className={styles.parentContainer} >
        <Navbar />
        <div className="section mt-0 pt-5 mx-1 is-hidden-tablet">
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
    </>
  )
}

export default Layout
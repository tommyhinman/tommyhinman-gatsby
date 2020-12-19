import React from "react"
import Layout from "../components/layout"
import { Helmet } from "react-helmet"

export default function About() {
  return (
    <div>
    <Helmet>
      <meta charSet="utf-8" />
      <title>about | tommyhinman</title>
    </Helmet>
    <Layout>
      <div className="content">
        <h1 className="title is-size-2-desktop is-size-3-mobile">About</h1>
        <p>
          A little home for projects and preoccupations.
        </p>
        <p>
          Résumé available on request at <a href="mailto:tommyhinman@gmail.com">tommyhinman@gmail.com</a>.
        </p>
      </div>
    </Layout>
    </div>
  )
}

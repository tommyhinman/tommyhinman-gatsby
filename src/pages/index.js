import React from "react"
import "../mystyles.scss"
import Layout from "../components/layout"
import { Helmet } from "react-helmet"

export default function Home() {
  return (
    <div>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Home | tommyhinman</title>
      </Helmet>
      <Layout>


        <div className="content">
          <h1>Home</h1>
          <p className="is-small">Some add'l text.</p>
        </div>


      </Layout>
    </div>
  )
}

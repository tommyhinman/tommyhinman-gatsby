import React from "react"
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
        <h3>Test Website!</h3>
        <p>Some addl text.</p>
      </Layout>
    </div>
  )
}

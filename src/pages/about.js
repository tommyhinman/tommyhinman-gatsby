import React from "react"
import Layout from "../components/layout"
import { Helmet } from "react-helmet"

export default function About() {
  return (
    <div>
    <Helmet>
      <meta charSet="utf-8" />
      <title>About | tommyhinman</title>
    </Helmet>
    <Layout>
      <h3>Testing an About page</h3>
      <p>
        <a href="mailto:me@example.com">me@example.com</a>
      </p>
    </Layout>
    </div>
  )
}

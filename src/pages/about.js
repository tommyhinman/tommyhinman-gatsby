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


      <div class="content">
        <h1>About</h1>
        <p>
          This website is a work in progress!
        </p>
        <p>
          <a href="mailto:me@example.com">me@example.com</a>
        </p>
      </div>


    </Layout>
    </div>
  )
}

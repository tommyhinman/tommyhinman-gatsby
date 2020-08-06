import React from "react"
import Layout from "../components/layout"
import { Helmet } from "react-helmet"

export default function Projects() {

  const envVar = process.env.TEST_VAR_TOMMY;

  return (
    <div>
    <Helmet>
      <meta charSet="utf-8" />
      <title>Projects | tommyhinman</title>
    </Helmet>
    <Layout>


      <div class="content">
        <h1>Projects</h1>
        <p>
          Environment variable test: {`${process.env.TEST_VAR_TOMMY}`}
        </p>
        <p>
          Environment variable test 2: {envVar}
        </p>
      </div>

    </Layout>
    </div>
  )
}

import React, {useEffect} from "react"
import Layout from "../components/layout"
import { Helmet } from "react-helmet"
import Amplify, { Analytics } from 'aws-amplify';

export default function About() {
  // Record page analytics
  useEffect( () => { Analytics.record({ name: 'pagevisit-index' }); }, []);

  return (
    <div>
    <Helmet>
      <meta charSet="utf-8" />
      <title>About | tommyhinman</title>
    </Helmet>
    <Layout>


      <div className="content">
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

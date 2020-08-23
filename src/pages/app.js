import React, {useEffect, useState} from "react"
import { Helmet } from "react-helmet"
import { Router, navigate } from "@reach/router"
import Layout from "../components/layout"
import { Link } from "gatsby"
import { withAuthenticator, Authenticator, Greetings } from 'aws-amplify-react';
import { AmplifySignOut } from '@aws-amplify/ui-react';
import { Auth, API } from 'aws-amplify'
import Pinboard from '../components/pinboard'
import useUserUtil from '../components/userUtil'

const MyTheme = {
    signInButtonIcon: { 'display': 'none' },
    googleSignInButton: { 'backgroundColor': 'red', 'borderColor': 'red' }
}

const Home = () => <p>Home</p>

const Tools = () => {

  return (
    <div>
      <Authenticator />
      <hr />
      <Pinboard />
    </div>
  );
}

const ToolsWithAuth = withAuthenticator(Tools)

const App = () => (
  <div className="content">
    <Helmet>
      <meta charSet="utf-8" />
      <title>app | tommyhinman.com</title>
    </Helmet>
    <Layout>
      <nav>
        <Link to="/app">Home</Link> |&nbsp;
        <Link to="/app/tools">Tools</Link>
      </nav>
      <Router>
        <Home path="/app" path="/app">Home</Home>
        <ToolsWithAuth path="/app/tools">Tools</ToolsWithAuth>
      </Router>
    </Layout>
  </div>
)

export default App

import React from "react"
import { Router, navigate } from "@reach/router"
import { Link } from "gatsby"
import { withAuthenticator, Authenticator, Greetings } from 'aws-amplify-react';
import { AmplifySignOut } from '@aws-amplify/ui-react';
import { Auth } from 'aws-amplify'

const MyTheme = {
    signInButtonIcon: { 'display': 'none' },
    googleSignInButton: { 'backgroundColor': 'red', 'borderColor': 'red' }
}


const Home = () => <p>Home</p>
const Settings = () => (
  <div>
    <p>Settings</p>
    <Authenticator />
  </div>
)
const Billing = () => <p>Billing</p>

const AuthSettings = withAuthenticator(Settings)

const App = () => (
  <>
    <nav>
      <Link to="/app">Home</Link>
      <Link to="/app/settings">Settings</Link>
      <Link to="/app/billing">Billing</Link>
    </nav>
    <Router>
      <Home path="/app" path="/app">Home x</Home>
      <AuthSettings path="/app/settings">Settings x</AuthSettings>
      <Billing path="/app/billing">Billing x</Billing>
    </Router>
  </>
)

export default App

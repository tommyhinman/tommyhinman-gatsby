import React from "react"
import { Helmet } from "react-helmet"
import Layout from "../../components/layout"
import Game from "./fruit-balls/Game"

export default function FruitBalls() {
  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>fruitballs | tommyhinman</title>
      </Helmet>
      {/* <Layout> */}
      <Game />
      {/* </Layout> */}
    </>
  )
}

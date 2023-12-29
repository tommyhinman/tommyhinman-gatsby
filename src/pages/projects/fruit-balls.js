import React from "react"
import { Helmet } from "react-helmet"
import Game from "./fruit-balls/game"

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

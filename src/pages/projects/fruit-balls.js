import React from "react"
import { Helmet } from "react-helmet"
import Game from "./fruit-balls/game"
import "../../mystyles.scss"

export default function FruitBalls() {
  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width; initial-scale=1; maximum-scale=1; user-scalable=0;"
        />
        <title>fruitballs | tommyhinman</title>
      </Helmet>

      <div>
        <div class="columns is-centered">
          <div class="column is-6-desktop">
            <Game />
          </div>
        </div>
      </div>
    </>
  )
}

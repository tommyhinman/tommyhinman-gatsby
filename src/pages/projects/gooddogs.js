import React from "react"
import { Helmet } from "react-helmet"
import Layout from "../../components/layout"
import { getDogs } from "../../data/dogs"

const Dog = ({ dogData }) => {
  return (
    <>
      <div className=" container">
        <span class="subtitle is-4">{dogData.title}</span>
        <figure className="image mt-2">
          <img src={dogData.imageUrl} />
        </figure>
      </div>
    </>
  )
}

export default function Gooddogs() {
  const dogs = getDogs()
  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>good dogs | tommyhinman</title>
      </Helmet>
      <Layout>
        <div className=" mt-0 mb-5">
          {dogs.map((dog, index, arr) => (
            <>
              <Dog dogData={dog} key={index} />
              {index === arr.length - 1 ? "" : <hr />}
            </>
          ))}
        </div>
      </Layout>
    </>
  )
}

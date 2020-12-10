import React from "react"
import Layout from "../../components/layout"
import { Helmet } from "react-helmet"
import { ToastContainer } from "react-toastr";
import ToastMessagejQuery from "react-toastr/lib/components/ToastMessage/ToastMessagejQuery";
import { getCategories } from "../../data/scattergoriesCategories"
import { navigate } from '@reach/router';

import "toastr/build/toastr.css";
import "animate.css/animate.css";

const seedrandom = require('seedrandom');
const randomWords = require('random-words');
const toastr = require('toastr');

const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J',
                 'K', 'L', 'M', 'N', 'O', 'P', 'R', 'S', 'T', 'W' ];
const numberOfCategories = 12;
const allCategories = getCategories();

export default function Scattergories() {

  var haveGeneratedSeed = false;
  var randomSeed = "";
  if (typeof window !== `undefined`) {
    if (window.location.search.length <= 1) {
      navigate('?' + getUnseededRandomWordString());
    }
    randomSeed = window.location.search.substring(1);
    haveGeneratedSeed = true;
  }
  const rng = new seedrandom(randomSeed);
  const startingLetterIndex = getRandom(rng, 0, 19);
  const startingLetter = letters[startingLetterIndex];


  const pickedCategories = pickCategories(rng, allCategories, numberOfCategories);

  return (<>
    <Helmet>
      <meta charSet="utf-8" />
      <title>scattergories | tommyhinman</title>
    </Helmet>
    <Layout>
        <div className="content mt-0 mb-5">
          <div className="columns is-centered">
            <div className="column is-5">
              <div className="box">
                {haveGeneratedSeed && (<>
                  <h1 className="title has-text-centered is-size-2 mb-2">
                    {startingLetter}
                  </h1>
                  <hr className="mt-2 mb-1"/>
                  <ol type="1">
                    {pickedCategories.map((category, index) => (
                      <li key={index}>{category}</li>
                    ))}
                  </ol>
                  <div className="is-size-7 has-text-centered">
                    Seed: {randomSeed}
                  </div>
                </>)}
              </div>
              <div className="columns is-variable is-1 is-mobile">
                <div className="column is-half">
                  <button className="button is-fullwidth is-info" onClick={copyCurrentUrlToClipboard}>
                    Copy Link
                  </button>
                </div>
                <div className="column is-half">
                  <button className="button is-fullwidth is-success" onClick={newGame}>
                    New Game
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
    </Layout>
  </>)
}

/*
  Copy the browser's current URL to the clipboard.
*/
function copyCurrentUrlToClipboard() {
  const urlToShare = window.location;
  const dummyTextArea = document.createElement("textarea");
  document.body.appendChild(dummyTextArea);
  dummyTextArea.value = window.location;
  dummyTextArea.select();
  document.execCommand("copy");
  document.body.removeChild(dummyTextArea);

  toastr.info('Seed: ' + window.location.search.substring(1), 'Copied link!');
}

/*
  Start a new game, by generating a new seed and navigating to it.
*/
function newGame() {
  const newGameSeed = getUnseededRandomWordString();
  navigate('?' + newGameSeed);
}

/*
  Pick categories from the full list of categories.
  Pass in the random generator, to preserve seed.
*/
function pickCategories(rng, categoryList, count) {
  const workingList = Array.from(categoryList);
  const pickedList = [];

  for (var i = 0; i < count; i++) {
    const randomIndex = getRandom(rng, 0, workingList.length);
    pickedList.push(workingList[randomIndex]);
    workingList.splice(randomIndex, 1);
  }

  return pickedList;
}

/*
  Random number between min and max.
  Pass in the random generator, to preserve seed.
*/
function getRandom(rng, min, max) {
  return Math.floor(rng() * (max - min) + min);
}

/*
  Get a random word string, to use for seeding.
  Doesn't use the seeded RNG that the rest of this code uses!
*/
function getUnseededRandomWordString() {
  const randomWordsList = randomWords(3);

  return randomWordsList.join('-');
}

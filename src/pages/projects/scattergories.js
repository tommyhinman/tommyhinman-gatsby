import React, {useState, useEffect} from "react"
import Layout from "../../components/layout"
import { Helmet } from "react-helmet"
import { ToastContainer } from "react-toastr";
import ToastMessagejQuery from "react-toastr/lib/components/ToastMessage/ToastMessagejQuery";
import { getCategories } from "../../data/scattergoriesCategories"
import { navigate } from '@reach/router';
import Countdown from 'react-countdown';
import Amplify, { Analytics } from 'aws-amplify';

import "toastr/build/toastr.css";
import "animate.css/animate.css";

const seedrandom = require('seed-random');
const randomWords = require('random-words');
const toastr = require('toastr');

const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J',
                 'K', 'L', 'M', 'N', 'O', 'P', 'R', 'S', 'T', 'W' ];
const numberOfCategories = 12;
// Two minutes in milliseconds
const gameLength = 120000;
const allCategories = getCategories();


export default function Scattergories() {
  // Record page analytics
  useEffect( () => { Analytics.record({ name: 'pagevisit-scattergories' }); }, []);

  /*
    Figure out the starting seed based on the URL search param.
    If there's none set, generate random words and use that.
    NOTE: These words are generated BEFORE setting the RNG seed, so they're different every time the page loads!
    This is intentional, so that whenever the game is newly loaded you get a fresh sequence of games.
  */
  var haveGeneratedSeed = false;
  var randomSeed = "";
  if (typeof window !== `undefined`) {
    if (window.location.search.length <= 1) {
      navigate('?' + getUnseededRandomWordString());
    }
    randomSeed = window.location.search.substring(1);
    haveGeneratedSeed = true;
  }

  // Seed Math.random() with the inputted (or generated) seed.
  seedrandom(randomSeed, {global:true});

  const [hasGameStarted, setHasGameStarted] = useState(false);

  const startingLetterIndex = getRandom(0, 19);
  const startingLetter = letters[startingLetterIndex];
  const pickedCategories = pickCategories(allCategories, numberOfCategories);

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
    setHasGameStarted(false);
  }

  /*
    Set the game state to started, which starts the timer's countdown!
  */
  function startGame() {
    setHasGameStarted(true);
  }

  const countdownRenderer = ({minutes, seconds, completed}) => {
    if (completed) {
      return (<span>Time's up!</span>);
    } else {
      var paddedSeconds = seconds;
      if (seconds < 10) {
        paddedSeconds = "0" + seconds;
      }
      return (<span>{minutes}:{paddedSeconds}</span>);
    }
  }

  return (<>
    <Helmet>
      <meta charSet="utf-8" />
      <title>scattergories | tommyhinman</title>
    </Helmet>
    <Layout>
        <div className="content mt-0 mb-5">
          <div className="columns is-centered">
            <div className="column is-5">
              {hasGameStarted && (
                <div className="is-size-2 has-text-centered">
                  <Countdown date={Date.now() + gameLength} renderer={countdownRenderer} />
                </div>
              )}

                <div className="box">
                  {haveGeneratedSeed && (<>
                    <h1 className="title has-text-centered is-size-2 mb-2">
                      {startingLetter}
                    </h1>
                    <hr className="mt-2 mb-1"/>
                    {hasGameStarted ? (
                    <ol type="1">
                      {pickedCategories.map((category, index) => (
                        <li key={index}>{category}</li>
                      ))}
                    </ol>
                  ) : (
                    <div className="has-text-centered">
                    <button className="button is-success my-3" onClick={startGame}>
                      Start Game
                    </button>
                    </div>
                  )}
                    <div className="is-size-7 has-text-centered">
                      Seed: {randomSeed}
                    </div>
                  </>)}
                </div>
              <div className="columns is-variable is-1 is-mobile">
                <div className="column is-half">
                  <button className="button is-fullwidth is-light is-info" onClick={copyCurrentUrlToClipboard}>
                    Copy Link
                  </button>
                </div>
                <div className="column is-half">
                  <button className="button is-fullwidth is-light is-success" onClick={newGame}>
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
  Pick categories from the full list of categories.
  Pass in the random generator, to preserve seed.
*/
function pickCategories(categoryList, count) {
  const workingList = Array.from(categoryList);
  const pickedList = [];

  for (var i = 0; i < count; i++) {
    const randomIndex = getRandom(0, workingList.length);
    pickedList.push(workingList[randomIndex]);
    workingList.splice(randomIndex, 1);
  }

  return pickedList;
}

/*
  Random number between min and max.
  Pass in the random generator, to preserve seed.
*/
function getRandom(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

/*
  Get a random word string, to use for seeding.
*/
function getUnseededRandomWordString() {
  const randomWordsList = randomWords(3);

  return randomWordsList.join('-');
}

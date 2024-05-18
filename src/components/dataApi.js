import React, { useState, useEffect, useReducer } from "react"
import axios, { CancelToken } from "axios"

const dataFetchReducer = (state, action) => {
  switch (action.type) {
    case "FETCH_INIT":
      return {
        ...state,
        isLoading: true,
        isError: false,
      }
    case "FETCH_SUCCESS":
      return {
        ...state,
        isLoading: false,
        isError: false,
        data: action.payload,
      }
    case "FETCH_FAILURE":
      return {
        ...state,
        isLoading: false,
        isError: true,
      }
    default:
      throw new Error()
  }
}

const useDataApi = (initialUrl, initialData, config = null) => {
  const [url, setUrl] = useState(initialUrl)

  const [state, dispatch] = useReducer(dataFetchReducer, {
    isLoading: false,
    isError: false,
    data: initialData,
  })

  useEffect(() => {
    let didCancel = false

    const fetchData = async () => {
      dispatch({ type: "FETCH_INIT" })

      // In cases where the URL is set to blank, no need to load.
      if (url != "") {
        try {
          console.log("Making http request to " + url)
          const result = await axios.get(url, config)
          if (!didCancel) {
            dispatch({ type: "FETCH_SUCCESS", payload: result.data })
          }
        } catch (error) {
          console.log("Error getting URL!")
          console.log(error)
          if (!didCancel) {
            dispatch({ type: "FETCH_FAILURE" })
          }
        }
      }
    }
    fetchData()

    return () => {
      didCancel = true
    }
  }, [url])

  return [state, url, setUrl]
}

export default useDataApi

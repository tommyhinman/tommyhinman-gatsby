import React, { useEffect, useState } from "react"
import { Helmet } from "react-helmet"
import Layout from "../../components/layout"
import useDataApi from "../../components/dataApi"
import { useDebounce } from "use-debounce"

const urlTemplate =
  "https://api.themoviedb.org/3/movie/{MOVIE_ID}?append_to_response=credits"
const SEARCH_URL_TEMPLATE =
  "https://api.themoviedb.org/3/search/movie?query={QUERY}&include_adult=false&language=en-US&page=1"
const JOBS = ["Director", "Screenplay"]

const CastList = ({ movieData }) => {
  return movieData.credits.cast.map(castEntry => <div>{castEntry.name}</div>)
}

const movieDataMap = new Map()

const getMovieName = id => {
  const movieData = movieDataMap.get(id)
  return movieData != null ? movieData.title : "unknown"
}

const getParticipantIds = id => {
  const movieData = movieDataMap.get(id)
  if (movieData == null) return []

  const actorList = movieData.credits.cast
  const crewList = movieData.credits.crew.filter(c => JOBS.includes(c.job))
  return [...new Set([...actorList, ...crewList])]
}

const getMovieIntersection = (a, b) => {
  const castListA = getParticipantIds(a)
  const castIdsA = castListA.map(c => c.id)
  const castListB = getParticipantIds(b)

  return castListB.filter(m => castIdsA.includes(m.id))
}

export default function Movies() {
  const config = {
    headers: {
      Authorization:
        // This is a read-only key, so I guess it's fine to check it in.
        "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4ZGZhMzliOWMxZDgyYzQwYTcwNzk1ZjNmZDE2ZGI5YiIsInN1YiI6IjY2NDhkNTY3NDZmNzA3ZWU5ZjhlN2I1YyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.vPw5sD0iAcqqkEp0qmsoPzsKsGfjel1yvXp_wWHS9YU",
    },
  }
  const [movieFetch, movieUrl, setMovieUrl] = useDataApi(
    urlTemplate.replace("{MOVIE_ID}", "11"),
    null,
    config
  )

  const [searchFetch, searchUrl, setSearchUrl] = useDataApi(
    SEARCH_URL_TEMPLATE.replace("{QUERY}", ""),
    null,
    config
  )

  const [searchQuery, setSearchQuery] = useState("")
  const [movieList, setMovieList] = useState([])
  const [connection, setConnection] = useState("")
  const [debouncedSearchQuery] = useDebounce(searchQuery, 200)

  useEffect(() => {
    if (
      searchFetch != null &&
      searchFetch.data != null &&
      searchFetch.data.results != null &&
      searchFetch.data.results.length > 0
    ) {
      const searchData = searchFetch.data.results
      const list = searchData.map((result, i) => {
        const date = new Date(result.release_date)
        const movieLabel = `${result.title} (${date.getFullYear()})`
        return { id: result.id, name: movieLabel }
      })
      console.log({ list })
      setSearchItems(list)
    }
  }, [searchFetch])

  useEffect(() => {
    if (movieFetch != null && movieFetch.data != null) {
      const movieData = movieFetch.data
      movieDataMap.set(movieData.id, movieData)
      const newMovieId = movieData.id
      if (!movieList.includes(newMovieId)) {
        const currentMovieId = movieList[movieList.length - 1]

        if (movieList.length == 0) {
          setMovieList([...movieList, newMovieId])
        } else {
          const intersection = getMovieIntersection(currentMovieId, newMovieId)
          if (intersection.length > 0) {
            setConnection(intersection.map(c => c.name).join(", "))
            setMovieList([...movieList, newMovieId])
            setSearchItems([])
          }
        }
      }
    }
  }, [movieFetch])

  const [searchItems, setSearchItems] = useState([])

  const handleOnSearch = string => {
    const encodedStr = encodeURIComponent(string)
    setSearchUrl(SEARCH_URL_TEMPLATE.replace("{QUERY}", encodedStr))
  }

  const handleOnSelect = id => {
    const url = urlTemplate.replace("{MOVIE_ID}", id)
    setMovieUrl(url)
  }

  useEffect(() => {
    handleOnSearch(debouncedSearchQuery)
  }, [debouncedSearchQuery])

  const isLoading = movieFetch.isLoading || movieFetch.data == null

  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>movies | tommyhinman</title>
      </Helmet>
      <Layout>
        {connection && <div>Connection: {connection}</div>}
        <div>
          Movie List:{" "}
          {movieList.map(m => (
            <div>{getMovieName(m)}</div>
          ))}
        </div>
        <div class="dropdown is-active">
          <div class="dropdown-trigger">
            <div class="field">
              <p class="control is-expanded has-icons-right">
                <input
                  class="input"
                  type="search"
                  placeholder="Search..."
                  onChange={e => {
                    setSearchQuery(e.target.value)
                  }}
                />
                <span class="icon is-small is-right">
                  <i class="fas fa-search"></i>
                </span>
              </p>
            </div>
          </div>
          <div class="dropdown-menu" id="dropdown-menu" role="menu">
            <div class="dropdown-content">
              {searchItems.map(i => (
                <a
                  href="#"
                  class="dropdown-item"
                  value={i.id}
                  onClick={() => handleOnSelect(i.id)}
                >
                  {i.name}
                </a>
              ))}
            </div>
          </div>
        </div>
      </Layout>
    </>
  )
}

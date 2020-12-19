import React from "react"
import { Link } from "gatsby"

export default function Project(props) {

  const ProjectLink = (props) => {
    if(props.internalLink != null) {
      return (
        <Link to={props.internalLink}>
          {props.projectName}
        </Link>
      )
    } else if (props.externalLink != null) {
      return (
        <a href={props.externalLink} target="_blank">
          {props.projectName}
        </a>
      )
    } else {
      return (
        <div>
          {props.projectName}
        </div>
      )
    }
  }

  return (
    <div className="container my-4">
      <h1 className="title is-4">
        <ProjectLink
          internalLink={props.internalLink}
          externalLink={props.externalLink}
          projectName={props.projectName}
        />
      </h1>
      <div className="content">
        {props.children}
      </div>
    </div>
  )
}

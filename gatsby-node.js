const path = require(`path`)
const { createFilePath } = require(`gatsby-source-filesystem`)
const util = require('util')

exports.onCreateNode = ({ node, getNode, actions }) => {
  const { createNodeField } = actions
  if (node.relativeDirectory === `data/aoty`) {
    // Cut the 'data' folder out of the slug, since it's not necessary. There's probably a cleaner way to do this.
    const slug = createFilePath({ node, getNode, basePath: `pages` }).replace('\/data','')

    console.log("Creating slug: " + slug)
    createNodeField({
      node,
      name: `slug`,
      value: slug,
    })
  }
}

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions
  // **Note:** The graphql function call returns a Promise
  // see: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise for more info
  const result = await graphql(`
    query {
      allFile(filter: { relativeDirectory: { eq: "data/aoty" } }) {
        nodes {
          fields {
            slug
          }
        }
      }
    }
  `)

  console.log("RESULT: " + util.inspect(result, false, null, true /* enable colors */))

  result.data.allFile.nodes.forEach(( node ) => {
    // This is a pretty ugly way to get the year out of the file path to insert as context... There's probably a cleaner way.
    var aotyYear = node.fields.slug.split('/')[2]
    console.log("Creating page for year: " + aotyYear);
    createPage({
      path: node.fields.slug,
      component: path.resolve(`./src/templates/aoty.js`),
      context: {
        // Data passed to context is available
        // in page queries as GraphQL variables.
        slug: node.fields.slug,
        aotyYear: aotyYear,
      },
    })
  })
}

// Implement the Gatsby API “onCreatePage”. This is
// called after every page is created.
exports.onCreatePage = async ({ page, actions }) => {
  const { createPage } = actions

  // page.matchPath is a special key that's used for matching pages
  // only on the client.
  if (page.path.match(/^\/app/)) {
    page.matchPath = "/app/*"

    // Update the page.
    createPage(page)
  }
}

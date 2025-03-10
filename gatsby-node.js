const axios = require("axios")
const og = require("open-graph")
const { createRemoteFileNode } = require("gatsby-source-filesystem")
const request = require("request");

/**
 START OF A dirty HACK: 
 We add "MEETUP_BROWSER_ID" to not get a 500 from meetup.com API
 everyone loves monkey-patching 🐒:
 */
// 
og.getHTML = function (url, userAgent, cb) {
  request({
    url: url,
    encoding: 'utf8',
    gzip: true,
    jar: true,
    cookies: "",
    // here is the change:
    headers: { 'User-Agent': userAgent, "Cookie": "MEETUP_BROWSER_ID=id=" },
  },
    function (err, res, body) {
      if (err) return cb(err);

      if (res.statusCode === 200) {
        cb(null, body);
      }
      else {
        cb(new Error("Request failed with HTTP status code: " + res.statusCode));
      }
    })
}

/**
 END OF HACK
 */


exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions

  createTypes(`
    type Event implements Node {
        created: Date @dateformat
        date_in_series_pattern: Boolean
        description: String
        duration: Int
        group: MeetupGroup
        id: String
        is_online_event: Boolean
        link: String
        local_date: Date @dateformat
        local_time: String
        name: String
        rsvp_close_offset: String
        rsvp_limit: Int
        status: String
        time: Date @dateformat
        updated: Date @dateformat
        utc_offset: Int
        visibility: String
        waitlist_count: Int
        yes_rsvp_count: Int
        featuredImg: File @link(from: "fields.localFile")
    }

    type MeetupGroup implements Node {
        created: Date @dateformat
        name: String
        id: Int
        join_mode: String
        lat: Float
        lon: Float
        urlname: String
        who: String
        localized_location: String
        state: String
        country: String
        region: String
        timezone: String
    }
    `)
}

exports.sourceNodes = async ({ actions, createNodeId, createContentDigest, reporter }, { groupId }) => {
  const { createNode } = actions

  if (!groupId) {
    reporter.panic("Please define an groupId param to gatsby-source-meetup-events")
  }

  const axiosClient = axios.create({
    baseURL: "https://api.meetup.com/",
  })

  try {
    const { data } = await axiosClient.get(`${groupId}/events`)

    data.forEach((event) => {
      createNode({
        ...event,
        id: createNodeId(event.id),
        parent: null,
        children: [],
        internal: {
          type: "Event",
          content: JSON.stringify(event),
          contentDigest: createContentDigest(event),
        },
      })
    })
  } catch (err) {
    reporter.panicOnBuild("Error creating Meetup events.")
  }
}

exports.onCreateNode = async ({ node, actions: { createNode, createNodeField }, createNodeId, getCache }) => {
  if (node.internal.type === "Event" && node.link !== null) {

    const ogData = await new Promise((resolve, reject) => {
      const link = node.link.replace(/\/\s*$/, "");

      return og(link, function (err, meta) {
        if (err) {
          reject(`Failed by loading open graph for meetup: ${link} // error: ${err}`)
        } else {
          resolve(meta)
        }
      })
    })

    highResImage = ogData.image.url.replace("global_", "highres_")

    const fileNode = await createRemoteFileNode({
      url: highResImage,
      parentNodeId: node.id,
      createNode,
      createNodeId,
      getCache,
    })
    if (fileNode) {
      createNodeField({ node, name: "localFile", value: fileNode.id })
    }
  }
}

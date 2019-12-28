# gatsby-source-meetup-events

## Description

Gatsby source plugin for fetching Meetup events. Uses Meetup's Group ID to fetch upcoming events with the unauthenticated [Group Events endpoint](https://www.meetup.com/meetup_api/docs/:urlname/events/#list).

From Meetup's documentation

> Gets a listing of all Meetup Events hosted by a target group, in ascending order by default

The Schema is explicitly typed using [Gatsby's schema customisation API](https://www.gatsbyjs.org/docs/schema-customization/).

## How to install

`npm install --save gatsby-source-meetup-events`

`yarn add gatsby-source-meetup-events`

## Available options

## Setup

Add the following to your gatsby-config, including the groupID option for the group whose events are to be fetched.

```js
{
    resolve: 'gatsby-source-meetup-events',
    options: {
        groupId: `Front-End-Web-Developers-Perth`,
    },
},
```

## Available options

`groupID`: **Required**. The Group ID to query for events.

## When do I use this plugin?

This plugin was created for managing a community group website. The next three events were fetched and displayed on the site so members were kept up to date with upcoming events. They could then navigate to the Meetup event and RSVP.

## How to query for data

You can query the next three events by doing the following

```graphql
query EventsQuery {
  allEvent(limit: 3) {
    edges {
      node {
        id
        name
        link
        date: local_date(formatString: "dddd, MMMM D")
        month: local_date(formatString: "MMMM")
      }
    }
  }
}
```

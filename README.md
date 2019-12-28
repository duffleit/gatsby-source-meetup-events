# gatsby-source-meetup-events

Gatsby source plugin fetching Meetup events. Uses Group ID to fetch all upcoming events with the unauthenticated [Group Events endpoint](https://www.meetup.com/meetup_api/docs/:urlname/events/#list).
From Meetup's documentation

> Gets a listing of all Meetup Events hosted by a target group, in ascending order by default

The Schema is explicitly typed using [Gatsby's schema customisation API](https://www.gatsbyjs.org/docs/schema-customization/).

## Install

`yarn add gatsby-source-meetup-events`

`npm install --save gatsby-source-meetup-events`

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

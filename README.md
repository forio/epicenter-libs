# Epicenter JavaScript Libs (v3)

Intended for use w/ Node 12

UPDATEME: (ideally before a major knowledge transfer to avoid frequent update responsibilities); what follows below is just a few makeshift notes; any formatting, clarification, or additional details you want to tack on are greatly appreciated

## Transition Guide (v2 &rarr; v3)
* Everything has a scopeBoundary: Project, Group, Episode, World, Run, 
* Use `key` — `id` is now internalized, now the long value of the row id in the database
* All `key`s are GUIDs (globally unique ids)
* objectType - `user` or `admin`; used for a thing? permissions or something

## Somes Tenets for Development
* Code should function in both Browser and Node environments

## Todos
* Address CometD usage (make compatible with both Browser and Node) -- currently providing our own cometd instance when using channels
* Figure out how to get a testing framework in for the Node side; seems users are encountering issues the use of `node --experimental-modules` w/ regards to Mocha
* Add some sort of error handling for when Epicenter drops your permissions (will occur after a certain period of time); how should this affect channels, what should client receive, etc.

## How to Test Node

## How to Test Browser
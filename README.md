Epicenter JavaScript Libs (v3)
---

Prequisite Node version: 12+

JIRA: https://issues.forio.com/projects/EPILIBS/issues

- [Transition Guide (v2 &rarr; v3)](#transition-guide-v2--v3)
  - [New Features In v3](#new-features-in-v3)
  - [Some Things Were Renamed](#some-things-were-renamed)
  - [Changes In The Way We Store And Expose User Data](#changes-in-the-way-we-store-and-expose-user-data)
  - [Session Expiration & Generic Error Handling](#session-expiration--generic-error-handling)
  - [Built-in SSO Handling](#built-in-sso-handling)
  - [Pagination](#pagination)
  - [Presence](#presence)
- [Tenets for Development](#tenets-for-development)
- [How to Contribute](#how-to-contribute)
- [How to Prepare a Release](#how-to-prepare-a-release)
- [How to Build Documentation](#how-to-build-documentation)
- [How to Test](#how-to-test)
- [How to Use Examples (Local)](#how-to-use-examples-local)
  - [Vanilla JavaScript](#vanilla-javascript)
  - [Node Server](#node-server)


# Transition Guide (v2 &rarr; v3)
## New Features In v3
* All resources now have an associated scope to help categorize them -- e.g., project, group, episode, world.
* All resources now have an associated permit to help define permissions for roles (anonymous, participant, leader, reviewer, facilitator)
* Users now have a `displayName` for use in sims, detached from any private personal data
* Two new roles for end users:
    * reviewer: a role similar to facilitators, but lower on the permissions hierarchy
    * leader: a role similar to participants, but higher on the permissions hierarchy
* And more below...

## Some Things Were Renamed
* A bunch of user and run properties, among them --
    * `userName → handle`
    * `firstName → givenName`
    * `lastName → familyName`
    * `run.saved → run.marked`
    * `run.trashed → run.hidden`
* Resources ID'd by `[RESOURCE]Id` (e.g., `runId`) now use `key` instead of `id` (so now it's `runKey`)
* `id` now refers to the long value of the row ID in the database instead
* All resource `key`s are GUIDs (globally unique IDs)

## Changes In The Way We Store And Expose User Data
User information has been separated into out to better support for GDPR standards. Users now own a "pseudonym" from which to interact with the simulations. This is detached from their personal data which lets the platform to maintain a record while allowing for easy removal of user-sensitive data when requested.

## Session Expiration & Generic Error Handling
* v3 authorization tokens can now expire after a period of inactivity, and become invalid after a world assignment change
* All calls have an error handling fallback to an `errorManager` instance, which will help to run checks on generic network errors like the expiration behavior described in the previous bullet

## Built-in SSO Handling
On load, epi-libs will now make an effort to find any Epicenter SSO tokens and consume them to generate an Epicenter session for you. This means a node server is no longer a hard requirement if you want to do SSO!

## Pagination
When retrieving records, pagination is no longer done via the request `Content-Range` header like in v2. Instead, the platform will now return a page-like object, which will contain properties that reflect the `records {start}-{end}/{total}` syntax:

* `first → page.firstResult`
* `end → page.firstResult + page.maxResults`
* `total → page.totalResults`

## Presence
A user's presence is now determined by their connection to the CometD server. Unlike in v2, the platform will automatically create push channel notifications on behalf of the user when they subscribe or do anything channel related (i.e., like a CometD handshake).

# Tenets for Development
* Code should function in both Browser and Node environments
* Trailing slashes in URL pathnames are meaningful in v3; so where applicable: always omit the slash at the end of the URLs of your API REST call (**this includes the one that might show up before a search query**)

# How to Contribute
1. Create a new branch for your change; if there's a JIRA ticket associated use that, e.g., `git checkout -b EPILIBS-42`
2. Make your changes
3. Create a [conventional commit](https://www.conventionalcommits.org/en/v1.0.0/) describing your changes
   * If you feel your change breaks the existing usage of the library be sure to indicate this in the commit message by adding a note in the commit footer starting with: `BREAKING CHANGE: `
4. Push up your branch and make sure it passes the tests in the pre-push hook
5. Make a pull request on github, or if you're confident: merge your branch into `master`

# How to Prepare a Release
1. Build to the `dist/` folder: `npm run build`
2. Test to make sure there are no breaking changes: `npm run single-test`
3. Make sure you have the latest tags from master: `git fetch origin`
4. Update version in the `package.json` file; suffix your version with `-breaking` if it contains a breaking change
5. Update the change log: `npm run changelog` to generate the diff between versions
6. Commit `package.json` and `CHANGELOG.md` files to `master`
7. Tag `master` with the same version you used in step 4 (prefix with 'v')
8. Visit Jenkins: https://build.forio.com/job/deploy-epicenter-js-v3--epicenter--/

\*The web development team isn't planning on incrementing the number that correlates to the major version, that space is reserved for major platform changes (i.e., Epicenter v4 and beyond). Instead, starting in `v3.8.0` -- we will opt to track breaking changes with a suffix `-breaking` and increment the minor number instead.

E.g., `3.10.9-breaking` indicates a breaking change to `3.9.x`. **Beware of these changes when incrementing versions; do not jump minor versions without looking at the tags in between.** You can utilize the CHANGELOG.md to review what has changed between versions and tags.

# How to Build Documentation


# How to Test
Tests are written to preserve behavior across releases. These are unit tests and are not intended for testing Epicenter features themselves.

```
npm install             # Installs dependencies for libs
npm run build           # Builds libs to dist/ folder
npm run single-test     # Runs the tests once
npm run test            # Runs the tests w/ a watch
```
Logs during testing are sent to `browser.log` file

# How to Use Examples (Local)
The following are examples of the Epicenter JS libs use cases. Their intended purpose is to be a sandbox for end-to-end testing.

Do not use these as a starting point/template for new projects. They are not an indicator of frontend best practices, rather -- the choice to use vanilla JavaScript here was to make it universally understandable.

## Vanilla JavaScript
```
npm install             # Installs dependencies for libs
npm run build           # Builds libs to dist/ folder
cd examples/parcel
npm install             # Install dependencies for example
npm start               # Serves example locally at local.forio.com:3913
```
## Node Server
```
npm install             # Installs dependencies for libs
npm run build-node      # Builds libs (node version) to dist/ folder
cd examples/node
npm install             # Install dependencies for example
npm start
```

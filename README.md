# Epicenter JavaScript Libs (v3)

Intended for use w/ Node v12

**ATTENTION** -- current development is done on test.forio.com, you'll need to ensure the test server is on in order to make API calls; Jenkins job: https://build.forio.com/view/Ops/job/test-server-start-stop--client-staging--ops--/

UPDATEME: (ideally before a major knowledge transfer to avoid frequent update responsibilities); what follows below is just a few makeshift notes; any formatting, clarification, or additional details you want to tack on are greatly appreciated

## Transition Guide (v2 &rarr; v3)
* All resources now have a scopeBoundary: Project, Group, Episode, World, Run,
* Using `key` instead of `id`; `id` now the long value of the row id in the database instead
* All `key`s are GUIDs (globally unique ids)
* objectType - special key used for generating Java object class instances on the platform, e.g., `user`, `admin`
* v3 authorization tokens can now expire after a period of inactivity, or world assignment change

## Somes Tenets for Development
* Code should function in both Browser and Node environments

## Todos
* See JIRA: https://issues.forio.com/projects/EPILIBS/issues

## How to Use Examples
By default, all examples currently go to the `forio-dev/epi-v3` account/project on Epicenter. Examples files are intended to provide a sandbox environment for development, feel free to edit as you wish.

### Vanilla JavaScript (with Webpack)
```
npm run build           #in a separate terminal
cd examples/vanilla
npm install
npm start
```
### React Redux
```
npm run build           #in a separate terminal
cd examples/react-redux
npm install
npm start
```
### Node
```
npm run build-node      #in a separate terminal
cd examples/node
npm install
npm start
```

## How to Test
```
npm run build           #in a separate terminal
npm run test
```

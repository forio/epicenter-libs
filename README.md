# Epicenter JavaScript Libs (v3)

Intended for use w/ Node v12

⚠️ **ATTENTION** -- for newer platform features, you'll need to use the test server: `test.forio.com`; See Jenkins job: https://build.forio.com/view/Ops/job/test-server-start-stop--client-staging--ops--/

UPDATEME: (ideally before a major knowledge transfer to avoid frequent update responsibilities); what follows below is just a few makeshift notes; any formatting, clarification, or additional details you want to tack on are greatly appreciated

## Transition Guide (v2 &rarr; v3)
* All resources now have a scopeBoundary: Project, Group, Episode, World, Run,
* Using `key` instead of `id`; `id` now the long value of the row id in the database instead
* All `key`s are GUIDs (globally unique ids)
* objectType - special key used for generating Java object class instances on the platform, e.g., `user`, `admin`
* v3 authorization tokens can now expire after a period of inactivity, or world assignment change

## Somes Tenets for Development
* Code should function in both Browser and Node environments
* Trailing slashes in URL pathnames are meaningful in v3; so where applicable: always omit the slash at the end of the URLs of your API call (**this includes the one that might show up before a `?` in a query**)

## Todos
* See JIRA: https://issues.forio.com/projects/EPILIBS/issues

## How to Use Examples (Locally)
By default, all examples currently go to the `forio-dev/epi-v3` account/project on Epicenter. Examples files are intended to provide a sandbox environment for development, feel free to edit as you wish.

### Vanilla JavaScript (with Webpack)
```
npm install             # Installs dependencies for libs
npm run build           # Builds libs to dist/ folder
cd examples/vanilla
npm install             # Install dependencies for example
npm start               # Serves example locally at local.forio.com:3913
```
### React Redux
```
npm install             # Installs dependencies for libs
npm run build           # Builds libs to dist/ folder
cd examples/react-redux
npm install             # Install dependencies for example
npm start               # Serves example locally at local.forio.com:3913
```
### Node
```
npm install             # Installs dependencies for libs
npm run build-node      # Builds libs (node version) to dist/ folder
cd examples/node
npm install             # Install dependencies for example
npm start
```

## How to Test
```
npm install             # Installs dependencies for libs
npm run build           # Builds libs to dist/ folder
npm run test
```
Logs during testing are sent to `browser.log`

## How to Create a Production-Ready Build
When you feel you are ready to release new version of the the libs:
1. On the `develop` branch
2. Update the `package.json` with the to your new version (following [semver](https://semver.org/) specifications*)
3. Build to the `dist/` folder: `npm run prod`
4. Make sure tests pass: `npm run test`
5. Merge `develop` in to `master`
6. Tag `master` with the same version you used in step 2 (prefix w/ a 'v')

\* ⚠️ We don't truly follow semver standards; because we'd like to retain the MAJOR version at 3 to match in parallel with the Epicenter platform's versioning, we've lost the semantics for defining a release that *does* introduce a breaking change. **For this reason, for any and all releases that will contain potential breaking changes, we can only default to explicitly stating so in the release notes.** Obviously, try not to introduce any breaking changes.
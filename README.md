# Epicenter JavaScript Libs (v3)

Prequisite Node version: 12

JIRA: https://issues.forio.com/projects/EPILIBS/issues

## Transition Guide (v2 &rarr; v3)
* All resources now have a scopeBoundary: Project, Group, Episode, World, Run,
* Using `key` instead of `id`; `id` now the long value of the row id in the database instead
* All `key`s are GUIDs (globally unique ids)
* objectType - special key used for generating Java object class instances on the platform, e.g., `user`, `admin`
* v3 authorization tokens can now expire after a period of inactivity, or world assignment change

## Somes Tenets for Development
* Code should function in both Browser and Node environments
* Trailing slashes in URL pathnames are meaningful in v3; so where applicable: always omit the slash at the end of the URLs of your API call (**this includes the one that might show up before a search query**)

## How to Contribute
1. Create a new branch for your change; if there's a JIRA ticket associated use that, e.g., `git checkout -b EPILIBS-42`
2. Make your changes
3. Push up your branch and make sure it passes the tests in the pre-push hook
4. Merge your branch into `master`

## How to Prepare a Release
1. Build to the `dist/` folder: `npm run build`
2. Test to make sure there are no breaking changes: `npm run single-test`
3. Make sure you have the latest tags from master: `git fetch origin`
4. Update the `package.json` with the to your new version*
5. Update the change log: `npm run changelog`
6. Commit `package.json` and `CHANGELOG.md` files to `master`
7. Tag `master` with the same version you used in step 4 (prefix with 'v')
8. Visit Jenkins: https://build.forio.com/job/deploy-epicenter-js-v3--epicenter--/

\*We do not follow semver standards; because we'd like to retain the MAJOR version at 3 to match in parallel with the Epicenter platform's versioning, we have our own means of versioning:
```
Given a version number MAJOR.MINOR.PATCH, increment the:

MAJOR version never -- we'd likely recreate the libs from the ground up before updating this,
MINOR version when you add incompatible API changes, and
PATCH version when you make backwards compatible feature additions or bug fixes.

Additional labels for pre-release and build metadata are fine (e.g., `v3.1.0-alpha`)
```

## How to Build Documentation
We should figure out a better build process for this one, but for the time being:
```
cd documentation
node index.js
```
Will compile an HTML file called `documentation.html` in the same directory.

## How to Test
```
npm install             # Installs dependencies for libs
npm run build           # Builds libs to dist/ folder
npm run test
```
Logs during testing are sent to `browser.log`

## How to Use Examples (Locally)
By default, all examples currently go to the `forio-dev/epi-v3` account/project on Epicenter. Examples files are intended to provide a sandbox environment for development, feel free to edit as you wish.

### Vanilla JavaScript
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

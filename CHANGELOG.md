# [3.6.0](https://github.com/forio/epicenter-libs/compare/v3.5.1...v3.6.0) (2021-07-26)


### Code Refactoring

* vault update changed from PATCH -> PUT ([998693c](https://github.com/forio/epicenter-libs/commit/998693c33bff9e4a956da72a76c627172a712f0f))


### BREAKING CHANGES

* vaultAdapter.update produces a PUT instead of a PATCH (to match epicenter 3.7.x)



## [3.5.1](https://github.com/forio/epicenter-libs/compare/v3.5.0...v3.5.1) (2021-07-16)


### Features

* episodeAdapter.byName to take includeEpisodes ([d966d19](https://github.com/forio/epicenter-libs/commit/d966d19df3d94821bf78cd9aceaea707227bb26a))



# [3.5.0](https://github.com/forio/epicenter-libs/compare/v3.4.0...v3.5.0) (2021-07-14)


### Bug Fixes

* handle localhost domain ([7d77cc5](https://github.com/forio/epicenter-libs/commit/7d77cc52f497019c304a1a44797fea9c0552221b))


### Code Refactoring

* episodeAdapter.byName -> episodeAdapter.withName (new args) ([4829496](https://github.com/forio/epicenter-libs/commit/48294965feb09300790ca4d7d5bbc15feee01e82))
* forUserKey -> forUser ([f4fda50](https://github.com/forio/epicenter-libs/commit/f4fda5055995211957987082cbc6b842c8623bc8))
* vaultAdapter.getWithScope -> vaultAdapter.withScope ([d2304cd](https://github.com/forio/epicenter-libs/commit/d2304cd45fbd5c552c7691de3e8f22fd45cc8836))


### Features

* add vaultAdapter.byName ([d4b3f7b](https://github.com/forio/epicenter-libs/commit/d4b3f7b7bc569b9d3cd3ba6f35dc2fcd833d3e24))


### BREAKING CHANGES

* vaultAdapter.getWithScope -> withScope, renamed for consistency
* episodeAdapter.byName -> withName; takes groupName as an optional argument
* groupAdapter.forUserKey renamed to groupAdapter.forUser



# [3.4.0](https://github.com/forio/epicenter-libs/compare/v3.3.1...v3.4.0) (2021-06-10)


### Bug Fixes

* accept userKeys when using world scope in vault ([ec1cee9](https://github.com/forio/epicenter-libs/commit/ec1cee95ec468a53ac90a8d4f162a12cde8d86ea))
* no GETs for channelsEnabled on login ([820e5a4](https://github.com/forio/epicenter-libs/commit/820e5a43384034f47cf1b15e20c0034e21ed937f))
* query crashing on runs with no variables ([f6db421](https://github.com/forio/epicenter-libs/commit/f6db421d22823ccfc62989a973e54e0dfc9a3720))
* query variables return payload ([bfe4d2a](https://github.com/forio/epicenter-libs/commit/bfe4d2a7d2a6f6a78e1b403905b805c28a10af32))
* typo ([f57192c](https://github.com/forio/epicenter-libs/commit/f57192ce44aeb20ef3ea335ba03b3309e305847c))
* v3 SSO cookie occasionally wrapped in quotes ([a364b6c](https://github.com/forio/epicenter-libs/commit/a364b6cf9e49f576c8c917fbf484ba0529ed007e))
* worldAdapter.removeUsers to actually use DELETE ([ace23c5](https://github.com/forio/epicenter-libs/commit/ace23c5e4cd612896ba801acbfe67e9e832cfc8d))


### Code Refactoring

* change exceedMinimums to objective ([3f6fe10](https://github.com/forio/epicenter-libs/commit/3f6fe10f3ef20d25d71945fe05750180d5fc3be0))
* change runAdapter.query to better support multiplayer ([b9b6fab](https://github.com/forio/epicenter-libs/commit/b9b6fab21d8a2104f822f9dd50bba004cb53ae91))
* change worldAdapter.create to only take optional args ([addae8e](https://github.com/forio/epicenter-libs/commit/addae8e55e28b91f71400932be2da0676d380185))
* cleanup; remove updateAssignments ([eb2c721](https://github.com/forio/epicenter-libs/commit/eb2c7215b03f7d92834178d227bc73ca80470e1b))
* groupAdapter add/update/remove user ([efb6ed4](https://github.com/forio/epicenter-libs/commit/efb6ed4ba8799fcf55b26861b1ac822e6316400c))
* groupAdapter.get to use session groupkey by default ([5a3f667](https://github.com/forio/epicenter-libs/commit/5a3f667e6caaf54d11e361deff759e43bfc29bfb))
* rename 'updateUsers' -> 'updateAssignments' ([d21a0f1](https://github.com/forio/epicenter-libs/commit/d21a0f1751073abf5768150ab7fd678703de58fa))
* rename assignUsers to autoAssignUsers ([eabff19](https://github.com/forio/epicenter-libs/commit/eabff1936951a64758b78698e043105776cf62b0))
* rename editPersonas -> setPersonas ([dcba7e2](https://github.com/forio/epicenter-libs/commit/dcba7e24227d7a45645e249d644db348aa218b3b))
* rename getAssignments -> getAssignmentsByKey ([d02d5fd](https://github.com/forio/epicenter-libs/commit/d02d5fd08dc0b64193c815243c36ed6184b4e906))
* rename makeAssignments -> editAssignments ([142a2e9](https://github.com/forio/epicenter-libs/commit/142a2e9588fecd01500bd7d90a5e95ed537e803f))


### Features

* add 'keepEmptyWorlds' flag ([0c1d557](https://github.com/forio/epicenter-libs/commit/0c1d55703642dce3c587042a064a9690ab9e4611))
* add assetAdapter ([472358d](https://github.com/forio/epicenter-libs/commit/472358dac7e7459a7d565d5c651de7de81604d87))
* add assignRun for worldAdapter ([4ab0e11](https://github.com/forio/epicenter-libs/commit/4ab0e114ca4527ba9b3884787848526c9ae0c59a))
* add includeEpisode option for query ([01cbbeb](https://github.com/forio/epicenter-libs/commit/01cbbebb0b66b78f26acf5e7490c5032940ca4f4))
* add makeAssignments function ([f133bde](https://github.com/forio/epicenter-libs/commit/f133bdeb4513b91b46666ddf676227504ce501a5))
* add projectAdapter.get ([4dc13c5](https://github.com/forio/epicenter-libs/commit/4dc13c538e19241676715cf8f3df198c0c534f1b))
* add PUSH_CATEGORY.GROUP for assignments ([d8c6dfe](https://github.com/forio/epicenter-libs/commit/d8c6dfed85ca8ffab9e826c6ea281a9d4d73c460))
* add user adapter ([66bbe15](https://github.com/forio/epicenter-libs/commit/66bbe15cab723ffe7421cc5ab95330c58057b6cd))
* attempt to support formdata (browser) ([b073e48](https://github.com/forio/epicenter-libs/commit/b073e48eb30119c21fbc08ad769f3a607cc9b5c3))


### BREAKING CHANGES

* changed the arguments accepted by addUser, updateUser, removeUser
* worldAdapter.create to only take one (optional) argument
* query(modelFile, scope, optionals) -> query(modelFile, optionals)
* exceedMinimums -> objective; changed from bool to enum
* worldAdapter.getAssignments -> worldAdapter.getAssignmentsByKey
* worldAdapter.editPersonas -> worldAdapter.setPersonas
* worldAdapter.makeAssignments -> worldAdapter.editAssignments
* worldAdapter.assignUsers -> worldAdapter.autoAssignUsers
* worldAdapter.updateAssignments no longer supported
* worldAdapter.updateUsers -> worldAdapter.updateAssignments
* groupAdapter.get(groupKey) -> groupAdapter.get({ groupKey })



## [3.3.1](https://github.com/forio/epicenter-libs/compare/v3.3.0...v3.3.1) (2021-02-03)


### Bug Fixes

* errorManager default handler to actually return retry resp ([e5ba658](https://github.com/forio/epicenter-libs/commit/e5ba6589f12685c5ae1031a65695370b3dae294b))


### Features

* attach args to retry function ([443a1bf](https://github.com/forio/epicenter-libs/commit/443a1bf2e96c6b683e9ab88bf5a195502620a78c))



# [3.3.0](https://github.com/forio/epicenter-libs/compare/v3.2.1...v3.3.0) (2021-02-03)


### Code Refactoring

* change authAdapter.upgrade to authAdapter.regenerate ([3d05f2d](https://github.com/forio/epicenter-libs/commit/3d05f2dd12649cbcd23f8a32cb6192f77615b39e))


### BREAKING CHANGES

* authAdapter.upgrade renamed to authAdapter.regenerate



## [3.2.1](https://github.com/forio/epicenter-libs/compare/v3.2.0...v3.2.1) (2021-01-21)


### Bug Fixes

* add samesite, secure to session cookies ([101b261](https://github.com/forio/epicenter-libs/commit/101b261e49a48bf571b7fc05e953c5efeea0296b))


### Code Refactoring

* authAdapter.login to take generic URL options as 2nd arg ([be231a9](https://github.com/forio/epicenter-libs/commit/be231a9bee4562deff764193ead92e868fa9c83f))


### BREAKING CHANGES

* authAdapter.login now takes account/project overrides as second argument



# [3.2.0](https://github.com/forio/epicenter-libs/compare/v3.1.0...v3.2.0) (2020-12-11)


### Bug Fixes

* all 'optionals' to actually be optional ([9bdd9b0](https://github.com/forio/epicenter-libs/commit/9bdd9b067ad99d1898fa7bfd1318cad8e0fba42d))
* authAdapter.login to ignore falsey values ([572be63](https://github.com/forio/epicenter-libs/commit/572be63e49af02cd8b02cac62e5a3fa74121336e))
* handle 204 responses ([474bee3](https://github.com/forio/epicenter-libs/commit/474bee3d7029823a36f443f4a475df9848f7dac8))
* properly handle undefined search params ([0c34372](https://github.com/forio/epicenter-libs/commit/0c34372f12a76ac6869845866dec4e94a4fb2788))
* support node v12+ in build process ([d1c9afb](https://github.com/forio/epicenter-libs/commit/d1c9afb942ed68f0c7dd942c6daf56014a31b5a6))


### Code Refactoring

* runAdapter.retrieveFromWorld arguments ([239a2d4](https://github.com/forio/epicenter-libs/commit/239a2d4e6497522c5972dbfcf308935b113c54e3))


### Features

* add group adapters ([49fae4d](https://github.com/forio/epicenter-libs/commit/49fae4d0a0e142b478fe68a29b2d37e248047fde))
* add new push categories ([530d2ea](https://github.com/forio/epicenter-libs/commit/530d2ea2c99ae56e1f34f325be206f42e556fb54))
* add support for token overrides ([00adf31](https://github.com/forio/epicenter-libs/commit/00adf3141e95335c8b4be6707850b6511d5e3f3a))
* add support for worlds to runAdapter (EPILIBS-55) ([9213f2f](https://github.com/forio/epicenter-libs/commit/9213f2fd162be9536013b2bc97ff12eecae909b5))
* world api adapter (EPILIBS-55) ([7b2ac96](https://github.com/forio/epicenter-libs/commit/7b2ac96117e8218533e96ae2a0193a34c9d3fa32))


* refactor!: change LOCK_TYPE to ROLE ([ac9b200](https://github.com/forio/epicenter-libs/commit/ac9b200e6fa5f7fb935e8d53b62423412c2e745a))
* refactor!: change pagination ([44921fb](https://github.com/forio/epicenter-libs/commit/44921fbd3a28882343f24dfbc054e3a400c2dbf7))
* refactor!: router 'with' functions to only ignore undefined input ([b7cb586](https://github.com/forio/epicenter-libs/commit/b7cb586c4b1ec1c9faacb7eb19e2780d82610c69))
* refactor!: run query to accept arrayed filter/sort ([3da6e8c](https://github.com/forio/epicenter-libs/commit/3da6e8c79d883563f4ab727e10534ef08dfca5aa))


### BREAKING CHANGES

* retrieveFromWorld to accept (worldKey, model) instead of (model, worldKey)
* LOCK_TYPE changed to ROLE for more generic usage
* remove page.withAll; change page.next
* router 'with' functions will now utilize falsey values it previously ignored
* runAdapter.query filter/sort no longer uses objs



# [3.1.0](https://github.com/forio/epicenter-libs/compare/v3.0.3...v3.1.0) (2020-10-17)


### Bug Fixes

* test change log generation ([9be9445](https://github.com/forio/epicenter-libs/commit/9be94457097b4dfcc20022a23d3b18bcaf9a7dac))


### Features

* testing gen ([8d9b2f9](https://github.com/forio/epicenter-libs/commit/8d9b2f9142ef6975d52be52010c40304ce75b774))




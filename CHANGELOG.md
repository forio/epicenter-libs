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




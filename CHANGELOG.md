# [3.33.0](https://github.com/forio/epicenter-libs/compare/v3.32.0...v3.33.0) (2025-11-19)


### Bug Fixes

* add executioncontext and modelcontext interfaces ([38b81f9](https://github.com/forio/epicenter-libs/commit/38b81f9591052ae7faa7a8a9f79a4e22fb372b8d))
* add full wraper for leaderboard ([455f5fd](https://github.com/forio/epicenter-libs/commit/455f5fd80d92f89b2a587d86b757b0189dba7e1a))
* add missing roles to AdminSession ([17ae60d](https://github.com/forio/epicenter-libs/commit/17ae60dda21cc78044a63e55c229024be28615ca))
* add morphology enum ([f08c305](https://github.com/forio/epicenter-libs/commit/f08c3051227c4a4e9b9d9e8601beece5db117340))
* add newline to nvmrc ([079949a](https://github.com/forio/epicenter-libs/commit/079949aae72fc74c94d38287ffbf362a2558ea3e))
* add retry limit to prevent infinite recursion ([bda2289](https://github.com/forio/epicenter-libs/commit/bda228941018500034c330b21868b7162e28e24a))
* correct attachments type ([d8c6099](https://github.com/forio/epicenter-libs/commit/d8c6099786999f47f1601fe93bf8f995cea87677))
* correct channel type structure ([276a429](https://github.com/forio/epicenter-libs/commit/276a42926099530e42cb75d042a8089b85009ea4))
* correct emailAdapter jsdocs and parameters ([07e4aaf](https://github.com/forio/epicenter-libs/commit/07e4aafcb6eb6ca81ab1c57cec05682fb42399ce))
* correct getVideoDirectoryByKey endpoint ([473e1ef](https://github.com/forio/epicenter-libs/commit/473e1ef84fe74a31984bd51ba068a6b85522ee94))
* correct phrasing, add missing import ([794377a](https://github.com/forio/epicenter-libs/commit/794377a84d9865a3ccfef4a5d9661293158d9f14))
* correct spelling of "prerequisite" ([6020927](https://github.com/forio/epicenter-libs/commit/60209275f25b6859a8ce38de452f95098fb89f5e))
* correct types in video API ([b097c4d](https://github.com/forio/epicenter-libs/commit/b097c4df74f55e89e84facc730060f8d74757754))
* export missing types from adapters ([74ef30a](https://github.com/forio/epicenter-libs/commit/74ef30ac44675c53c512829b8dd8eef2c6598498))
* fix filter utilities exports ([3774303](https://github.com/forio/epicenter-libs/commit/37743035958c16272a4431f46245c7fdda022a48))
* fix remaining eslint errors/warnings, tweak config ([6400f62](https://github.com/forio/epicenter-libs/commit/6400f624e810e713325b0087a8ca5f6c3085d8e9))
* handle max URL length; do not convert GET to POST ([5f6a66b](https://github.com/forio/epicenter-libs/commit/5f6a66b36a8b57671a1a0e43abf6c29b69d2d391))
* improve cometd/oumuamua session invalidation/disconnection handling ([be736e3](https://github.com/forio/epicenter-libs/commit/be736e39c1456d083fae853eaf384973a56e99d4))
* remove domain from cookies to prevent conflicts ([4b50624](https://github.com/forio/epicenter-libs/commit/4b50624d7b903d6ed7213f9d8ddb0951e4fe8f98))
* remove unnecessary lowercasing ([6e15cea](https://github.com/forio/epicenter-libs/commit/6e15cea3240a0e9cd31570c6f5729413e53adef8))
* return value from videoAdapter.download; only throw if appropriate ([b6a7bd0](https://github.com/forio/epicenter-libs/commit/b6a7bd0529dee68a29772e94f1e85fc02b06efc2))
* safely escape regex metacharacters ([fa5fccd](https://github.com/forio/epicenter-libs/commit/fa5fccdff8b85e9b397e635a7538fb6374b02016))
* scope admin session cookies to account/project path ([1f818ac](https://github.com/forio/epicenter-libs/commit/1f818ac5583c0244cd31674518051a656ecf44bc))
* update deprecated sso endpoint ([754ac67](https://github.com/forio/epicenter-libs/commit/754ac6772edb2d46e24bd7f5bf59bbb84cffd99e))
* update inaccurate type defs and JSDocs ([37a93d5](https://github.com/forio/epicenter-libs/commit/37a93d578142c705a33571e04b1fbbd78b09dcc8))
* use correct endpoint for undoSubmitFor ([ad23612](https://github.com/forio/epicenter-libs/commit/ad2361200ae909a46a72dab3f0deb9a85c99f1aa))
* use correct type for groupRole ([f3fb82f](https://github.com/forio/epicenter-libs/commit/f3fb82fac3d3ee38ba938d1fbacbf86ab4e936b6))


### Features

* add consensus collectInGroup method ([bc06fd7](https://github.com/forio/epicenter-libs/commit/bc06fd7b12d384257b5d268e563ad0bbf766778f))
* add consensus pause/resume methods ([9769c87](https://github.com/forio/epicenter-libs/commit/9769c8759d3bdc011757308f9248323999e23e2c))
* add consensus removeRoleExpectationFor method ([4a057f9](https://github.com/forio/epicenter-libs/commit/4a057f9bb8071d04d78849c6ca10919c8f2c5ebb))
* add support for boolean filter groups in queries ([b89cd16](https://github.com/forio/epicenter-libs/commit/b89cd16ff8c7ad9a59ecebce82c083c273b3bcc2))
* support tokenAccessSeconds in applicable asset endpoints ([0b1d9c2](https://github.com/forio/epicenter-libs/commit/0b1d9c2b10ad3c2998b211f8df8112dd39d4bd01))
* wrap /email/to/support endpoint ([83f71d1](https://github.com/forio/epicenter-libs/commit/83f71d1fbced38183161b3e4fbaa4dd709695fc8))



# [3.32.0](https://github.com/forio/epicenter-libs/compare/v3.31.0...v3.32.0) (2025-10-02)


### Bug Fixes

* add parens/argument to catch block ([ce28d27](https://github.com/forio/epicenter-libs/commit/ce28d27bba12e310e1a37993668e1482a2c511b6))
* prefix unused var with underscore ([1dc8a0b](https://github.com/forio/epicenter-libs/commit/1dc8a0b79daa5492c3647c7ae47e754adc49a128))


### Features

* added somebody endpoints ([4ae35e6](https://github.com/forio/epicenter-libs/commit/4ae35e63221b4ef902bde173c0fafb509d0beb53))



# [3.31.0](https://github.com/forio/epicenter-libs/compare/v3.30.0...v3.31.0) (2025-09-18)


### Bug Fixes

* add babel logical assignment plugin; export types ([0ef029d](https://github.com/forio/epicenter-libs/commit/0ef029d0b9bec61f441fc383df611a7772db1fd3))
* add comments ([3f54e37](https://github.com/forio/epicenter-libs/commit/3f54e37d6f2f75da3c9c6ee11ffc531d8d877120))
* fix babel config ([1b556d6](https://github.com/forio/epicenter-libs/commit/1b556d6b6e1f4a9b5d871dae7096eaa8244cf801))
* resolve cometd reconnection issues and improve error handling ([f4d6429](https://github.com/forio/epicenter-libs/commit/f4d642915d119a6c2f4bf016aaac750fc2139865))
* resolve sass deprecation warnings ([70181b2](https://github.com/forio/epicenter-libs/commit/70181b2afa1f48b0478fad4fb2b544757e87e852))
* update phylogeny enum ([1e73898](https://github.com/forio/epicenter-libs/commit/1e738988a0ed13fcf3909d2353c07515db21e7c7))


### Features

* add presenceAdapter.disconnect method ([32d998b](https://github.com/forio/epicenter-libs/commit/32d998b4debe3f93e2e4216fe3a0052f4e1902e0))
* add vaultAdapter.updateProperties method ([c5e4b15](https://github.com/forio/epicenter-libs/commit/c5e4b152a88034d26e2750beb337d2dc6ef4f457))



# [3.30.0](https://github.com/forio/epicenter-libs/compare/v3.29.0...v3.30.0) (2025-07-18)


### Features

* add groupName optional to vaultAdapter.list and vaultAdapter.count ([93db181](https://github.com/forio/epicenter-libs/commit/93db1818252ef643af1f78a9a22224e9fca10cc5))



# [3.29.0](https://github.com/forio/epicenter-libs/compare/v3.28.3...v3.29.0) (2025-05-09)


### Bug Fixes

* change local.forio.com to localhost ([9b9d68b](https://github.com/forio/epicenter-libs/commit/9b9d68bcfaf419e6fc0b4f4bad43ebde9caf3e01))
* updated test spec for leaderboard getCount ([257ea07](https://github.com/forio/epicenter-libs/commit/257ea075488dc68aad52821d32ff66c3d9ce69e4))
* updated tests ([d8564fc](https://github.com/forio/epicenter-libs/commit/d8564fc3916ee7826a1d4f0d9095683848e555e9))
* updated typo in jsdocs for getCount leaderboard adapter call ([21c48aa](https://github.com/forio/epicenter-libs/commit/21c48aa0cb09e02a7ef64d72676ccd6b6ac8762a))
* updated typos in Leaderboard and spec from poor copy/pasting ([666766a](https://github.com/forio/epicenter-libs/commit/666766a2be948e90cfde90925a7f64ba760ad881))


### Features

* added consensus undoSubmitFor and channel unsubscribeAll ([ab0285f](https://github.com/forio/epicenter-libs/commit/ab0285fef182cc9695a66f5159d19605c78fd826))
* added getCount call to Leaderboard Adapter ([b4e058a](https://github.com/forio/epicenter-libs/commit/b4e058a49ab1c7dc0fe6690193556cd4acf1cc54))



## [3.28.4](https://github.com/forio/epicenter-libs/compare/v3.28.3...v3.28.4) (2025-01-03)


### Bug Fixes

* updated test spec for leaderboard getCount ([257ea07](https://github.com/forio/epicenter-libs/commit/257ea075488dc68aad52821d32ff66c3d9ce69e4))
* updated typo in jsdocs for getCount leaderboard adapter call ([21c48aa](https://github.com/forio/epicenter-libs/commit/21c48aa0cb09e02a7ef64d72676ccd6b6ac8762a))
* updated typos in Leaderboard and spec from poor copy/pasting ([666766a](https://github.com/forio/epicenter-libs/commit/666766a2be948e90cfde90925a7f64ba760ad881))


### Features

* added getCount call to Leaderboard Adapter ([b4e058a](https://github.com/forio/epicenter-libs/commit/b4e058a49ab1c7dc0fe6690193556cd4acf1cc54))



## [3.28.3](https://github.com/forio/epicenter-libs/compare/v3.28.2...v3.28.3) (2024-10-21)


### Bug Fixes

* move timeout query param to body in POST calls ([9fa1cc6](https://github.com/forio/epicenter-libs/commit/9fa1cc6b872a280ef62d7f4e034d396fede4b83b))



## [3.28.2](https://github.com/forio/epicenter-libs/compare/v3.28.1...v3.28.2) (2024-10-18)


### Bug Fixes

* changed cometD import ([39996a9](https://github.com/forio/epicenter-libs/commit/39996a9a55b6cfbc7d4396fab73d61e0c2c28aa4))



## [3.28.1](https://github.com/forio/epicenter-libs/compare/v3.27.1...v3.28.1) (2024-07-30)


### Bug Fixes

* changed casing of mutationKey for vaultAdapter ([d178f85](https://github.com/forio/epicenter-libs/commit/d178f859bc4683d23bd596c0995fce318890aa13))
* include pagination in walletAdapter.withScope ([3308967](https://github.com/forio/epicenter-libs/commit/33089679ad6917cd6a464cdd77ea3e545b1f8d92))
* updated mutationKey test ([b0acd5c](https://github.com/forio/epicenter-libs/commit/b0acd5c4d472522350efe4d7028f942c85b67c81))


### Features

* add allowChannel parameter to selfAssign and autoAssignUsers ([8c3a540](https://github.com/forio/epicenter-libs/commit/8c3a540fe01b92853f5fcfbcdf3781d62f38cbaa))
* added episode categories and auth forcePathInclusion options ([891b0a8](https://github.com/forio/epicenter-libs/commit/891b0a8c1fb67e98dcb927602ca61ee306988534))



# [3.28.0](https://github.com/forio/epicenter-libs/compare/v3.27.1...v3.28.0) (2024-07-24)


### Bug Fixes

* changed casing of mutationKey for vaultAdapter ([d178f85](https://github.com/forio/epicenter-libs/commit/d178f859bc4683d23bd596c0995fce318890aa13))
* include pagination in walletAdapter.withScope ([3308967](https://github.com/forio/epicenter-libs/commit/33089679ad6917cd6a464cdd77ea3e545b1f8d92))
* updated mutationKey test ([b0acd5c](https://github.com/forio/epicenter-libs/commit/b0acd5c4d472522350efe4d7028f942c85b67c81))


### Features

* added episode categories and auth forcePathInclusion options ([891b0a8](https://github.com/forio/epicenter-libs/commit/891b0a8c1fb67e98dcb927602ca61ee306988534))



## [3.27.2](https://github.com/forio/epicenter-libs/compare/v3.27.1...v3.27.2) (2024-06-20)


### Bug Fixes

* include pagination in walletAdapter.withScope ([3308967](https://github.com/forio/epicenter-libs/commit/33089679ad6917cd6a464cdd77ea3e545b1f8d92))



## [3.27.1](https://github.com/forio/epicenter-libs/compare/v3.27.0...v3.27.1) (2024-06-19)


### Bug Fixes

* updated assetAdapter.store error handling ([e083a12](https://github.com/forio/epicenter-libs/commit/e083a12f4b7410bcc7593050d0f0e77b1e4bbbe2))


### Features

* add populace to worldAdapter: selfAssign, autoAssignUsers ([562db6a](https://github.com/forio/epicenter-libs/commit/562db6ad05bb5b8f0b85745dedc8f449ea48f9f6))



# [3.27.0](https://github.com/forio/epicenter-libs/compare/v3.26.0...v3.27.0) (2024-05-10)


### Features

* add extra docs to walletAdapter and use userKey when not available ([4b367f6](https://github.com/forio/epicenter-libs/commit/4b367f6c3cad9456405b5a3dd44e18f95d255e62))
* add withScope method to walletAdapter ([e2fe5d8](https://github.com/forio/epicenter-libs/commit/e2fe5d8b07b93cc0e66f0bcbb2bd81d7ffee5d04))
* added wallet adapter ([ff35b02](https://github.com/forio/epicenter-libs/commit/ff35b020b5dd0c206a280bc9d0f72dc8be2cc687))
* applicable resources `allowChannel` ([6bd461d](https://github.com/forio/epicenter-libs/commit/6bd461dc200f6fee4e0a9c6db55c71b39be36d96))



# [3.26.0](https://github.com/forio/epicenter-libs/compare/v3.25.0...v3.26.0) (2024-03-28)



# [3.25.0](https://github.com/forio/epicenter-libs/compare/v3.24.0...v3.25.0) (2024-03-06)


### Features

* add `logLevel` argument to cometd adapter ([0275578](https://github.com/forio/epicenter-libs/commit/0275578840faa494d83c696913dfc409fc2e8115))
* add pushChannelURL to config ([4748dd9](https://github.com/forio/epicenter-libs/commit/4748dd935b3feb85278f1713cac4c3dbf069e510))
* add vault count feature ([e9c2d90](https://github.com/forio/epicenter-libs/commit/e9c2d90d4d778d344499a9fe446969601c20b175))
* channel auto detect protocol on startup ([2be0667](https://github.com/forio/epicenter-libs/commit/2be06674203a34559187eb0528738056bf489454))



# [3.24.0](https://github.com/forio/epicenter-libs/compare/v3.23.5...v3.24.0) (2024-02-08)


### Bug Fixes

* remove `name` field from `worldAdapter.update` ([3ce0bcb](https://github.com/forio/epicenter-libs/commit/3ce0bcbee3c69448725edbfc780db53318b6e0a1))
* use correct endpoint for world-scoped personas ([8a8bf88](https://github.com/forio/epicenter-libs/commit/8a8bf88c0a652a903310eb762675623db469efc8))


### Features

* `authAdapter` `logout`, `getSession` accept `RoutingOptions` ([01bb2a8](https://github.com/forio/epicenter-libs/commit/01bb2a8fd8b72be7597eb1d0ee65512583fad4d6))
* `RoutingOptions.inert` accepts predicate function ([f61ce44](https://github.com/forio/epicenter-libs/commit/f61ce4452329c91759a1770ce2041950afc3febf))
* `unregister` `ErrorManager` handlers ([a181f7c](https://github.com/forio/epicenter-libs/commit/a181f7ce6c64aa1a37cb9d8323e64e4d6bfc3ba8))
* add `displayName` to world create/update ([0e831c3](https://github.com/forio/epicenter-libs/commit/0e831c3c9e8ec4c979ddd249b0777c633f78eda3))
* add MARGINAL objective and marginal number to personas ([bfd124f](https://github.com/forio/epicenter-libs/commit/bfd124f0f2a3cfa508791b13a5880af1b4c125ef))
* export `DEFAULT_ERROR_HANDLERS` ([dbe48f1](https://github.com/forio/epicenter-libs/commit/dbe48f1b852579431cfafdefd3eb8e7bf6e5d077))



## [3.23.5](https://github.com/forio/epicenter-libs/compare/v3.23.4...v3.23.5) (2024-01-31)


### Bug Fixes

* use cometd `clearSubscriptions` in `empty` ([68d1d80](https://github.com/forio/epicenter-libs/commit/68d1d80661899e15f7d1581d333131437224cfb9))



## [3.23.4](https://github.com/forio/epicenter-libs/compare/v3.23.3...v3.23.4) (2023-11-02)


### Bug Fixes

* fix a typo ([8a9b707](https://github.com/forio/epicenter-libs/commit/8a9b7076daf8c572bf3365086c6fef6b6e95fe69))


### Features

* ability to ignore missing variables in getVariables response ([35c17f1](https://github.com/forio/epicenter-libs/commit/35c17f1d56b5a063cebd4a69efa984770c49d0ab))



## [3.23.3](https://github.com/forio/epicenter-libs/compare/v3.23.2...v3.23.3) (2023-10-04)


### Bug Fixes

* `cometdAdapter` init only once ([fd9a07f](https://github.com/forio/epicenter-libs/commit/fd9a07f0c1f3b383f53f3542fc959e5dabfe18f2))


### Features

* added support for self signed Daily tokens ([f6240ea](https://github.com/forio/epicenter-libs/commit/f6240eae42e680aaedf40bfd748aa2306b615414))



## [3.23.2](https://github.com/forio/epicenter-libs/compare/v3.23.1...v3.23.2) (2023-07-20)


### Bug Fixes

* correct errors in leaderboardAdapter.update jsdocs ([8569124](https://github.com/forio/epicenter-libs/commit/8569124a7790588068c4bd2ee786fa7e2022dae5))
* ensure isNode function returns a value ([9237dea](https://github.com/forio/epicenter-libs/commit/9237dea9350fbba178550b9d3df5f7ee4476509c))



## [3.23.1](https://github.com/forio/epicenter-libs/compare/v3.22.0...v3.23.1) (2023-06-27)


### Features

* added sso outcome and saml determination ([df88351](https://github.com/forio/epicenter-libs/commit/df8835117385282aab18317e194c8825daeb45e3))
* added updateRecordingStatus for Daily ([3bbbb8e](https://github.com/forio/epicenter-libs/commit/3bbbb8e02ef7ba2b1edcda7dffdb562914834722))
* expose `INTER` `REVIVE`, `RESURRECT` rituals ([c40cc61](https://github.com/forio/epicenter-libs/commit/c40cc6194d178dd616744d517c070de56099974b))



# [3.23.0](https://github.com/forio/epicenter-libs/compare/v3.22.0...v3.23.0) (2023-05-19)


### Features

* added sso outcome and saml determination ([df88351](https://github.com/forio/epicenter-libs/commit/df8835117385282aab18317e194c8825daeb45e3))
* added updateRecordingStatus for Daily ([3bbbb8e](https://github.com/forio/epicenter-libs/commit/3bbbb8e02ef7ba2b1edcda7dffdb562914834722))
* expose `INTER` `REVIVE`, `RESURRECT` rituals ([c40cc61](https://github.com/forio/epicenter-libs/commit/c40cc6194d178dd616744d517c070de56099974b))



# [3.22.0](https://github.com/forio/epicenter-libs/compare/v3.21.0...v3.22.0) (2023-04-20)


### Bug Fixes

* accounted for various file types in getVideoByRecordingId ([707e87c](https://github.com/forio/epicenter-libs/commit/707e87cd6d1055e3f4ac24239e4b5ce2f93eb9ad))


### Features

* added daily adapter ([3d98386](https://github.com/forio/epicenter-libs/commit/3d98386536b6b9d3aaf511f5632141e104696bcb))



# [3.21.0](https://github.com/forio/epicenter-libs/compare/v3.20.0...v3.21.0) (2023-04-19)


### Features

* [EPILIBS-102] removed ritual from getMetadata and updateMetadata ([8455ca5](https://github.com/forio/epicenter-libs/commit/8455ca59f02da6da44242ce5dff2ced4a91f11b3))



# [3.20.0](https://github.com/forio/epicenter-libs/compare/v3.19.0...v3.20.0) (2023-04-05)


### Bug Fixes

* use correct endpoint for runAdapter.introspect ([acc5920](https://github.com/forio/epicenter-libs/commit/acc5920bf3b319b41f914bbf35b93e07b4b57675))


### Features

* migrate wrapper tests epilibs 104 ([bfa3958](https://github.com/forio/epicenter-libs/commit/bfa3958d86a3ed5d42e2ea98a84f1a8f3021c21a))
* wrap endpoint for introspection via runKey ([d3da6f8](https://github.com/forio/epicenter-libs/commit/d3da6f84c3f11e9e7ed11fd15afb254fbd9e81ae))
* wrap migrate for run adapter ([07efb2e](https://github.com/forio/epicenter-libs/commit/07efb2ea4f0cc85aacc68474d8dcc68f1fe72215))


### Reverts

* remove bad tests epilibs 104 ([e1aa923](https://github.com/forio/epicenter-libs/commit/e1aa92373ee8de2278b9cf3fbbfd98e7ef9a538f))



# [3.19.0](https://github.com/forio/epicenter-libs/compare/v3.18.0...v3.19.0) (2023-02-27)


### Features

* `userAdapter` GET /user/{userKey} ([bc088d9](https://github.com/forio/epicenter-libs/commit/bc088d9b686bbd676e1db0cf3dd3c8cfc945e963))
* added matchmaker adapter ([b3ae97f](https://github.com/forio/epicenter-libs/commit/b3ae97fac358bcba97ba5b4ba95b20aa99253853))
* added somebody adapter ([a1d60e5](https://github.com/forio/epicenter-libs/commit/a1d60e55f3bc492079cf6cc8cf8f89ae60fdb974))
* added somebody tests ([afc956e](https://github.com/forio/epicenter-libs/commit/afc956eb72d3d3296c85adb41a5dcebf6929b8df))



# [3.18.0](https://github.com/forio/epicenter-libs/compare/v3.17.3...v3.18.0) (2023-01-26)


### Bug Fixes

* cleanup unused code ([03af3d6](https://github.com/forio/epicenter-libs/commit/03af3d6e75e328415a2ed463d5be52a59839e592))
* use correct endpoint for consensusAdapter.submitActions ([dd15a42](https://github.com/forio/epicenter-libs/commit/dd15a4220fe567bd67aaeb44828fd6e5845a0a93))
* wording ([e878939](https://github.com/forio/epicenter-libs/commit/e8789399625c7be4ab0679257935bed049ef6ecf))


### Features

* [EPICENTER-5331] Add video download ([208e1d7](https://github.com/forio/epicenter-libs/commit/208e1d7493d839a6cc5a574ad126b09691595f71))
* [EPICENTER-5423] Add asset download ([d70863e](https://github.com/forio/epicenter-libs/commit/d70863e710518b4a1a8196f0e8df74058245d02c))
* add actions to triggerFor ([d7b80f6](https://github.com/forio/epicenter-libs/commit/d7b80f69b8bde407ad33cefc8caf274a84bba100))
* added default error handling for cometd ([95182d1](https://github.com/forio/epicenter-libs/commit/95182d151f9573f2f1dfcf868fee7d1f6c3b3f03))
* begin consensus wrapping ([b4fa346](https://github.com/forio/epicenter-libs/commit/b4fa34666be84adef5cf36511b92e8e9ca0525cd))
* complete consensus wrapper; first pass ([2f40cf1](https://github.com/forio/epicenter-libs/commit/2f40cf17a9fda37e79f9553cd7feffb00e02ee2e))
* consensus create comments ([e5dc177](https://github.com/forio/epicenter-libs/commit/e5dc177ced53536f8055adc32bab3d70dc324b6b))
* consensus progress ([632ffe6](https://github.com/forio/epicenter-libs/commit/632ffe606dfac4ea178ae81cfa2419096b5ab7e8))
* functional forceClose consensus ([9f52e9a](https://github.com/forio/epicenter-libs/commit/9f52e9af9391eaa9b326c23dd8cdc6d983f63df2))
* newly wrapped consensus API calls ([0e30b57](https://github.com/forio/epicenter-libs/commit/0e30b577ba50576f2596c62057a24dedc013ad41))
* platform accepts run `permit` or assigns default ([8056b3a](https://github.com/forio/epicenter-libs/commit/8056b3ab806bec65699320ff9820d43d860cf685))
* submit consensus actions ([1ebc74c](https://github.com/forio/epicenter-libs/commit/1ebc74c220629fe74c3e44a094f0e662e4764095))



## [3.17.3](https://github.com/forio/epicenter-libs/compare/v3.17.2...v3.17.3) (2023-01-02)


### Bug Fixes

* fixed initialLayoutClassList Vonage bug ([9d7ce6c](https://github.com/forio/epicenter-libs/commit/9d7ce6cf672a9bf80da86cc863df7feb841e620d))



## [3.17.2](https://github.com/forio/epicenter-libs/compare/v3.17.1...v3.17.2) (2022-12-20)


### Bug Fixes

* typo ([8c4a6ac](https://github.com/forio/epicenter-libs/commit/8c4a6ac63f9588adaa386ae1e6a3ccf91eec6898))


### Features

* added in support for worldNameGenerator for certain world routes ([ef8e3b4](https://github.com/forio/epicenter-libs/commit/ef8e3b46e387e943968c271f3cbab7334f714392))
* epicenter-5306 wrap GET to run/singular/key ([4f62b68](https://github.com/forio/epicenter-libs/commit/4f62b6862acff26645f9f2b147249522fcf078a5))
* runAdapter.createSingular is now available ([bb86ca3](https://github.com/forio/epicenter-libs/commit/bb86ca370db66b0b256b9b9c485b95a92ceee050))



## [3.17.1](https://github.com/forio/epicenter-libs/compare/v3.17.0...v3.17.1) (2022-11-17)


### Features

* [EPICENTER-5374] Add Presence terminate call to epicenter-libs ([2efba58](https://github.com/forio/epicenter-libs/commit/2efba58e4257c02304a94ae7d40f703c17436913))



# [3.17.0](https://github.com/forio/epicenter-libs/compare/v3.16.0...v3.17.0) (2022-10-07)


### Bug Fixes

* remove mutationStrategy from url if not provided, fix vault.spec ([fb26e9f](https://github.com/forio/epicenter-libs/commit/fb26e9fa40cba9c828acef817de6ab206a1a8b79))


### Features

* default mutationStrategy to ERROR for vault definitions ([0efae18](https://github.com/forio/epicenter-libs/commit/0efae18a94e04d969df4fe83d7700d95dbc4eb2a))
* getPersonas added to worldAdapter ([b8083ad](https://github.com/forio/epicenter-libs/commit/b8083adfbc8c5d249fb154d7bd357b522d50ca38))
* remove mutationKey from vault post, add mutationStrategy ([b0028a3](https://github.com/forio/epicenter-libs/commit/b0028a3b5f586a39ca0cdf4f5fae8097969be7e1))



# [3.16.0](https://github.com/forio/epicenter-libs/compare/v3.15.2...v3.16.0) (2022-08-25)


### Bug Fixes

* add back run link; fix description of getWhitelistedUsers ([e15e750](https://github.com/forio/epicenter-libs/commit/e15e750e0eca82def6c7d8e76c017a7ae4b3be6f))
* added video transcription route ([2ab0d77](https://github.com/forio/epicenter-libs/commit/2ab0d77a4a10b2a3ba4ff3a39fa3d7f2ebdc946c))
* updated dependency ([c727f22](https://github.com/forio/epicenter-libs/commit/c727f2237bcbcf4e608627617875998afd4c9c83))


### Features

* add a handler to the cometd reconnection error ([531d602](https://github.com/forio/epicenter-libs/commit/531d6022c9bef3ff46cf8fce8aa989c4e4728c99))
* add ability to specify link for self-registration email ([91ab013](https://github.com/forio/epicenter-libs/commit/91ab01350deca764dc3698fe0fdff9aff3f9eaac))
* add functionality to self-register for groups ([ca0f785](https://github.com/forio/epicenter-libs/commit/ca0f78516d325f16486a80624fc289807e7bcdee))
* **router:** add `useProjectProxy` routing config ([5c06a4b](https://github.com/forio/epicenter-libs/commit/5c06a4be2cf60768e833dbb882e091a622079150))



## [3.15.2](https://github.com/forio/epicenter-libs/compare/v3.15.1...v3.15.2) (2022-08-08)


### Bug Fixes

* adjust run spec to account for recent updates ([7bbb853](https://github.com/forio/epicenter-libs/commit/7bbb8538f8cf0bd044c7da65e0bbf94438635983))


### Features

* t: EPICENTER-5304 make getVariables more flexible for single run ([122828e](https://github.com/forio/epicenter-libs/commit/122828e00067f879ab20e3188eed15d27baaa709))



## [3.15.1](https://github.com/forio/epicenter-libs/compare/v3.15.0...v3.15.1) (2022-06-29)


### Bug Fixes

* remove previous subscription before adding new version ([0473e92](https://github.com/forio/epicenter-libs/commit/0473e928699802da9434dc5197117298cdddc069))



# [3.15.0](https://github.com/forio/epicenter-libs/compare/v3.14.0...v3.15.0) (2022-06-22)


### Bug Fixes

* add back the previous logout test ([60f0677](https://github.com/forio/epicenter-libs/commit/60f067728d14c08ac8362209c45ae2d2a10a280f))
* add DELETE to logout ([d3812ff](https://github.com/forio/epicenter-libs/commit/d3812ff9aaf9339470b2b1717c69455b5d77a4a4))
* avoid invalidating session on server if already invalid token ([a3cab6b](https://github.com/forio/epicenter-libs/commit/a3cab6b7b547d03d4744637535a1ab09a7f8c960))
* disable problematic code, fix run test ([f88ecae](https://github.com/forio/epicenter-libs/commit/f88ecaefdf618765186ea40615ff6b1ddabb299f))
* fix metadata tests ([13b9a85](https://github.com/forio/epicenter-libs/commit/13b9a85c86774062d2a3aae8b1ef870fe0c385e9))
* remove extra logout call from auth spec ([747e528](https://github.com/forio/epicenter-libs/commit/747e528677a98b39abb416fabd69bfb10043800b))
* remove references to logout DELETE ([16823e9](https://github.com/forio/epicenter-libs/commit/16823e9528fdbd3dcedec815a13d11e8e902831f))
* revert problematic logout api call ([8a95f3c](https://github.com/forio/epicenter-libs/commit/8a95f3ce6ff5f1b1791a49d4f2b81c60369edb61))
* revert unused code ([cd690b5](https://github.com/forio/epicenter-libs/commit/cd690b5a6916eb21bd062ec7b0bbdaf08434e0e2))


### Features

* fix authentication tests ([3415e80](https://github.com/forio/epicenter-libs/commit/3415e806506d1078854132e516a0b9f2906d2d51))
* progress on error manager ([00d40fe](https://github.com/forio/epicenter-libs/commit/00d40fe7f02e75a7a120ec6675293f28833b417f))
* remove deprecated api calls ([0e5e311](https://github.com/forio/epicenter-libs/commit/0e5e311ba5e243ae4e481c1c0cfe0a002ad9f5b2))



# [3.14.0](https://github.com/forio/epicenter-libs/compare/v3.13.0...v3.14.0) (2022-06-14)


### Features

* `userAdapter` GET /user/with/handle ([418a61f](https://github.com/forio/epicenter-libs/commit/418a61fc2b3e790d24bf2b1d10b705d0f11eef4c))
* runAdapter fix build: routing options was in the wrong place ([d476553](https://github.com/forio/epicenter-libs/commit/d476553aa1c7e362ae9e01c4deeec1d9d0eb8785))



# [3.13.0](https://github.com/forio/epicenter-libs/compare/v3.12.0...v3.13.0) (2022-05-12)


### Features

* add optionals for projectAdapter.list ([a944b1c](https://github.com/forio/epicenter-libs/commit/a944b1cb0c2de7e5b50790a0b1c5ec0935898b8a))
* listen for cometd disconnect/reconnect ([f857332](https://github.com/forio/epicenter-libs/commit/f857332425ea958bbe42c9baebca7d887c9cf37d))



# [3.12.0](https://github.com/forio/epicenter-libs/compare/v3.11.0...v3.12.0) (2022-02-01)


### Bug Fixes

* add projectAdapter.list (was accidentally removed) ([f63e1e4](https://github.com/forio/epicenter-libs/commit/f63e1e432253f7c37c67799704b0aa2368a5171e))
* libs to handle 'epicenter' global variable in node ([3536451](https://github.com/forio/epicenter-libs/commit/3536451b26ea049cc0b12ed872b36fde572fcdac))


### Features

* add config.setContext function for bulk set ([604dfd5](https://github.com/forio/epicenter-libs/commit/604dfd55666fd6c6a8d7702d650458d4d34a172e))
* add utility function for accessing proxy calls ([75704aa](https://github.com/forio/epicenter-libs/commit/75704aa0cd5155f1f17da59f92f624bea7573d7b))
* add VIDEO push category ([8950017](https://github.com/forio/epicenter-libs/commit/8950017bf00c40912bba8d1cd129adc331a1abde))
* add videoAPI and videoAdapter ([995784a](https://github.com/forio/epicenter-libs/commit/995784a6465eb43a07780485c536977541873c54))
* add vonage REST API methods ([1e89b9e](https://github.com/forio/epicenter-libs/commit/1e89b9e7ca7f7af9def0203da9779fe59ecd0b04))
* add vonageAdapter ([1fb1536](https://github.com/forio/epicenter-libs/commit/1fb1536392df65fb42bb8a116f13d104b71c3554))
* config account/project to be set in prod node env ([b8f615c](https://github.com/forio/epicenter-libs/commit/b8f615cf4f32dee060c98ba938ca6a2c20e42f73))
* config.setContext to configure protocol ([5e445d7](https://github.com/forio/epicenter-libs/commit/5e445d7fc7aa737dd2f929484508f8efb6d88f20))
* vonageAdapter.startArchive to accept resolution arg ([088dcad](https://github.com/forio/epicenter-libs/commit/088dcadf99d53531eea5dac13669c5914a4b5d65))



# [3.11.0](https://github.com/forio/epicenter-libs/compare/v3.10.0-breaking...v3.11.0) (2022-01-08)


### Bug Fixes

* error handler less specific ([1b5d4b5](https://github.com/forio/epicenter-libs/commit/1b5d4b5bc444fc83b1308d33d51c61eeea54cc90))



# [3.10.0-breaking](https://github.com/forio/epicenter-libs/compare/v3.9.0...v3.10.0-breaking) (2022-01-06)


### Features

* many new features & cleanup; explanation in commit desc ([331f4f7](https://github.com/forio/epicenter-libs/commit/331f4f7ca80d321edbfb892fb49aac62419fff2f))


### BREAKING CHANGES

* leaderboardAdapter.update arguments re-ordered



# [3.9.0](https://github.com/forio/epicenter-libs/compare/v3.8.3...v3.9.0) (2021-12-02)


### Features

* add createUser function ([d892996](https://github.com/forio/epicenter-libs/commit/d8929968344ad49bd8618536976582269159f5cc))



## [3.8.3](https://github.com/forio/epicenter-libs/compare/v3.8.2...v3.8.3) (2021-11-16)


### Bug Fixes

* fixed an issue w/ runAdapter.query returning variables in an array ([f544cbf](https://github.com/forio/epicenter-libs/commit/f544cbf628ed397834e3f71cf74c37ef7f61ade7))



## [3.8.2](https://github.com/forio/epicenter-libs/compare/v3.8.1...v3.8.2) (2021-11-11)



## [3.8.1](https://github.com/forio/epicenter-libs/compare/v3.8.0-breaking...v3.8.1) (2021-11-02)


### Bug Fixes

* users w/ multiple groups unable to log in ([46de1ce](https://github.com/forio/epicenter-libs/commit/46de1ce92b22cb05ae6045203212666336898eea))



# [3.8.0-breaking](https://github.com/forio/epicenter-libs/compare/v3.7.1...v3.8.0-breaking) (2021-10-30)


### Bug Fixes

* added to documentation ([d90507c](https://github.com/forio/epicenter-libs/commit/d90507c089cac3bf22eb37bf46f7e7a0dd3ec0f8))
* altered cron documentation ([f92be61](https://github.com/forio/epicenter-libs/commit/f92be61434e621d43dfa84c66967043ec0ddbe80))
* fixed bug due to tokenOverride ([b1da99d](https://github.com/forio/epicenter-libs/commit/b1da99d2809d9b613fef34b35b0c95a1104e1d1e))
* fixed group adapter test name changes ([780666d](https://github.com/forio/epicenter-libs/commit/780666dc7f1c826072c5f3c0f12553790e9d5926))
* typo that broke request() ([adcf7b6](https://github.com/forio/epicenter-libs/commit/adcf7b65d72c4d019b81b082f7780aab626bf555))
* updated documentation ([4471966](https://github.com/forio/epicenter-libs/commit/4471966f0a7a3ea07156b6e970030a7bfb4eb0f4))
* updated email documentation ([a9c2d97](https://github.com/forio/epicenter-libs/commit/a9c2d97a26619237c49b419b47ae86828cb05d19))


### Code Refactoring

* handle resource scopes consistent to Epicenter ([10a227b](https://github.com/forio/epicenter-libs/commit/10a227b44bc98cbabdb8a2c44a8d5d05dd64d770))


### Features

* add chatAdapter ([854127a](https://github.com/forio/epicenter-libs/commit/854127a92d795cf970504b64abf92f7e48784da9))
* add support for auth overrides (EPILIBS-79) ([7773913](https://github.com/forio/epicenter-libs/commit/7773913a9bb4e928e71416ce2acc82591f85e5b7))
* added additional email endpoint support ([3d6127c](https://github.com/forio/epicenter-libs/commit/3d6127cdebb273c314e84f2301f5a89a1b79529c))
* added get task adapter ([08b8d7e](https://github.com/forio/epicenter-libs/commit/08b8d7ed0289763d582a254f89d8b59baf1412c4))
* added remaining task adapter GETs ([2bae7b0](https://github.com/forio/epicenter-libs/commit/2bae7b0026caabec3d4c06424a4e46082dd0c792))
* added resetPassword ([716e9c7](https://github.com/forio/epicenter-libs/commit/716e9c717568b66f6444c68d53e02354aaa1d36c))
* added sendEmailToAdmin adapter ([7900bd8](https://github.com/forio/epicenter-libs/commit/7900bd81939082336012833ecfd8f5687a5cd932))
* create and destroy tasks ([7d22d59](https://github.com/forio/epicenter-libs/commit/7d22d591248df590566ade7dc9d1a189d3f5454d))
* email route ([c75a917](https://github.com/forio/epicenter-libs/commit/c75a917570fd8ab9f778e9811802d08b6760c238))


### Performance Improvements

* code-split cometd ([d53a3ab](https://github.com/forio/epicenter-libs/commit/d53a3ab486baa14b8108d84f25d85a49213dd1e4))


### BREAKING CHANGES

* optionals.userKey for scopes is no longer supported



## [3.7.1](https://github.com/forio/epicenter-libs/compare/v3.7.0...v3.7.1) (2021-09-27)


### Bug Fixes

* added documentation for resetPassword ([dcfa14b](https://github.com/forio/epicenter-libs/commit/dcfa14b42f2550018a3a90d6b0d6cae53f0e0373))
* fixed bug due to tokenOverride ([c6fbf42](https://github.com/forio/epicenter-libs/commit/c6fbf423791fecc60f2b8556b2805f87da9deb2e))
* fixed group adapter test name changes ([dbf3fa0](https://github.com/forio/epicenter-libs/commit/dbf3fa00ca78a7f5b0a2bbfdea5208e77be07480))


### Features

* added resetPassword ([6c0fad3](https://github.com/forio/epicenter-libs/commit/6c0fad357dd2ce856d501a236119fd856b05c546))



# [3.7.0](https://github.com/forio/epicenter-libs/compare/v3.6.1...v3.7.0) (2021-09-03)

### Code Refactoring

* groupAdapter optional arguments renamed: all -> includeAllMembers; expired -> includeExpired ([658e2a9](https://github.com/forio/epicenter-libs/commit/8ce6886773ac49d95984fa9e11cc48371658e2a9))


### BREAKING CHANGES

* Group API calls w/ query parameter 'all' becomes 'includeAllMembers' and 'expired' becomes 'includeExpired'  (to match epicenter 3.7.x / 3.8.x)

## [3.6.1](https://github.com/forio/epicenter-libs/compare/v3.6.0...v3.6.1) (2021-08-06)


### Features

* add group status endpoint adapter ([c2a34d9](https://github.com/forio/epicenter-libs/commit/c2a34d92bb5c2d8e4d297d1f536f9c0382e9f531))



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




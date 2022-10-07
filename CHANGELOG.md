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




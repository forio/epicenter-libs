import { createRequire } from 'module';
import { fileURLToPath as fromURL } from 'url';

const require = createRequire(fromURL(import.meta.url));

require('cometd-nodejs-client').adapt();

// Your normal CometD client application here.
var lib = require('cometd');
var cometd = new lib.CometD();
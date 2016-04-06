const RELEASE = process.argv.includes('--release');
const STAGING = process.argv.includes('--staging') && !RELEASE;
const DEBUG = !RELEASE && !STAGING;
const NODE_ENV = (RELEASE ? 'production' : (STAGING ? 'staging' : 'development'));

export default NODE_ENV;

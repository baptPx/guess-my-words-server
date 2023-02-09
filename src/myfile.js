const dotenv = require('dotenv');
const res=dotenv.config({ path: `.env.${process.env.NODE_ENV}`});
const { parsed: mesvars } = res
console.log(process.env, mesvars)
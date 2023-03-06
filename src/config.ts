const dotenv = require('dotenv');
const res=dotenv.config({ path: `.env.${process.env.NODE_ENV}`}); //{ path: `.env.${process.env.NODE_ENV}`}

const { parsed: mesvars } = res
const { 
    PORT,
    DATABASE_NAME,
    DATABASE_USERNAME,
    DATABASE_PASSWORD, 
    DATABASE_URL,
    DATABASE_PORT,
    JWT_SECRET,
    FORCE_SYNC,
} = mesvars

module.exports = {
    PORT,
    DATABASE_NAME,
    JWT_SECRET,
    DATABASE_PORT,
    DATABASE_URL,
    DATABASE_USERNAME,
    DATABASE_PASSWORD,
    FORCE_SYNC,
    MIMETYPE_MAP_ALLOWED: ['image/jpeg', 'image/png']
}
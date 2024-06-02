const dotenv = require("dotenv");
const logger = require("../utils/pino");
const jwtStrategy = require("passport-jwt").Strategy;
const db = require('../models')
dotenv.config();

// getToken function for passport
const getToken = (req) => {
  return (
    req.cookies.token ||
    req.body.token ||
    req.header("Authorization")?.replace("Bearer ", "") ||
    null
  );
};

// opts for passport-jwt
let opts = {
  jwtFromRequest: getToken,
  secretOrKey: process.env.JWT_SECRET,
};

// passport-jwt configuration logic
exports.passportConfig = (passport) => {
  passport.use(
    new jwtStrategy(opts, async (payload, next) => {
      let result;
      let id = payload.id;
      try {
        result = await db.sequelize.models.user.findOne({
          where: {
            id: id,
          }
        })
      } catch (error) {
        // if any error during query execution
        logger.error(error)
        return next(error, false);
      }

      // if user present then call next with payload
      if (result) {
        return next(null, result);
      } else {
        // if user not present then call next with empty data
        return next(null, false);
      }
    })
  );
};



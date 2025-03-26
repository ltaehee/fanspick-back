require('./db_init');
const express = require('express');
const cors = require('cors');
// const session = require('express-session');
// const MongoDBSessionStore = require('connect-mongodb-session')(session);
// const { SESSION_SECRET, MONGODB_URL } = require('./consts/app');
const passport = require('passport');
const oauthRoutes = require('./routes/oauth/oauth.routes');
const managerRoutes = require('./routes/manager/manager.routes');
const purchaseRoutes = require('./routes/purchase/purchase.routes');
const reviewRoutes = require('./routes/review/review.routes');
const mypageRoutes = require('./routes/mypage/mypage.routes');
const awsRoutes = require('./routes/aws/aws.routes');
const errorHandler = require('./middleware/errorHandler');

// ============= passport =============
require('./passport/jwt.strategy');
require('./passport/google.strategy');
require('./passport/kakao.strategy');
require('./passport/naver.strategy');
// ====================================

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(
  cors({
    origin: 'http://localhost:5173',
  }),
);

// 쿠키 제거
// app.use(
//   session({
//     secret: SESSION_SECRET,
//     cookie: {
//       httpOnly: true,
//       maxAge: 10 * 1000,
//     },
//     store: new MongoDBSessionStore({
//       uri: MONGODB_URL,
//     }),
//   }),
// );

// 라우터
app.use('/api/oauth', oauthRoutes);
app.use('/api/manager', managerRoutes);
app.use('/api/purchase', purchaseRoutes);
app.use('/api/review', reviewRoutes);
app.use('/api/mypage', mypageRoutes);
app.use('/api/aws', awsRoutes);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

// 에러 핸들러
app.use(errorHandler);

module.exports = app;

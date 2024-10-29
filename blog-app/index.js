const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const helmet = require('helmet');
const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/posts');
const commentRoutes = require('./routes/comments');

dotenv.config();
const app = express();
app.use(helmet());
app.use(express.json());

//MongoDB 연결
mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error(err));

// 라우트 설정
app.use('/auth', authRoutes);
app.use('/posts', postRoutes);
app.use('/comments', commentRoutes);

// 에러 핸들링 미들웨어
app.use((err, req, res, next) => {
    res.status(err.statusCode || 500).json({ error: err.message || 'Internal Server Error' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// dotenv와 helmet를 이용해 환경 변수를 설정하고 보안 강화를 위한 기본 설정.
// 데이터베이스 연결과 라우트 설정을 통해 애플리케이션을 초기화
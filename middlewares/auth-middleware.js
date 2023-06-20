const jwt = require('jsonwebtoken');
const User = require('../schemas/user.js');

// 사용자 인증 미들웨어
module.exports = async (req, res, next) => {
    const { Authorization } = req.cookies;
    // Authorization 가 null이거나 값이 없다면  "" 빈 문자열로 대체 해줘라, 스플릿은 bearer와 jwt를 분리하기 위해서 사용.
    const [authType, authToken] = (Authorization ?? '').split(' ');

    if (!authToken || authType !== 'Bearer') {
        res.status(401).send({
            errorMessage: '로그인 후 이용 가능한 기능입니다.',
        });
        return;
    }

    try {
        // 1. authToken이 만료되었는지 확인
        // 2. authToken이 서버가 발급한 토큰이 맞는지 확인
        const { userId } = jwt.verify(authToken, 'custom-secret-key');
        // 3. authToken에 있는 userId에 해당하는 사용자가 실제 db에 존재하는지 확인.
        const user = await User.findById(userId);
        res.locals.user = user;

        next(); // 이 미들웨어 다음으로 보낸다.
    } catch (err) {
        console.error(err);
        res.status(401).send({
            errorMessage: '로그인 후 이용 가능한 기능입니다.',
        });
        return;
    }
};

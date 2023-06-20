const jwt = require('jsonwebtoken');
const express = require('express');
const router = express.Router();
const User = require('../schemas/user.js');

// 로그인 API
router.post('/auth', async (req, res) => {
    const { email, password } = req.body;

    // 이메일이 일치하는 유저를 찾는다.
    const user = await User.findOne({ email });

    // NOTE: 인증 메세지는 자세히 설명하지 않는것을 원칙으로 한다.
    // 1. 이메일에 일치하는 유저가 존재하지 않거나
    // 2. 유저의 패스워드가 입력한 비밀번호와 다를때
    if (!user || password !== user.password) {
        res.status(400).json({
            errorMessage: '이메일 또는 패스워드가 틀렸습니다.',
        });
        return;
    }

    // jwt 생성
    const token = jwt.sign({ userId: user.userId }, 'custom-secret-key');

    res.cookie('Authorization', `Bearer ${token}`); // JWT를 Cookie로 할당합니다!
    res.status(200).json({ token }); // JWT를 Body로 할당합니다!
});

module.exports = router;

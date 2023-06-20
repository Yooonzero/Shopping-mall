const express = require('express');
const router = express.Router();

const userSchema = require('../schemas/user.js');

// 회원가입 API
router.post('/users', async (req, res) => {
    const { email, nickname, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
        res.status(400).json({
            errorMessage: '패스워드가 패스워드 확인란과 다릅니다.',
        });
        return;
    }

    // email 또는 nickname이 db에 동일한 데이터가 있는지 확인하기 위해 가져온다.
    const existsUsers = await userSchema.findOne({
        $or: [{ email }, { nickname }], // $or 은 이메일과 닉네임이 일치할 때 조회한다.
    });
    if (existsUsers) {
        // NOTE: 보안을 위해 인증 메세지는 자세히 설명하지 않습니다.
        res.status(400).json({
            errorMessage: '이메일 또는 닉네임이 이미 사용중입니다.',
        });
        return;
    }

    const user = new userSchema({ email, nickname, password });
    await user.save(); // db에 저장.

    res.status(201).json({});
});

module.exports = router;

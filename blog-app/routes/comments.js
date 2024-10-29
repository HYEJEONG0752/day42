const express = require('express');
const Comment = require('../models/Comment');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const router = express.Router();

//댓글 작성
router.post('/:postId', authenticate, async (req, res) => {
    const comment = new Comment({ ...req.body, author: req.user.id, post: req.params.postId});
    await comment.save();
    res.status(201).json(comment);
});

//댓글 수정
router.put('/:id', authenticate, async (req, res) => {
    const comment = await Comment.findById(req.params.id);
    if (!comment || comment.author.toString() !== req.user.id) {
        return res.status(403).json({ error: 'Access Denied' });
    }
    Object.assign(comment, req.body);
    await comment.save();
    res.json(comment);
});

//댓글 삭제
router.delete('/:id', authenticate, authorize(['Admin']), async (req, res) => {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ error: 'Comment not found' });
    await comment.remove();
    res.json({ message: 'Comment deleted successfully' });
});

module.exports = router;

// 게시물과 댓글의 CRUD기능을 구현, 인증된 사용자만 게시물/댓글을 작성 및 수정할 수 있고, 댓글 삭제는 관리자 권한이 필요
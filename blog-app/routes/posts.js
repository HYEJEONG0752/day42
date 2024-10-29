const express = require('express');
const Post = require('../models/Post');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const router = express.Router();

//게시물 생성
router.post('/', authenticate, async (req, res) => {
    const post = new Post({ ...req.body, author: req.user.id });
    await post.save();
    res.status(201).json(post);
});

//게시물 조회
router.get('/', async (req, res) => {
    const posts = await Post.find().populate('author', 'username');
    res.json(posts);
});

//게시물 수정
router.put('/:id', authenticate, async (req, res) => {
    const post = await Post.findById(req.params.id);
    if (!post || post.author.toString() !== req.user.id) {
        return res.status(403).json({ error: 'Access Denied' });
    }
    Object.assign(post, req.body);
    await post.save();
    res.json(post);
});

// 게시물 삭제
router.delete('/:id', authenticate, authorize(['Admin']), async (req, res) => {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    await post.remove();
    res.json({ message: 'Post delete successfully' });
});

module.exports = router;
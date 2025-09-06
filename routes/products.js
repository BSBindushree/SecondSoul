const express = require('express');
const router = express.Router();
const productCtrl = require('../controllers/productController');
const { ensureAuthenticated } = require('../utils/authMiddleware');
const multer = require('multer');
const path = require('path');

// File upload setup
const upload = multer({
  dest: path.join(__dirname, '..', 'uploads'),
  limits: { fileSize: 2 * 1024 * 1024 } // 2MB
});

router.get('/', productCtrl.list);
router.get('/create', ensureAuthenticated, productCtrl.showCreate);
router.post('/create', ensureAuthenticated, upload.single('image'), productCtrl.create);
router.get('/my', ensureAuthenticated, productCtrl.myList);
router.get('/:id', productCtrl.showDetail);
router.get('/:id/edit', ensureAuthenticated, productCtrl.showEdit);
router.post('/:id/edit', ensureAuthenticated, upload.single('image'), productCtrl.update);
router.post('/:id/delete', ensureAuthenticated, productCtrl.remove);

module.exports = router;

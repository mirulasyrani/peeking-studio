const express = require('express');
const router = express.Router();
const controller = require('../controllers/invoiceController');

const { requireAdmin } = require('../middleware/authMiddleware');
const validate = require('../middleware/validate');
const { invoiceSchema } = require('../validators/invoiceSchema');

router.post(
  '/',
  requireAdmin, // ✅ Use the correctly imported middleware
  validate(invoiceSchema),
  controller.createInvoice
);

router.patch('/:id/confirm', controller.confirmInvoice);
router.get('/:id', controller.getInvoice);

module.exports = router;

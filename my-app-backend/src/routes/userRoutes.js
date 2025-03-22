const router = require('express').Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/user-info', authMiddleware, userController.getUserInfo);
router.get('/customers', authMiddleware, userController.getCustomerUsers);
router.post('/customers/add', authMiddleware, userController.addCustomer);
router.get('/my-customers', authMiddleware, userController.getMyCustomers);
router.delete('/my-customers/:customerId', authMiddleware, userController.deleteCustomer);

router.get('/suggestions', authMiddleware, userController.getUserSuggestions);
router.get('/questionnaires/:questionnaireId/suggestions', authMiddleware, userController.getQuestionnaireSuggestions);

module.exports = router;
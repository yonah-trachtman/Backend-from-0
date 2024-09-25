import express from 'express';
import { getAllUsers, filterUsersByName, filterUsersByEmail, updateUserStatuses, removeUserFromGroup } from '../controllers/userController';

const router = express.Router();

router.get('/', getAllUsers);
router.get('/filter', filterUsersByName);
router.get('/filter/email', filterUsersByEmail);
router.put('/update-statuses', updateUserStatuses);
router.put('/remove-from-group/:userId', removeUserFromGroup);

export default router;

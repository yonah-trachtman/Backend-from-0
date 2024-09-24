import { Router } from 'express';
import {
    getAllUsers,
    filterUsersByName,
    filterUsersByEmail,
    updateUserStatuses,
    removeUserFromGroup
} from '../controllers/userController';

const router = Router();

router.get('/', getAllUsers);
router.get('/filter/name', filterUsersByName);
router.get('/filter/email', filterUsersByEmail);
router.patch('/statuses', updateUserStatuses);
router.patch('/:userId/group', removeUserFromGroup);

export default router;

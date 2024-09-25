import { Router } from 'express';
import { User } from '../entities/user';
import AppDataSource from '../database';

const userRouter = Router();
const userRepository = AppDataSource.getRepository(User);

userRouter.get('/', async (req, res) => {
    const { limit = 10, offset = 0 } = req.query;
    const users = await userRepository.find({
        skip: Number(offset),
        take: Number(limit),
    });
    res.json(users);
});

userRouter.get('/name', async (req, res) => {
    const { name } = req.query;
    const users = await userRepository.find({ where: { name } });
    res.json(users);
});

userRouter.get('/email', async (req, res) => {
    const { email } = req.query;
    const users = await userRepository.find({ where: { email } });
    res.json(users);
});

userRouter.patch('/status', async (req, res) => {
    const updates = req.body; 
    const promises = updates.map(update => 
        userRepository.update(update.id, { status: update.status })
    );
    await Promise.all(promises);
    res.status(204).send();
});

userRouter.patch('/:id/remove-group', async (req, res) => {
    const userId = Number(req.params.id);
    const user = await userRepository.findOne({ where: { id: userId }, relations: ['group'] });
    
    if (user && user.group) {
        user.group = null;
        await userRepository.save(user);

        const group = await user.group;
        const memberCount = await userRepository.count({ where: { group: { id: group.id } } });
        
        if (memberCount === 0) {
            group.status = 'empty';
            await AppDataSource.getRepository(Group).save(group);
        }
        res.status(204).send();
    } else {
        res.status(404).send('User not found or already not in a group.');
    }
});

export default userRouter;

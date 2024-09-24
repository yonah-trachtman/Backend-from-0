import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { User } from '../models/user';

export const getAllUsers = async (req: Request, res: Response) => {
    const { limit = 10, offset = 0 } = req.query;
    const users = await getRepository(User).find({
        take: Number(limit),
        skip: Number(offset),
    });
    res.json(users);
};

export const filterUsersByName = async (req: Request, res: Response) => {
    const { name } = req.query;
    const users = await getRepository(User).find({ where: { name } });
    res.json(users);
};

export const filterUsersByEmail = async (req: Request, res: Response) => {
    const { email } = req.query;
    const users = await getRepository(User).find({ where: { email } });
    res.json(users);
};

export const updateUserStatuses = async (req: Request, res: Response) => {
    const updates = req.body; // Expecting an array of { id, status }
    const userRepo = getRepository(User);
    const promises = updates.map(async ({ id, status }) => {
        return userRepo.update(id, { status });
    });
    await Promise.all(promises);
    res.status(204).send();
};

export const removeUserFromGroup = async (req: Request, res: Response) => {
    const { userId } = req.params;
    const userRepo = getRepository(User);
    const user = await userRepo.findOne(userId);

    if (!user) return res.status(404).send('User not found');

    user.groupId = null;
    await userRepo.save(user);

    // Check if the group is empty
    const usersInGroup = await userRepo.find({ where: { groupId: user.groupId } });
    if (usersInGroup.length === 0) {
        // Update group status to empty (implement group logic separately)
    }

    res.status(204).send();
};

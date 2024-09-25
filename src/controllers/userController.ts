import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { User } from '../entities/user';
import { Group } from '../entities/group'; 

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
    const users = await getRepository(User).find({ where: { name: String(name) } });
    res.json(users);
};

export const filterUsersByEmail = async (req: Request, res: Response) => {
    const { email } = req.query;
    const users = await getRepository(User).find({ where: { email: String(email) } });
    res.json(users);
};

export const updateUserStatuses = async (req: Request, res: Response) => {
    const updates: { id: string, status: 'pending' | 'active' | 'blocked' }[] = req.body;
    const userRepo = getRepository(User);
    const promises = updates.map(async ({ id, status }) => {
        return userRepo.update(Number(id), { status });
    });
    await Promise.all(promises);
    res.status(204).send();
};

export const removeUserFromGroup = async (req: Request, res: Response) => {
    const { userId } = req.params;
    const userRepo = getRepository(User);
    const user = await userRepo.findOne({ where: { id: Number(userId) } });

    if (!user) return res.status(404).send('User not found');

    user.groupId = null;
    await userRepo.save(user);

    const usersInGroup = await userRepo.find({ where: { groupId: user.groupId ?? undefined } });
    if (usersInGroup.length === 0) {
        await updateGroupStatusToInactive(user.groupId);
        await deleteGroupIfEmpty(user.groupId);
    }

    res.status(204).send();
};

async function updateGroupStatusToInactive(groupId: number | null) {
    if (groupId) {
        const groupRepo = getRepository(Group);
        await groupRepo.update(groupId, { status: 'inactive' });
    }
}

async function deleteGroupIfEmpty(groupId: number | null) {
    if (groupId) {
        const groupRepo = getRepository(Group);
        await groupRepo.delete(groupId);
    }
}

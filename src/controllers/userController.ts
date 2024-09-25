// src/controllers/userController.ts
import { Request, Response } from 'express';
import { client } from '../database';

// Get all users with pagination
const getAllUsers = async (req: Request, res: Response) => {
  const limit = parseInt(req.query.limit as string) || 10; // Default limit
  const offset = parseInt(req.query.offset as string) || 0; // Default offset

  try {
    const result = await client.query('SELECT * FROM users ORDER BY id LIMIT $1 OFFSET $2', [limit, offset]);
    const users = result.rows;

    // Get total count of users for pagination
    const countResult = await client.query('SELECT COUNT(*) FROM users');
    const totalCount = parseInt(countResult.rows[0].count, 10);

    res.json({
      totalCount,
      users,
      limit,
      offset,
    });
  } catch (err) {
    console.error('Error retrieving users:', err);
    res.status(500).json({ error: 'Failed to retrieve users' });
  }
};

// Filter users by name
const filterUsersByName = async (req: Request, res: Response) => {
  const name = req.query.name as string;

  if (!name) {
    return res.status(400).json({ error: 'Name query parameter is required' });
  }

  try {
    const result = await client.query('SELECT * FROM users WHERE name = $1', [name]);
    const users = result.rows;

    res.json({ users });
  } catch (err) {
    console.error('Error filtering users:', err);
    res.status(500).json({ error: 'Failed to filter users' });
  }
};

// Filter users by email
const filterUsersByEmail = async (req: Request, res: Response) => {
  const email = req.query.email as string;

  if (!email) {
    return res.status(400).json({ error: 'Email query parameter is required' });
  }

  try {
    const result = await client.query('SELECT * FROM users WHERE email = $1', [email]);
    const users = result.rows;

    res.json({ users });
  } catch (err) {
    console.error('Error filtering users:', err);
    res.status(500).json({ error: 'Failed to filter users' });
  }
};

// Update multiple users' statuses
const updateUserStatuses = async (req: Request, res: Response) => {
    const users = req.body; // Expecting an array of objects with id and status
  
    if (!Array.isArray(users) || users.length === 0) {
      return res.status(400).json({ error: 'Request body must be a non-empty array of users' });
    }
  
    const validStatuses = ['pending', 'active', 'blocked'];
    const invalidUsers = users.filter(user => 
      !user.id || !user.status || !validStatuses.includes(user.status)
    );
  
    if (invalidUsers.length > 0) {
      return res.status(400).json({ error: 'Invalid user data', invalidUsers });
    }
  
    const updateQuery = `
      UPDATE users
      SET status = CASE 
        ${users.map(user => `WHEN id = ${user.id} THEN '${user.status}'::user_status`).join('\n')}
        END
      WHERE id IN (${users.map(user => user.id).join(',')})
    `;
  
    try {
      await client.query(updateQuery);
      res.status(200).json({ message: 'User statuses updated successfully' });
    } catch (err) {
      console.error('Error updating user statuses:', err);
      res.status(500).json({ error: 'Failed to update user statuses' });
    }
  };

  const removeUserFromGroup = async (req: Request, res: Response) => {
    const userId = parseInt(req.params.userId); // Assuming userId is passed as a URL parameter
  
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }
  
    try {
      // Remove user from group
      const result = await client.query('UPDATE users SET group_id = NULL WHERE id = $1', [userId]);
  
      if (result.rowCount === 0) {
        return res.status(404).json({ error: 'User not found or already not in a group' });
      }
  
      // Check if the group has no more members
      const groupCheck = await client.query('SELECT COUNT(*) FROM users WHERE group_id IS NOT NULL');
      const totalUsersInGroup = parseInt(groupCheck.rows[0].count, 10);
  
      if (totalUsersInGroup === 0) {
        // Update the group status to empty
        await client.query('UPDATE groups SET status = \'empty\' WHERE id = (SELECT group_id FROM users WHERE id = $1)', [userId]);
      }
  
      res.status(200).json({ message: 'User removed from group successfully' });
    } catch (err) {
      console.error('Error removing user from group:', err);
      res.status(500).json({ error: 'Failed to remove user from group' });
    }
  };


export { getAllUsers, filterUsersByName, filterUsersByEmail, updateUserStatuses, removeUserFromGroup };

import pool from '../../database/db.js';

export const addTag = async (req, res) => {
    const { userId, name, type } = req.body;

    if (!userId || !name) {
        return res.status(400).json({ message: 'User ID and tag name are required.' });
    }

    try {
        const newTag = await pool.query(
            'INSERT INTO tags (user_id, name, type) VALUES ($1, $2, $3) RETURNING *;',
            [userId, name, type]
        );
        res.status(201).json(newTag.rows[0]);
    } catch (error) {
        if (error.code === '23505') { // Unique violation
            return res.status(409).json({ message: 'Tag with this name already exists for this user.' });
        }
        console.error('Error adding tag:', error);
        res.status(500).json({ message: 'Server error while adding tag.' });
    }
};

export const getTags = async (req, res) => {
    const { userId } = req.params; // Assuming userId comes from URL parameter

    if (!userId) {
        return res.status(400).json({ message: 'User ID is required.' });
    }

    try {
        const tags = await pool.query(
            'SELECT * FROM tags WHERE user_id = $1 ORDER BY name ASC;',
            [userId]
        );
        res.status(200).json(tags.rows);
    } catch (error) {
        console.error('Error fetching tags:', error);
        res.status(500).json({ message: 'Server error while fetching tags.' });
    }
}; 
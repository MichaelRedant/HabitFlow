import { DataTypes } from 'sequelize';
import { sequelize } from '../db.js';

export const Note = sequelize.define('Note', {
  title: { type: DataTypes.STRING, allowNull: false },
  content: { type: DataTypes.TEXT },
  habit: { type: DataTypes.STRING },
  quadrant: { type: DataTypes.STRING },
  tags: { type: DataTypes.JSON }
});

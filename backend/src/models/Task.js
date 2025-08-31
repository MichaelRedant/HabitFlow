import { DataTypes } from 'sequelize';
import { sequelize } from '../db.js';
import { Note } from './Note.js';

export const Task = sequelize.define('Task', {
  id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
  title: { type: DataTypes.STRING(255), allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: true },

  habit: { type: DataTypes.STRING(8), allowNull: true },       // '1'..'7' als string

  // 1..5 sliders op UI
  importance: { type: DataTypes.TINYINT.UNSIGNED, allowNull: false, defaultValue: 3 },
  urgency:    { type: DataTypes.TINYINT.UNSIGNED, allowNull: false, defaultValue: 3 },

  // server berekent deze en houdt 'm consistent
  quadrant:   { type: DataTypes.STRING(3), allowNull: false, defaultValue: 'IV' },

  status: { 
    type: DataTypes.ENUM('todo','doing','done','blocked','archived'),
    allowNull: false, defaultValue: 'todo'
  },

  dueAt:       { type: DataTypes.DATE, allowNull: true },
  completedAt: { type: DataTypes.DATE, allowNull: true },

  tags: {
    type: DataTypes.TEXT('long'),
    allowNull: false,
    defaultValue: '[]',
    get() { try { return JSON.parse(this.getDataValue('tags') || '[]'); } catch { return []; } },
    set(v) { this.setDataValue('tags', JSON.stringify(v ?? [])); }
  }
}, { underscored: true, tableName: 'Tasks' });

// relaties
Task.belongsTo(Note, { foreignKey: { name: 'noteId', allowNull: true }, onDelete: 'SET NULL' });
Note.hasMany(Task, { foreignKey: 'noteId' });

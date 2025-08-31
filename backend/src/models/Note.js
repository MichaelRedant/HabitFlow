import { DataTypes } from 'sequelize';
import { sequelize } from '../db.js';

export const Note = sequelize.define('Note', {
  id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
  title: { type: DataTypes.STRING(255), allowNull: false },
  content: { type: DataTypes.TEXT('long'), allowNull: true },

  // hou het bij strings om jouw huidige kolommen niet te migreren
  habit:    { type: DataTypes.STRING(8), allowNull: true },     // '1'..'7' als string oké
  quadrant: { type: DataTypes.STRING(3), allowNull: true },     // 'I','II','III','IV'

  // LONGTEXT opslag, maar als JSON exposed in JS
  tags: {
    type: DataTypes.TEXT('long'),
    allowNull: false,
    defaultValue: '[]',
    get() {
      const raw = this.getDataValue('tags');
      try { return raw ? JSON.parse(raw) : []; } catch { return []; }
    },
    set(val) {
      this.setDataValue('tags', JSON.stringify(val ?? []));
    }
  },
}, { underscored: true, tableName: 'Notes' });

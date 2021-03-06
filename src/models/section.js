export default (sequelize, DataTypes) => {
  const Section = sequelize.define('section', {
    name        : DataTypes.STRING,
    type        : DataTypes.STRING,
    style       : DataTypes.TEXT,
    content     : DataTypes.TEXT,
  },
  { underscored: true }
);

  Section.associate = (models) => {
    Section.belongsTo(models.Theme, {
      foreignKey: 'owner',
    });

    Section.hasMany(models.Widget, {
      foreignKey: {
        name: 'sectionId',
        field: 'section_id',
      },
    });
  };

  return Section;
};

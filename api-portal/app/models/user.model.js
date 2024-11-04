module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    user_id: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'USERID',
      primaryKey: true,
      autoIncrement: false,
    },
    user_name: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'USERNAME',
    },
    full_name: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'FULLNAME',
    },
    phone_number: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'PHONENUMBER',
    },
  }, {
    timestamps: false,
    freezeTableName: true,
    tableName: 'SYS_USER',
  });
  return User;
};

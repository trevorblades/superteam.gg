import Sequelize from 'sequelize';

export const sequelize = new Sequelize(process.env.DATABASE_URL, {
  logging: false
});

export const Player = sequelize.define('player', {
  name: Sequelize.STRING,
  ign: Sequelize.STRING,
  country: Sequelize.STRING,
  image: Sequelize.STRING,
  rating: Sequelize.FLOAT
});

export const Statistics = sequelize.define(
  'statistics',
  {
    rating: Sequelize.FLOAT,
    kills: Sequelize.INTEGER,
    deaths: Sequelize.INTEGER,
    kdRatio: Sequelize.FLOAT,
    headshots: Sequelize.FLOAT,
    damagePerRound: Sequelize.FLOAT,
    killsPerRound: Sequelize.FLOAT,
    assistsPerRound: Sequelize.FLOAT,
    deathsPerRound: Sequelize.FLOAT,
    grenadeDamagePerRound: Sequelize.FLOAT
  },
  {
    name: {
      singular: 'statistics'
    }
  }
);

Player.hasOne(Statistics);
Statistics.belongsTo(Player);

export const Team = sequelize.define('team', {
  name: Sequelize.STRING,
  logo: Sequelize.STRING
});

Player.belongsTo(Team);
Team.hasMany(Player);

export const User = sequelize.define('user', {
  username: Sequelize.STRING,
  displayName: Sequelize.STRING,
  profileImage: Sequelize.STRING
});

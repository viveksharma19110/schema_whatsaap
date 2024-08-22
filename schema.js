const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('whatsapp_db', 'username', 'password', {
  host: 'localhost',
  dialect: 'mysql'
});

// User model
const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true
  },
  phoneNumber: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  profilePicture: {
    type: DataTypes.STRING
  }
});

// Chat model
const Chat = sequelize.define('Chat', {
  id: {
    type: DataTypes.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING
  },
  isGroup: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
});

// Message model
const Message = sequelize.define('Message', {
  id: {
    type: DataTypes.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true
  },
  content: {
    type: DataTypes.TEXT
  },
  timestamp: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW
  },
  isEdited: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  disappearAt: {
    type: DataTypes.DATE
  }
});

// Media Attachment model
const MediaAttachment = sequelize.define('MediaAttachment', {
  id: {
    type: DataTypes.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true
  },
  type: {
    type: DataTypes.ENUM('image', 'video', 'audio', 'document'),
    allowNull: false
  },
  url: {
    type: DataTypes.STRING,
    allowNull: false
  },
  size: {
    type: DataTypes.INTEGER
  }
});

// Message Edit History model
const MessageEditHistory = sequelize.define('MessageEditHistory', {
  id: {
    type: DataTypes.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  editedAt: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW
  }
});

// Associations
User.belongsToMany(Chat, { through: 'UserChat' });
Chat.belongsToMany(User, { through: 'UserChat' });

Chat.hasMany(Message);
Message.belongsTo(Chat);

User.hasMany(Message, { as: 'SentMessages', foreignKey: 'senderId' });
Message.belongsTo(User, { as: 'Sender', foreignKey: 'senderId' });

Message.hasMany(MediaAttachment);
MediaAttachment.belongsTo(Message);

Message.hasMany(MessageEditHistory);
MessageEditHistory.belongsTo(Message);

// Sync models with database
sequelize.sync({ force: true }).then(() => {
  console.log('Database and tables created!');
});
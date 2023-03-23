import mongoose from 'mongoose';

const Schema = mongoose.Schema;

export type UserType = {
  id: string;
  id_type: string;
  password: string;
  username: string;
  roles: string[];
} & {
  _id: string;
};

const userSchema = new Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  id_type: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  username: {
    type: String,
    default: 'user'
  },
  roles: {
    type: [String],
    enum: ['user', 'admin', 'super_admin'],
    default: ['user']
  }
});

const User = mongoose.model('User', userSchema);

export default User;

import mongoose from 'mongoose'
const bcrypt = require('bcrypt')
const crypto = require('crypto')
import moment from 'moment'

const Schema = mongoose.Schema

const userSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      default: 'app',
      required: true,
      enum: ['app', 'admin', 'master'],
    },
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50,
    },
    image: {
      type: String,
      trim: true,
      maxlength: 150,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    active: {
      type: Boolean,
      default: true,
    },
    dateString: {
      type: String,
    },
    dateUnix: {
      type: Number,
      default: function () {
        const hold = moment()
        this.dateUnix = hold.unix()
        this.dateString = hold.format().split('T')[0]
        // let new1 = moment.unix(hold.unix());
      },
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    wins: {
      type: Number,
      default: 0,
      required: false
    },
    loses: {
      type: Number,
      default: 0,
      required: false,
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
  { autoIndex: true }
)

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword)
}

export default mongoose.models?.User || mongoose.model('User', userSchema)

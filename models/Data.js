import mongoose from 'mongoose'
const bcrypt = require('bcrypt')
const crypto = require('crypto')
import moment from 'moment'

const Schema = mongoose.Schema

const dataSchema = new mongoose.Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    opponent: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    userWin: {
      type: String,
    },
    difficulty: {
      type: String,
    },
    modality: {
      type: String,
      required: true,
    },
    memoizePositions: {
      type: Array,
      required: true,
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
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
  { autoIndex: true }
)

export default mongoose.models?.Data || mongoose.model('Data', dataSchema)

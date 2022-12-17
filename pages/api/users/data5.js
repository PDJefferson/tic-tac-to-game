import { getSession } from 'next-auth/react'
import bcrypt from 'bcrypt'
import crypto from 'crypto'
const mongoSanitize = require('express-mongo-sanitize')
import Data from '../../../models/Data'
import User from '../../../models/User'
import { GAME_SETTINGS } from '../../../constants/game'

async function handler(req, res) {
  if (req.method !== 'GET') {
    return
  }
  const session = await getSession({ req: req })

  if (!session) {
    res.status(401).json({ message: 'Not authenticated!' })
    return
  }

  const getData = await Data.find({ user: session.user23._id })
    .sort({ dateUnix: -1 })
    .limit(5)
    .populate({
      path: 'opponent',
      select: 'name',
    })

  res.status(200).json({ message: 'Data saved!', data: getData })
  return
}

export default handler

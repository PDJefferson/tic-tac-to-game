import { getSession } from 'next-auth/react'
import bcrypt from 'bcrypt'
import crypto from 'crypto'
const mongoSanitize = require('express-mongo-sanitize')
import Data from '../../../models/Data'
import User from '../../../models/User'

async function handler(req, res) {
  if (req.method !== 'POST') {
    return
  }
  const session = await getSession({ req: req })

  if (!session) {
    res.status(401).json({ message: 'Not authenticated!' })
    return
  }

  const body = JSON.parse(req.body)

  const hasProhibited = mongoSanitize.has(body)
  if (hasProhibited) {
    res.status(401).json({ message: 'Something went wrong!' })
    return
  }
  console.log(body)
  let data23
  if (body.modality === 'online') {
    data23 = await Data.create({
      user: session.user23._id,
      opponent: body.opponent,
      userWin: body.userWin,
      modality: body.modality,
      memoizePositions: body.memoizePositions,
    })
    if (!data23) {
      res.status(401).json({ message: 'Something went wrong!' })
      return
    }
  }
  if (body.modality === 'pvc') {
    data23 = await Data.create({
      user: session.user23._id,
      userWin: body.userWin,
      difficulty: body.difficulty,
      modality: body.modality,
      memoizePositions: body.memoizePositions,
    })
    if (!data23) {
      res.status(401).json({ message: 'Something went wrong!' })
      return
    }
  }

  const user = await User.findOne({ _id: session.user23._id }).exec()

  if (!user) {
    return resp.status(204).json({ message: `Something went wrong.` })
  }
  user.data.push(data23._id)

  if (body.modality === 'online') {
    //update the amount of wins
    if (body.userWin === 'true') user.wins = user.wins + 1
    //update the amount of loses
    if (body.userWin === 'false') user.loses = user.loses + 1
    if (body.userWin === 'tie') user.ties = user.ties + 1
  }

  //persist to the db
  const result = await user.save()
  if (!result) {
    return resp.status(204).json({ message: `Something went wrong.` })
  }

  res.status(200).json({ message: 'Data saved!' })
  return
}

export default handler

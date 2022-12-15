import User from '../../../models/User'

export default async function getAllUsers(req, resp) {
  //find users by the amount of wins
  const users = await User.find().sort({ wins: -1 }).limit(3)

  //if users is empty then return a response of not found
  if (!users) return resp.status(204).json({ message: 'No Users Found.' })
  resp.json(users)
}

import User from '../../../models/User'

export default async function updateUser(req, resp) {
  let userToUpdate = JSON.parse(req.body)
  //check if the body has an id
  if (!userToUpdate.id) {
    //return a bad request if it doesn't
    return resp.status(400).json({ message: 'ID parameter is required.' })
  }

  console.log(userToUpdate.id)
  //find the user that matches that id
  const user = await User.findOne({ _id: userToUpdate.id }).exec()

  if (!user) {
    return resp
      .status(204)
      .json({ message: `No user matches ID ${userToUpdate.id}.` })
  }

  //update the amount of wins
  if (userToUpdate.wins) user.wins = userToUpdate.wins
  //update the amount of loses
  if (userToUpdate.loses) user.loses = userToUpdate.loses
  //persist to the db
  const result = await user.save()
  resp.json(result)
}

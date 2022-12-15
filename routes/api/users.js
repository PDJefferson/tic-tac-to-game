const colors = ['#FFCA28', '#FFCA28', '#FFCA28']
export async function getAllUsers() {
  //listen to this response
  const response = await fetch('/api/users/list', {
    method: 'GET',
  })
  if (!response.ok) {
    throw new Error(data.message || 'Could not fetch quotes.')
  }

  const data = await response.json()
  data.forEach((obj, index) => (obj.color = colors[index]))
  return data
}

export async function updateUser({ id, wins, loses }) {
  //creating the object to send to the server
  const data = {
    id: id,
    wins: wins,
    loses: loses,
  }

  //listening to this endpoint
  const response = await fetch('/api/users/update', {
    method: 'PUT',
    body: JSON.stringify(data),
  })
  //return the response
  const values = await response.json()
  values.forEach((obj, index) => (obj.color = colors[index]))
  return values
}

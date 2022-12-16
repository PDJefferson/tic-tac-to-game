const colors = ['#FFCA28', '#FFCA28', '#FFCA28']

export async function saveData(data) {
  console.log('data')
  let body
  if (data.modality === 'online') {
    body = {
      modality: data.modality,
      userWin: data.userWin,
      memoizePositions: data.holdMemoizePositions,
      opponent: data.opponent,
    }
  }
  if (data.modality === 'pvc') {
    body = {
      modality: data.modality,
      userWin: data.userWin,
      difficulty: data.difficulty,
      memoizePositions: data.holdMemoizePositions,
    }
  }

  const res = await fetch(`${process.env.NEXTAUTH_URL}/api/users/savegame`, {
    method: 'POST',
    body: JSON.stringify(body),
  })
  const response = await res.json()
  if (response.message === 'Data saved!') {
  } else {
  }
}

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

import { useState } from 'react'

import './index.css'

import FieldForm from '../../component/field-form'
import Grid from '../../component/grid'

import { Alert, Loader, LOAD_STATUS } from '../../component/load'

export default function Container({
  onCreate,
  placeholder,
  button,
  id = null,
}) {
  const [status, setStatus] = useState(null)
  const [message, setMessage] = useState('')

  const handleSubmit = (value) => {
    return sendData({ value })
  } // при натисканні на кнопку відправляємо дані на сервер

  const sendData = async (dataToSend) => {
    setStatus(LOAD_STATUS.PROGRESS) // встановлюємо статус завантаження

    try {
      const res = await fetch('http://localhost:4000/post-create', {
        // відправляємо дані на сервер
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: convertData(dataToSend), // перетворюємо дані в JSON формат і відправляємо на сервер
      })

      const data = await res.json() // отримуємо дані з сервера в JSON форматі

      if (res.ok) {
        // якщо дані успішно відправлені на сервер
        setStatus(null) // встановлюємо статус завантаження в null

        if (onCreate) onCreate() // якщо передана функція onCreate, то викликаємо її, тобто створюємо новий пост
      } else {
        setMessage(data.message)
        setStatus(LOAD_STATUS.ERROR)
      }
    } catch (error) {
      setMessage(error.message)
      setStatus(LOAD_STATUS.ERROR)
    }
  }

  const convertData = ({ value }) =>
    JSON.stringify({
      text: value,
      username: 'user',
      postId: id,
    })

  return (
    <Grid>
      <FieldForm
        placeholder={placeholder}
        button={button}
        onSubmit={handleSubmit}
      />
      {status === LOAD_STATUS.ERROR && (
        <Alert status={status} message={message} />
      )}
      {status === LOAD_STATUS.PROGRESS && <Loader />}
    </Grid>
  )
}

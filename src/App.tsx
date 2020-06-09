import React, { useState, useEffect } from 'react'
import logo from './assets/mongo.png'
import './App.scss'
import { DOMAIN, DEV } from './config'
import io from 'socket.io-client'
import FadeLoader from 'react-spinners/FadeLoader'
import Modal from 'react-modal'


// types

const modalStyle: any = {
  backgroundColor: '#f53b57',
  border: 0,
  width: 400,
  height: 200,
  maxHeight: '50%',
  maxWidth: '70%',
  display: 'flex',
  justifyContent: 'space-around',
  alignItems: 'center',
  flexDirection: 'column',
  marginLeft: 'auto',
  marginRight: 'auto',
  marginTop: 100,
  position: 'relative',
  color: 'rgb(245, 245, 245)',
}


function App() {
  const [mongoUri, setMongoUri] = useState('')
  const [socket, setSocket] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const connect = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault()
    try {
      if (socket) {
        setLoading(true)
        socket.emit('connectMongo', mongoUri, (dbs: {
          totalSize: Number,
          ok: Number,
          databases: Array<{ name: String, sizeOnDisk: Number, empty: Boolean }>
        }) => {
          setLoading(false)
          console.log('ack: ', dbs)
        })
      }
    } catch (err) {
      console.log(err)
    }
  }


  useEffect(() => {
    const mySocket = io(DOMAIN)
    setSocket(mySocket)

    return () => {
      mySocket.disconnect()
      setSocket(null)
    }
  }, [])

  return (
    <div className="app">
      { loading &&
        <div className="overlay">
          <FadeLoader
            loading={true}
            height={45}
            width={15}
            radius={6}
            margin={30}
            css="transform: translateX(-15px) translateY(-50px);"
            color="#0be881"
          />
        </div>
      }

      <Modal
        ariaHideApp={false}
        isOpen={!!error}
        onRequestClose={() => setError('')}
        className="modal"
        style={{
          content: modalStyle,

          overlay: { backgroundColor: 'rgba(0, 0, 0, 0)'}
        }}
        contentLabel={error}
      >
        <button
          className="modal-button"
          onClick={() => setError('')}
        >Close</button>

        <h2>Error</h2>
        <p>{error}</p>
      </Modal>

      <header className="app-header">
        <img src={logo} className="app-logo" alt="logo" />

        <form onSubmit={connect}>
          <input
            type="text"
            value={mongoUri}
            onChange={e => setMongoUri(e.target.value)}
            placeholder={'mongodb://localhost:27017'}
            className="spacing-y input-main"
          />
          <div>
            <input type="submit" value="Connect" className="button-main" />
          </div>
        </form>

        <p>
          Connect to your MongoDB database.
        </p>
      </header>
    </div>
  );
}

export default App;

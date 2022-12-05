import { useRef, useState } from 'react'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Modal from '@mui/material/Modal'
import Checkbox from '@mui/material/Checkbox'

const style = {
  position: 'relative',
  // top: '50%',
  // left: '50%',
  top: '4.7rem',
  left: '7rem',
  right: '0px',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '1px solid grey',
  borderRadius: '5px',
  boxShadow: 24,
  // p: 4,
}

const label = { inputProps: { 'aria-label': 'Checkbox demo' } }

const dummyData = [
  {
    label: 'zahid',
    collapse: true,
    data: [
      {
        selected: false,
        itemName: 'item1',
      },
      {
        selected: false,
        itemName: 'item2',
      },
    ],
  },
  {
    label: 'Allah wasaya',
    collapse: true,
    data: [
      {
        selected: false,
        itemName: 'item3',
      },
      {
        selected: true,
        itemName: 'item4',
      },
    ],
  },
]

const App = () => {
  const [AllData] = useState(dummyData)
  const [data, setData] = useState(dummyData)
  const [open, setOpen] = useState(false)

  const handleOpen = () => setOpen(true)
  const closeModal = () => setOpen(false)

  const handleCollapse = (index: number) => {
    const copyData = [...data]
    copyData[index].collapse = !copyData[index].collapse
    setData(copyData)
  }

  const handleSearch = (value: string) => {
    let copyData = [...AllData]
    copyData = copyData.filter((item) => item.label.toLowerCase().includes(value.toLowerCase()))
    setData(copyData)
  }

  const handleCheck = (checked: boolean, index: number, index2: number) => {
    let copyData = [...AllData]
    copyData[index].data[index2].selected = !copyData[index].data[index2].selected
    setData(copyData)
  }

  return (
    <div className='App' style={{ marginTop: '10rem', marginLeft: '50rem' }}>
      <Box
        component='form'
        sx={{
          '& > :not(style)': { m: 1, width: '25ch' },
        }}
        noValidate
        autoComplete='off'
      >
        <TextField
          onChange={(event) => handleSearch(event.target.value)}
          onClickCapture={() => setOpen(true)}
          id='outlined-basic'
          label='Outlined'
          variant='outlined'
        />
        <Box sx={style}>
          {data.map((items, index) => (
            <Box key={index} style={{ margin: '10px' }}>
              <Typography style={{ cursor: 'pointer' }} onClick={() => handleCollapse(index)}>
                {items.label}
              </Typography>
              {!items.collapse &&
                items.data.map((item, index2) => (
                  <Box style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                    <Typography key={index2} style={{ marginLeft: '10px' }}>
                      {item.itemName}
                    </Typography>
                    <Checkbox onChange={(event) => handleCheck(event.target.checked, index, index2)} {...label} checked={item.selected} />
                  </Box>
                ))}
            </Box>
          ))}
        </Box>
      </Box>
    </div>
  )
}

export default App

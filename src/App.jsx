import { useState } from 'react'
import MultiDropDown from './dynamicSelect'

const dummyData = [
  {
    id: 1,
    name: 'zahid',
    collapse: true,
    data: [
      {
        id: 2,
        collapse: true,
        name: 'item1',
        data: [
          {
            id: 3,
            selected: false,
            name: 'item5',
          },
          {
            id: 4,
            selected: false,
            name: 'item6',
          },
        ],
      },
      {
        id: 5,
        selected: false,
        name: 'item2',
      },
    ],
  },
  {
    name: 'Allah wasaya',
    collapse: true,
    data: [
      {
        id: 6,
        selected: false,
        name: 'item3',
      },
      {
        id: 7,
        selected: false,
        name: 'item4',
      },
    ],
  },
]

const App = () => {
  const [ids, setIds] = useState([])

  return (
    <div className='App' style={{ marginTop: '10rem', marginLeft: '50rem', width: '20rem' }}>
      <MultiDropDown dropDownData={dummyData} ids={ids} setIds={setIds} />
      <MultiDropDown dropDownData={dummyData} ids={ids} setIds={setIds} />
    </div>
  )
}

export default App

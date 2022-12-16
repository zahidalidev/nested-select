import * as React from 'react'
import { useState, useEffect } from 'react'
import { ArrowDropDown, ArrowDropUp, ExpandLess, ExpandMore, Close } from '@mui/icons-material'
import { Box, Checkbox, FormControl, Input, Typography, IconButton } from '@mui/material'
import { makeStyles } from '@mui/styles'

const MultiDropDown = ({ dropDownData, ids, setIds }) => {
  const [filteredData, setFilteredData] = useState([])
  const [showDropDown, setShowDropDown] = useState(false)
  const [selectedItems, setSelectedItems] = useState([])
  const [active, setActive] = useState(false)
  const [focus, setFocus] = useState(false)
  const [showResetButton, setShowResetButton] = useState(false)
  const [detectFocus, setDetectFocus] = useState(false)
  const [isThemeDark, setIsThemeDark] = useState(false)
  const [value, setValue] = useState('')
  const [count, setCount] = useState(0)
  const [nestedCount, setNestedCount] = useState(0)
  const [nestedlevel, setNestedLevel] = useState(false)

  const classes = useStyles()

  useEffect(() => {
    setFilteredData([...dropDownData])
  }, [dropDownData])

  const handleSearch = (value) => {
    let results = dropDownData.filter((item) =>
      item.name.toLowerCase().includes(value.toLowerCase())
    )

    if (value) {
      setShowDropDown(true)
      setActive(true)
    }

    setValue(value)
    setFilteredData(results)
  }

  const handleSelectAndCollapse = (data, id, flag) => {
    for (let obj of data || []) {
      if (obj.id === id) {
        obj[flag] = !obj[flag]
        return obj
      }

      const selectedObj = handleSelectAndCollapse(obj.data, id, flag)

      if (selectedObj) return selectedObj
    }
  }

  const handleCollapse = (id) => {
    const copyFilteredData = [...filteredData]

    handleSelectAndCollapse(copyFilteredData, id, 'collapse')
    setFilteredData(copyFilteredData)
  }

  const handleCheck = (id) => {
    let copyFilteredData = [...dropDownData]
    let copySelectedItems = [...selectedItems]
    let copyIds = [...ids]

    const selectedObj = handleSelectAndCollapse(copyFilteredData, id, 'selected')

    if (selectedObj?.selected) {
      copySelectedItems.push(selectedObj)
      copyIds.push(selectedObj.id)
    } else {
      copySelectedItems = copySelectedItems.filter((item) => item.id !== id)
      copyIds = copyIds.filter((itemId) => itemId !== id)
    }

    if (copySelectedItems.length > 0) setActive(true)
    else if (copySelectedItems.length === 0 && !showDropDown) {
      setFocus(false)
      setActive(false)
    }

    setSelectedItems(copySelectedItems)
    setIds(copyIds)
    setFilteredData(copyFilteredData)
  }

  const highlight = (data, id, childId) => {
    for (let obj of data || []) {
      if (obj.id == id) {
        if (obj.selectedChilds === undefined) obj.selectedChilds = [childId]
        else if (obj.selectedChilds.includes(childId))
          obj.selectedChilds = obj.selectedChilds.filter((id) => id !== childId)
        else obj.selectedChilds = [...obj.selectedChilds, childId]
        return obj
      }

      const selectedObj = highlight(obj.data, id, childId)

      if (selectedObj) return selectedObj
    }
  }

  const removeHighlight = (data, id) => {
    for (let obj of data || []) {
      if (obj?.selectedChilds?.includes(id)) {
        obj.selectedChilds = obj.selectedChilds.filter((selectedId) => selectedId !== id)
        return obj
      }

      const selectedObj = removeHighlight(obj.data, id)

      if (selectedObj) return selectedObj
    }
  }

  const handleRemoveHighlight = (id) => {
    let copyFilteredData = [...dropDownData]

    removeHighlight(copyFilteredData, id)
    setFilteredData(copyFilteredData)
  }

  const handleHighlight = (id, childId) => {
    let copyFilteredData = [...dropDownData]

    highlight(copyFilteredData, id, childId)
    setFilteredData(copyFilteredData)
  }

  const handleBlur = () => {
    if (selectedItems.length === 0 && value.length === 0) setActive(false)

    setFocus(false)
  }

  const handleFocus = () => {
    setShowDropDown(true)
    setActive(true)
    setFocus(true)
    setDetectFocus(false)
  }

  const handleActive = () => {
    if (detectFocus) setShowDropDown(!showDropDown)

    setDetectFocus(true)
    setActive(true)
    setFocus(true)
  }

  const handleReset = () => {
    let copyFilteredData = [...dropDownData]
    const copyIds = [...ids]

    copyIds.forEach((id) => {
      handleSelectAndCollapse(copyFilteredData, id, 'selected')
      removeHighlight(copyFilteredData, id)
    })

    setSelectedItems([])
    setIds([])
    setFilteredData(copyFilteredData)
  }

  const handleSelect = (filteredData, item) => {
    if (item.collapse !== undefined) handleCollapse(item.id)

    if (item.selected !== undefined) {
      handleCheck(item.id)
      handleHighlight(filteredData?.id, item.id)
    }
  }

  const resetNavigation = (data) => {
    for (let obj of data || []) {
      obj.current = false
      if (obj?.data?.length > 0) obj.collapse = true

      const selectedObj = resetNavigation(obj.data)

      if (selectedObj) return selectedObj
    }
  }

  const handleResetNavigation = () => {
    const copyFilteredData = [...dropDownData]

    resetNavigation(copyFilteredData)
    setFilteredData(copyFilteredData)
    setCount(0)
    setNestedCount(0)
    setNestedLevel(false)
  }

  const hanldeKeyPress = (event) => {
    if (!showDropDown) return

    let copyData = [...dropDownData]

    if (event.key === 'ArrowDown' && count < filteredData.length) {
      if (nestedlevel && nestedCount < copyData[count - 1].data.length) {
        copyData[count - 1].data = copyData[count - 1].data.map((item) => {
          if (item.current !== undefined) item.current = false
          return item
        })

        copyData[count - 1].data[nestedCount].current = true
        setNestedCount(nestedCount + 1)
      } else if (!nestedlevel) {
        copyData = copyData.map((item) => {
          if (item.current !== undefined) item.current = false
          return item
        })

        copyData[count].current = true
        setCount(count + 1)
      }
    } else if (event.key === 'ArrowUp' && count > 0) {
      if (nestedlevel && nestedCount >= 2) {
        copyData[count - 1].data = copyData[count - 1].data.map((item) => {
          if (item.current !== undefined) item.current = false
          return item
        })

        copyData[count - 1].data[nestedCount - 2].current = true
        setNestedCount(nestedCount - 1)
      } else {
        copyData = copyData.map((item) => {
          if (item.current !== undefined) item.current = false
          return item
        })

        if (nestedlevel) {
          copyData[count - 1].data = copyData[count - 1].data.map((item) => {
            if (item.current !== undefined) item.current = false
            return item
          })

          copyData[count - 1].current = true
          setNestedCount(0)
        } else {
          copyData[count - 2].current = true
          setCount(count - 1)
        }
      }
    } else if (event.key === 'Enter') {
      if (nestedlevel && nestedCount >= 1 && nestedCount <= copyData[count - 1].data.length) {
        handleSelect(copyData[count - 1], copyData[count - 1].data[nestedCount - 1])
      } else {
        setNestedLevel(!nestedlevel)
        copyData[count - 1].collapse = !copyData[count - 1].collapse
      }
    }

    setFilteredData(copyData)
  }

  const handleDropDownEvent = () => {
    setShowDropDown(!showDropDown)
    handleResetNavigation()
  }

  const handleKeyEvent = (event) => {
    hanldeKeyPress(event)
  }

  useEffect(() => {
    const { matches } = window.matchMedia('(prefers-color-scheme: dark)')

    setIsThemeDark(matches)
    window.addEventListener('keydown', handleKeyEvent)

    return () => {
      window.removeEventListener('keydown', handleKeyEvent)
    }
  })

  const expandIcon = (item) =>
    !item.collapse ? (
      <ExpandLess sx={{ color: isThemeDark && '#ffff' }} />
    ) : (
      <ExpandMore sx={{ color: isThemeDark && '#ffff' }} />
    )

  const DropChild = ({ item, level }) => (
    <DropDown key={item.name} filteredData={item} level={level + 1} />
  )

  const DropDown = ({ filteredData, level = 1 }) =>
    filteredData?.data?.map((item, i) => (
      <Box key={i} sx={{ margin: '2px', marginLeft: level === 1 ? '2px' : '12px' }}>
        <Box
          onClick={() => handleSelect(filteredData, item)}
          className={classes.checkboxContainer}
          sx={{
            justifyContent: item.selected !== undefined ? 'left' : 'space-between',
            backgroundColor:
              item?.selectedChilds?.length > 0 || item?.current
                ? isThemeDark
                  ? '#283644'
                  : '#EBEBEB'
                : null,
            '&:hover': { background: isThemeDark ? '#283644' : '#EBEBEB' },
          }}
        >
          {item.selected !== undefined && (
            <Checkbox className={classes.checkbox} checked={item.selected} />
          )}
          <Typography sx={{ fontSize: `${17 - level}px`, color: isThemeDark && '#ffffff' }}>
            {item.name}
          </Typography>
          {item.collapse !== undefined && expandIcon(item)}
        </Box>
        {!item.collapse && <DropChild item={item} level={level} />}
      </Box>
    ))

  return (
    <>
      <Box className={classes.container}>
        <FormControl
          className={classes.mainContainer}
          sx={{
            padding: selectedItems.length === 0 ? '5px 20px 0px 0px' : '8px 19px 4px 8px',
            border:
              showDropDown || focus
                ? '2px solid #007bff'
                : `1px solid ${isThemeDark ? '#e8e8e84d' : '#c6c6c6'}`,
            '&:hover': !(showDropDown || focus) && {
              border: `1px solid ${isThemeDark ? '#ffffff' : '#000000'}`,
            },
          }}
          onMouseEnter={() => setShowResetButton(true)}
          onMouseLeave={() => setShowResetButton(false)}
        >
          {selectedItems.length !== 0 && (
            <Box className={classes.selectedNamesContainer}>
              {selectedItems.map((item) => (
                <Box
                  key={item.id}
                  className={classes.selectedNames}
                  sx={{
                    marginBottom: selectedItems.length > 1 ? '5px' : '0px',
                    backgroundColor: isThemeDark ? '#3F444A' : '#00000014',
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: '0.8125rem',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      // maxWidth: '6rem',
                    }}
                  >
                    {item.name}
                  </Typography>
                  <Close
                    onClick={() => {
                      handleCheck(item.id)
                      handleRemoveHighlight(item.id)
                    }}
                    className={classes.removeNameButton}
                    sx={{
                      backgroundColor: isThemeDark ? '#707478' : 'rgba(26, 32, 39, 0.26)',
                      color: isThemeDark ? '#3F444A' : '#fff',
                    }}
                  />
                </Box>
              ))}
              {showResetButton && (
                <Close
                  onClick={handleReset}
                  className={classes.resetButton}
                  sx={{
                    color: isThemeDark ? '#FFFFFF' : 'grey',
                    '&:hover': {
                      backgroundColor: isThemeDark
                        ? 'rgba(255, 255, 255, 0.08)'
                        : 'rgba(0, 0, 0, 0.04)',
                    },
                  }}
                />
              )}
            </Box>
          )}
          <Box
            className={classes.arrowButton}
            sx={{ cursor: ids.length === 0 && 'pointer !important' }}
          >
            <IconButton onMouseDown={handleDropDownEvent} className={classes.arrowButtonIcon}>
              {showDropDown ? <ArrowDropUp /> : <ArrowDropDown />}
            </IconButton>
          </Box>
          <Typography
            className={active || showDropDown ? classes.focusedLabel : classes.label}
            sx={{
              color: focus || showDropDown ? '#007bff' : isThemeDark ? '#e8e8e8b3' : '#455667',
              backgroundColor: (active || showDropDown) && (isThemeDark ? '#1A2027' : '#ffffff'),
            }}
          >
            Flags
          </Typography>
          <Input
            onChange={(event) => handleSearch(event.target.value)}
            onClick={handleActive}
            onFocus={handleFocus}
            onBlur={handleBlur}
            margin='dense'
            size='small'
            className={classes.inputField}
            sx={{
              margin: selectedItems.length === 0 ? '3px 8px 5px 12px' : '3px 8px 2px 5px',
              // width: '85%',
            }}
            disableUnderline
          />
        </FormControl>

        <Box
          hidden={!showDropDown}
          className={classes.dropdown}
          sx={{
            boxShadow: 1,
            backgroundColor: isThemeDark ? '#172534' : '#ffffff',
          }}
        >
          {filteredData?.length !== 0 ? (
            <DropDown filteredData={{ data: filteredData }} />
          ) : (
            <Box sx={{ margin: '2px' }}>
              <Box sx={{ display: 'flex', padding: '5px 5px 5px 10px' }}>
                <Typography sx={{ color: isThemeDark && '#ffffff' }}>No option</Typography>
              </Box>
            </Box>
          )}
        </Box>
      </Box>
    </>
  )
}

export default MultiDropDown

const useStyles = makeStyles({
  container: {
    marginTop: '0.5rem',
    marginBottom: '0.5rem',
    width: '90%'
  },

  checkboxContainer: {
    display: 'flex',
    flexDirection: 'row',
    padding: '5px 5px 5px 10px',
    cursor: 'pointer',
    alignItems: 'center',
  },

  checkbox: {
    transform: 'scale(0.7)',
    padding: '0px',
    marginRight: '5px',
  },

  mainContainer: {
    borderRadius: '5px',
    width: '-webkit-fill-available',
  },

  selectedNames: {
    display: 'flex',
    borderRadius: '16px',
    padding: '5px 10px 5px 10px',
    alignItems: 'center',
    marginTop: '1px',
  },

  selectedNamesContainer: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },

  removeNameButton: {
    cursor: 'pointer',
    margin: '0 -4px 0px 4px',
    padding: '1px',
    borderRadius: '10px',
    fontSize: '18px !important',
  },

  resetButton: {
    position: 'absolute',
    cursor: 'pointer',
    padding: '3px',
    borderRadius: '15px',
    fontSize: '26px !important',
    right: '20%',
    top: '48%',
    margin: '-13px',
  },

  inputField: {
    zIndex: 3,
  },

  arrowButton: {
    position: 'absolute',
    bottom: 0,
    top: 0,
    right: '5px',
    display: 'flex',
    alignItems: 'center',
  },

  arrowButtonIcon: {
    padding: '3px !important',
    '&:focus': { outline: 'none' },
  },

  dropdown: {
    position: 'relative',
    margin: '2px',
    color: '#1A2027',
    borderRadius: '4px',
    zIndex: 100,
    padding: '8px 0px 8px 0px',
  },

  label: {
    position: 'absolute',
    left: '12px',
    transform: 'translate(0, 4px) scale(1)',
    transition: '200ms cubic-bezier(0, 0, 0.2, 1) 0ms',
  },

  focusedLabel: {
    position: 'absolute',
    pointerEvents: 'none',
    transform: 'translate(0, -14px) scale(0.8)',
    transformOrigin: 'top left',
    transition: '200ms cubic-bezier(0, 0, 0.2, 1) 0ms',
    fontSize: '16px',
    lineHeight: '1 !important',
    left: '16px',
    padding: '0px 6px 0px 6px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: '-8px !important',
  },
})

//KEY CODES
//should clean up these hard-coded key codes
const ENTER = 13
const RIGHT_ARROW = 39
const LEFT_ARROW = 37
const UP_ARROW = 38
const DOWN_ARROW = 40


function handleKeyDown(e) {

  //console.log("keydown code = " + e.which)

  if (e.which == ENTER) {
    handleGetPuzzleButton() //treat ENTER key like you would a submit
    document.getElementById('userTextField').value = ''

  }

}

function handleKeyUp(e) {

    //create a JSON string representation of the data object
    //let jsonString = JSON.stringify(dataObj)
    //DO NOTHING WITH THIS DATA FOR NOW



  if (e.which == ENTER) {
    handleGetPuzzleButton() //treat ENTER key like you would a submit
    document.getElementById('userTextField').value = ''

  }

  e.stopPropagation()
  e.preventDefault()

}









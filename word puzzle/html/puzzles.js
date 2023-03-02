

//loads puzzle to the screen when user clicks 'get puzzle' or hits enter

function handleGetPuzzleButton() {

  let puzzleNum=0

  let userText = document.getElementById('userTextField').value
  if (userText && userText != '') {

    let textDiv = document.getElementById("text-area")
    //textDiv.innerHTML = '';


    if(userText.toLowerCase()=='puzzle3'){
      puzzleNum=3
    }

    //requesting puzzle from the server

    let userRequestObj = {
      text: userText
    }
    let userRequestJSON = JSON.stringify(userRequestObj)
    document.getElementById('userTextField').value = ''

    let xhttp = new XMLHttpRequest()
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {

        let responseObj = JSON.parse(this.responseText)

        if (responseObj.puzzleLines) {

          puzzleName = userText

          //for puzzle 3 (one word split up letters)
          if (puzzleNum==3){


            textDiv.innerHTML = `<span class="userText"> ${userText}</span>`
            words = [] //clear words on canvas
            serverSolution=''

            for(let x=0; x<responseObj.puzzleLines.length;x++){

              for(let y=0; y<responseObj.puzzleLines[x].length;y++){


                let word = {
                  word: responseObj.puzzleLines[x][y]
                }

                assignRandomIntCoords(word, canvas.width, canvas.height)
                words.push(word)
                serverSolution+= responseObj.puzzleLines[x][y]+" "

              }
            }

          }


          //puzzles 1 and 2 (split up words from the phrase)
          else{


            textDiv.innerHTML = `<span class="userText"> ${userText}</span>`
            words = [] //clear words on canvas
            serverSolution=''
            for (line of responseObj.puzzleLines) {
              lineWords = line.split(" ")
              for (w of lineWords) {
                let word = {
                  word: w
                }
                assignRandomIntCoords(word, canvas.width, canvas.height)
                words.push(word)
                serverSolution+=word.word+" "
          }
            }
          }

        }

        drawCanvas()
      }

    }
    xhttp.open("POST", "userText") //API .open(METHOD, URL)
    xhttp.send(userRequestJSON) //API .send(BODY)
  }
}



//when user hits solve puzzle button

function handleSolvePuzzleButton() {


  let output = ''
 let clientSolution=''
  let thisLine=[]


  const sortedByYValue = words.sort( (a,b)  => {return a.y - b.y}  );

  let anchor = sortedByYValue[0].y

  let tolerance = 10


  for(let i=0; i<sortedByYValue.length; i++){


    //if word falls on the same vertical line as anchor word
    if ((sortedByYValue[i].y <= anchor+tolerance) && (sortedByYValue[i].y >= anchor-tolerance)){

      sortedByYValue[i].y = anchor
      thisLine.push(sortedByYValue[i])

    }

    //word falls on a new line
    else{
      anchor = sortedByYValue[i].y

      sortedByXValue = thisLine.sort( (a,b)  => {return a.x - b.x}  );

      thisLine = []

      for(let x=0; x<sortedByXValue.length; x++){

        output+=sortedByXValue[x].word + " "

        if (puzzleName=='puzzle3'){
          clientSolution+=sortedByXValue[x].word
        }
        else{
          clientSolution+=sortedByXValue[x].word+" "
        }

      }

      output+='<br>'


      sortedByXValue=''


      thisLine.push(sortedByYValue[i])


    }


  }

  sortedByXValue = thisLine.sort( (a,b)  => {return a.x - b.x}  );

  for(let x=0; x<sortedByXValue.length; x++){


    if (puzzleName=='puzzle3'){
      clientSolution+=sortedByXValue[x].word
      output+=sortedByXValue[x].word
    }
    else{
      clientSolution+=sortedByXValue[x].word+" "
      output+=sortedByXValue[x].word + " "
    }



  }

  thisLine = []


  drawCanvas()

  //check solution

  //request from server again


  let userRequestObj = {
   name: puzzleName,
   solution: clientSolution
  }
  let userRequestJSON = JSON.stringify(userRequestObj)

  let xhttp = new XMLHttpRequest()
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      console.log("data: " + this.responseText)
      console.log("typeof: " + typeof this.responseText)
      //we are expecting the response text to be a JSON string
      let responseObj = JSON.parse(this.responseText)

      console.log(responseObj)
      if(responseObj.text=="correct"){
        let textDiv = document.getElementById("text-area")

        textDiv.innerHTML = `<span class="correct">${output} </span>`
      }
      else if(responseObj.text=="wrong"){
        let textDiv = document.getElementById("text-area")

        textDiv.innerHTML = `<span class="incorrect">${output} </span>`

      }

 }


}

xhttp.open("POST", "solvePuzzle") //API .open(METHOD, URL)
xhttp.send(userRequestJSON) //API .send(BODY)


}
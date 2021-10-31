const mainDiv = document.createElement("div")
mainDiv.setAttribute('class','container')

document.body.append(mainDiv)

const searchRow = document.createElement('div')
searchRow.setAttribute('class','row search-row mt-4')
const searchDiv = document.createElement('div')
searchDiv.setAttribute('class','col-12 search-div')

mainDiv.append(searchRow)
searchRow.append(searchDiv)

/**
 * renders the search div, where it takes the user input, to search for that word's meaning in the dictionary
 * search() function is called when the search button is clicked
 */
searchDiv.innerHTML = `
    <h3>Dictionary 📖</h3>
    <div class="input-group mb-3 mt-3">
        <input type="text" class="form-control form-input-value" placeholder="Search for a word...">
        <div class="input-group-append">
            <button class="btn btn-outline-secondary" type="button" id="searchBtn" onclick="search()"><i class="fas fa-search"></i> Search</button>
        </div>
    </div>
`

const dictRow = document.createElement('div')
dictRow.setAttribute('class','row dict-row')
mainDiv.append(dictRow)

/**
 * getting the user input and attaching that searched word to the api url, to fetch the data related to thet word
 */
const search = () => {
    const inputValue = document.querySelector('.form-input-value').value

    dictRow.innerHTML = ''

    /**
     * it is a async function , where we are fetching the data from external api, so to handle with promises we have used
     * async function, and await will make the funciton to wait untill the promise gets resolved, await can be used only in
     * async function
     */
    const getData = async() => {
    
        /**
         * try catch block used to handle errors
         */
    try {
        const resp = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${inputValue}`)

        if(!resp.ok){
            const errMsg = `An error occured '${resp.status}' '${resp.statusText}'`
            throw new Error(errMsg)
        }
        const data = await resp.json()
        const dataObj = data.map((item)=>{
            /**
             * destructuring objects, so that we can use them without dot notation
             */
            const {word, phonetics, meanings} = item
            const {text, audio} = phonetics[0]
            
            /**
             * this div displays the searched word, its phonetics and audio which can be played
             */
            dictRow.innerHTML += `
                <div class="col-12 mt-3 dict-container">
                <div class='heading'>
                    <div>
                        <h3>${word}</h3>
                        <p>${text}</p>
                    </div>
                    <audio controls>
                        <source src=${audio} type="audio/mpeg">
                    </audio>
                </div>
                    <h5>Definitions of ${word}</h5>
                    <ol class="def-list">
                        
                    </ol>
                </div>
            `

            const defList = document.querySelector('.def-list')

            const meaningData = meanings.map((arr2)=>{
                /**
                 * this displays the meaning for that word in exclamation, verb and noun with examples
                 */
                defList.innerHTML += `
                    <li>
                        <h6>${arr2.partOfSpeech}</h6>
                        <p>: ${arr2.definitions[0].definition}</p>
                        <p class="example">"${arr2.definitions[0].example}"</p>
                    </li>
                `
            })
        })
        } catch(error) {
            /**
             * displays error message in the window when there is no such word, so that error has occured
             */
            dictRow.innerHTML = `
                <h5 class="mt-3 err-msg">No results found, please check your spelling</h5>
            `
        }
    }
    getData()

    document.querySelector('.form-input-value').value = ''
}





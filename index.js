import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSettings = {
    databaseURL: "https://realtime-database-28672-default-rtdb.europe-west1.firebasedatabase.app/"
}

const app = initializeApp(appSettings)
const database = getDatabase(app)
const shoppingListInDB = ref(database, "shoppingList")

const inputFieldEl = document.getElementById("input-field")
const addButtonEl = document.getElementById("add-button")
const clearButton = document.getElementById("clear-button")
const shoppingListEl = document.getElementById("shopping-list")

addButtonEl.addEventListener("click", function () {
    let inputValue = inputFieldEl.value

    //push input field value to db
    push(shoppingListInDB, inputValue)

    clearInputFieldEl()
})

clearButton.addEventListener("dblclick", function () {
    // create path to db
    let shoppingListDbLocation = ref(database, `shoppingList`)

    // remove everything from db
    remove(shoppingListDbLocation)
})

// listening for "Enter" press
inputFieldEl.addEventListener("keyup", function (e) {
    if (e.key === "Enter") {
        let inputValue = inputFieldEl.value

        //push input field value to db on "Enter" press
        push(shoppingListInDB, inputValue)

        clearInputFieldEl()
    }
})

//
onValue(shoppingListInDB, function (snapshot) {
    if (snapshot.exists()) {
        // [#lq34j3øl5hl2 {<-- ID}, Bread]
        let itemsArray = Object.entries(snapshot.val())

        // empty HTML shopping list
        clearShoppingListEl()

        // add new items form db back to HTML shopping list
        for (let i = 0; i < itemsArray.length; i++) {
            let currentItem = itemsArray[i]

            // add one item in HTML shopping list
            appendItemToShoppingListEl(currentItem)
        }
    } else {
        // nothing in db
        shoppingListEl.innerHTML = "No items here... yet"
    }
})

// clear HTML shopping list
function clearShoppingListEl() {
    shoppingListEl.innerHTML = ""
}

// clear input field text
function clearInputFieldEl() {
    inputFieldEl.value = ""
}


function appendItemToShoppingListEl(item) {

    // #lq34j3øl5hl2 {<-- ID}
    let itemID = item[0]

    //  Bread
    let itemValue = item[1]

    // newEl = <li></li>
    let newEl = document.createElement("li")

    // newEl = <li>Bread</li>
    newEl.textContent = itemValue

    // newEl = <li ondblclick={ funksjonenUnder() }>Bread</li>
    newEl.addEventListener("dblclick", function () {
        // finner tingen i db basert på id
        let exactLocationOfItemInDB = ref(database, `shoppingList/${itemID}`)

        // fjerner tingen
        remove(exactLocationOfItemInDB)
    })

    // add <li ondblclick={funksjonenOver() }>Bread</li> til HTML shopping liste
    shoppingListEl.append(newEl)
}
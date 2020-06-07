function populateUFs() {
    const ufSelect = document.querySelector("select[name=uf]")

    fetch("https://servicodados.ibge.gov.br/api/v1/localidades/estados")
        .then( res => res.json() )
        .then( states => {
            for( const state of states ) {
                ufSelect.innerHTML += `<option value="${state.id}">${state.nome}</option>`
            }
        } )
}

populateUFs()

function getCities() {
    const citySelect = document.querySelector("select[name=city]") //Forma 1
    const stateInput = document.querySelector("[name=state]") //Forma 2

    const ufValue = event.target.value
    const indexOfSelectedState = event.target.selectedIndex

    stateInput.value = event.target.options[indexOfSelectedState].text

    const url = `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${ufValue}/municipios`

    citySelect.innerHTML = "<option value>Seleccione cidade</option>"
    citySelect.disabled = true
   
    fetch(url)
        .then( res => res.json() )
        .then( cities => {
            
            for( const city of cities ) {
                citySelect.innerHTML += `<option value="${city.nome}">${city.nome}</option>`
            }
            citySelect.disabled = false
        } )
}

document
    .querySelector("select[name=uf]")
    .addEventListener("change", getCities )

   
   
// items de coleta 
// todos os li's

const itemsToCollect = document.querySelectorAll(".items-grid li")

for (const item of itemsToCollect) {
    item.addEventListener("click", handleSelectedItem)
    
}

const collectedItems = document.querySelector("input[name=items]")
let selectedItems = []

function handleSelectedItem(event) {
    const itemLi = event.target
    
    //add or remove a class with javascript
    itemLi.classList.toggle("selected")

    const itemId = event.target.dataset.id 

    

    //verificar se existem items seleccionados se sim
    //pegar os items seleccionados

    const alreadySelected = selectedItems.findIndex( item => {
        const itemFound = item == itemId // sera true ou false
        return itemFound
    })
    

    //se ja estiver seleccionado tirar da seleccao

    if (alreadySelected >= 0 ){
        // tirar da selecccao
        const filteredItems = selectedItems.filter ( item => {
            const itemIsDifferent = item !== itemId //false
            return itemIsDifferent
        })

        selectedItems = filteredItems

    } else { 
        
        //se nao estiver seleccionado adicionar a seleccao

        selectedItems.push (itemId)
    }

    //actualizar o campo escondido com os items seleccionados
    collectedItems.value = selectedItems
    
}




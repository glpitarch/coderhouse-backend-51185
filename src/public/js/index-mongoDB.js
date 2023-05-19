
let navbarProducts = document.getElementById('navbarProducts')
let advancedSearchButton = document.getElementById('advancedSearchButton')

const changeDisplayDropdownMenu = (id) => {
    let data = document.getElementById(id)
        if (data.classList.contains('hidden')) {
            data.classList.remove('hidden')
            data.classList.add('appearDropdown')
        } else {
            data.classList.remove('appearDropdown')
            data.classList.add('hidden')
        }
}

const changeDisplay = (id) => {
    let data = document.getElementById(id)
        if (data.classList.contains('hidden')) {
            data.classList.remove('hidden')
            data.classList.add('block')
        } else {
            data.classList.remove('block')
            data.classList.add('hidden')
        }
}

let advancedFilter = `http://localhost:8080/products?`
const urlFilterCreator = () => {
    let searchButton = document.getElementById('searchButton')
    let checkboxPrice = document.getElementById('checkboxPrice').checked
    let checkboxStock = document.getElementById('checkboxStock').checked
    let checkboxProductName = document.getElementById('checkboxProductName').checked
    let checkboxPrcheckboxCategory = document.getElementById('checkboxCategory').checked
    if (checkboxPrice & (!checkboxStock & !checkboxProductName & !checkboxPrcheckboxCategory)) {
        let minValuePriceRange = document.getElementById('minValuePriceRange').value
        let maxValuePriceRange = document.getElementById('maxValuePriceRange').value
        advancedFilter += `query={%22price%22%3A{%22%24gte%22%3A${minValuePriceRange},%22%24lte%22%3A${maxValuePriceRange}}}&`
    }
    if (checkboxStock) {
        let minValueStockRange = document.getElementById('minValueStockRange').value
        let maxValueStockRange = document.getElementById('maxValueStockRange').value
        advancedFilter += `query={%22stock%22%3A{%22%24gte%22%3A${minValueStockRange},%22%24lte%22%3A${maxValueStockRange}}}&`
    }
    console.log(advancedFilter)
    window.location.href = advancedFilter
}

const showValue = () => {
    let minValuePriceRange = document.getElementById('minValuePriceRange').value
    document.getElementById('minValuePrice').innerHTML = minValuePriceRange

    let maxValuePriceRange = document.getElementById('maxValuePriceRange').value
    document.getElementById('maxValuePrice').innerHTML = maxValuePriceRange

    let minStockPriceRange = document.getElementById('minValueStockRange').value
    document.getElementById('minValueStock').innerHTML = minStockPriceRange

    let maxStockPriceRange = document.getElementById('maxValueStockRange').value
    document.getElementById('maxValueStock').innerHTML = maxStockPriceRange
  }

navbarProducts.addEventListener("click", () => { changeDisplayDropdownMenu('dropdownCategoryMenu') });
advancedSearchButton.addEventListener("click", () => { changeDisplay('advancedSearchBarContainer') });
searchButton.addEventListener("click", () => { urlFilterCreator() });
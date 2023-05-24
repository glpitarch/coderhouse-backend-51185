
let navbarProducts = document.getElementById('navbarProducts')
let advancedSearchButton = document.getElementById('advancedSearchButton')

const addClass = (id, className) => {
    let data = document.getElementById(id)
    data.classList.add(className)
}

const removeClass = (id, className) => {
    let data = document.getElementById(id)
    data.classList.remove(className)
}

const changeClass = (id, className1, className2) => {
    let data = document.getElementById(id)
    if (data.classList.contains(className1)) {
        data.classList.remove(className1)
        data.classList.add(className2)
    } else {
        data.classList.remove(className2)
        data.classList.add(className1)
    } 
}

const changeClasses = (id, className1, className2, option, className3, className4) => {
    if (option === 0) {
        changeClass(id, className1, className2)  
    }
    else if (option === 1) {
        changeClass(id, className1, className2)
        changeClass(id, className3, className4) 
    }
}

let advancedFilter = `http://localhost:8080/products?`
const urlFilterCreator = () => {
    let checkboxProductName = document.getElementById('checkboxProductName').checked
    let productName = document.getElementById('productNameInput').value

    let checkboxPrice = document.getElementById('checkboxPrice').checked
    let minValuePriceRange = document.getElementById('minValuePriceRange').value
    let maxValuePriceRange = document.getElementById('maxValuePriceRange').value

    let checkboxStock = document.getElementById('checkboxStock').checked
    let minValueStockRange = document.getElementById('minValueStockRange').value
    let maxValueStockRange = document.getElementById('maxValueStockRange').value

    let checkboxCategory = document.getElementById('checkboxCategory').checked
    let productsCategoryName = document.getElementById('productsCategory').value

    if (checkboxProductName) {
        advancedFilter += `query={%22title%22%3A%22${productName}%22}`
    }
    if (checkboxPrice && (!checkboxStock && !checkboxProductName && !checkboxCategory)) {
        advancedFilter += `query={%22price%22%3A{%22%24gte%22%3A${minValuePriceRange},%22%24lte%22%3A${maxValuePriceRange}}}`
    }
    if (checkboxStock && (!checkboxPrice && !checkboxProductName && !checkboxCategory)) {
        advancedFilter += `query={%22stock%22%3A{%22%24gte%22%3A${minValueStockRange},%22%24lte%22%3A${maxValueStockRange}}}`
    }
    if (checkboxCategory && (!checkboxPrice && !checkboxProductName && !checkboxStock)) {
        advancedFilter += `query={%22category%22%3A%22${productsCategoryName}%22}`
    }

    if (checkboxPrice && checkboxStock && (!checkboxProductName && !checkboxCategory)) {
        advancedFilter += `query={%22stock%22%3A{%22%24gte%22%3A${minValueStockRange},%22%24lte%22%3A${maxValueStockRange}},%22price%22%3A{%22%24gte%22%3A${minValuePriceRange},%22%24lte%22%3A${maxValuePriceRange}}}`
    }
    if (checkboxCategory && checkboxStock && (!checkboxProductName && !checkboxPrice)) {
        advancedFilter += `query={%22category%22%3A%22${productsCategoryName}%22,%22stock%22%3A{%22%24gte%22%3A${minValueStockRange},%22%24lte%22%3A${maxValueStockRange}}}`
    }
    if (checkboxCategory && checkboxPrice && (!checkboxProductName && !checkboxStock)) {
        advancedFilter += `query={%22category%22%3A%22${productsCategoryName}%22,%22price%22%3A{%22%24gte%22%3A${minValuePriceRange},%22%24lte%22%3A${maxValuePriceRange}}}`
    }

    if (checkboxPrice && checkboxStock && checkboxCategory && (!checkboxProductName)) {
        advancedFilter += `query={%22category%22%3A%22${productsCategoryName}%22,%22stock%22%3A{%22%24gte%22%3A${minValueStockRange},%22%24lte%22%3A${maxValueStockRange}},%22price%22%3A{%22%24gte%22%3A${minValuePriceRange},%22%24lte%22%3A${maxValuePriceRange}}}&&`
    }

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

navbarProducts.addEventListener("mouseover", () => { changeClass('dropdownCategoryMenu','hidden', 'absolute')});
advancedSearchButton.addEventListener("click", () => { changeClass('advancedSearchBarContainer', 'hidden', 'block') });
searchButton.addEventListener("click", () => { urlFilterCreator() });
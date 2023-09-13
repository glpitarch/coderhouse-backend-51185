const navbarProducts = document.getElementById('navbarProducts')
const advancedSearchButton = document.getElementById('advancedSearchButton')
const addProductButtons = document.querySelectorAll('[id^="addButton-"]')

addProductButtons.forEach(button => {
  button.addEventListener('click', () => {
        const getCartId = document.getElementById('cartId')
        const cartId = getCartId.getAttribute('data-cart-id')
        const productId = button.getAttribute('data-product-id')
            fetch(`/api/carts/${cartId}/product/${productId}`, {
            method: 'POST'
            })
            .then(response => {
                if (response.ok) {
                window.location.replace('/cart')
                } else {
                    throw new Error('An error has occurred trying to add a product to your cart')
                }
            })
            .catch(error => {
                alert(error)
                console.log(error)
            })
    })
})

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
    let checkboxSortAsc = document.getElementById('checkboxSortAsc').checked
    let checkboxSortDesc = document.getElementById('checkboxSortDesc').checked

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
    if (checkboxSortAsc) {
        advancedFilter += `&sort=asc`
    }
    if (checkboxSortDesc) {
        advancedFilter += `&sort=desc`
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

navbarProducts.addEventListener("click", () => { changeClass('dropdownCategoryMenu','hidden', 'block')})
advancedSearchButton.addEventListener("click", 
    () => { 
        let advancedSearchBarContainer = document.getElementById('advancedSearchBarContainer')
        let hiddenStatus = advancedSearchBarContainer.classList.contains('hidden')
        let blockStatus = advancedSearchBarContainer.classList.contains('block')
        let appearStatus = advancedSearchBarContainer.classList.contains('ani-appear')
        let disappearStatus = advancedSearchBarContainer.classList.contains('ani-disappear')
        if (blockStatus === true && appearStatus === true) {
            advancedSearchBarContainer.classList.remove('ani-appear')
            advancedSearchBarContainer.classList.add('ani-disappear')
            setTimeout(() => {
                changeClass('advancedSearchBarContainer', 'block', 'hidden') 
            }, 2000)

        } else if (blockStatus === true && disappearStatus === true) {
            changeClass('advancedSearchBarContainer', 'block', 'hidden') 
            advancedSearchBarContainer.classList.remove('ani-disappear')
            advancedSearchBarContainer.classList.add('ani-appear') 

        } else if (hiddenStatus === true && disappearStatus === true) {
            changeClass('advancedSearchBarContainer', 'hidden', 'block')
            advancedSearchBarContainer.classList.remove('ani-disappear')
            advancedSearchBarContainer.classList.add('ani-appear')
        }
        else if (hiddenStatus === true) {
            changeClass('advancedSearchBarContainer', 'hidden', 'block')
            advancedSearchBarContainer.classList.add('ani-appear')
        }
    }
)
searchButton.addEventListener("click", () => { urlFilterCreator() })


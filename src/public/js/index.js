let productsCategory = document.getElementById('productsCategoryList')
let productsNav = document.getElementById('productsNav')

const changeDisplay = (id) => {
    let data = document.getElementById(id)
        if (data.classList.contains('hidden')) {
            data.classList.remove('hidden')
            data.classList.add('appear')
        } else {
            data.classList.remove('appear')
            data.classList.add('hidden')
        }
}

productsNav.addEventListener("click", () => { changeDisplay('productsCategoryList') });
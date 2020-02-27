
$(document).ready(() => {
    let div = document.getElementById('div-message');
    setTimeout(() => {
        if (div) {
            document.getElementById('div-message').remove();
        }

    }, 10000)
});
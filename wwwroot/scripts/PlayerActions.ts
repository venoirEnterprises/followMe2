
function surrender() {

    $.post('/player/surrender', { username: localStorage.getItem("username") })
        .fail(function () {
            console.log("person surrender error");
        })
}
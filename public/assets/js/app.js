$(document).ready(function(){
    $('.collapsible').collapsible();

    $(document).on("submit", ".commentForm", function(){
        let id = $(this).attr("data-id");

        $.ajax({
            method: "POST",
            url: "/article/" + id,
            data: {
                text: $("#" + id).val()
            }
        }).then(function(data){
            console.log(data);
        })
    })

    $(document).on("click", ".delete", function(){
        let id = $(this).attr("data-id");

        $.ajax({
            method: "DELETE",
            url: "/comment/" +id
        }).then(function(){
            console.log("comment deleted")
            location.reload();
        })
    })



})
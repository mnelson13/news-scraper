$(document).ready(function(){
    $('.collapsible').collapsible();
    $('.sidenav').sidenav();

    //appends either an open heart or closed heart underneath each article picture based on if saved is === or !== true
    $.ajax({
        method: "GET",
        url: "/populated"
    }).then(function(data){
        data.forEach(
            function(result){
        
            if (result.saved === false) {
                $('[data-imgid="' + result._id + '"]').append('<i data-id=' + result._id + ' class="material-icons notSelected">favorite_border</i>');
            } else {
                $('[data-imgid="' + result._id + '"]').append('<i data-id=' + result._id + ' class="material-icons selected">favorite</i>');
            }
        })
    })

    //updates an article to saved = true if selected
    $(document.body).on("click", ".notSelected", function(){
        $(this).text("favorite");
        $(this).removeClass("notSelected");
        $(this).addClass("selected");
        let id = $(this).attr("data-id");

        $.ajax({
            method: "GET",
            url: "/article/save/" + id
        }).then(function(data){
            location.reload();
        })
        
    });

    //updates an article to saved = false if selected
    $(document.body).on("click", ".selected", function(){
        $(this).text("favorite_border");
        $(this).removeClass("selected");
        $(this).addClass("notSelected");
        let id = $(this).attr("data-id");

        $.ajax({
            method: "GET",
            url: "/article/unsave/" + id
        }).then(function(data){
            location.reload();
        })
        
        
    });

    //creates a new comment
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
            location.reload();
        })
    })

    //deletes a comment
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

    //scrapes for new articles
    $(document).on("click", ".scrape", function(){
        $.ajax({
            method: "GET",
            url: "/scrape"
        }).then(function(data){
            location.reload()
        })
    })



})
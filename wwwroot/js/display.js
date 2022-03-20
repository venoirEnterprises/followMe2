$(function () {
    $(".hideDetail").hide();
    var boxToHide = ""

    $(".linkShow").mouseover(function () {
        boxToHide = this.id + "box";
        $("#" + boxToHide).mouseleave(hidethis)
        $("#" + this.id + "Detail").show("");
    })

    //"blur,mouseout"
    

    function hidethis() {
        //alert(this.id)
        $(".hideDetail").hide("slow");
    }


    var url = window.location.href.toLocaleLowerCase();
    var homeurl = "../Welcome"
    if (((url.match(/\//g) || []).length) === 5) {
        homeurl = "../../../Welcome"
    }
    $("#typeContent").css("width", "80%")
    $("#typeListNovel").hide();
    $("#typeListIndex").hide();
    $("#dataCore_type").val("Ages")
    $("#typeContent").val("<hr/><section></section>")
    $("#dataCore_header").change(function () {
        if ($("#dataCore_header").val() === "Novels") {
            $("#typeListNovel").show();
            $("#typeListContent").hide();
            $("#typeListIndex").hide();
            $("#dataCore_type").val("battalionsOfHorror")
        }
        if ($("#dataCore_header").val() === "Index") {
            $("#typeListNovel").hide();
            $("#typeListContent").hide();
            $("#typeListIndex").show();
            $("#dataCore_type").val("Index")
        }
        if ($("#dataCore_header").val() !== "Index" &&
            $("#dataCore_header").val() !== "Novels") {
            $("#typeListNovel").hide();
            $("#typeListContent").show();
            $("#typeListIndex").hide();
            $("#dataCore_type").val("Ages")
        }
    })

    $("#typeListContent").change(function () {
        $("#dataCore_type").val($("#typeListContent").val())
    })
    $("#typeListNovel").change(function () {
        $("#dataCore_type").val($("#typeListNovel").val())
    })

    var type = $("#typeContent").val();

    //HTML additions
    $("#addDeclaredType").click(function () {

        if ($("#addType").val() === "Section") {
            type = type.substring(0, type.length - 10);
            type += "</section><hr/><section></section>"
            $("#typeContent").val(type);
        }
        else {
            $("#done").show().attr("class", "").addClass($("#addType").val());
            $("#contentForEditing").attr("class", "").show();
            if ($("#addType").val() === "Paragraph") {
                $("#linkAdd").attr("class", "").show();
                $("#imageAdd").attr("class", "").show();
                $("#imageEditing").show();
            }
            else {
                $("#imageAdd").hide();
                $("#linkAdd").hide();
            }
        }
    })

    $("#linkAdd").click(function () {
        $("#headerDescription").attr("class", "").show();
        $("#typeDescription").attr("class", "").show();
        $("#titleDescription").attr("class", "").show();
        $("#linkCheck").attr("class", "").show();
    })

    $("#linkCheck").click(function () {
        $.getJSON(homeurl + "/isThisURLValid", {
            header: $("#headerDescription").val().toLocaleLowerCase(),
            type: $("#typeDescription").val().toLocaleLowerCase(),
            title: $("#titleDescription").val().toLocaleLowerCase()
        },
        function (data) {

            if (data === false || data === "") {
                $("#urlInvalid").attr("class", "").show();
            }
            else {
                $("#urlInvalid").hide();
                var content = $("#contentForEditing").val()
                content += data;
                $("#contentForEditing").val(content);
            }
        }
    );
    });

    //DONE

    $("#done").click(function () {
        switch ($("#done").attr("class")) {
            case "Section":
                //this is done above, there is no content for sections
                break;
            case "Title":
                type = type.substring(0, type.length - 10);
                type += "<h4>" + $("#contentForEditing").val() + "</h4>"
                break;
            case "Paragraph":
                type = type.substring(0, type.length - 10);
                type += "<p>" + $("#contentForEditing").val() + "</p>"
                break;
        }
        type += "</section>"
        $("#headerDescription").hide().val("")
        $("#imageEditing").hide();
        $("#typeDescription").hide().val("")
        $("#titleDescription").hide().val("")
        $("#linkCheck").hide();
        $("#typeContent").val(type);
        $("#done").attr("class", "");
        $("#contentForEditing").hide().val("");
        $("#done").hide();
        $("#linkAdd").hide();
    })


    $("#imageAdd").click(function () {
        $("#addImageFrom").attr("class", "").show();
        $("#filePreview").attr("class", "").show();
        $("#imageCheckingButton").attr("class", "").show();

    })

})
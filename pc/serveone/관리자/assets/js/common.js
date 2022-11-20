$(function () {
    // GNB
    $("header .gnb button.active").next("ul").addClass("active");
    $("header .gnb button").on("click", function(){
        if($(this).hasClass("active")){
            $(this).removeClass("active");
            $(this).next("ul").stop().slideUp(500);
        }else{
            $("header .gnb button").removeClass("active");
            $("header .gnb ul").stop().slideUp(500);
            $(this).addClass("active");
            $(this).next("ul").stop().slideDown(500);
        }
    });

    // close modal on click dimLayer
    $(document).on("click", "#mainDimLayer", function () {
        closeModal();
    });

    // 모달 닫기(공통)
    $(document).on("click", ".close_modal", function () {
        closeModal();
    });

    /* 공통 alert, confirm 관련 */
    // 공통 alert, confirm 모달 닫기(X버튼, 취소버튼)
    $(".modal_wrap").on("click", ".delete_modal", function () {
        action_popup.close(this);
        // 220614 추가
        $(".modal_wrap.mini").removeClass("active");

		$(".subDimLayer").remove();
		$("body").removeClass("fixed");
    });

    // datepicker
    if ($("#datepickerToggle, #datepickerToggle2, #datepickerToggle3, #datepickerToggle4").length > 0) {
        $("#datepickerToggle, #datepickerToggle2, #datepickerToggle3, #datepickerToggle4").datepicker({
            language: 'ko',
            autoClose: true
        });
    }

    // if ($("#datepickerMultiple").length > 0) {
    //     $("#datepickerMultiple").datepicker({
    //         language: 'ko',
    //         autoClose: true,
    //         onSelect : function(formatDate, date, inst){
    //             if(formatDate.indexOf(" ~ ") > -1){
    //                 inst.hide();
    //             }
    //         }
    //     });
    // }
});

// addnDimLayer
function addnDimLayer() {
    var createDiv = "<div id='mainDimLayer'></div>";
    $("body").append(createDiv).addClass("fixed");
}

// addnSubDimLayer
function addnSubDimLayer() {
    var createDiv = "<div class='subDimLayer'></div>";
    $("body").append(createDiv).addClass("fixed");
}

// closeModal
function closeModal() {
    $(".modal_wrap").removeClass("active");
    $("#mainDimLayer").remove();
    $("body").removeClass("fixed");
}

/**
 *  공통 alert, confirm 관련
 *  alert, confirm 대용 팝업 메소드 정의 <br/>
 *  timer : 애니메이션 동작 속도 <br/>
 *  alert : 경고창 <br/>
 *  confirm : 확인창 <br/>
 *  open : 팝업 열기 <br/>
 *  close : 팝업 닫기 <br/>
 **/
// alert and confirm common
var action_popup = {
    timer: 300,
    // confirm 모달
    confirm: function (txt, callback, title) {
        // 텍스트 없을경우(유효성 검증)
        if (txt == null || txt.trim() == "") {
            console.warn("confirm message is empty.");
            return;
            // 콜백 정의 검증
        } else if (callback == null || typeof callback != "function") {
            console.warn("callback is null or not function.");
            return;
            // 정상인 경우
        } else {
            $(".confirm .btn_ok").on("click", function () {
                $(this).unbind("click"); // 기존 모달 위에 띄울 경우 중복 확인 동작 방지
                callback(true);
                action_popup.close(this);
            });
            this.open("confirm", txt, title);
        }
    },

    // alert 모달
    alert: function (txt, title) {
        if (txt == null || txt.trim() == "") {
            console.warn("confirm message is empty.");
            return;
        } else {
            this.open("alert", txt, title);
        }
    },

    // alert or confirm 구분해서 열기
    open: function (type, txt, title) {
        var popup = $("." + type);
        popup.find(".modal_text").empty().append(txt);
        if(title != null && title.trim() != ""){
            popup.find(".modal_header strong").empty().append(title);
        }

        addnSubDimLayer();
        $(".subDimLayer").css("height", $(document).height()).attr("target", type);
        popup.fadeIn(this.timer);
    },

    // alert or confirm 구분해서 닫기
    close: function (target) {
        var modal = $(target).closest(".modal_wrap");
        var dimLayer;
        if (modal.hasClass("confirm")) {
            dimLayer = $(".subDimLayer[target=confirm]");
        } else if (modal.hasClass("alert")) {
            dimLayer = $(".subDimLayer[target=alert]");
        } else {
            console.warn("close unknown target.");
            return;
        }
        modal.fadeOut(this.timer);
        $(".confirm .btn_ok").unbind("click");
        setTimeout(function () {
            dimLayer != null ? dimLayer.remove() : "";
            // 220614 삭제 closeModal();
            if($(target).hasClass("btn_ok")) closeModal();
        }, this.timer);
    },
};
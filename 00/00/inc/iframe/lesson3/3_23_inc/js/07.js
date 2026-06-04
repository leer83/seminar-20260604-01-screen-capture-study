// preload image
/* (function () {
    const url = `3_23_inc/images/07/`;
    imgPreLoad([
        `${url}image.png`,
    ], true);
})(); */

// preload audio
/* audioPreLoad(['07_01', '07_02', '07_03'], function () {
}); */
//-----------------------

// next, prev, dot 클릭
/*
$(document).on('click', '.navigation .prev, .navigation .next, .navigation .dot', function () {
    var idx = pageCon1.currentPage;
    var page = pageCon1.wrap.find('.page').eq(idx);
    contentScript(idx, page);
});
*/

this.initContentsIn = function () {
};

this.resetPopIn = function () {
};

this.resetContentsIn = function () {
};

function contentScript(_idx, _content) {
    if (typeof (videoCon) !== 'undefined') { videoCon.stop(); }
    if (typeof (resetPopIn) !== 'undefined') { resetPopIn(); }
    if (typeof (resetContentsIn) !== 'undefined') { resetContentsIn(); }

    switch (contentsIdx) {
        case 0:
            const pageCon1 = new pageingContents(contents.find('.contentbox'))
            pageCon1.init();

            pageCon1.wrap.find('.pageing .dot').on('click', function () {
                pageConEvent_1(pageCon1.page.eq(pageCon1.currentPage));
                contents.attr('data-page', pageCon1.currentPage);
            });
            pageConEvent_1(pageCon1.page.eq(0));

            // 바로 이동 처리
            (function () {
                if (typeof (goPage) === 'undefined') {
                    return;
                }
                $('.contentsWrap').css('opacity', 0);

                pageCon1.currentPage = goPage;
                pageCon1.pageMove(pageCon1.currentPage);
                effectAdo_stop($(`#${pageCon1.effectSnd}`));
                // pageCon1.btnWrap.addClass('dis');
                pageCon1.next.off();
                pageCon1.prev.off();
                pageCon1.navi.off();
                pageCon1.dot.off();
                pageConEvent_1(pageCon1.page.eq(pageCon1.currentPage));
                contents.attr('data-page', pageCon1.currentPage);

                // UI통신
                // connViewer(pageCon1.btn);

                $('.contentsWrap').removeAttr('style');
            })();
            break;
        case 1:
            break;
        case 2:
            break;
    }
}


function pageConEvent_1(_page) {
    // console.log(_page.index())
    switch (_page.index()) {
        case 0:
            break;
        case 1:
            break;
        case 2:
            break;
        case 3:
            const conSet1 = new contentsSet(_page);
            conSet1.clickCon(1);
            conSet1.onClick = function () {
                effectAdo('click');
            };
            conSet1.onShowAns = function () {
                effectAdo('confirm');
            };
            conSet1.onReset = function () {
                effectAdo('confirm');
            };
            break;
    }
}

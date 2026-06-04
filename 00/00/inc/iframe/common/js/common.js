// 기본, 과목 공통 기능, 과목 개별 기능, 기타
/* ───────────────────────────────────────────────────────┐
 * file name : common.js
 * description : YBM 2025 실과 5,6학년 차시창 공용코드 모음
 * create date : 2025-05-30 17:54:14
 * creator : JGY
 * modify:
 * usage:
└────────────────────────────────────────────────────── */

// 개발버전
const VERSION = 'v1.0 - 2025-05-30 18:08:06';

// js common의 경로
const COMM_PATH = '../../common/';
const COMM_IMG_PATH = '../../common/images/';
const COMM_IMG_SCI_PATH = '../../common/images/kor/';

const windowTop = $(window);
const docTop = $(document);
const bodyTop = $('body');
const containerTop = $('#container');
const containerTopId = containerTop.attr('id');
const wrapTop = $('#wrap');
const wrapTopId = wrapTop.attr('id');
const wrapW = wrapTop.width();
const wrapH = wrapTop.height();


let videoCon;

let rootTimer = -1;
let rootTimer0 = -1;

var popCloseClick = undefined;  // 팝업 닫기시 callback

const sInputEvt = 'focusin propertychange change keyup paste input';












var colorList = [
    "#FDBB38",
    "#F8CADB",
    "#A9CE0D",
    "#5FCBD6",
    "#B6A3CE",
    "#A8A8A8",
];

/* =========================================================================================
 * 기본
 * ====================================================================================== */
/* ---------------------------------------
 * 사용자 환경
 * --------------------------------------- */
// 사용자 환경 구분
var user;       // 사용자 환경
var browser;    // 사용 browser
(function () {
    var ua = navigator.userAgent.toLowerCase();
    if (ua.indexOf('iphone') > 0 || ua.indexOf('android') > 0 && ua.indexOf('mobile') > 0) {

        if (ua.indexOf('iphone') > 0) user = 'ios';
        if (ua.indexOf('android') > 0) user = 'android';

    } else if (ua.indexOf('ipad') > 0 || ua.indexOf('mac') > 0 || ua.indexOf('android') > 0) {

        if (ua.indexOf('ipad') > 0 || ua.indexOf('mac') > 0) user = 'ios';
        if (ua.indexOf('android') > 0) user = 'android';

    } else {

        if (ua.indexOf('edge') > -1) {
            browser = 'edge';
        } else if (ua.indexOf('whale') > -1) {
            browser = 'whale';
        } else if (ua.indexOf('chrome') > -1) {
            browser = 'chrome';
        } else if (ua.indexOf('firefox') > -1) {
            browser = 'firefox';
        } else {
            browser = 'ie';
        }
        user = 'pc';
        if (ua.indexOf('Windows 7') > -1 || ua.indexOf('Windows NT 6.1') > -1) {
            $('#wrap').addClass('win7');
        }
    }
    $('#wrap').addClass(user + ' ' + browser);
})();
/*
console.warn('+++ user: ', user);
console.warn('+++ browser: ', browser);
console.warn('----------');
*/

var isMobile,downEvent,moveEvent,upEvent,clickEvent;
function getScale() {

    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        isMobile = true;

        downEvent = "touchstart";
        moveEvent = "touchmove";
        upEvent = "touchend";
        clickEvent = "tap";
    } else {
        isMobile = false;

        downEvent = "mousedown";
        moveEvent = "mousemove";
        upEvent = "mouseup";
        clickEvent = "click";
    }
    // var wrap = document.querySelector('.Page');
    var wrap = document.querySelector('#wrap');

    GameManager.event.clientWidth = document.body.clientWidth;
    GameManager.event.clientHeight = document.body.clientHeight;

    GameManager.event.wrapWidth = wrap.clientWidth;
    GameManager.event.wrapHeight = wrap.clientHeight;

    GameManager.event.zoomVertical = (GameManager.event.clientHeight / GameManager.event.wrapHeight) * 1.0;
    GameManager.event.zoomHorizontal = (GameManager.event.clientWidth / GameManager.event.wrapWidth) * 1.0;

    /* if (parent.ZOOMVALUE == undefined) {
        parent.ZOOMVALUE = 1;
    }
    if (GameManager.event.clientHeight < GameManager.event.clientWidth) {
        factor = GameManager.event.zoomRate = parent.ZOOMVALUE;
    } else {
        factor = GameManager.event.zoomRate = GameManager.event.zoomHorizontal;
    }

    factor = parent.ZOOMVALUE; */

    if (FORTEACHERCD) {
        factor = FORTEACHERCD.responsive.baseContainerSize.zoom;
    }
}


/* ---------------------------------------
 * 재정의
 * --------------------------------------- */
// requestAnimationFrame 재정의
window.requestAnimationFrame = function () {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||

        function (callback) {
            window.setTimeout(callback, 1000 / 60);
        };
}();
// cancelAnimationFrame 재정의
window.cancelAnimationFrame = (function () {
    return window.cancelAnimationFrame ||
        window.webkitCancelAnimationFrame ||
        window.mozCancelAnimationFrame ||
        window.oCancelAnimationFrame ||
        window.msCancelAnimationFrame ||
        function (id) {
            window.clearTimeout(id);
        };
})();

// transition & animation
var sTransitionStart = 'transitionstart webkitTransitionStart oTransitiStart otransitionstart';
var sTransitionCancel = 'transitioncancel webkitTransitionCancel oTransitionCancel otransitioncancel';
var sTransitionEnd = 'transitionend webkitTransitionEnd oTransitionEnd otransitionend MSTransitionEnd';

var sAnimationStart = 'webkitAnimationStart mozAnimationStart MSAnimationStart onanimationstart animationstart';
var sAnimationCancel = 'webkitAnimationCancel mozAnimationCancel MSAnimationCancel onanimationcancel animationcancel';
var sAnimationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd onanimationend animationend';

/* ---------------------------------------
 * 설정
 * --------------------------------------- */

//* 2023-12-15 16:31:12 - JGY : jQuery 3.x mobile에서 실행순서가 뒤죽박죽됨
// $(function () { });

// javascript로 처리. 모든 환경에서 가장 먼저 실행됨
docTop[0].addEventListener('DOMContentLoaded', initDomReady, false);
/* async */ function initDomReady() {
    docTop[0].removeEventListener('DOMContentLoaded', initDomReady);

    // Font Preloading
    wrapTop.prepend(`
        <div id="cFontPreload">
            <i class="dump dump1 font_jalnan">a</i>
            <i class="dump dump2 font_baskin">b</i>
            <i class="dump dump3 font_nanums">c</i>
            <i class="dump dump4 font_nanumsqbold">d</i>
            <i class="dump dump5 font_nanumg">e</i>
            <i class="dump dump6 font_maple">f</i>
            <i class="dump dump7 font_goyang">g</i>
            <i class="dump dump8 font_recipe">h</i>
            <i class="dump dump9 font_katuri">i</i>
            <i class="dump dump10 font_kopup">j</i>
            <i class="dump dump11 font_bmjua">k</i>
            <i class="dump dump12 font_han">l</i>
            <!--
            <i class="dump dump13">m</i>
            <i class="dump dump14">m</i>
            <i class="dump dump15">o</i>
            <i class="dump dump16">p</i>
            <i class="dump dump17">q</i>
            <i class="dump dump18">r</i>
            <i class="dump dump19">s</i>
            <i class="dump dump20">t</i>
            <i class="dump dump21">u</i>
            <i class="dump dump22">v</i>
            <i class="dump dump23">w</i>
            <i class="dump dump24">x</i>
            <i class="dump dump25">y</i>
            <i class="dump dump26">z</i>
            -->
        </div>
    `);
    return;

    // 배경 이미지 프리로드
    if (wrapTop.find('#cimgPreload').length < 1) {
		wrapTop.prepend('<div id="cimgPreload"></div>');
	}
	wrapTop.find('#cimgPreload').css({
		'opacity': 0.01,
		'width': '100%',
		'height': '100%',
		'position': 'absolute',
		'z-index': -999,
		'transform': 'scale(0.01)'
    });

    let bgImgNone = [];

    wrapTop.find('.contents').each(function (i) {
        var b = $(this).css('background-image');
        if (b === 'none') {
            bgImgNone.push($(this).getSelector()[0]);
        }
        if (b === 'none') {
            return true;
        }
        b = b.split('/');
        var imgSrc = 'inc/images/' + b[b.length - 2] + '/' + b[b.length - 1].split('.')[0] + '.png';
        wrapTop.find('#cimgPreload').append('<div style=background-image:url(' + imgSrc + ')>');
    });

	wrapTop.find('.pageWrap .page').each(function (i) {
        var b = $(this).css('background-image');
        if (b === 'none') {
            bgImgNone.push($(this).getSelector()[0]);
        }
		b = b.split('/');
		var imgSrc = 'inc/images/' + b[b.length - 2] + '/' + b[b.length - 1].split('.')[0] + '.png';
		wrapTop.find('#cimgPreload').append('<div style=background-image:url(' + imgSrc + ')>');
	});

    wrapTop.find('.tabWrap .tab').each(function (i) {
        var b = $(this).css('background-image');
        if (b === 'none') {
            bgImgNone.push($(this).getSelector()[0]);
        }
		b = b.split('/');
		var imgSrc = 'inc/images/' + b[b.length - 2] + '/' + b[b.length - 1].split('.')[0] + '.png';
		wrapTop.find('#cimgPreload').append('<div style=background-image:url(' + imgSrc + ')>');
	});

    /* wrapTop.find('.popup').each(function (i) {
        var b = $(this).css('background-image');
        if (b === 'none') {
            bgImgNone.push($(this).getSelector()[0]);
        }
		b = b.split('/');
		var imgSrc = 'inc/images/' + b[b.length - 2] + '/' + b[b.length - 1].split('.')[0] + '.png';
		wrapTop.find('#cimgPreload').append('<div style=background-image:url(' + imgSrc + ')>');
	}); */

    wrapTop.find('#cimgPreload div').css({
        'width': '100%',
        'height': '100%'
    });

    // missing background-image 출력
    if (bgImgNone.length > 0) {
        console.group('[ background-image missing ]');
        let bgImgNoneStr = '';
        bgImgNone.forEach(function (value, idx, self) {
            if (idx < bgImgNone.length - 1) {
                bgImgNoneStr += `${value}\n\n`;
            }
            else {
                bgImgNoneStr += `${value}`;
            }
        });
        console.log(bgImgNoneStr);
        console.groupEnd();
    }
}

// jQuery.getSelector
// https://stackoverflow.com/questions/2420970/how-can-i-get-selector-from-jquery-object
// use) $('#main').getSelector();
!(function ($, undefined) {
    /// adapted http://jsfiddle.net/drzaus/Hgjfh/5/

    var get_selector = function (element) {
        var pieces = [];

        for (; element && element.tagName !== undefined; element = element.parentNode) {
            if (element.className) {
                var classes = element.className.split(' ');
                for (var i in classes) {
                    if (classes.hasOwnProperty(i) && classes[i]) {
                        pieces.unshift(classes[i]);
                        pieces.unshift('.');
                    }
                }
            }
            if (element.id && !/\s/.test(element.id)) {
                pieces.unshift(element.id);
                pieces.unshift('#');
            }
            pieces.unshift(element.tagName);
            pieces.unshift(' > ');
        }

        return pieces.slice(1).join('');
    };

    $.fn.getSelector = function (only_one) {
        if (true === only_one) {
            return get_selector(this[0]);
        } else {
            return $.map(this, function (el) {
                return get_selector(el);
            });
        }
    };

})(window.jQuery);



var contentsAll;    // .contentsWrap > .contents
var contentsIdx;    // 현재 보고 있는 .contents의 index값
var contents;       // 현재 보고 있는 .contents

windowTop[0].initContentsIn = undefined;        // 개별 페이지마다 딱 한번만 실행
windowTop[0].resetPopIn = undefined;            // 개별 페이지내 resetPop
windowTop[0].resetContentsIn = undefined;       // 개별 페이지내 resetContent

// 사용 환경 설정
$(window).on('load', function () {

    getScale();

    // 기본 정보값 출력
    /* rootTimer = setTimeout(function () {
        let css = 'background: #f22; color: #333;';
        getScale();
        console.group('%c[environment]', css);
        console.log('user: ', user);
        console.log('browser: ', browser);
        console.log('version: ', VERSION);
        console.log('factor: ', factor);
        console.groupEnd();
    }, 500); */

    contentsAll = wrapTop.find('.contentsWrap').find('>.contents');
    contentsIdx = 0;
    contents = contentsAll.eq(contentsIdx);

    // 팝업
    initPop();

    // System UI와 통신용 처리
    if (wrapTop.find('ul.navi li').length > 0) {
        connViewer('dot');
        connViewer('navi');
    }

    // QR
    initQR();

    // 캐릭터 팝업
    initCharPop();

    contentsAll.eq(0).show();

    if (typeof (initContentsIn) !== 'undefined') {
        initContentsIn();
    }

    if (typeof contentScript !== 'undefined') {
        contentScript(0, contentsAll.eq(0));
    }


    // 최상단 탭
    let html = '';
    for (let i = 0; i < contentsAll.length; ++i) {
        html += `<li>${i + 1}</li>`;
    }
    wrapTop.find('.setContent').append(html);

    wrapTop.find('.setContent').attr({
        'data-page': 1,
        'data-total': contentsAll.length,
    });
    wrapTop.find('.setContent li').removeClass('on act');
    wrapTop.find('.setContent li').eq(0).addClass('on act');

    wrapTop.find('.setContent li').on('click', function (e) {

        $(this).siblings().removeClass('on act');
        $(this).addClass('on act');

        var idx = $(this).index();
        var content = contentsAll.eq(idx);

        if (content.is(':visible')) { return false; }
        // if (contentsIdx === idx) { return; }

        $(this).closest('.setContent').attr('data-page', idx + 1);
        $(this).siblings().removeClass('on act');
        $(this).addClass('on act');

        // resetPopCom();
        // resetContentsCom();
        resetContents();

         //* 2025-05-14 13:15:54 - JGY : 사용자의 직접 클릭에 의해서만 동작가능
		// effectAdo('click');
		if (isHuman(e) === true) {
			// effectAdo('click', false);
            effectAdo('click');
		}
		//*--------------------------------------------

        contentsIdx = idx;
        contents = wrapTop.find('.contents').eq(contentsIdx);

        contentsAll.hide();
        contents.show();

        contentScript(idx, contents);
    });

    // 과목별 처리
    // subjectFunction();

    // 우클릭 방지
    bodyTop.on('contextmenu', function () {
        return false;
    });

    // <img/> 드래그 방지
    wrapTop.find('img').each(function () {
        $(this).attr('ondragstart', 'return false'); //마우스 이벤트 삭제.
    });

    // pop & popup 닫기버튼 처리
    /*
    wrapTop.find('.closeBtn').on('click', function () {
        var pop = $(this).parent();
        if (pop.hasClass('popup')) {
            effectAdo('click', false);
            pop.hide();
            //$('.full_pop_bg').hide();
            removeMask();
        }
        else if (pop.hasClass('pop')) {
            effectAdo('click', false);
            pop.hide();
        }
    });
    */

    // 입력처리
    $('textarea, input').each(function () {
        if (!$(this).hasClass('nop')) {
            $(this).addClass('placeholder');

            $(this).on(sInputEvt, function () {
                $(this).removeClass('placeholder');
            });

            $(this).on('focusout blur', function () {
                var ksVal = $(this).val();
                if (ksVal.trim() === '') {
                    $(this).addClass('placeholder');
                }
                else {
                    $(this).removeClass('placeholder');
                }
            });
        }
    });

    // .navi 처리
    if ($('ul.navi').length > 0) {
        // 구성하고 있는 아이템요소의 개수 정리
        const $navi = $('ul.navi');
        const $cookie = $navi.find('li.cookie:not(.vdo):not(.etc)'); // 일반 페이지
        const $vdo = $navi.find('li.vdo');   // 영상
        const $etc = $navi.find('li.etc');   // 추가활동

        let cookieStr = '';
        if ($cookie.length > 0) {
            cookieStr = `n${$cookie.length}`;
        }

        let vdoStr = '';
        if ($vdo.length > 0) {
            vdoStr = `v${$vdo.length}`;
        }

        let etcStr = '';
        if ($etc.length > 0) {
            etcStr = `a${$etc.length}`;
        }

        let resultArr = [cookieStr, vdoStr, etcStr];
        let result = '';
        resultArr.forEach(function (value, idx, self) {
            if (value !== '') {
                result += value + '_';
            }
        });
        if (result.charAt(result.length - 1) === '_') {
            result = result.slice(0, -1);
        }
        $navi.attr('data-tp', result);


        // 최초 활성화 요소에 마크
        if ($cookie.filter('.on').length > 0) {
            $cookie.filter('.on').addClass('origin');
        }
        else if ($vdo.filter('.on').length > 0) {
            $vdo.filter('.on').addClass('origin');
        }
        else {

        }
    }

});


function resetContentsCom() {
    /*
    $('[data-pop]').removeClass('dis');
	$('.ing').removeClass('ing');
    */

    wrapTop.find('.full_pop_bg').hide();
    wrapTop.find('.pop, .popup').hide();

	ado_stop('#popAdo');
	ado_stop('#contentAdo');

    clearTimeout(rootTimer);
    clearTimeout(toReadTimer);
    clearTimeout(effectAdoTimer);
    clearTimeout(contentAdoTimer);
}


function resetPopCom() {
    wrapTop.find('.btnPop').removeClass('dis');
    wrapTop.find('.solpop').remove();
}


/**
 * .contents 리셋
 */
/* function resetContents() {
    resetPopAll();
    ado_stop();
} */
function resetContents() {
    resetPopAll();
    ado_stop();

    // 7종 게임 - bgm처리
    if (docTop.find('.bgmAdo').length > 0) {
        docTop.find('.bgmAdo').each(function () {
            adoReset($(this));
        });
    }
}


// transition & animation 설정
//<![CDATA[
$.fn.extend({
    //** 공통 :  transitionCss transition (모션)
    /*
    use)
    $('.box1').transitionCss('tran', function () {
        console.log('end: transition');
    });
    */
    transitionCss: function (transitionName, end_func) {
        var transitionEnd = 'webkitTransitionEnd mozTransitionEnd msTransitionEnd oTransitionEnd ontransitionend transitionend';
        var _cb = end_func;
        this.addClass('transitional ' + transitionName).one(transitionEnd, function (e) {
            $(this).removeClass('transitional ' + transitionName);
            if (_cb) { _cb(e); }
        });
        return this;
    },
    //** 공통 :  animateCss 이미지 (모션)
    /*
    use)
    $('.box1').animateCss('ani', function(){
        console.log('end: animation');
    });
    */
    animateCss: function (animationName, end_func) {
        var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd onanimationend animationend';
        var _cb = end_func;
        this.addClass('animated ' + animationName).one(animationEnd, function (e) {
            $(this).removeClass('animated ' + animationName);
            if (_cb) { _cb(e); }
        });
        return this;
    }
});
//]]>

/* ---------------------------------------
 * 프리로드
 * --------------------------------------- */
// 배경 이미지 프리로드
$(function () {
    return;


    if ($('#wrap #cimgPreload').length === 0) {
        $('#wrap').prepend('<div id="cimgPreload"></div>');
    }
    $('#cimgPreload').css({
        'opacity': 0.01,
        'width': '100%',
        'height': '100%',
        'position': 'absolute',
        'z-index': -999,
        'transform': 'scale(0.01)'
    });

    $('.contents').each(function (i) {
        var b = $(this).css('background-image');
        if (b === 'none') {
            return true;
        }
        b = b.split('/');
        var imgSrc = 'inc/images/' + b[b.length - 2] + '/' + b[b.length - 1].split('.')[0] + '.png';
        $('#cimgPreload').append('<div style=background-image:url(' + imgSrc + ')>');
    });

    $('.pageWrap .page').each(function (i) {
        var b = $(this).css('background-image');
        b = b.split('/');
        var imgSrc = 'inc/images/' + b[b.length - 2] + '/' + b[b.length - 1].split('.')[0] + '.png';
        $('#cimgPreload').append('<div style=background-image:url(' + imgSrc + ')>');
    });

    $('.tabWrap .tab').each(function (i) {
        var b = $(this).css('background-image');
        b = b.split('/');
        var imgSrc = 'inc/images/' + b[b.length - 2] + '/' + b[b.length - 1].split('.')[0] + '.png';
        $('#cimgPreload').append('<div style=background-image:url(' + imgSrc + ')>');
    });

    $('#cimgPreload div').css({
        'width': '100%',
        'height': '100%'
    });
});

/**
 * 깜빡거림 방지용 프리로더
 * @param {Array} paSelector image 파일 경로 배열
 * @param {Boolean} pbDirect 경로 조합을 하지 않을지 여부
 * @returns null
 * @use imgPreLoad(['','','',], {pbDirect})
 */
function imgPreLoad(paSelector, pbDirect) {
    return false;



    if (!paSelector || paSelector.length === 0) {
        return false;
    }
    $(function () {
        // pc + mobile
        if ($('#wrap #cimgPreload2').length === 0) {
            $('#wrap').prepend('<div id="cimgPreload2"></div>');
            $('#cimgPreload2').css({
                'position': 'absolute',
                'left': '-9999px'
            });
        }

        var ksPageNo, ksImgSrc, i, b;

        ksPageNo = getFileName().split('.')[0].slice(-2);

        ksImgSrc = '';
        for (i = 0; i < paSelector.length; ++i) {
            if (paSelector[i].indexOf('.') < 0) {
                paSelector[i] = paSelector[i] + '.png';
            }
            if (pbDirect) {
                ksImgSrc = paSelector[i];
            } else if (paSelector[i].indexOf('.png') > -1 || paSelector[i].indexOf('.gif') > -1 || paSelector[i].indexOf('.jpg') > -1) {
                ksImgSrc = 'inc/images/' + ksPageNo + '/' + paSelector[i];
            } else {
                b = $(paSelector[i]).css('background-image');
                b = b.split('/');
                ksImgSrc = 'inc/images/' + b[b.length - 2] + '/' + b[b.length - 1].split('.')[0] + '.png';
            }
            $('#cimgPreload2').append('<img src="' + ksImgSrc + '" alt="" title="" />');
        }
        $('#cimgPreload2 img').css({
            'position': 'absolute',
            'left': '0px',
            'top': '0px'
        });

        // PC일때
        if (user === 'pc') {
            if ($('#wrap #cimgPreload').length === 0) {
                $('#wrap').prepend('<div id="cimgPreload"></div>');
                $('#cimgPreload').css({
                    'opacity': 0.01,
                    'width': '100%',
                    'height': '100%',
                    'position': 'absolute',
                    'z-index': -999,
                    'transform': 'scale(0.01)',
                    // 'pointer-events': 'none'
                });
            }
            ksPageNo = getFileName().split('.')[0].slice(-2);

            ksImgSrc = '';
            for (i = 0; i < paSelector.length; ++i) {
                if (paSelector[i].indexOf('.') < 0) {
                    paSelector[i] = paSelector[i] + '.png';
                }
                if (pbDirect) {
                    ksImgSrc = paSelector[i];
                }
                else if (paSelector[i].indexOf('.png') > -1 || paSelector[i].indexOf('.gif') > -1 || paSelector[i].indexOf('.jpg') > -1) {
                    ksImgSrc = 'inc/images/' + ksPageNo + '/' + paSelector[i];
                }
                else {
                    b = $(paSelector[i]).css('background-image');
                    b = b.split('/');
                    ksImgSrc = 'inc/images/' + b[b.length - 2] + '/' + b[b.length - 1].split('.')[0] + '.png';
                }
                $('#cimgPreload').append('<div style=background-image:url(' + "'" + ksImgSrc + "'" + ')>');
                //$('#cimgPreload').append('<div style="width: 100%; height: 100%; position:absolute; background-image: url(' + ksImgSrc + ');"></div>');
            }
            $('#cimgPreload div').css({
                'width': '100%',
                'height': '100%',
                'position': 'absolute'
            });
        }
    });
}
// 공통이미지들중 깜빡임 방지
imgPreLoad([
    '../common/images/clickitem/ansbtn.png',         // 정답보기
    '../common/images/clickitem/ansbtn2.png',        // 확인하기
    '../common/images/clickitem/rebtn.png',           // 다시하기
    '../common/images/audio/btn_sound_stop.png'
], true);

/**
 * 음성 프리로더
 * @param {Array} paSnd mp3 파일 경로 배열
 * @param {Boolean} pfComp 로드완료시 호출될 콜백함수
 * @use audioPreLoad([,,], pfComp)
 */
function audioPreLoad(paSnd, pfComp) {

    /* if (Array.isArray(paSnd) === false) {
        return false;
    } */

    if ($('#wrap .audiobox').length <= 0) {
        $('#wrap').append('<div class="audiobox"></div>');
    }

    // 개별 음원 미리 생성
    var html;
    paSnd.forEach(function (value, idx, self) {
        html = '<audio id="' + value + '" src="inc/media/mp3/' + value + '.mp3" type="audio/mp3"></audio>';
        $('#wrap .audiobox').append(html);
    });
    var knLoadCnt = 0;
    var knErrorCnt = 0;

    function onHandler(e) {
        //$(this).off(e.type, onHandler);
        $(this).off('error canplaythrough', onHandler);
        if (e.type === 'error') {
            knErrorCnt++;
        } else if (e.type === 'canplaythrough') {
            if ($(this)[0].readyState > 3) {
                knLoadCnt++;
            }
        }
        if ((knErrorCnt + knLoadCnt) === $('#wrap .audiobox audio').length) {
            //console.log('++ mp3LoadComplete');
            if (pfComp) {
                pfComp({
                    'load': knLoadCnt,
                    'error': knErrorCnt
                });
            }
        }
    }
    $('#wrap .audiobox audio').each(function (index) {
        $(this).off('error canplaythrough').on('error canplaythrough', onHandler);
        $(this)[0].load();
    });
}

/* ---------------------------------------
 * 음성
 * --------------------------------------- */
/**
 * 음성 재생
 * @param {string} effect 음성 종류
 * @param {boolean} bStopOther 다름 음성에 기여 여부
 * @param {string} psParentPath 음성 파일 경로
 * @param {boolean} cookie 음성 제어(on, off)
 */
function effectAdo(effect, bStopOther, psParentPath, cookie) {
    // 클릭 효과음 제거
    // if(effect === 'click'){
    //     return;
    // }

    psParentPath = psParentPath || '../common/media/mp3/';

    var cookie = cookie;
    if (!cookie) cookie = false;
    if (getCookie('effMode') == 'true' && !cookie) {
        return false;
    }

    var ado = '#' + effect;
    if ($(ado).length == 0) {
        var html = '<audio id="' + effect + '" src="' + psParentPath + '' + effect + '.mp3" type="audio/mp3"></audio>';
        $('#wrap').append(html);
    }

    if (bStopOther !== undefined && bStopOther === false) {
        bStopOther = false;
    } else {
        bStopOther = true;
    }

    if (bStopOther) {
        ado_stop();
    }

    $('[data-ado]').removeClass('on');

    if ($(ado)[0].currentTime > 0) {
        $(ado)[0].currentTime = 0;
    }

    $(ado)[0].play();

    // $(ado).off('ended').on('ended', function () {
    //     $('.ansX').removeClass('ansX');
    // });
}

/*
오디오 재생|일시정지 토글
*/
function adoPauseMode(effect, psParentPath, elem) {
    // 클릭 효과음 제거
    // if(effect === 'click'){
    //     return;
    // }

    psParentPath = psParentPath || '../common/media/mp3/';

    var ado = '#' + effect;

    if ($(ado).length == 0) {
        var html = '<audio id="' + effect + '" src="' + psParentPath + '' + effect + '.mp3" type="audio/mp3"></audio>';
        $('#wrap').append(html);
    }

    if ($(ado).is('[data-dur]') === false) {
        // $(ado).off('loadeddata').on('loadeddata', function () {
        $(ado).on('loadeddata', function (e) {
            $(this).off('loadeddata', arguments.callee);
            $(this).attr('data-dur', this.duration);
        });
    }

    $(ado).off('ended').on('ended', function () {
        $('[data-ado=' + effect + ']').removeClass('on');
        $('.sync').removeClass('on');

        $('.btn.play').removeClass('on');
    });

    $("audio").each(function () {
        if ($(this).attr('id') !== effect) {
            $(this)[0].pause();
            $('[data-ado=' + $(this).attr('id') + ']').removeClass('on');
            $(this)[0].currentTime = 0;

            $(`[data-sync-idx]`).attr('data-sync-idx', -1);
            if (typeof (onSync) !== 'undefined') {
                onSync({
                    syncIdx: -1,
                    allStop: true,
                });
            }
        }
    });

    // 일시정지
    if (elem.hasClass('on')) {
        $(ado)[0].pause();
        elem.removeClass('on');
        $('.sync').removeClass('on');
        $(`[data-sync-idx]`).attr('data-sync-idx', -1);

        if (typeof (onSync) !== 'undefined') {
            onSync({
                isPlay: false,
                syncIdx: -1,
            });
        }
    }
    // 재생
    else {
        $(ado)[0].play();
        elem.addClass('on');

        if (typeof (onSync) !== 'undefined') {
            onSync({
                isPlay: true,
                syncIdx: -1,
            });
        }
    }
}

/**
 * 선택 음성 정지
 * @param {string} effect 음성 종류
 */
function effectAdo_stop(effect) {
    if (effect.length < 1) {
        return false;
    }
    effect[0].pause();
    if (effect[0].currentTime > 0) {
        effect[0].currentTime = 0;
    }
}

/**
 * 모든 음성 일시정지
 */
function ado_pause() {
    $("audio").each(function () {
        var indp = $(this).attr('data-indp');

        if (indp == undefined || indp == false) {
            $(this)[0].pause();
        }
    });
}

/**
 * 모든 음성 정지
 */
function ado_stop() {
    $('audio').each(function () {
        $(this)[0].pause();
        if ($(this)[0].currentTime > 0) {
            $(this)[0].currentTime = 0;
        }
    });
}

/* =========================================================================================
 * 과목 공통 기능
 * ====================================================================================== */
/* ---------------------------------------
 * 세팅
 * --------------------------------------- */
// loadScriptFile('../common/js/jquery.ui.drag.js', function (){});
// loadScriptFile('../common/js/jquery.ui.touch-punch.min.js', function (){});
// loadScriptFile('../common/js/jquery.mCustomScrollbar.js', function (){});
loadScriptFile('../common/js/dragContents.js', function () { });
loadScriptFile('../common/js/scrollContents.js', function () { });
loadScriptFile('../common/js/lineContents.js', function () { });
/**
 * 컨텐츠 관련
 * @param {*} wrap 컨텐츠가 만들어질 요소
 * @param {boolean} bStopOther 다른 음성요소 정지 시킬지 여부
 */
var contentsSet = function contentsSet(wrap, bStopOther) {
    var self = this;
    this.wrap = wrap;
    this.bStopOther = (bStopOther === false) ? false : true;

    var setT;

    // callback
    this.onClick = null;        // 클릭 시
    this.onWrite = null;        // 텍스트 입력 시
    this.onDrag = null;         // 드래그 시작
    this.endDrag = null;        // 드래그 끝
    this.onDrop = null;         // 드롭 시
    this.onCorrect = null;      // 정답
    this.onWrong = null;        // 오답
    this.onShowAns = null;      // 정답보기
    this.onReset = null;        // 다시하기

    /**
     * 클릭 컨텐츠 세팅
     * @param {Number} set clickItem의 총 개수
     * @param {String} type clickContents의 클릭 타입('checkbox', 'sequence', 'OX','cho')
     * @param {Number} ansIdx OX 정답 index
     */
    this.clickCon = function (set, type, ansIdx) {
        self.clickCon = new clickContents(set, self.wrap, type, ansIdx);
        self.clickCon.init();

        self.clickCon.onClick = function (pbIsOpen, pnIdx, pbIsSetRe) {
            // console.log('클릭');
            // effectAdo('click', self.bStopOther);
            if (self.onClick) { self.onClick(pbIsOpen, pnIdx, pbIsSetRe); }
        };
        self.clickCon.onReset = function () {
            // console.log('다시하기');
            effectAdo('click', self.bStopOther);
            if (self.onReset) { self.onReset(); }
        };
        self.clickCon.onShowAns = function () {
            // console.log('확인하기');
            effectAdo('anschk_o', self.bStopOther);
            if (self.onShowAns) { self.onShowAns(); }
        };
        self.clickCon.onShowCho = function () {
            // console.log('초성보기');
            effectAdo('click', self.bStopOther);
            if (self.onShowCho) { self.onShowCho(); }
        };
    }

    /**
     * .clickItem과 연결된 요소 생성
     */
    this.clickConn = function (cnt) {
        if (!self.clickCon) {
            console.log('w(ﾟДﾟ)w clickContents is noting...');
            return;
        }

        let html = `<div class="connItemGroup">`;
        for (let i = 0; i < self.clickCon.clickItems; ++i) {
            html += `<div class="connItem connItem${i + 1}" data-idx="${i + 1}"></div>`;
        }
        html += '</div>';

        self.clickCon.itemwrap.append(html);
        self.clickCon.connItemWrap = self.clickCon.itemwrap.find('.connItemGroup');
        self.clickCon.connItem = self.clickCon.connItemWrap.find('.connItem');
        self.clickCon.connItem.hide();

        self.clickCon.items.on('click', function () {
            const $ts = $(this);
            const idx = parseInt($ts.attr('data-idx'), 10);

            const connItem = self.clickCon.connItem.filter(`[data-idx="${idx}"]`);

            // show
            if ($(this).hasClass('on')) {
                connItem.show().addClass('active');
            }
            // hide
            else {
                connItem.hide().removeClass('active');
            }
        });

        self.clickCon.ansBtn.on('click', function () {
            const $ts = $(this);
            // 확인하기
            if ($ts.hasClass('re')) {
                if (self.clickCon.connItemWrap) {
                    self.clickCon.connItem.show().addClass('active');
                }
            }
            // 다시하기
            else{
                self.clickCon.connItem.hide().removeClass('active');
            }
        });
    };

    /**
     * 드래그 컨텐츠 세팅
     * @param {Array} set drag, drop 생성 정보값
     */
    this.dragCon = function (set) {
        self.dragCon = new dragContents(self.wrap, set);
        self.dragCon.init();
        self.dragCon.onDrag = function (pjRec, e, obj) {
            // console.log('드래그 시작');
            if (self.onDrag) { self.onDrag(pjRec, e, obj); }
        }
        self.dragCon.endDrag = function (pjRec, e, obj) {
            // console.log('드래그 완료');
            if (self.endDrag) { self.endDrag(pjRec, e, obj); }
        }
        self.dragCon.onDrop = function (pnDragIdx, pnDropIdx, pbAns, pbComplete, pjRec, e, obj) {
            // console.log('드롭 완료');
            effectAdo('click', self.bStopOther);
            if (self.onDrop) { self.onDrop(pnDragIdx, pnDropIdx, pbAns, pbComplete, pjRec, e, obj); }
        }
        self.dragCon.onShowAns = function () {
            // console.log('정답보기');
            effectAdo('anschk_o', self.bStopOther);
            if (self.onShowAns) { self.onShowAns(); }
        }
        self.dragCon.onReset = function () {
            // console.log('다시하기');
            effectAdo('click', self.bStopOther);
            if (self.onReset) { self.onReset(); }
        }
        self.dragCon.onCorrect = function () {
            // console.log('정답');
            effectAdo('anschk_o', self.bStopOther);
            if (self.onCorrect) { self.onCorrect(); }
        }
        self.dragCon.onWrong = function () {
            // console.log('오답');
            effectAdo('anschk_x', self.bStopOther);
            if (self.onWrong) { self.onWrong(); }
        }
    }

    /**
     * 선긋기 컨텐츠 세팅
     * @param {String} type 선긋기 타입('line', 'multiLine')
     */
    this.lineCon = function (type) {
        clearTimeout(setT);
        setT = setTimeout(function () {
            self.lineCon = new lineContents(self.wrap, type);
            self.lineCon.init();
            self.lineCon.onCorrect = function (curIndex, curDot, connDot, isConnAns, opt) {
                // console.log('정답');
                effectAdo('anschk_o', self.bStopOther);
                if (self.onCorrect) { self.onCorrect(curIndex, curDot, connDot, isConnAns, opt); }
            };
            self.lineCon.onWrong = function () {
                // console.log('오답');
                effectAdo('anschk_x', self.bStopOther);
                if (self.onWrong) { self.onWrong(); }
            };
            self.lineCon.onShowAns = function () {
                // console.log('확인하기');
                effectAdo('anschk_o', self.bStopOther);
                if (self.onShowAns) { self.onShowAns(); }
            };
            self.lineCon.onResetAns = function () {
                // console.log('다시하기');
                effectAdo('click', self.bStopOther);
                if (self.onReset) { self.onReset(); }
            };
        }, 110);
    }

    /**
     * 글쓰기 컨텐츠 세팅
     * @param {String} totalT 생성할 <textarea>의 총 개수
     * @param {String} totalI 생성할 <input>의 총 개수
     */
    this.writeCon = function (totalT, totalI) {
        self.writeCon = new writeContents(self.wrap, totalT, totalI);
        self.writeCon.init();
        self.writeCon.onWrite = function (pjThis, e) {
            // console.log('입력중');
            if (self.onWrite) { self.onWrite(pjThis, e); }
        };
        self.writeCon.onShowAns = function () {
            // console.log('정답보기');
            effectAdo('click', self.bStopOther);
            if (self.onShowAns) { self.onShowAns(); }
        };
        self.writeCon.onReset = function () {
            // console.log('다시하기');
            effectAdo('click', self.bStopOther);
            if (self.onReset) { self.onReset(); }
        };
        self.writeCon.onClose = function () {
            // console.log('닫기');
            effectAdo('click', self.bStopOther);
            if (self.onClose) { self.onClose(); }
        };
    }
}

/**
 * 스크롤 관련
 * @param {*} wrap 스크롤이 만들어질 요소
 */
var scrollSet = function scrollSet(wrap) {
    var self = this;
    this.wrap = wrap;

    this.onScroll = null;

    /**
     * 스크롤 세팅
     * @param {string} tmax_pos 스크롤바의 최대너비 또는 높이값
     * @param {string} idx 스크롤 index값
     * @param {string} axis 스크롤의 가로형(x), 세로형(y)
     * @param {string} maxDir 최대값의 방향(r, l, b, t)
     */
    this.dragScroll = function (tmax_pos, idx, axis, maxDir) {
        self.wrap.attr('data-type', 'dragScroll');
        self.dragScroll = new dragScrollContents(self.wrap, tmax_pos, idx, axis, maxDir)
        self.dragScroll.init();

        self.dragScroll.onScroll = function (pnValue, pnPos, pnMinPos, pnMaxPos, ui) {
            // console.log('스크롤');
            if (self.onScroll) { self.onScroll(pnValue, pnPos, pnMinPos, pnMaxPos, ui); }
        };
    }

    /**
     * 스크롤 세팅
     * @param {string} axis 스크롤의 가로형(x), 세로형(y)
     */
    this.customScroll = function (axis) {
        self.wrap.attr('data-type', 'customScroll');
        self.wrap.each(function () {
            var $this = $(this);
            var $scrollPage = $this.find('.scrollpage');
            var knLength;
            var knScrollLength;
            if (axis == 'y') {
                knLength = pxToInt($this.height());
                knScrollLength = pxToInt($scrollPage.outerHeight(true));
            } else {
                knLength = pxToInt($this.width());
                knScrollLength = pxToInt($scrollPage.outerWidth(true));
            }

            if (knScrollLength > knLength) {
                $this.mCustomScrollbar({
                    scrollInertia: 200,
                    theme: 'my-theme',
                    axis: axis,
                    advanced: { autoScrollOnFocus: false },
                    callbacks: {
                        onScroll: function () {
                            if (self.onScroll) { self.onScroll(); }
                        }
                    }
                });
            }
        });
    };
}

/* ---------------------------------------
 * 페이지 이동
 * --------------------------------------- */
/**
 * 페이징 컨텐츠
 * @param {*} wrap pageingContents가 만들어질 요소
 * @param {string} type pageingContents의 구동 방식
 * @param {boolean} bStopOther 다른 음성요소 정지 시킬지 여부
 */
var pageingContents = function pageingContents(wrap, type, bStopOther) {
    var self = this;
    this.wrap = wrap;                               // .pageWrap
    this.pages = wrap.children('.pages');           // .pageWrap .pages
    this.page = wrap.find('.page');                 // .pageWrap .page
    this.pageNum = self.page.length;                // .page length
    this.currentPage = 0;                           // 현재 페이지 index
    this.next, this.prev, this.navi, this.dot;      // navigation

    this.bStopOther = bStopOther || true;            // 다른 음성요소 정지 시킬지 여부
    this.effectSnd = 'click';                       // 클릭효과음 ID값

    this.movingType = type;                         // 페이지 넘김 방식(cut, x, y)

    this.onMoveEnd = undefined;                     // callback

    this.init = function () {
        self.pageGrasp();

        self.wrap.find(".navigation").remove();
        self.currentPage = 0;
        self.pages.attr('data-page', self.currentPage);

        if (self.wrap.hasClass('moving')) {
            self.pages.css({ left: 0, top: 0 });
            self.wrap.removeClass('moving x y');
        }

        self.makeNavi();
        self.page.hide();
        self.page.eq(0).show();

        self.next.off('click').on("click", function () {
            self.nextClick($(this));
        });

        self.prev.off('click').on("click", function () {
            self.prevClick($(this));
        });

        self.dot.each(function () {
            $(this).off('click').on("click", function () {
                if ($(this).hasClass("on")) return false;
                var p = $(this).index();
                self.currentPage = p;
                self.pageMove(self.currentPage);
            });
        });

        if (self.pageNum === 1) {
            self.navi.hide();
        }

        self.moving(self.movingType);
    }

    this.pageGrasp = function () {
        if (self.page.eq(0).closest('.pageWrap').find('.pageWrap').length > 0) {
            self.page = wrap.find('.page').not(self.page.eq(0).closest('.pageWrap').find('.pageWrap .page'));
            self.pageNum = self.page.length;
        }

        if (self.pages.length === 0) {
            self.page.eq(0).closest('.pageWrap').prepend('<div class="pages"></div>');
            self.pages = self.wrap.children('.pages');
            self.pages.append(self.page);
        }
    }

    this.makeNavi = function () {
        var html = '<div class="navigation"></div>';
        if (self.page.eq(0).closest('.pageWrap').find('.pageWrap').length > 0) {
            self.page.eq(0).closest('.pageWrap').append(html);
            self.navi = wrap.find('.navigation').not(self.page.eq(0).closest('.pageWrap').find('.pageWrap .navigation'));
        }
        else {
            self.wrap.append(html);
            self.navi = wrap.find('.navigation');
        }

        var prev = '<div class="prev dis"></div>';
        var next = '<div class="next"></div>';
        var pageing = '<div class="pageing"></div>';
        self.navi.append(prev + next + pageing);

        for (var i = 0; i < self.pageNum; i++) {
            self.navi.find(".pageing").append('<div class="dot"><span class="text">' + (i + 1) + '</span></div>');
        }

        self.next = self.navi.find(".next");
        self.prev = self.navi.find(".prev");
        self.dot = self.navi.find(".pageing .dot");

        self.dot.eq(0).addClass("on");
    };

    this.nextClick = function (el) {
        if (el.hasClass("dis")) { return false; }
        self.currentPage = self.currentPage + 1;
        self.pageMove(self.currentPage);
    };

    this.prevClick = function (el) {
        if (el.hasClass("dis")) { return false; }
        self.currentPage = self.currentPage - 1;
        self.pageMove(self.currentPage);
    };

    this.pageMove = function (page) {
        self.pages.off(sTransitionEnd).on(sTransitionEnd, function () {
            if (typeof (self.onMoveEnd) !== 'undefined') { self.onMoveEnd(); }
        });

        self.currentPage = page;

        effectAdo(self.effectSnd, self.bStopOther);

        self.dot.removeClass('on');
        self.dot.eq(self.currentPage).addClass('on');

        self.navi.find('.dis').removeClass('dis');

        if (self.currentPage == 0) {
            self.prev.addClass('dis');
        }
        else if (self.currentPage + 1 == self.pageNum) {
            self.next.addClass('dis');
        }

        self.pages.attr('data-page', self.currentPage);

        var myPos, myCnt;
        switch (self.movingType) {
            case 'cut':
            default:
                self.page.hide();
                self.page.eq(self.currentPage).show();
                break;
            case 'x':
                myCnt = parseInt(self.currentPage, 10) * pxToInt(self.wrap.width());
                myPos = '-' + myCnt + 'px';
                self.pages.css('left', myPos);
                break;
            case 'y':
                myCnt = parseInt(self.currentPage, 10) * pxToInt(self.wrap.height());
                myPos = '-' + myCnt + 'px';
                self.pages.css('top', myPos);
                break;
        }
    };

    this.moving = function (psType) {
        switch (psType) {
            case 'cut':
            default:
                self.movingType = 'cut';
                self.wrap.removeClass('moving x y');
                self.wrap.addClass('cut');
                self.wrap.find('.page').css({
                    left: '0px',
                    top: '0px'
                });
                break;
            case 'x':
                self.movingType = 'x';
                self.wrap.removeClass('cut');
                self.wrap.addClass('moving x');
                self.wrap.find('.page').each(function (idx) {
                    $(this).css('left', pxToInt(self.wrap.width()) * idx);
                });
                break;
            case 'y':
                self.movingType = 'y';
                self.wrap.removeClass('cut');
                self.wrap.addClass('moving y');
                self.wrap.find('.page').each(function (idx) {
                    $(this).css('top', pxToInt(self.wrap.height()) * idx);
                });
                break;
        }
    };
}

/**
 * 탭 컨텐츠
 * @param {*} wrap tabContents 만들어질 요소
 * @param {boolean} bStopOther 다른 음성요소 정지 시킬지 여부
 */
var tabContents = function tabContents(wrap, bStopOther) {
    var self = this;
    this.wrap = wrap;                      // .tabWrap
    this.tabs = wrap.children('.tabs');    // .tabWrap .tabs
    this.tab = wrap.find('.tab');          // .tabWrap .tab
    this.tabNum = self.tab.length;         // .tab length
    this.currentTab = 0;                   // 현재 페이지 index
    this.btnWrap, this.btn;                // btnWrap

    this.bStopOther = bStopOther || true;  // 다른 음성요소 정지 시킬지 여부
    this.effectSnd = 'click';              // 클릭효과음 ID값

    this.init = function () {
        self.tabGrasp();

        self.wrap.find(".btnTabWrap").remove();
        self.currentTab = 0;
        self.tabs.attr('data-tab', self.currentTab);

        self.makeBtnWrap();
        self.tab.hide();
        self.tab.eq(0).show();

        self.btn.each(function () {
            $(this).off('click').on("click", function () {
                if ($(this).hasClass("on")) return false;
                var p = $(this).index();
                self.currentTab = p;
                self.tabMove(self.currentTab);
            });
        });
    }

    this.tabGrasp = function () {
        if (self.tab.eq(0).closest('.tabWrap').find('.tabWrap').length > 0) {
            self.tab = wrap.find('.tab').not(self.tab.eq(0).closest('.tabWrap').find('.tabWrap .tab'));
            self.tabNum = self.tab.length;
        }

        if (self.tabs.length === 0) {
            self.tab.eq(0).closest('.tabWrap').prepend('<div class="tabs"></div>');
            self.tabs = self.wrap.children('.tabs');
            self.tabs.append(self.tab);
        }
    }

    this.makeBtnWrap = function () {
        var html = '<div class="btnTabWrap"></div>';
        if (self.tab.eq(0).closest('.tabWrap').find('.tabWrap').length > 0) {
            self.tab.eq(0).closest('.tabWrap').append(html);
            self.btnWrap = wrap.find('.btnTabWrap').not(self.tab.eq(0).closest('.tabWrap').find('.tabWrap .btnTabWrap'));
        }
        else {
            self.wrap.append(html);
            self.btnWrap = wrap.find('.btnTabWrap');
        }

        for (var i = 0; i < self.tabNum; i++) {
            self.btnWrap.append('<div class="btnTab"><span class="text">' + (i + 1) + '</span></div>');
        }

        self.btn = self.btnWrap.find(".btnTab");

        self.btn.eq(0).addClass("on");
    };

    this.tabMove = function (tab) {
        self.currentTab = tab;

        effectAdo(self.effectSnd, self.bStopOther);

        self.btn.removeClass('on');
        self.btn.eq(self.currentTab).addClass('on');

        self.tabs.attr('data-tab', self.currentTab);

        self.tab.hide();
        self.tab.eq(self.currentTab).show();
    };
}

/* ---------------------------------------
 * 팝업
 * --------------------------------------- */
/**
 * 팝업 통합
 * @param {*} pjWrap 팝업이 만들어질 요소
 * @param {boolean} bHideOther 다른 팝업을 닫을지 여부
 * @param {boolean} bStopOther 다른 음성요소 정지 시킬지 여부
 */
function initPop(pjWrap) {
    var wrap;
    var popType;

    $('.btnPop, .btnPopup').off('click').on('click', function () {
        var $ts = $(this);
        var idx = $ts.attr('data-idx');
        popType = $(this).attr('data-type');

        const cusTp = $ts.attr('data-tp') || '';

        // wrap = pjWrap || $ts.parent();
        wrap = pjWrap || $ts.closest('.contents');

        // 기본
        var bStopOther = true;  // 다른 media요소 정지
        var bHideOther = true;  // 다른 popup요소 닫기
        var bMakeMask = false;  // 마스크 생성할지 여부

        if ($ts.attr('data-stop-other') === 'false') {
            bStopOther = false;
        }
        if ($ts.attr('data-hide-other') === 'false') {
            bHideOther = false;
        }
        if ($ts.attr('data-mask') === 'true') {
            bMakeMask = true;
        }

        // .btnPop, .btnPopup 구별
        let bPop = $ts.hasClass('btnPop') || false;


        // 열기
        if (!$ts.hasClass('on')) {
            if (bHideOther === true) {

                //* 2024-01-03 14:27:17 - JGY : .pop, .popup 닫기를 분기처리
                // resetPop();
                if (bPop) {
                    resetPop();
                }
                else {
                    resetPopup();
                }
                //*----------------

            }
            $ts.addClass('on');


            //* 2025-06-04 16:38:26 - JGY : ul.navi 안에 있을 경우의 처리
            if ($ts.closest('ul.navi').length > 0) {
                const $ulNavi = $ts.closest('ul.navi');
                $ulNavi.find('.cookie').not($ts).removeClass('on');
            }
            //*--------------------

            popType = popType || '';

            if ($ts.hasClass('auto')) {
                makePop(wrap, $ts, idx, popType);
            }

            if ($ts.hasClass('btnPop')) {
                if (popType !== '') { wrap.find('.pop[data-idx="' + idx + '"]').attr('data-type', popType); }
                wrap.find('.pop[data-idx="' + idx + '"]').show();

                if (cusTp !== '') {
                    wrap.find(`.pop[data-idx="${idx}"]`).attr('data-tp', cusTp);
                }
            }
            else if ($ts.hasClass('btnPopup')) {
                if (popType !== '') { wrap.find('.popup[data-idx="' + idx + '"]').attr('data-type', popType); }

                if (cusTp !== '') {
                    wrap.find(`.popup[data-idx="${idx}"]`).attr('data-tp', cusTp);
                }

                if (bMakeMask === true) {
                    makeMask();
                }

                wrap.find('.popup[data-idx="' + idx + '"]').show();
            }

            if (popType === 'dragPop') {
                wrap.find('.pop[data-type="' + popType + '"]').draggable({
                    cursor: "pointer",
                    revert: "false",
                    scroll: false,
                    containment: $("#wrap"),
                    start: function (e, obj) {
                        var factor = FORTEACHERCD.responsive.baseContainerSize.zoom;
                        obj.position.top = Math.round(obj.position.top / factor);
                        obj.position.left = Math.round(obj.position.left / factor);
                        isRec = $(this);
                    },
                    drag: function (e, obj) {
                        var factor = FORTEACHERCD.responsive.baseContainerSize.zoom;
                        obj.position.top = Math.round(obj.position.top / factor);
                        obj.position.left = Math.round(obj.position.left / factor);
                    },
                    stop: function (e, obj) { },
                });
                wrap.find('.pop[data-type="' + popType + '"]').removeAttr('style').show();
            }

            $ts.removeClass('stop');
            if ($ts.attr('data-type') === 'vivasam') {
                $ts.addClass('stop');
            }
            closePop(bStopOther);
        }
        // 닫기
        else {
            $ts.removeClass('on');

            if ($ts.hasClass('btnPop')) {
                wrap.find('.pop[data-idx="' + idx + '"]').hide();
                if ($ts.hasClass('auto')) {
                    wrap.find('.pop[data-idx="' + idx + '"]').remove();
                }
            }
            else if ($ts.hasClass('btnPopup')) {
                wrap.find('.popup[data-idx="' + idx + '"]').hide();
                if ($ts.hasClass('auto')) {
                    wrap.find('.popup[data-idx="' + idx + '"]').remove();
                }
            }

            if (popType == 'dragPop') {
                wrap.find('.pop[data-type="' + popType + '"]').draggable('destroy').removeAttr('style');
            }
        }

        effectAdo('click', bStopOther);
    });
}

/**
 * pop 생성
 * @param {*} wrap 팝업이 만들어질 요소
 * @param {*} pjThis 팝업버튼
 * @param {Number} idx 팝업의 인덱스
 * @param {string} type 팝업의 타입
 */
function makePop(wrap, pjThis, idx, type) {
    var popHtml = '';
    if (pjThis.hasClass('btnPop')) {
        popHtml += '<div class="pop auto" data-idx="' + idx + '" data-type="' + type + '">';
    }
    else if (pjThis.hasClass('btnPopup')) {
        popHtml += '<div class="popup auto" data-idx="' + idx + '" data-type="' + type + '">';
    }
    popHtml += '    <div class="close"></div>';
    popHtml += '</div>';

    const $pop = $(popHtml);
    if (type === '') {
        $pop.removeAttr('data-type');
    }

    wrap.append(popHtml);
}


/**
 * 팝업 닫기
 * @param {boolean} bStopOther 다른 음성요소 정지 시킬지 여부
 */
function closePop(bStopOther) {
    $('.pop, .popup').find('.close').off('click').on('click', function (e) {
        var $ts = $(this);
        var pop = $ts.parent();
        var idx = $ts.parent().attr('data-idx');
        var type = $ts.parent().attr('data-type');
        var wrap = $ts.parent().parent();

        if (pop.hasClass('pop')) {
            wrap.find('.btnPop[data-idx="' + idx + '"]').removeClass('on');
        }
        else if (pop.hasClass('popup')) {
            wrap.find('.btnPopup[data-idx="' + idx + '"]').removeClass('on');

            if (pop.hasClass('dragPop')) {
                pop.removeAttr('style');
            }


            //* 2025-06-04 16:38:26 - JGY : ul.navi 안에 있을 경우의 처리
            if (wrap.find('.btnPopup[data-idx="' + idx + '"]').closest('ul.navi').length > 0) {
                const $ulNavi = wrap.find('.btnPopup[data-idx="' + idx + '"]').closest('ul.navi');
                $ulNavi.find('.cookie.origin').addClass('on');
                // console.log($ulNavi.find('.cookie.origin'));
            }
            //*--------------------
        }

        pop.hide();

        if (pop.hasClass('auto')) {
            pop.remove();
        }

        if (type == 'dragPop') {
            wrap.find('.pop[data-type="' + type + '"]').removeAttr('style');
        }



        if (typeof popCloseClick !== 'undefined') { popCloseClick(); }

        if (isHuman(e) === true) {
            effectAdo('click', bStopOther);
        }
    });
}

/**
 * 팝업 리셋
 */
function resetPopAll() {
    $('.btnPop, btnPopup').removeClass('on dis');
    $('.pop').not('.popup').hide();
    $('.pop.auto, .popup.auto').remove();
    if ($('.pop').attr('data-type') == 'dragPop') {
        $('.pop').removeAttr('style');
    }
}

/**
 * 팝업(.pop) 모두 리셋
 */
function resetPop() {
    $('.btnPop').removeClass('on dis');
    $('.pop').not('.popup').hide();
    $('.pop.auto').remove();
    $('.pop[data-type="dragPop"]').removeAttr('style');
}

/**
 * 팝업(.popup) 모두 리셋
 */
function resetPopup() {
    removeMask();

    $('.btnPopup').removeClass('on dis');
    $('.popup').not('.pop').hide();
    $('.popup.auto').remove();
    $('.popup.dragPop').removeAttr('style');
}

/* ---------------------------------------
 * 클릭
 * --------------------------------------- */
/**
 * 클릭 컨텐츠
 * @param {number} items clickItem의 총 개수
 * @param {*} wrap clickContents가 만들어질 요소
 * @param {string} type clickContents의 클릭 타입('checkbox', 'sequence', 'OX','cho')
 * @param {array} ansIdx OX 정답 index
 */
var clickContents = function clickContents(items, wrap, type, ansIdx) {
    var self = this;
    this.wrap = wrap;               // .clickContent parent
    this.itemWrap = '';             // .clickContent
    this.clickItems = items;        // .clickItem의 총 개수
    this.openItemNum = 0;           // 열려있는 .clickItem의 총 개수
    this.items = '';                // .clickContent .clickItem
    this.ansBtn = '';               // .clickContent .ansbtn
    this.choBtn = '';               // .clickContent .chobtn

    this.clickItemWrap = '';        // .clickContent .clickItemWrap

    this.type = type;               // 클릭 타입('checkbox', 'sequence', 'OX','cho')
    this.ansIdx = ansIdx;           // OX 정답

    // callback
    this.onClick = undefined;       // clickItem 클릭할 때
    this.onShowAns = undefined;     // 정답보기
    this.onReset = undefined;       // 다시하기
    this.onShowCho = undefined;     // 초성보기

    var setT;

    this.init = function () {
        self.openItemNum = 0;

        if (self.wrap.find('.clickItem').length > 0) {
            self.wrap.find('.clickContent').remove();
        }

        self.makeWrap();
        self.makeItem();
        self.makeBtn();

        self.items.off('click').on('click', function () {
            var $this = $(this);
            var knIdx = parseInt($this.attr('data-idx'), 10);
            var kbIsOpen = false;

            if (!$this.hasClass('on')) {
                $this.addClass('on');
                self.openItemNum++;
                kbIsOpen = true;
                switch (self.type) {
                    case 'sequence':
                        var knIdxNext = knIdx + 1;
                        self.items.filter('[data-idx="' + knIdxNext + '"]').addClass('act');
                        break;
                    case 'OX':
                    case 'ox':
                        if ($this.attr('data-ans') == 'true') {
                            effectAdo('anschk_o');
                        } else {
                            effectAdo('anschk_x');
                            clearTimeout(setT);
                            setT = setTimeout(function(){
                                $this.removeClass('on');
                            }, 800)
                        }
                        break;
                    case 'cho':
                        $this.removeClass('cho');
                        break;
                }
            }
            else {
                $this.removeClass('on');
                kbIsOpen = false;
                self.openItemNum--;
            }

            var kbIsSetRe = false;

            switch (self.type) {
                case 'OX':
                case 'ox':
                    if (self.clickItemWrap.find('[data-ans="true"]').length == self.clickItemWrap.find('.on[data-ans="true"]').length) {
                        self.items.addClass('dis');
                        self.ansBtn.addClass('re');
                        kbIsSetRe = true;
                    }else{
                        kbIsSetRe = false;
                    }
                    break;
                default:
                    if (self.openItemNum === self.clickItems) {
                        self.ansBtn.addClass('re');
                        self.choBtn.addClass('off dis');
                        kbIsSetRe = true;
                    }
                    else {
                        self.ansBtn.removeClass('re');
                        self.choBtn.removeClass('off dis');
                        kbIsSetRe = false;
                    }
                    break;
            }

            if (typeof self.onClick !== 'undefined') { self.onClick(kbIsOpen, knIdx, kbIsSetRe); }
        });

        self.addEventAnsBtn();
        self.addEventChoBtn();
    };

    this.addEventAnsBtn = function () {
        let type = self.type || '';
        switch (type.toLowerCase()) {
            case 'checkbox':
                break;
            case 'sequence':
                break;
            case 'ox':
                break;
            case 'cho':
                break;
            default:
                self.ansBtn.addClass('ansbtn2');
                break;
        }

        self.ansBtn.off('click').on('click', function () {
            // 다시하기
            if ($(this).hasClass('re')) {
                self.reset();
            }
            // 모두보기
            else {
                self.showAll();
            }
        });
    };

    this.addEventChoBtn = function () {
        self.choBtn.off('click').on('click', function () {
            // 초성보기
            if ($(this).hasClass('off')) {
                $(this).removeClass('off');
                self.items.removeClass('cho');
            }
            else {
                $(this).addClass('off');
                self.items.addClass('cho');
            }

            if (typeof self.onShowCho !== 'undefined') { self.onShowCho(); }
        });
    };

    this.reset = function () {
        self.items.removeClass('on dis');
        self.openItemNum = 0;
        self.ansBtn.removeClass('re');

        switch (self.type) {
            case 'sequence':
                self.items.removeClass('act');
                self.items.eq(0).addClass('act');
                break;
            case 'cho':
                self.items.removeClass('cho');
                self.choBtn.removeClass('off dis');
                break;
        }

        if (typeof self.onReset !== 'undefined') {
            self.onReset();
        }
    };

    this.showAll = function () {
        self.ansBtn.addClass('re');
        self.items.addClass('on');
        self.openItemNum = self.clickItems;

        switch (self.type) {
            case 'sequence':
                self.items.removeClass('act');
                self.items.eq(0).addClass('act');
                break;
            case 'OX':
            case 'ox':
                self.items.removeClass('on');
                self.itemwrap.find('[data-ans="true"]').addClass('on');
                self.openItemNum = self.itemwrap.find('[data-ans="true"]').length;
                break;
            case 'cho':
                self.choBtn.addClass('off dis');
                break;
        }

        if (typeof self.onShowAns !== 'undefined') { self.onShowAns(); }
    };

    this.makeWrap = function () {
        var html = '<div class="clickContent"></div>';
        self.wrap.append(html);
        self.itemwrap = self.wrap.find('.clickContent');
    };

    this.makeItem = function () {
        if (self.itemwrap.find('.clickItemWrap').length === 0) {
            self.itemwrap.append('<div class="clickItemWrap"></div>');
        }
        self.clickItemWrap = self.itemwrap.find('.clickItemWrap');

        var html = '';
        for (var i = 0; i < self.clickItems; i++) {
            html += '<div class="clickItem clickItem' + (i + 1) + '" data-idx="' + (i + 1) + '"></div>';
        }
        self.itemwrap.find('.clickItemWrap').append(html);
        self.items = self.itemwrap.find('.clickItem');

        if (self.items.length == 1) self.items.addClass('ex');

        self.setType();
    };

    this.makeBtn = function () {
        switch (self.type) {
            case 'cho':
                var choHtml = '<div class="chobtn"></div>';
                self.itemwrap.append(choHtml);
                break;
        }

        var html = '<div class="ansbtn"></div>';
        self.itemwrap.append(html);

        self.ansBtn = self.itemwrap.find('.ansbtn');
        self.choBtn = self.itemwrap.find('.chobtn');
    };

    this.setType = function () {
        switch (self.type) {
            case 'click':
            default:
                break;
            case 'checkbox':
                self.itemwrap.addClass('checkbox');
                break;
            case 'sequence':
                self.itemwrap.addClass('sequence');
                self.items.eq(0).addClass('act');
                break;
            case 'OX':
            case 'ox':
                self.itemwrap.addClass('ox');
                for (i = 0; i < self.ansIdx.length; i++) {
                    self.items.eq(self.ansIdx[i]).attr('data-ans', 'true');
                }
                break;
            case 'cho':
                self.itemwrap.addClass('cho');
                break;
        }
    };
}

/* ---------------------------------------
 * 줌
 * --------------------------------------- */
/**
 * 확대/축소 컨텐츠
 * @param {*} wrap zoomContents가 생성될 요소
 */
var zoomContents = function zoomContents(wrap) {
    var self = this;
    this.wrap = wrap;

    this.scale = 1;
    this.translateX = 0;
    this.translateY = 0;

    this.zoomWrap, this.zoombtn, this.zoomImg;

    this.init = function () {
        if (self.wrap.find('.zoomWrap').length > 0) {
            self.wrap.find('.zoomWrap').remove();
        }

        self.makeHtml();

        self.zoomImgMove(self.zoomImg);

        self.zoomImg.css(self.wrap.css('background'));

        self.zoombtn.find('.text').html(self.scale * 100 + '%');

        self.zoombtn.find('.plus').on('click', function () {
            self.scaleUp();
        });

        self.zoombtn.find('.minus').on('click', function () {
            self.scaleDown();
        });

        self.zoombtn.find('.text').on('click', function () {
            self.zommImg.css({
                'transform': 'scale(1)'
            });

            self.zoombtn.find('.text').html(100 + '%');
            self.scale = 1;
        });
    }

    this.makeHtml = function () {
        var html = '<div class="zoomWrap">';
        html += '<div class="zoombtn">';
        html += '<div class="btn plus"></div>';
        html += '<div class="text"></div>';
        html += '<div class="btn minus"></div>';
        html += '</div>';
        html += '<div class="zoombox">';
        html += '<div class="zoomImg"></div>';
        html += '</div>';
        html += '</div>';
        self.wrap.append(html);

        self.zoomWrap = self.wrap.find('.zoomWrap');
        self.zoombtn = self.wrap.find('.zoombtn');
        self.zoomImg = self.wrap.find('.zoomImg');
    }

    this.scaleUp = function () {
        if (self.scale < 1.8) {
            effectAdo('click');
            self.scale += 0.2;
            var n = Math.round(self.scale * 100);
            self.zoombtn.find('.text').html(n + '%');

            self.zoomImg.css({
                'transform': 'scale(' + self.scale + ') translate(0px, 0px)',
                'transition': 'transform 0.3s'
            });

            self.translateX = 0;
            self.translateY = 0;
        }

        if (self.scale >= 1.2) {
            self.zoomImg.css('cursor', 'pointer');
            self.zoomImg.css({
                'transform': 'scale(' + self.scale + ') translate(' + self.translateX + 'px, ' + self.translateY + 'px)',
                'transition': 'transform 0.3s'
            });
        }
    }

    this.scaleDown = function () {
        if (self.scale > 0.4) {
            effectAdo('click');
            self.scale -= 0.2;
            self.zoomImg.css('transform', 'scale(' + self.scale + ')');
            var n = Math.round(self.scale * 100)
            self.zoombtn.find('.text').html(n + '%');

            self.zoomImg.css({
                'transform': 'scale(' + self.scale + ') translate(' + self.translateX + 'px, ' + self.translateY + 'px)',
                'transition': 'transform 0.3s'
            });
        }

        if (self.scale <= 1) {
            self.zoomImg.css('cursor', 'auto');
            self.zoomImg.css({
                'transform': 'scale(' + self.scale + ') translate(0px, 0px)',
                'transition': 'transform 0.3s'
            });
            self.translateX = 0;
            self.translateY = 0;
        }
    }

    this.zoomImgMove = function (el) {
        var moving = false;
        var oX, oY, zoomX, zoomY;

        el.on('mousedown', function (e) {
            if (self.scale > 1) {
                moving = true;
                oX = e.clientX - el.position().left;
                oY = e.clientY - el.position().top;
            }
        });

        el.on('mousemove', function (e) {
            if (moving) {
                var factor = FORTEACHERCD.responsive.baseContainerSize.zoom;

                zoomX = ((e.clientX - oX) / factor) + (((self.scale - 1) * el.width()) / 2);
                zoomY = ((e.clientY - oY) / factor) + (((self.scale - 1) * el.height()) / 2);

                self.zoomImg.css({
                    left: zoomX + "px",
                    top: zoomY + "px",
                    'transition': 'transform 0s'
                });
            }
        });


        el.on('mouseup', function (e) {
            if (moving) {
                moving = false;
            }
        });

        el.on('mouseleave', function (e) {
            if (moving) {
                moving = false;
            }
        })
    }
}

/**
 * 통합교과용 확대/축소 컨텐츠
 * @param {*} wrap mapContents가 생성될 요소
 * @param {*} width .mapWrap의 너비
 * @param {*} height .mapWrap의 높이
 * @param {*} btn .innerbtn 생성여부
 */
var zoomContents2 = function (wrap, width, height, btn) {

    var self = this;

    this.wrap = wrap;
    this.width = width || 1920;
    this.height = height || 900;
    this.scale = 1;
    this.translateX = 0;
    this.translateY = 0;
    this.btn = btn;

    this.max = 2.0;         // 최대확대값
    this.min = 0.2;         // 최소확대값
    this.chg = 0.2;         // 확대축소 변위값
    this.duration = 0.3;    // transition-duration

    this.factor = 1;

    this.init = function () {
        this.wrap.html('');
        this.makeHtml();
        this.mapMove(this.map);

        this.map.css(self.wrap.css('background'));

        this.mapbtn.find('.text').html(`${self.scale * 100}%`);
        this.mapbtn.find('.plus').on('click', function () {
            self.scaleUp();
        });

        this.mapbtn.find('.minus').on('click', function () {
            self.scaleDown();
        });

        if (this.btn) {
            self.map.find('.innerbtn').on('click', function () {
                effectAdo('click', false);
                self.map.toggleClass('on');
            });
        }

        //self.map.css('cursor', 'pointer');
        //self.mapwrap.addClass('map_draggable');
    };

    this.makeHtml = function () {
        const html = `
            <div class="mapWrap">
                <div class="mapbtn">
                    <div class="btn plus"></div>
                    <div class="text"></div>
                    <div class="btn minus"></div>
                </div>
                <div class="mapbox">
                    <div class="map"></div>
                </div>
            </div>
        `;
        self.wrap.append(html);
        self.mapwrap = self.wrap.find('.mapWrap');
        self.map = self.wrap.find('.map');
        self.mapbtn = self.wrap.find('.mapbtn');

        self.mapwrap.css({
            'width': self.width + 'px',
            'height': self.height + 'px',
        });

        if (self.btn) {
            self.map.append('<div class="innerbtn"></div>');
        }
    };

    this.scaleUp = function () {
        if (self.scale < self.max) {
            getScale();
            self.factor = FORTEACHERCD.responsive.baseContainerSize.zoom;

            effectAdo('click');
            self.scale += self.chg;
            self.scale = Number(Number(String(self.scale)).toFixed(1));
            var n = Math.round(self.scale * 100);
            self.mapbtn.find('.text').html(`${n}%`);

            self.translateX = 0;
            self.translateY = 0;

            self.map.css({
                'transform': `translate(${self.translateX}px, ${self.translateY}px) scale(${self.scale})`,
                'transition': `transform ${self.duration}s`
            });
        }

        if (self.scale > 1) {
            self.map.css('cursor', 'pointer');
            self.mapwrap.addClass('map_draggable');
        }
        else {
            self.map.css('cursor', 'auto');
            self.mapwrap.removeClass('map_draggable');
        }
    };

    this.scaleDown = function () {
        if (self.scale > self.min) {
            effectAdo('click');
            self.scale -= self.chg;
            self.scale = Number(Number(String(self.scale)).toFixed(1));
            self.map.css('transform', 'scale(' + self.scale + ')');
            var n = Math.round(self.scale * 100);
            self.mapbtn.find('.text').html(`${n}%`);

            self.translateX = 0;
            self.translateY = 0;

            self.map.css({
                'transform': `translate(${self.translateX}px, ${self.translateY}px) scale(${self.scale})`,
                'transition': `transform ${self.duration}s`
            });
        }

        if (self.scale > 1) {
            self.map.css('cursor', 'pointer');
            self.mapwrap.addClass('map_draggable');
        }
        else {
            self.map.css('cursor', 'auto');
            self.mapwrap.removeClass('map_draggable');
        }

        /* if (self.scale <= 1) {

            self.translateX = 0;
            self.translateY = 0;

            self.map.css('cursor', 'auto');
            self.map.css({
                'transform': 'scale(' + self.scale + ') translate(0px, 0px)',
                'transition': 'transform 0.3s'
            });
        } */
    };

    this.mapMove = function (el) {
        var moving = false;
        var oX, oY, mapX, mapY;
        var mx, my;

        el.on('mousedown', function (e) {
            if (self.scale > 1) {
                moving = true;
                mx = e.pageX;
                my = e.pageY;
                oX = mx - el.position().left;
                oY = my - el.position().top;
            }
        });

        el.on('mousemove', function (e) {
            if (moving) {
                getScale();
                const factor = FORTEACHERCD.responsive.baseContainerSize.zoom;

                mx = e.pageX;
                my = e.pageY;
                mapX = ((mx - oX) / factor) + (((self.scale - 1) * el.width()) / 2);
                mapY = ((my - oY) / factor) + (((self.scale - 1) * el.height()) / 2);

                self.translateX = mapX;
                self.translateY = mapY;

                self.map.css({
                    'transform': `translate(${mapX}px, ${mapY}px) scale(${self.scale})`,
                    'transition': `transform ${0}s`
                });

                //self.map.find('.finger, .obj').addClass('moveDis dis');
                self.map.find('*').addClass('moveDis');
            }
        });

        el.on('mouseup', function (e) {
            if (moving) {
                moving = false;
                self.map.find('.moveDis').removeClass('moveDis');
            }
        });
        el.on('mouseleave', function (e) {
            if (moving) {
                moving = false;
                self.map.find('.moveDis').removeClass('moveDis');
            }
        });
    };

    this.reset = function () {
        self.scale = 1;
        self.mapbtn.find('.text').html(`${self.scale * 100}%`);

        self.translateX = 0;
        self.translateY = 0;

        self.map.css('cursor', 'auto');
        self.map.css({
            'transform': `translate(${self.translateX}px, ${self.translateY}px) scale(${self.scale})`,
            'transition': `transform ${0}s`
        });

        self.map.find('.moveDis').removeClass('moveDis');

        self.mapwrap.removeClass('map_draggable');
    };
};

/* ---------------------------------------
 * 글쓰기
 * --------------------------------------- */
/**
 * @param {JQuery} wrap writeContents가 만들어질 요소
 * @param {Number} textItems 생성할 <textarea>의 총 개수
 * @param {Number} inputItems 성할 <input>의 총 개수
 */
var writeContents = function writeContents(wrap, textItems, inputItems) {
    var self = this;
    this.wrap = wrap;

    this.textItems = textItems || 0;        // 생성할 <textarea>의 총 개수
    this.inputItems = inputItems || 0;      // 생성할 <input>의 총 개수

    this.conWrap = '';                      // .textContent

    this.textWraps = '';                    // .textContent .textWrap
    this.inputWraps = '';                   // .textContent .inputWrap

    this.exWrapsT = '';                     // .textContent .textWrap .exWrap
    this.exWrapsI = '';                     // .textContent .inputWrap .exWrap

    this.textAreas = '';                    // .textContent textarea
    this.inputs = '';                       // .textContent input

    this.btnEx = '';                        // 예시보기 ↔ 다시하기

    // callback
    this.onWrite = undefined;               // 텍스트 입력할 때
    this.onShowAns = undefined;             // 예시보기
    this.onReset = undefined;               // 다시하기
    this.onClose = undefined;               // 닫기

    this.init = function () {
        if (self.wrap.find('.textContent').length > 0) {
            self.wrap.find('.textContent').remove();
        }

        self.makeCon();
        self.makeTextWrap();
        self.makeBtn();

        self.addEventWrite();
        self.addEventBtns();
    }

    this.reset = function () {
        self.textWraps.find('.placeholder').show();

        self.textAreas.val('').show().trigger('blur');
        self.inputs.val('').show().trigger('blur');

        self.exWrapsT.hide();
        self.exWrapsI.hide();

        self.btnEx.removeClass('re dis');
    }

    this.makeCon = function () {
        let html = `<div class="textContent"></div>`;
        self.wrap.append(html);
        self.conWrap = self.wrap.find('.textContent');
    }

    this.makeTextWrap = function () {
        let html = '';
        let i;
        for (i = 0; i < self.textItems; ++i) {
            // <textarea id="textbox${i + 1}" class="textbox" spellcheck="false" maxlength="1" restrict="number"></textarea>
            html += `
                <div class="wrapper textWrap textWrap${i + 1}">
                    <div class="bg"></div>
                    <textarea id="textbox${i + 1}" class="textbox" spellcheck="false"></textarea>
                    <div class="placeholder"><span class="tir off">입력해 주세요</span></div>
                    <div class="exWrap">
                        <div class="closeBtn"></div>
                    </div>
                </div>
            `;
        }
        for (i = 0; i < self.inputItems; ++i) {
            // <input type="text" id="inputbox${i + 1}" class="inputbox" spellcheck="false" maxlength="1" restrict="number">
            html += `
                <div class="wrapper inputWrap inputWrap${i + 1}">
                    <div class="bg"></div>
                    <input type="text" id="inputbox${i + 1}" class="inputbox" spellcheck="false">
                    <div class="placeholder"><span class="tir off">입력해 주세요</span></div>
                    <div class="exWrap">
                        <div class="closeBtn"></div>
                    </div>
                </div>
            `;
        }

        self.conWrap.append(html);

        self.textWraps = self.conWrap.find('.textWrap');
        self.textAreas = self.conWrap.find('textarea');

        self.inputWraps = self.conWrap.find('.inputWrap');
        self.inputs = self.conWrap.find('input');

        self.exWrapsT = self.textWraps.find('.exWrap');
        self.exWrapsI = self.inputWraps.find('.exWrap');
    }

    this.makeBtn = function () {
        let html = `<div class="exbtn"></div>`;
        self.conWrap.append(html);
        self.btnEx = self.conWrap.find('.exbtn');
    }

    // 입력제한모드 설정
    this.setRestrictT = function (pjTexAreas, psMode) {
        pjTexAreas = pjTexAreas || self.textAreas;
        pjTexAreas.attr('restrict', psMode);
    }
    this.setRestrictI = function (pjInputs, psMode) {
        pjInputs = pjInputs || self.inputs;
        pjInputs.attr('restrict', psMode);
    }

    // 입력가능 값 설정
    this.setMaxLengthT = function (pjTexAreas, pnMaxLength) {
        pjTexAreas = pjTexAreas || self.textAreas;
        pjTexAreas.attr('maxlength', pnMaxLength);
    }

    this.setMaxLengthI = function (pjInputs, pnMaxLength) {
        pjInputs = pjInputs || self.inputs;
        pjInputs.attr('maxlength', pnMaxLength);
    }

    this.addEventWrite = function () {
        self.textAreas.add(self.inputs).on(sInputEvt, function () {
            $(this).closest('.wrapper').find('.placeholder').hide();
        });

        self.textAreas.add(self.inputs).on('focusout blur', function () {
            var ksVal = $(this).val();
            if (ksVal.trim() === '') {
                $(this).closest('.wrapper').find('.placeholder').show();
            }
            else {
                $(this).closest('.wrapper').find('.placeholder').hide();
            }
        });

        self.textAreas.add(self.inputs).on('input', function (e) {
            if ($(this).is('[maxlength]')) {
                $(this).val($(this).val().substring(0, parseInt($(this).attr('maxlength'), 10)));
            }
            var ksMode = $(this).attr('restrict');
            switch (ksMode) {
                case 'korean':
                    onlyKorean(e);
                    break;
                case 'number':
                    onlyNumber(e);
                    break;
                default:
                    break;
            }

            if (typeof self.onWrite !== 'undefined') { self.onWrite($(this), e); }
        });
    }

    this.addEventBtns = function () {
        // 예시팝업 닫기버튼
        self.exWrapsT.add(self.exWrapsI).find('.closeBtn').on('click', function () {
            effectAdo('click', false);

            const $ts = $(this);
            const $wrapper = $ts.closest('.wrapper');

            $wrapper.find('.exWrap').hide();

            if ($wrapper.hasClass('textWrap')) {
                $wrapper.find('textarea').show().trigger('blur');
                if ($wrapper.find('textarea').val() === '') {
                    $wrapper.find('.placeholder').show();
                }
                else {
                    $wrapper.find('.placeholder').hide();
                }
            }
            else if ($wrapper.hasClass('inputWrap')) {
                $wrapper.find('input').show().trigger('blur');
                if ($wrapper.find('input').val() === '') {
                    $wrapper.find('.placeholder').show();
                }
                else {
                    $wrapper.find('.placeholder').hide();
                }
            }

            self.btnEx.removeClass('dis');

            if (typeof self.onClose !== 'undefined') { self.onClose(); }
        });

        // 예시보기
        self.btnEx.on('click', function () {
            effectAdo('click', false);

            var $ts = $(this);

            // 다시 하기
            if ($ts.hasClass('dis')) {
                self.textAreas.show();
                self.textAreas.trigger('focusIn');

                // 기존 내용 리셋
                self.textAreas.show();
                self.textAreas.val('');
                self.textAreas.trigger('blur');

                self.inputs.show();
                self.inputs.val('');
                self.inputs.trigger('blur');

                self.textWraps.find('.placeholder').show();
                self.inputWraps.find('.placeholder').show();
                // 기존 내용 유지
                /* let ksVal;
                if (self.textAreas.length > 0) {
                    self.textWraps.each(function () {
                        ksVal = $(this).find('textarea').val();
                        if (ksVal.trim() === '') {
                            $(this).find('.placeholder').show();
                        }
                        else {
                            $(this).find('.placeholder').hide();
                        }
                    });
                }

                if (self.inputs.length > 0) {
                    self.inputs.each(function () {
                        ksVal = $(this).find('input').val();
                        if (ksVal.trim() === '') {
                            $(this).find('.placeholder').show();
                        }
                        else {
                            $(this).find('.placeholder').hide();
                        }
                    });
                } */

                self.exWrapsT.hide();
                self.exWrapsI.hide();

                $ts.removeClass('dis');

                if (typeof self.onReset !== 'undefined') { self.onReset(); }
            }
            // 예시 보기
            else {
                self.textAreas.hide();
                self.textAreas.trigger('blur');

                self.inputs.hide();
                self.inputs.trigger('blur');

                self.textWraps.find('.placeholder').hide();
                self.inputWraps.find('.placeholder').hide();

                self.exWrapsT.show();
                self.exWrapsI.show();

                $ts.addClass('dis');

                if (typeof self.onShowAns !== 'undefined') { self.onShowAns(); }
            }

            // 다시 하기
            /* if ($this.hasClass('re')) {
                $this.removeClass('re');
                self.reset();
                return;
            }
            // 예시보기
            else {
                //self.textAreas.trigger('blur').val('');
                self.textAreas.hide();
                self.textAreas.trigger('blur');
                self.textWraps.find('.placeholder').hide();
                self.exWraps.show();
            }
            $this.addClass('re'); */
        });
    }
};

/* ---------------------------------------
 * 캐릭터 음원
 * --------------------------------------- */
/**
 * 캐릭터 음원 컨텐츠
 * @param {*} wrap aniContents가 생성될 요소
 * @param {Array} set ado, img 생성 정보값
 * @param {String} adoPath 오디오 파일 경로
 * @param {String} imgPath 이미지 파일 경로
 * @param {String} type aniItem의 이미지 타입('gif', 'Gif')
 * @param {boolean} bStopOther 다른 음성요소 정지 시킬지 여부
 */
var aniContents = function (wrap, set, adoPath, imgPath, type, bStopOther) {
    var self = this;
    this.wrap = wrap;
    this.set = set;

    this.type = type;

    this.bStopOther = (bStopOther === false) ? false : true;

    this.adoItems = self.set.ado;
    this.imgItems = self.set.img;

    this.itemwrap = '';                         // .aniWrap
    this.items = '';                            // .aniWrap .aniItem

    this.soundBtn = '';                         // .aniWrap .soundBtn

    this.cnt = 0;
    this.allChk = false;

    this.onClick = undefined;
    this.onEnded = undefined;
    this.onPlayAll = undefined;
    this.onReset = undefined;

    this.init = function () {
        /* if (self.wrap.find('.aniWrap').length > 0) {
            self.wrap.find('.aniWrap').remove();
        } */

        self.cnt = 0;
        self.allChk = false;

        self.makeWrap();
        self.makeItem();
        self.makeBtn();

        self.addEventItem();
        self.addEventBtn();
    }

    this.makeWrap = function () {
        /* var html = '<div class="aniWrap"></div>';
        self.wrap.append(html); */
        self.itemwrap = self.wrap.find('.aniWrap');
    }

    this.makeItem = function () {
        /* var html = '';
        for (var i = 0; i < self.adoItems.length; i++) {
            html += '<div class="aniItem aniItem' + (i + 1) + '" data-ado="' + self.adoItems[i] + '"></div>';
        }
        self.itemwrap.append(html); */
        self.items = self.itemwrap.find('.aniItem');
        for (var i = 0; i < self.adoItems.length; i++) {
            self.items.eq(i).attr('data-ado', self.adoItems[i]);
        }
        // self.items.html('');
        /* for (let j = 0; j < self.items.length; j++) {
            self.items.eq(j).append(`
                <div class="char"></div>
                <div class="item">
                    <div class="close"></div>
                </div>
            `);
        } */

        if (type == 'gif' || type == 'Gif') {
            /* for (let k = 0; k < self.items.length; k++) {
                self.items.eq(k).append(`
                    <div class="motionWrap">
                        <div class="cover"></div>
                        <img class="motion" src="`+ imgPath + self.imgItems[k] + `.gif" title="" alt="">
                    </div>
                `);
            } */
        }
    }

    this.makeBtn = function () {
        // self.itemwrap.append('<div class="soundBtn"></div>');
        self.soundBtn = self.itemwrap.find('.soundBtn');
    }

    this.addEventItem = function () {
        self.items.off('click').on('click', function (e) {
            e.stopPropagation();
            ado_stop();

            self.allChk = false;

            var $this = $(this);
            var ado = $(this).attr('data-ado');

            if (ado !== undefined) {
                if ($this.hasClass('ing')) {
                    $this.removeClass('ing on');

                    if (type == 'gif' || type == 'Gif') {
                        self.stopMotion(self.items);
                    }
                }
                else {
                    self.items.removeClass('on');
                    // $this.addClass('ing on');
                    effectAdo(ado, self.bStopOther, adoPath);
                    $this.addClass('ing on');

                    if (type == 'gif' || type == 'Gif') {
                        self.playMotion($this, true);
                    }
                }
            }

            self.items.length === self.itemwrap.find('.ing').length ? self.soundBtn.addClass('re') : self.soundBtn.removeClass('re');

            if (typeof (videoCon) != 'undefined') { videoCon.stop(); }

            $(`#${ado}`).off('ended').on('ended', function () {
                if (typeof (self.onEnded) !== 'undefined') { self.onEnded(false); }
                $this.removeClass('on');
                self.stopMotion(self.items);
            });

            if (typeof (self.onClick) !== 'undefined') { self.onClick($(this)); }
        });
    }

    this.addEventBtn = function () {
        self.soundBtn.off('click').on('click', function (e) {
            e.stopPropagation();
            ado_stop();

            self.items.removeClass('ing on');

            if ($(this).hasClass('re')) {
                $(this).removeClass('re');
                self.allChk = false;
                self.stopMotion(self.items);
                if (typeof (self.onReset) !== 'undefined') { self.onReset(); }
            }
            else {
                $(this).addClass('re');
                self.allChk = true;
                self.cnt = 0;
                self.allSound('start');
                if (typeof (self.onPlayAll) !== 'undefined') { self.onPlayAll(); }
            }
        });

        self.items.find('.item .close').off('click').on('click', function (e) {
            e.stopPropagation();
            ado_stop();
            effectAdo('click');
            $(this).parent().hide();
            $(this).parent().parent().removeClass("ing");
        });
    }

    this.playMotion = function (pjThis, pbIsRefresh) {
        var wrap = pjThis.find('.motionWrap');
        var motion = pjThis.find('.motion');

        if (!motion.is('[data-url]')) {
            motion.attr('data-url', motion.attr('src'));
        }

        if (pbIsRefresh) {
            pjThis.siblings().find('.motionWrap').removeClass('on');
            pjThis.siblings().find('.motion').off('load');
            motion.attr('src', `${motion.attr('data-url')}?_r=${Date.now()}`);
            motion.off('load').on('load', function () {
                $(this).off('load');
                wrap.addClass('on');
            });
        }
        else {
            pjThis.siblings().find('.motionWrap').removeClass('on');
            wrap.addClass('on');
        }
    }

    this.stopMotion = function (pjItems) {
        pjItems.each(function () {
            var wrap = $(this).find('.motionWrap');
            wrap.removeClass('on');
            wrap.find('.motion').off('load');
        });
    }

    this.allSound = function (play) {
        if (self.allChk) {
            if (play === undefined) self.cnt++;
            var target = self.items.eq(self.cnt);
            var ado = target.attr('data-ado');
            effectAdo(ado, self.bStopOther, adoPath);
            self.items.removeClass('on');
            target.addClass('ing on');

            if (type == 'gif' || type == 'Gif') {
                self.playMotion(target, true);
            }

            $(`#${ado}`).off('ended').on('ended', function () {
                if (self.items.length - 1 > self.cnt) self.allSound();
                if (typeof (self.onEnded) !== 'undefined') { self.onEnded(true); }
                target.removeClass('on');
                self.stopMotion(target, true);
            });
        }
    }
}


/* ---------------------------------------
 * 스탬프 컨텐츠
 * --------------------------------------- */
/**
 * 스탬프 컨텐츠
 * @param {*} wrap stampContents가 만들어질 요소
 * @param {boolean} bStopOther 다른 음성요소 정지 시킬지 여부
 */
var stampContents = function stampContents(wrap, bStopOther) {
    var self = this;
    this.wrap = wrap;

    this.stamp, this.item;

    this.bStopOther = (bStopOther === false) ? false : true;

    var stampNum = 0;
    var soundNum = 0;
    var setT1;

    this.init = function () {
        self.makeHtml();

        self.stamp.off(sAnimationStart).on(sAnimationStart, function () {
            self.soundOn();
        });
    }

    this.makeHtml = function () {
        if (wrap.find('.stamp')) wrap.find('.stamp').remove();
        if (wrap.find('.item')) wrap.find('.item').remove();
        stampNum = Math.floor(random(8, 1));
        var html = '';
        html += '<div class="stamp"></div>';
        html += '<div class="item"></div>';
        self.wrap.append(html);

        self.stamp = self.wrap.find('.stamp');
        self.item = self.wrap.find('.item');
    }

    this.soundOn = function () {
        // effectAdo('stamp', self.bStopOther);
        setT1 = setTimeout(function () {
            self.item.show().addClass('bounce2 st' + stampNum);

            soundNum = stampNum % 4;
            if (soundNum == 0) {
                soundNum = 4;
            }
            effectAdo(("stamp" + soundNum), self.bStopOther);
        }, 1200);
    }
}

/* ---------------------------------------
 * 슬라이드 컨텐츠
 * --------------------------------------- */
/**
 * 슬라이드 컨텐츠
 * @param {*} wrap slidingContents가 만들어질 요소
 * @param {string} location slidingContents의 위치 ('top', 'bottom', 'left', 'right')
 * @param {string} type slidingContents의 구동 방식 ('1, '2')
 * @param {boolean} bStopOther 다른 음성요소 정지 시킬지 여부
 */

var slidingContents = function slidingContents(wrap, location, type, bStopOther) {
    var self = this;
    this.wrap = wrap;                            // .slideWrap

    this.slide = wrap.find('.slide');            // .slideWrap .slide
    this.slideBtn = wrap.find('.slideBtn');      // .slideWrap .slideBtn

    this.bStopOther = (bStopOther === false) ? false : true;
    this.effectSnd = 'click';                    // 클릭효과음 ID값

    this.movingType = type || '1';               // 구동 방식 ('1, '2')
    this.location = location || 'left';          // 위치 ('top', 'bottom', 'left', 'right')

    this.slideL;                                 // .slideWrap .slide의 길이
    this.slideW = self.slide.css('width');       // .slideWrap .slide의 width
    this.slideH = self.slide.css('height');      // .slideWrap .slide의 height
    this.btnL;                                   // .slideWrap .slideBtn의 길이
    var btnLength = '120px';                     // .slideWrap .slideBtn의 width가 없을시
    var setp1 = 0.2;                             // setp1 time
    var setp2 = 0.3;                             // setpw time

    this.init = function () {
        self.setting();
        self.slideBtn.off('click').on('click', function () {
            effectAdo(self.effectSnd, self.bStopOther);
            if (!self.wrap.hasClass('open')) {
                self.open();
            }
            else {
                self.close();
            }
        });
    };

    this.setting = function () {
        self.wrap.removeClass('open').addClass(self.location);

        self.slide.removeAttr('style');

        if (self.location == 'left' || self.location == 'right') {
            self.slideL = self.slideW;
            self.btnL = (self.slideBtn.css('width') == '0px') ? btnLength : self.slideBtn.css('width');
            self.slideBtn.css({
                width: self.btnL,
                height: '100%',
            });
        }
        else if (self.location == 'top' || self.location == 'bottom') {
            self.slideL = self.slideH;
            self.btnL = (self.slideBtn.css('height') == '0px') ? btnLength : self.slideBtn.css('height');
            self.slideBtn.css({
                width: '100%',
                height: self.btnL,
            });
        }

        self.slide.css(self.location, -(pxToInt(self.slideL) - pxToInt(self.btnL)) + 'px');

        self.wrap.css({
            width: self.slideW,
            height: self.slideH,
        });
        self.wrap.css(self.location, '0px');
    };

    this.open = function () {
        self.wrap.addClass('open');

        switch (self.movingType) {
            case '1':
            default:
                self.slide.css('transition', self.location + ' ' + setp2 + 's linear');
                self.slide.css(self.location, '0px');
                self.slide.off(sTransitionEnd).on(sTransitionEnd, function () {
                    self.slide.css('transition', '');
                });
                break;
            case '2':
                self.slide.css('transition', self.location + ' ' + setp1 + 's linear');
                self.slide.css(self.location, -pxToInt(self.slideL) + 'px');

                self.slide.off(sTransitionEnd).on(sTransitionEnd, function () {
                    self.slide.css('transition', '');
                    self.slide.css('transition', self.location + ' ' + setp2 + 's linear');
                    self.slide.css(self.location, '0px');
                });
                break;
        }
    };

    this.close = function () {
        self.wrap.removeClass('open');

        switch (self.movingType) {
            case '1':
            default:
                self.slide.css('transition', self.location + ' ' + setp2 + 's linear');
                self.slide.css(self.location, -(pxToInt(self.slideL) - pxToInt(self.btnL)) + 'px');

                self.slide.off(sTransitionEnd).on(sTransitionEnd, function () {
                    self.slide.css('transition', '');
                });
                break;
            case '2':
                self.slide.css('transition', self.location + ' ' + setp2 + 's linear');
                self.slide.css(self.location, -pxToInt(self.slideL) + 'px');

                self.slide.off(sTransitionEnd).on(sTransitionEnd, function () {
                    self.slide.css('transition', '');
                    self.slide.css('transition', self.location + ' ' + setp1 + 's linear');
                    self.slide.css(self.location, -(pxToInt(self.slideL) - pxToInt(self.btnL)) + 'px');
                });
                break;
        }
    };
}

/* ---------------------------------------
 * 함께 읽기
 * --------------------------------------- */
/**
 * 함께 읽기
 * @param {*} wrap toReadContents가 만들어질 요소
 * @param {string} effect 버튼 클릭시 재생되는 음성
 * @param {boolean} bStopOther 다른 음성요소 정지 시킬지 여부
 */
var toReadContents = function toReadContents(wrap, effect, bStopOther) {
    var self = this;
    this.wrap = wrap;

    this.toRead, this.btn;

    effect = effect || 'count';
    this.effect = effect
    this.bStopOther = (bStopOther === false) ? false : true;

    var toReadTimer;
    var time;

    this.init = function () {
        wrap.find('.toRead, .btnToRead').remove();
        self.makeArea();
        clearTimeout(toReadTimer);
        self.btn.removeClass('on');
        self.toRead.hide().removeClass('motion');

        self.btn.off('click').on('click', function () {
            var $this = $(this);
            self.btnEvent($this);
        });
    };

    this.makeArea = function () {
        var html = '';
        html += '<div class="toRead"></div>';
        html += '<div class="btnToRead"></div>';
        self.wrap.append(html);
        self.toRead = self.wrap.find('.toRead');
        self.btn = self.wrap.find('.btnToRead');
    };

    this.btnEvent = function (ts) {
        ts.addClass('on');
        self.toRead.show().addClass('motion');
        time = self.toRead.css('animation-duration');
        time = time.replace('s', '');
        time = Number(time) * 1000;
        effectAdo(self.effect, self.bStopOther);
        clearTimeout(toReadTimer);
        toReadTimer = setTimeout(function () {
            ts.removeClass('on');
            self.toRead.hide().removeClass('motion');
        }, time + 2000);
    };
}

/* ---------------------------------------
 * 링크 버튼
 * --------------------------------------- */
/**
 * 링크 버튼
 * @param {JQuery} wrap linkContents 가 만들어질 요소
 * @param {Number} items 링크 버튼의 총 개수
 * @param {Array} aLink 링크
 */
var linkContents = function linkContents(wrap, items, aLink) {
    var self = this;
    this.wrap = wrap;           // .linkContent parent

    this.itemwrap = '';         // .linkContent
    this.linkItems = items;     // .linkItem의 총 개수
    this.items = '';            // .linkContent .linkItem
    this.itemareas = '';        // .linkContent .linkItem .linkArea
    this.itembtns = '';         // .linkContent .linkItem .linkBtn

    this.linkItemWrap = '';    // .linkContent .linkItemWrap

    this.bStopOther = true;     // 다른 음성요소 정지 시킬지 여부
    this.effectSnd = 'click';   // 클릭효과음 ID값

    // callback
    this.onClick = undefined;

    this.init = function () {
        if (self.wrap.find('.linkItem').length > 0) {
            self.wrap.find('.linkContent').remove();
        }

        // 강제 클래스 부여
        var knWrapIdx = parseInt(self.wrap.attr('class').split(' ')[1].slice(-1), 10);
        self.wrap.addClass('link');
        //self.wrap.closest('.contents').find('.btnPopFull' + knWrapIdx).addClass('linkbtn');

        self.makeWrap();
        self.makeItem();

        var ksUrl = '';
        self.items.each(function (idx) {
            ksUrl = (aLink.length === 1) ? aLink[0] : aLink[idx];
            $(this).attr('data-url', ksUrl);
        });

        self.itemareas.add(self.itembtns).on('click', function () {
            var $ts = $(this);
            var ksUrl = '';
            ksUrl = $ts.closest('[data-url]').attr('data-url');
            window.open(ksUrl, '_blank');
        });
    };

    this.makeWrap = function () {
        var html = '<div class="linkContent"></div>';
        self.wrap.append(html);
        self.itemwrap = self.wrap.find('.linkContent');
    };

    this.makeItem = function () {
        if (self.itemwrap.find('.linkItemWrap').length === 0) {
            self.itemwrap.append('<div class="linkItemWrap"></div>');
        }
        self.linkItemWrap = self.itemwrap.find('.linkItemWrap');

        var html = '';
        for (var i = 0; i < self.linkItems; i++) {
            html += '<div class="linkItem linkItem' + (i + 1) + '" data-idx="' + (i + 1) + '">';
            html += '    <div class="linkArea"></div>';
            html += '    <div class="linkBtn"></div>';
            html += '</div>';
        }
        self.itemwrap.find('.linkItemWrap').append(html);
        self.items = self.itemwrap.find('.linkItem');
        self.itemareas = self.itemwrap.find('.linkArea');
        self.itembtns = self.itemwrap.find('.linkBtn');
    };
};

/* =========================================================================================
 * 기타
 * ====================================================================================== */
/* ---------------------------------------
 * 배경
 * --------------------------------------- */
/**
 * #wrap의 배경색 변경
 * @param {string} color 배경색
 */
function bgColorChange(color) {
    $('#container').css('background-color', 'rgb(0, 0, 0)');
    $('#wrap').css('background-color', color);
}

/* ---------------------------------------
 * 딤드
 * --------------------------------------- */
/**
 * 딤드 생성
 */
function makeMask() {
    $('#container').append('<div class="mask"></div>');
    $('#container .mask').css({
        'width': '100%',
        'height': '100%',
        'background-color': 'rgba(0,0,0,0.5)'
    });
}

/**
 * 지정 컨텐츠 내에 딤드 생성
 * @param {*} pjContents 딤드가 만들어질 요소
 * @param {number} pnzIndex 딤드의 z_index
 */
function makeContentsMask(pjContents, pnzIndex) {
    pjContents.append('<div class="mask"></div>');
    pjContents.find('.mask').css({
        'width': '100%',
        'height': '100%',
        'background-color': 'rgba(0,0,0,0.5)'
    });
    if (pnzIndex) {
        pjContents.find('.mask').css({
            'position': 'absolute',
            'left': '0px',
            'top': '0px',
            'z-index': pnzIndex
        });
    }
}

/**
 * 딤드 제거
 */
function removeMask() {
    $('#container .mask').remove();
}

/* ---------------------------------------
 * 랜덤 및 섞기
 * --------------------------------------- */
/**
 * pnMin초과 pnMax미만에서의 랜덤값
 * pnMin < result < pnMax
 * @param {number} pnMin 변환할 텍스트
 * @param {number} pnMax 변환할 텍스트
 */
function randomArbitrary(pnMin, pnMax) {
    return Math.random() * (pnMax - pnMin) + pnMin;
}

/**
 * pnMin이상 pnMax이하에서의 랜덤값
 * pnMin <= result <= pnMax integer
 * @param {number} pnMin 변환할 텍스트
 * @param {number} pnMax 변환할 텍스트
 */
function random(pnMin, pnMax) {
    return parseInt(Math.random() * ((pnMax + 1) - pnMin)) + pnMin;
}

/**
 * 배열 섞기(같을 수 있음)
 * @param {array} $arr 복제 대상 배열
 */
function shuffle($arr) {
    var kaTarget = $arr.concat();
    var j, koTemp;
    for (var i = kaTarget.length - 1; i > 0; --i) {
        j = Math.floor(Math.random() * (i + 1)); // 0<= j <= i 값
        koTemp = kaTarget[i];
        kaTarget[i] = kaTarget[j];
        kaTarget[j] = koTemp;
    }
    return kaTarget;
}

/**
 * 원본과 같지 않게 섞기
 * @param {array} $arr 복제 대상 배열
 */
function getNotDuplicateRanArray(paTarget) {
    // 섞기
    function shuffle(pArr) {
        var kaTarget = pArr.concat();
        var j, koTemp;
        for (var i = kaTarget.length - 1; i > 0; --i) {
            j = Math.floor(Math.random() * (i + 1));
            koTemp = kaTarget[i];
            kaTarget[i] = kaTarget[j];
            kaTarget[j] = koTemp;
        }
        return kaTarget;
    }
    // 같은지 검증
    function arrayEquals(a, b) {
        return Array.isArray(a) &&
            Array.isArray(b) &&
            a.length === b.length &&
            a.every(function (val, index) {
                return val === b[index];
            });
        //return JSON.stringify(arr1) === JSON.stringify(arr2);
    }

    var knCnt = 0; // while반복문 실행 횟수
    var kaShuffle; // 섞은 결과
    var kbEqual; // 같은지 검증 결과
    var kaProcess = []; // 각 단계 과정 복사

    if (paTarget.length <= 1) {
        return {
            array: paTarget.concat(),
            count: knCnt,
            process: kaProcess.concat()
        };
    }

    while (true) {
        knCnt++;

        kaShuffle = shuffle(paTarget);
        kbEqual = arrayEquals(paTarget, kaShuffle);
        kaProcess.push({
            count: knCnt,
            value: JSON.stringify(kaShuffle)
        });
        // 같지 않다면 return
        if (!kbEqual) {
            return kaShuffle;
            /* return {
                count: knCnt,
                original: paTarget.concat(),
                process: kaProcess.concat(),
                shuffle: kaShuffle
            }; */
        }
    }
}

/* ---------------------------------------
 * 탐색
 * --------------------------------------- */








/**
 * paArea배열에서 pnValue의 구간
 * 결과값이 색인이 큰 쪽에 수렴
 * @param {*} paArea 시작값
 * @param {*} paArea 끝값
 */
/*
paArea [0, 100, 200] 일때,
pnValue
-1			-1
201			Number.MAX_VALUE;
0			0
1           1
99			1
100			2
101         2
199			2
200			2
*/
function findAreaIdx(pnValue, paArea) {
    var knIdx = -1;

    // 0 → length-1 까지 탐색
    // < [0]
    if (pnValue < paArea[0]) {
        knIdx = -1;
    }
    // [length - 1] <
    else if (pnValue > paArea[paArea.length - 1]) {
        knIdx = Number.MAX_VALUE;
    }
    // [0] ===
    else if (pnValue === paArea[0]) {
        knIdx = 0;
    }
    // find index
    else {
        for (var i = 0; i < paArea.length - 2; ++i) {
            if (paArea[i] < pnValue && pnValue <= paArea[i + 1]) {
                knIdx = i + 1;
            }
        }
        if (knIdx === -1 && paArea[paArea.length - 2] < pnValue) {
            knIdx = paArea.length - 1;
        }
    }
    return knIdx;
}

/**
 * paArea배열에서 pnValue의 구간
 * 결과값이 색인이 작은 쪽에 수렴
 * @param {*} paArea 시작값
 * @param {*} paArea 끝값
 */
/*
paArea [0, 100, 200] 일때,
pnValue
-1			-1
201			Number.MAX_VALUE;
0			0
1           0
99			0
100			1
101         1
199			1
200			1
*/
function findAreaIdx2(pnValue, paArea) {
    var knIdx = -1;

    // 0 → length-1 까지 탐색
    // < [0]
    if (pnValue < paArea[0]) {
        knIdx = -1;
    }
    // [length - 1] <
    else if (pnValue > paArea[paArea.length - 1]) {
        knIdx = Number.MAX_VALUE;
    }
    // [length - 1] ===
    else if (pnValue === paArea[paArea.length - 1]) {
        knIdx = paArea.length - 1;
    }
    // find index
    else {
        for (var i = 0; i < paArea.length - 1; ++i) {
            if (paArea[i] <= pnValue && pnValue <= paArea[i + 1]) {
                knIdx = i;
            }
        }
    }
    return knIdx;
}

/* ---------------------------------------
 * 변환 및 추출
 * --------------------------------------- */
/**
 * 지정 텍스트를 초성으로 변환
 * @param {string} str 변환할 텍스트
 */
function cho_hangul(str) {
    cho = ["ㄱ", "ㄲ", "ㄴ", "ㄷ", "ㄸ", "ㄹ", "ㅁ", "ㅂ", "ㅃ", "ㅅ", "ㅆ", "ㅇ", "ㅈ", "ㅉ", "ㅊ", "ㅋ", "ㅌ", "ㅍ", "ㅎ"];
    result = "";
    for (i = 0; i < str.length; i++) {
        code = str.charCodeAt(i) - 44032;
        if (code > -1 && code < 11172) result += cho[Math.floor(code / 588)];
        else result += str.charAt(i);
    }
    return result;
}

/**
 * 지정 객체를 px을 제외한 값으로 변환
 * 99px to 99
 * @param {*} psPx 변환할 객체
 */
function pxToInt(psPx) {
    //return parseFloat(strPx);
    //return parseFloat(psPx.split('px')[0]);
    return !isNaN(psPx) || psPx === 'auto' ? psPx : parseFloat(psPx.replace('px', ''));
}

/**
 * 숫자를 자릿수 만큼 0으로 채워서 추출
 * @param {number} pn 자릿수
 * @param {*} pnWidth 변환할 객체
 */
function digit(pn, pnWidth) {
    if (isNaN(pnWidth) || !pnWidth) {
        pnWidth = 2;
    }
    pn = pn + '';
    return (pn.length >= pnWidth) ? pn : new Array(pnWidth - pn.length + 1).join('0') + pn;
}

/**
 * 숫자를 자릿수 만큼 0으로 채워서 추출(10보다 작은 값에 한정)
 * @param {number} pn 자릿수
 */
function itostr(pn) {
    return (pn < 10) ? '0' + pn : '' + pn;
}

/**
 * 숫자를 고정 소수점 표기법으로 변환
 * @param {*} poValue 변환할 객체
 * @param {number} pn 고정 소수점 자리수
 */
function toFixed(poValue, pn) {
    pn = pn === 0 ? 0 : pn || 1;
    return Number(Number(String(poValue)).toFixed(pn));
}

/**
 * 확장자를 포함한 html파일명 추출
 */
function getFileName() {
    var ksUrl = window.location.href;
    ksUrl = ksUrl.substring(ksUrl.lastIndexOf('/') + 1);
    return (ksUrl.match(/[^.]+(\.[^?#]+)?/) || [])[0].split('?')[0];
}

/**
 * eval대체
 * @param {string} psName 실행 값
 */
function eval(psName) {
    return new Function('return ' + psName)();
}

/* ---------------------------------------
 * 판단
 * --------------------------------------- */
/**
 *  value의 값이 비어있는지 아닌지 판단
 *  @param {*} value 판단이 필요한 객체
 */
function isNotNull(value) {
    if (value == '' || value == null || value == undefined || (value != null && typeof value == "object" && !Object.keys(value).length)) {
        return false;
    }
    else {
        return true;
    }
}

/**
 *  한글만 입력 가능
 *  @param {*} e 판단이 필요한 객체
 */
function onlyKorean(e) {
    var ksPrevValue = '';
    var ksValue = e.target.value;
    if (/^[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]*$/.test(ksValue)) {
        ksPrevValue = ksValue;
        e.target.value = ksValue;
    } else {
        e.target.value = ksPrevValue;
    }
}

/**
 *  숫자만 입력 가능
 *  @param {*} e 판단이 필요한 객체
 */
function onlyNumber(e) {
    var ksPrevValue = '';
    var ksValue = e.target.value;
    if (/^[0-9]*$/.test(ksValue)) {
        ksPrevValue = ksValue;
        e.target.value = ksValue;
    } else {
        e.target.value = ksPrevValue;
    }
}

// 사용자에 의해 이벤트가 발생했는지 여부 판별
function isHuman(e) {
    var kbIsUser = false;

    // javascript event 객체
    if (e && !e.originalEvent && e.isTrusted === true) {
        kbIsUser = true;
    }
    // jquery event 객채
    if (e && e.originalEvent && e.originalEvent.isTrusted === true) {
        kbIsUser = true;
    }

    return kbIsUser;
}

// 사용자에 의해 이벤트가 발생했는지 여부 판별
function isTrusted(e) {
    var kbIsUser = false;

    if (e.originalEvent) {
        kbIsUser = e.originalEvent.isTrusted;
    }
    else {
        kbIsUser = e.isTrusted;
    }

    return kbIsUser;
}

// iframe요소인지 여부
function isIframe() {
    return window.top !== window.self;
}

/* ---------------------------------------
 * 좌표
 * --------------------------------------- */

function getXFromWrap(e) {
    // mobile
    if (typeof (e.pageX) === 'undefined') {
        return e.originalEvent.changedTouches[0].pageX - wrapTop.offset().left;
    }
    // other
    else {
        return e.pageX - $('#wrap').offset().left;
    }
}

function getYFromWrap(e) {
    return GameManager.event.isTouchDevice ? e.originalEvent.changedTouches[0].pageY - wrapTop.offset().top : e.pageY - wrapTop.offset().top;
}


/* ---------------------------------------
 * 쿠키
 * --------------------------------------- */
/**
 * 쿠키 세팅
 * @param {string} name 쿠키 명칭
 * @param {boolean} value
 * @param {number} exp
 */
var setCookie = function(name, value, exp) {
    var date = new Date();
    date.setTime(date.getTime() + exp * 24 * 60 * 60 * 1000);
    document.cookie = name + '=' + value + ';expires=' + date.toUTCString() + ';';
};

/**
 * 쿠키 가져오기
 * @param {string} name 쿠키 명칭
 */
var getCookie = function(name) {
    var value = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
    return value ? value[2] : null;
};

/**
 * 쿠키 삭제
 * @param {string} name 쿠키 명칭
 */
var deleteCookie = function(name) {
    document.cookie = name + '=; expires=Thu, 01 Jan 1999 00:00:10 GMT;';
}

/* ---------------------------------------
 * 테스터
 * --------------------------------------- */

function runTest() {
    wrapTop.addClass('test2');
}

/**
 * scroll contents 최대 너비값 계산
 * @param {jQuery} pjScrollListWrap scroll contents
 */
function calculateScrollSize(pjScrollListWrap) {
    var kaWidth = [];
    kaWidth.push(pjScrollListWrap[0].scrollWidth);
    kaWidth.push(0);
    pjScrollListWrap.children().each(function (idx, value) {
        kaWidth[1] += $(this).outerWidth(true);
    });
    var knMaxWidth = Math.max(kaWidth[0], kaWidth[1]);
    return {
        array: kaWidth,
        max: knMaxWidth
    };
}

/**
 * 시간 변환
 * @param {number} paTime 바꿀 대상
 * @param {number} pnValue 바꿀 시간
 */
function chgTime(paTime, pnValue) {
    paTime.forEach(function (value, idx, self) {
        self[idx] = toFixed(value + pnValue);
    });
    console.log('time: ', paTime);
}

/**
 * 음성 배속 변경
 * @param {number} pnSpd 배속값
 */
function chgAdoSpd(pnSpd) {
    $('audio').each(function () {
        $(this)[0].playbackRate = pnSpd;
    });
    if (!$('audio').is('data-play-rate')) {
        $('audio').attr('data-play-rate', pnSpd);
        $('audio').on('play', function () {
            if (!$(this).is('data-play-rate')) {
                $(this)[0].playbackRate = Number($(this).attr('data-play-rate'));
            }
        });
    }

    // 전자저작물
    if (typeof (audioObj) !== 'undefined') {
        $(audioObj).each(function () {
            $(this)[0].playbackRate = pnSpd;
        });
        if (!$(audioObj).is('data-play-rate')) {
            $(audioObj).attr('data-play-rate', pnSpd);
            $(audioObj).on('play', function () {
                if (!$(this).is('data-play-rate')) {
                    $(this)[0].playbackRate = Number($(this).attr('data-play-rate'));
                }
            });
        }
    }
}

/**
 * 영상 배속 변경
 * @param {number} pnSpd 배속값
 */
function chgVdoSpd(pnSpd) {
    $('video').each(function () {
        $(this)[0].playbackRate = pnSpd;
    });
    if (!$('video').is('data-play-rate')) {
        $('video').attr('data-play-rate', pnSpd);
        $('video').on('play', function () {
            if (!$(this).is('data-play-rate')) {
                $(this)[0].playbackRate = Number($(this).attr('data-play-rate'));
            }
        });
    }
}

/**
 * 음성 현재 재생 시간 추출
 */
function getAdoTime() {
    var kaTime = [];
    $('audio').each(function () {
        kaTime.push(toFixed($(this)[0].currentTime));
    });
    console.log('audio: ', kaTime);
}

/**
 * 영상 현재 재생 시간 추출
 */
function getVdoTime() {
    var kaTime = [];
    $('video').each(function () {
        kaTime.push(toFixed($(this)[0].currentTime));
    });
    console.log('video: ', kaTime);
}

/**
 * 음성 전체 길이 추출
 */
function getAdoDuration() {
    var kaTime = [];
    $('audio').each(function () {
        kaTime.push(toFixed($(this)[0].duration));
    });
    console.log('audio: ', kaTime);
}

/**
 * 영상 전체 길이 추출
 */
function getVdoDuration() {
    var kaTime = [];
    $('video').each(function () {
        kaTime.push(toFixed($(this)[0].duration));
    });
    console.log('video: ', kaTime);
}

/**
 * pjTarget의 animation-duration 속성값에서 시간만 추출하여 ms로 변환(소수점 1자리만 허용)
 * @param {*} pjTarget 추출 대상
 */
function getAniDuration(pjTarget) {
    return Number(Number(pjTarget.css('animation-duration').slice(0, -1)).toFixed(1)) * 1000;
}

/**
 * 배경에 스케일 적용
 * @param {*} pnScale 화면 지정 배율
 */
function chgBgSize(pnScale) {
    var tmpFactor = pnScale || 0.5;

    $('body').css({
        transform: 'scale(' + tmpFactor + ')',
        transformOrigin: '0px 0px'
    });

    // getScale function redefine
    this.getScale = function () {
        factor = tmpFactor;
    };
    this.getScale();
}

/**
 * css overflow:hidden 요소들만 출력
 */
function getOFH() {
    $('*').each(function () {
        if ($(this).css('overflow') === 'hidden') {
            console.log($(this));
        }
    });
}

/**
 * 테스트 환경 조성
 */
function runTest() {
    $('#wrap').addClass('test2');
}

/**
 * 모션의 data-step 값 변경
 * @param {*} step
 */
function chgMotionStep(step) {
    contents.find('[data-step]').attr('data-step', step);
    contents.find('[data-step]').addClass('stop');
    contents.find('[data-step]').css({
        'opacity': `1`,
        'display': 'block',
        'visibility': 'visible',
        'animation': 'none',
    })
    // contents.find('[data-step]').addClass('animationNone');
}

/* =========================================================================================
 * 과목 개별 기능
 * ====================================================================================== */
$(window).on('load', function () {
    /**
     * 국어
     */
    // 테마 색상 변경(인트로)
    // if ($('#wrap').hasClass('kor')) {
    //     var colorPick = 0; // 기본 컬러
    //     var cookie = 'colorPick'// 색 지정 쿠키

    //     bgColorChange(colorList[colorPick]);

    //     if ($('#wrap').hasClass('intro')) {
    //         var colorPickerHtml = `
    //             <div class="colorPicker">
    //                 <ul>
    //                     <li></li>
    //                     <li></li>
    //                     <li></li>
    //                     <li></li>
    //                     <li></li>
    //                     <li></li>
    //                 </ul>
    //             </div>
    //         `
    //         $('#wrap').find('.contents').append(colorPickerHtml);


    //         $('.colorPicker li').eq(colorPick).addClass('on');
    //         $('.sub').css('color', colorList[colorPick]);
    //         $('.sub').css('color', colorList[colorPick]);
    //         $.cookie(cookie, colorPick);

    //         $('.colorPicker li').on('click', function () {
    //             var idx = $(this).index();

    //             bgColorChange(colorList[idx]);
    //             $('.sub').css('color', colorList[idx]);
    //             $('.sub > span').css('background-color', colorList[idx]);
    //             $('.colorPicker li').removeClass('on');
    //             $(this).addClass('on');
    //             $.cookie(cookie, idx);
    //             effectAdo('click');
    //         });
    //     }
    // }

    /**
     * 수학
     */
    // 음원 버튼(인트로)
    if ($('#effMode').length > 0) {
        setCookie('effMode', true, 1);
    }

    if (getCookie('effMode') == 'true') {
        $('#effMode').addClass('on');
    }

    $('#effMode').on('click', function () {
        effectAdo('click');
        deleteCookie('effMode');

        if ($(this).hasClass('on')) {
            $(this).removeClass('on');
        }
        else {
            $(this).addClass('on');
            setCookie('effMode', true, 1);
        }
    });


    // 수익 버튼
    $('.math_t').on('click', function() {
        effectAdo('click');
        var src = $(this).attr('data-url');
        window.open(src, 'menubar=no', false);
    });

    // 흥미 진진 활동
    $('.btnPopup[data-type="challenge"]').off('click').on('click', function(){
        var $this = $(this);

        $('.btnPopup[data-type="challenge"]').addClass('dis');
        $this.toggleClass('on');

        if($this.hasClass('sol')){
            effectAdo('sol');
        }
        else if($this.hasClass('tog')){
            effectAdo('tog');
        }

        $('#sol, #tog').off('ended').on('ended', function(){
            $this.removeClass('on');
            if($this.hasClass('sol')){
                $this.parent().find('.popup.sol').show();
            }
            else if($this.hasClass('tog')){
                $this.parent().find('.popup.tog').show();
            }

            $('.btnPopup[data-type="challenge"]').removeClass('dis');
        });
    });

    $('.popup[data-type="challenge"]').find('.close').off('click').on('click', function(){
        var $this = $(this);

        effectAdo('click');
        $this.parent('.popup').hide();
    });

    $('.popup[data-type="challenge"]').find('.hwalbtn').off('click').on('click', function(){
        var $this = $(this);
        var url = $this.attr('data-url');

        effectAdo('click');
        window.open(url,'_blank');
    });

    // 확인 문제
    if ($('#wrap.math').hasClass('quiz')) {
        // 초기 세팅
        var introHtml = `
            <div class="introPage">
                <!-- 난이도 하 문항 선택 -->
                <ul class="question easy">
                    <li>0</li>
                    <li>1</li>
                    <li>2</li>
                    <li class="act">3</li>
                </ul>
                <!-- 난이도 중 문항 선택 -->
                <ul class="question normal">
                    <li>0</li>
                    <li>1</li>
                    <li class="act">2</li>
                    <li>3</li>
                </ul>
                <!-- 난이도 상 문항 선택 -->
                <ul class="question hard">
                    <li>0</li>
                    <li class="act">1</li>
                    <li>2</li>
                    <li>3</li>
                </ul>
                <!-- 총 문항  -->
                <span class="sum">
                    6
                </span>

                <div class="startBtn"></div>
            </div>
        `
        $('.contentsWrap').before(introHtml);

        var contentsFrame = `
            <div class="pageing">
                <div class="btn prev"></div>
                <div class="btn next"></div>
            </div>
            <div class="headerSec">
                <ul class="setContent"></ul>
                <div class="return"></div>
                <div class="bline"></div>
                <div class="numberbox easy on">1</div>
                <div class="difficulty"></div>
            </div>

            <!-- 완료 버튼 -->
            <div class="finish_btn"></div>
        `
        $('#wrap.math').find('.contentsWrap').append(contentsFrame);
        $('.setContent').hide();
        $('.contentsWrap, .contents').hide();
        $('.introPage').show();

        var easy = 3;
        var normal = 2;
        var hard = 1;

        // 각 문항 조정
        $('.question li').on('click', function () {
            effectAdo('click');
            $(this).addClass('act');
            $(this).siblings().removeClass('act');

            if ($(this).parent().hasClass('easy')) {
                easy = $(this).index();
            } else if ($(this).parent().hasClass('normal')) {
                normal = $(this).index();
            } else {
                hard = $(this).index();
            }
            $('.sum').html(easy + normal + hard);
        });

        // 시작하기 버튼
        var totalNum;
        var easy_page = ['clickPage1', 'clickPage2', 'clickPage3'];
        var normal_page = ['clickPage4', 'clickPage5', 'clickPage6'];
        var hard_page = ['clickPage7', 'clickPage8', 'clickPage9'];
        var easy_show = [];
        var normal_show = [];
        var hard_show = [];
        var easy_rand = [];
        var noraml_rand = [];
        var hard_rand = [];
        var currentPage = 0;
        var cur = 0;

        $('.startBtn').click(function () {
            ado_stop();
            effectAdo('click');
            totalNum = easy + normal + hard;

            easy_rand = shuffleRandom(easy);
            normal_rand = shuffleRandom(normal);
            hard_rand = shuffleRandom(hard);

            easy_show = make_quiz(easy_page, easy_rand, easy);
            normal_show = make_quiz(normal_page, normal_rand, normal);
            hard_show = make_quiz(hard_page, hard_rand, hard);
            click_page = easy_show.concat(normal_show, hard_show);

            if (totalNum == 0) {
                alert('문제를 선택하세요.');
                return false;
            }
            if (totalNum == 1) {
                currentPage = 1;
            }

            $('.setContent li').remove();

            $('.introPage').hide();
            $('.contentsWrap').show();
            $('.setContent').show();
            $('.pageing').show();
            $('.pageing').find('.prev').addClass('dis');

            for (var i = 0; i < totalNum; i++) {
                if (i < easy) {
                    $('.setContent').append('<li class="easy">' + (i + 1) + '</li>');
                } else if (i < (easy + normal)) {
                    $('.setContent').append('<li class="normal">' + (i + 1) + '</li>');
                } else if (i < (totalNum)) {
                    $('.setContent').append('<li class="hard">' + (i + 1) + '</li>');
                }
            }

            $('.setContent li').off('click').on('click', function () {
                var idx = $(this).index();
                currentPage = idx;
                var contents = $('.contents').eq(idx);
                var pageIdx = $('.' + click_page[idx]).index();
                var difficulty = $(this).attr('class');

                $(this).siblings().removeClass('on');
                $(this).addClass('on');

                $('.contents').hide();
                $('.contents').eq(pageIdx).show();

                resetContents();
                effectAdo('click');

                if (typeof contentScript_quiz !== 'undefined') {
                    contentScript_quiz(pageIdx, $('.contents').eq(pageIdx));
                }

                if (typeof contentScript !== 'undefined') {
                    contentScript(pageIdx, $('.contents').eq(pageIdx));
                }

                $('.numberbox').text(idx + 1);

                switch (difficulty) {
                    case 'easy':
                        $('.difficulty').css('background', 'url(../common/images/quizitem/difficulty_easy.png)');
                        $('.numberbox').removeClass('easy normal hard').addClass('easy');
                        break;
                    case 'normal':
                        $('.difficulty').css('background', 'url(../common/images/quizitem/difficulty_normal.png)');
                        $('.numberbox').removeClass('easy normal hard').addClass('normal');
                        break;
                    case 'hard':
                        $('.difficulty').css('background', 'url(../common/images/quizitem/difficulty_hard.png)');
                        $('.numberbox').removeClass('easy normal hard').addClass('hard');
                        break;
                }

                $('.pageing .btn').addClass('dis');

                cur = $('.setContent li.on').index();
                var num = $('.setContent li').length;
                if (cur !== 0) $('.pageing .prev').removeClass('dis');
                if (cur !== (num - 1)) $('.pageing .next').removeClass('dis');

                if(cur == num - 1) {
                    $('.ansbtn').click(function(){
                        if($(this).hasClass('re')){
                            $('.finish_btn').addClass('on');
                        }else{
                            $('.finish_btn').removeClass('on');
                            $('.bounce2').remove();
                        }
                    });
                }
            });

            $('.setContent li').eq(0).trigger('click');
            $('.' + click_page[0]).show();

            $('.bline').css('width', $('.setContent').width() + 140 + 'px');
        });

        // 페이지 이동
        $('.pageing .btn').off('click').on('click', function () {
            effectAdo('click');
            $('.solbtn').removeClass('on');

            if ($(this).hasClass('next')) {
                cur += 1;
            } else {
                cur -= 1;
            }

            $('.setContent li').eq(cur).trigger('click');
        });

        // 홈버튼
        $('.return').off('click').on('click',function(){
            $('.contentsWrap, .contents, .setContent').hide();
            $('.introPage').show();
            effectAdo('click');
        });

        $(".finish_btn").off('click').on("click", function() {
            effectAdo("click");
            $(this).removeClass("on");
        });
    }
});

/**
 * 국어
 */
/**
 * 누적 체크리스트
 * @param {JQuery} wrap  startContents 가 만들어질 요소
 * @param {Number} group 별표 그룹의 총 개수
 * @param {Number|Array} star 별표 그룹내 별의 총 개수(모두 같으면 정수, 그룹별로 다르다면 array)
 */
var starContents = function starContents(wrap, group, star) {
    var self = this;
    this.wrap = wrap;

    this.groupTotal = group || 1;
    this.starTotal = star || 3;

    this.conWrap = '';          // .starContent
    this.starGroups = '';       // .starContent .starGroup
    this.stars = '';            // .starContent .starGroup .star

    this.init = function () {
        /* if (self.wrap.find('.starContent').length > 0) {
            self.wrap.find('.starContent').remove();
        }

        // 깜빡임 방지
        imgPreLoad([
            '../common/images/clickitem/star1_on.png',
            '../common/images/clickitem/star2_on.png',
            '../common/images/clickitem/star3_on.png',
        ], true); */


        self.makeCon();
        self.makeStarGroup();
        self.makeStar();

        self.addEvent();
    };

    this.reset = function () {
        self.stars.removeClass('on');
    };

    this.makeCon = function () {
        /* var html = '';
        html += '<div class="starContent"></div>';
        self.wrap.append(html); */
        self.conWrap = self.wrap.find('.starContent');
    };

    this.makeStarGroup = function () {
        /* var html = '';
        for (var i = 0; i < self.groupTotal; ++i) {
            html += '<div class="starGroup starGroup' + (i + 1) + '"></div>';
        }
        self.conWrap.append(html); */
        self.starGroups = self.conWrap.find('.starGroup');
    };

    this.makeStar = function () {
        /* var html = '';
        var i, k;
        if (Array.isArray(self.starTotal)) {
            for (i = 0; i < self.starTotal.length; ++i) {
                html = '';
                for (k = 0; k < self.starTotal[i]; ++k) {
                    html += '<div class="star star' + (k + 1) + '"></div>';
                }
                self.starGroups.eq(i).append(html);
            }
        }
        else {
            self.starGroups.each(function () {
                html = '';
                for (k = 0; k < self.starTotal; ++k) {
                    html += '<div class="star star' + (k + 1) + '"></div>';
                }
                $(this).append(html);
            });
        } */

        self.stars = self.conWrap.find('.star');
    };


    this.addEvent = function () {
        self.stars.on('click', function () {
            effectAdo('click', false);

            var $ts = $(this);
            var idx = $ts.index();
            var stars = $ts.closest('.starGroup').find('.star');

            stars.removeClass('on');
            stars.slice(0, idx + 1).addClass('on');
        });
    };
};


// 확인 문제용
// 랜덤 숫자 생성
function shuffleRandom(n) {
    var ar = new Array();
    var temp;
    var rnum;

    for (var i = 1; i <= n; i++) {
        ar.push(i);
    }

    for (var i = 0; i < ar.length; i++) {
        rnum = Math.floor(Math.random() * n);
        temp = ar[i];
        ar[i] = ar[rnum];
        ar[rnum] = temp;
    }

    return ar;
}

// 난이도에 따라 clickPage 생성
function make_quiz(diff_array, ar, n) {
    var array = [];

    for (var i = 0; i < n; i++) {
        array.push(diff_array[ar[i] - 1]);
    }

    return array;
}

// 오디오 싱크
// adosyncmode
/*
// ex
time = 15;
sync = [0, 10, 20, 30];
var past = sync.filter(function (item) {
    return item < time;
});
console.log(past); // [0, 10]
*/

var onSync = undefined;

function adoSyncMode(ado, sync, wrap) {
    if (typeof sync === 'undefined') {
        sync = [Number(ado.attr('data-dur')) * 1000];
    }

    // console.log(wrap);

    ado.off('timeupdate').on('timeupdate', function () {
        var time = $(this)[0].currentTime * 1000; // sec → millisec
        var past = sync.filter(function (item) {
            return item < time;
        });

        // console.log($(this)[0].currentTime, time, past);

        /*
        0, 1, ..., undefined(sync배열의 마지막 시간초과 ~ 끝)
        */
        var currentLine = sync[past.length];
        currentLine = sync.indexOf(sync[past.length]);

        // 일시정지
        if ($(this)[0].paused) {
            wrap.find('.sync').removeClass('on');
            wrap.attr('data-sync-idx', -1);
            wrap.closest('.syncInfo').attr('data-sync-idx', -1);
            if (typeof (onSync) !== 'undefined') {
                onSync({
                    isSync: false,
                    isPause: true,
                    syncIdx: -1
                });
            }
            return false;
        }

        // sync배열의 마지막 시간 다음 ~ 끝
        if (currentLine < 0) {
            wrap.find('.sync').removeClass('on');
            wrap.attr('data-sync-idx', -1);
            wrap.closest('.syncInfo').attr('data-sync-idx', -1);

            if (typeof (onSync) !== 'undefined') {
                onSync({
                    isSync: false,
                    isEnd: true,
                    syncIdx: -1
                });
            }
            return false;
        };
        wrap.find('.sync').removeClass('on');
        wrap.find('.sync').eq(currentLine).addClass('on');
        wrap.attr('data-sync-idx', currentLine);
        wrap.closest('.syncInfo').attr('data-sync-idx', currentLine);

        if (typeof (onSync) !== 'undefined') {
            onSync({
                isSync: true,
                isEnd: false,
                syncIdx: currentLine,
            });
        }
    });
}

// preload image
/* (function () {
    const url = `inc/images/00/`;
    imgPreLoad([
        `${url}image.png`,
    ], true);
})(); */

// preload audio
/* audioPreLoad(['00_01', '00_02', '00_03'], function () {
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

function contentScript(_idx, _page) {
    if (typeof (videoCon) !== 'undefined') { videoCon.stop(); }
    if (typeof (resetPopIn) !== 'undefined') { resetPopIn(); }
    if (typeof (resetContentsIn) !== 'undefined') { resetContentsIn(); }

    switch (contentsIdx) {
        case 0:
            run();
            break;
        case 1:
            break;
        case 2:
            break;
    }
}

// 앱(WebView/Hybrid App)에서 네이티브 브릿지로 순수 Base64 추출해서 전달
const isApp = false;

// 캔버스를 활용해서 scale로 고해상도 확대된 데이터를 1:1로 저장할지 여부
const isUseCanvas = false;

let $userInputs;
let $captureWrap;

function run() {
    $captureWrap = contents.find('.captureWrap');

    // video

    const fileName1 = '[비상교육] 초등_과학(강) 5-1_1단원-4차시_차시 도입 영상';

    const videoCon1 = new videoPlayer(contents.find('.videoFrame'));
    const path1 = pathUrl(`SCN/106556`, fileName1);
    videoCon1.src = path1.src;
    videoCon1.init();
    videoCon1.video.attr('poster', path1.poster);


    // textarea, input 초기화
    $userInputs = contents.find('input, textarea');
    $userInputs.each(function () {
        const $userInput = $(this);
        $userInput.attr({
            'autocomplete': 'off',
            'spellcheck': 'false',
            'ariaLabel': $userInput.attr('ariaLabel') || '입력 칸',
        });

        $userInput.on('focus', function () {
            $(this).closest('.wrapper').addClass('hide-placeholder');
        });
        $userInput.on('blur', function () {
            updatePlaceholder($(this));
        });
    });

    // 저장버튼
    const $captureBtnWrap = contents.find('.captureBtnWrap');
    const $captureBtns = $captureBtnWrap.find('.captureBtn');
    $captureBtns.on('click', function () {
        const $captureBtn = $(this);

        switch ($captureBtn.attr('data-role')) {
            case 'capture':
                capture_toPng();
                break;
        }
    });
}

function updatePlaceholder($userInput) {
    let bool = $userInput.val().length > 0;
    console.log(bool);
    if (bool) {
        $userInput.closest('.wrapper').addClass('hide-placeholder');
    }
    else {
        $userInput.closest('.wrapper').removeClass('hide-placeholder');
    }
}

function hideInputPlaceholder() {
    $userInputs.each(function () {
        $(this).closest('.wrapper').addClass('hide-placeholder');
    });
}

function restoreInputPlaceholder() {
    /* $userInputs.each(function () {
        $(this).closest('.wrapper').removeClass('hide-placeholder');
    }); */

    $userInputs.each(function () {
        updatePlaceholder($(this));
    });
}

// iframe일 경우 #container의 배경색 추가
function applyIframeBgColor() {
    if ($captureWrap.find('iframe').length > 0) {
        $captureWrap.find('iframe').each(function () {
            const $ts = $(this);
            const $container = $ts.contents().find('#container');
            $container.css('background-color', '#cc0000');
        });
    }
}

function restoreIframeBgColor() {
    if ($captureWrap.find('iframe').length > 0) {
        $captureWrap.find('iframe').each(function () {
            const $ts = $(this);
            const $container = $ts.contents().find('#container');
            $container.css('background-color', 'transparent');
        });
    }
}


// video가 poster가 보여야 하는 경우 poster용 <img/>를 생성
function applyVideoPoster() {

    // 포스터가 보여야 하는지 여부
    const shouldShowPoster = function (video) {
        return (
            video.paused ||
            video.ended ||
            video.readyState < 3
        );
    };

    // 비디오가 재생중인지 여부
    const isVideoPlaying = function (video) {
        return (
            video &&
            !video.paused &&
            !video.ended &&
            video.readyState >= 3 &&
            video.currentTime > 0
        );
    };

    if ($captureWrap.find('video').length > 0) {
        $captureWrap.find('video').each(function () {

            const $ts = $(this);
            const ts = this;

            if (shouldShowPoster(ts) === true) {
                const $img = $(`<img class="video-poster" src="" alt="">`);
                $img.attr('src', $ts.attr('poster'));
                $img.css({
                    'position': 'absolute',
                    'top': 0,
                    'left': 0,
                    'width': '100%',
                    // 'height': '100%',
                    'height': `${$ts.css('height')}`,
                    'object-fit': 'cover',
                });
                $ts.parent().append($img);
            }
        });
    }
}

function restoreVideoPoster() {
    if ($captureWrap.find('video').length > 0) {
        $captureWrap.find('video').each(function () {
            const $ts = $(this);
            $ts.parent().find('.video-poster').remove();
        });
    }
}



// 캡처된 파일을 이미지 파일로 내보냄
function saveImg(dataURL, fileName) {
    const link = document.createElement('a');
    if (typeof link.download === 'string') {
        link.href = dataURL;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
    else {
        window.open(dataURL);
    }
}


/*
# 1배 캡쳐 vs 2배 캡쳐 후 1배로 다운


| 요소    | 1배 캡처 | 2→1 다운     |
| ----    | -----    | --------     |
| 텍스트  | 보통     | 더 부드러움  |
| 얇은 선 | 약간 깨짐| 안정적       |
| 이미지  | 동일     | 동일         |
| 성능    | 빠름     | 느림         |
*/


/*
https://www.npmjs.com/package/html-to-image
https://github.com/bubkoo/html-to-image

[동작 원리]
- html-to-image는 내부적으로 노드의 스타일을 SVG로 직렬화해서 캔버스로 렌더링합니다.
- width와 height를 2배로 주면, 결과 이미지 해상도가 2배가 됩니다.
- 동시에 transform: scale(2)을 주면 시각적으로도 2배 확대된 상태로 렌더링됩니다.

▶ 이렇게 하면 “화면상의 크기는 그대로지만, 저장된 이미지 해상도는 2배로” 만들 수 있습니다.
*/

/*
| 항목      | transform scale | pixelRatio |
| ------- | --------------- | ---------- |
| DOM 크기  | 커짐              | 그대로        |
| 레이아웃 영향 | 있음              | 없음         |
| 안정성     | 낮음              | 높음         |
| iframe  | 잘 깨짐            | 비교적 안정     |
| 글자 품질   | 보정됨             | 매우 좋음      |
| 구조      | 시각적 확대          | 렌더링 확대     |

[1]
width: width * 2,
height: height * 2,
style: {
    transform: 'scale(2)'
}

(실제동작)
DOM 자체를 2배로 키운 상태에서 렌더링
→ 레이아웃 자체가 커짐
→ 그 상태를 캡처

(핵심특징)
✔️ “보이는 화면 자체가 커짐”
✔️ DOM 레이아웃 영향 있음
❌ 실제 해상도 개념이 아님 (중복 확대됨)
❌ 깨짐/overflow/iframe 문제 많음


[2]
pixelRatio: 2

(실제동작)
DOM은 그대로 (1920 유지)
→ 캔버스만 2배 픽셀로 렌더링 (3840)

(핵심특징)
✔️ 화면 크기 변화 없음
✔️ DOM 그대로 유지
✔️ “보이지 않는 해상도 증가”
✔️ 가장 안정적

transform: scale = DOM을 키워서 찍는 방식 (시각적 확대 O)
pixelRatio = DOM 그대로 + 출력 해상도만 증가 (시각적 확대 X)
*/

function capture_toPng() {

    hideInputPlaceholder();
    applyIframeBgColor();
    applyVideoPoster();


    let target = $captureWrap[0];

    // 다운로드 되는 이미지 파일 이름 지정
    let userFileName = true;
    userFileName = prompt('저장할 파일 이름을 입력하세요:', 'capture');

    if (userFileName) {


        const scale = 2;
        const width = target.offsetWidth;
        const height = target.offsetHeight;

        let option;

        // 해상도 높이고, 시각적 확대
        /* option = {
            backgroundColor: '#fff',

            width: scale * width,
            height: scale * height,

            style: {

                transform: `scale(${scale})`,
                transformOrigin: 'top left',

                //IMPORTANT: 원본 엘리먼트의 크기만큼 보정(잘림 방지)
                width: `${target.offsetWidth}px`,
                height: `${target.offsetHeight}px`,
            }
        }; */

        // 캡처된 이미지의 픽셀 비율 설정. 깨짐 없이 고해상도 확대를 위해서 2배 설정
        option = {
            backgroundColor: '#fff',

            pixelRatio: scale,

            style: {
                transform: 'none',
                transformOrigin: 'top left',

                width: `${target.offsetWidth}px`,
                height: `${target.offsetHeight}px`,
            }
        };

        htmlToImage.toPng(target, option)
            .then(function (dataUrl) {
                console.log('캡쳐 성공');

                restoreInputPlaceholder();
                restoreIframeBgColor();
                restoreVideoPoster();

                // 앱(WebView/Hybrid App)에서 네이티브 브릿지로 순수 Base64 추출해서 전달
                if (isApp === true) {
                    // data:image/png;base64, 같은 접두사를 제거해서 순수한 Base64 데이터만 추출
                    /*
                    const dataUrl = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...";
                    const pureBase64 = dataUrl.replace(/^data:image\/[a-z]+;base64,/, "");

                    pureBase64 === "iVBORw0KGgoAAAANSUhEUgAA..."  // ← 순수한 Base64 데이터만 남음
                    */
                    const saveImg = dataUrl.replace(/^data:image\/[a-z]+;base64,/, '');

                    /*
                    window.Android.saveImage(base64);
                    webkit.messageHandlers.saveImage.postMessage(base64);
                    */
                }


                // 캔버스를 활용해서 scale로 고해상도 확대된 데이터를 1:1로 저장할지 여부
                if (isUseCanvas === true) {
                    const loadImg = new Image();
                    loadImg.onload = function () {
                        // 원본 크기
                        const width = target.offsetWidth;
                        const height = target.offsetHeight;

                        // 축소용 canvas
                        const loadCanvas = document.createElement('canvas');
                        loadCanvas.width = width;
                        loadCanvas.height = height;

                        // 고해상도 이미지를 원본 크기로 축소
                        const loadCanvasCtx = loadCanvas.getContext('2d');
                        loadCanvasCtx.drawImage(loadImg, 0, 0, width, height);

                        // 최종 저장용 PNG
                        const drawDataUrl = loadCanvas.toDataURL('image/png');
                        saveImg(drawDataUrl, `${userFileName}.png`);
                    };
                    loadImg.src = dataUrl;
                }
                // Data URL 그대로 다운로드
                else {
                    // console.log(dataUrl);
                    saveImg(dataUrl, `${userFileName}.png`);
                }
            })
            .catch(function (error) {
                console.error('캡쳐 실패:', error);
            });
    }
    else {
        console.log('사용자가 입력을 취소함');
        restoreInputPlaceholder();
    }
}

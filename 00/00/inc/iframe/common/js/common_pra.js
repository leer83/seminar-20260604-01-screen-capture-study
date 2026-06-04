/* ───────────────────────────────────────────────────────┐
 * file name : common_pra.js
 * description : YBM 2025 실과 5,6학년 차시창 공용코드 모음
 * create date : 2025-06-25
 * creator : JGY
 * modify:
 * usage:
└────────────────────────────────────────────────────── */



// .scrollpage의 scroll 리셋
function resetScrollPage(_page) {
    _page = _page || contents;

    if (_page.find('.scrollpage').length > 0) {
        _page.find('.scrollpage').animate({ scrollTop: 0 }, 500);
    }
}

/* ──────────────────────────────────────────────────────
* System UI와 통신
/* ────────────────────────────────────────────────────── */

function connViewer(data) {
    console.log('-------------connViewer', data);
    function setPageEvt($target) {
        $target.on('click', function (e) {

            if (isHuman(e) === true) {
                // effectAdo('click', false);
                effectAdo('click');
            }

            // if (isIframe() === true) {
                if (!parent.callMainManager()) return false;
                if (typeof parent.customFn === 'undefined') return;
                // const idx = $(this).attr('data-corner') || $(this).index() + 1;

                const $ts = $(this);

                let idx;
                let pageSetOp = {};

                let isCustom = false;

                // dpt1: lessonNum
                if ($ts.is(`[data-lessonNum]`) === true) {
                    pageSetOp.lessonNum = parseInt($(this).attr('data-lessonNum'), 10);
                    isCustom = true;
                }
                // dpt2:
                if ($ts.is(`[data-sNum]`) === true) {
                    pageSetOp.sNum = parseInt($(this).attr('data-sNum'), 10);
                    isCustom = true;
                }
                // dpt3: 차시내부 이동
                if ($ts.is(`[data-pNum]`) === true) {
                    pageSetOp.pNum = parseInt($(this).attr('data-pNum'), 10);
                    isCustom = true;
                }
                // dpt4: 그룹내 이동
                if ($ts.is(`[data-cornerNum]`) === true) {
                    pageSetOp.cornerNum = parseInt($(this).attr('data-cornerNum'), 10);
                    isCustom = true;
                }

                // index에 기반한 이동
                if (isCustom === false) {
                    pageSetOp.cornerNum = $(this).index() + 1;
                }

                // parent.callMainManager().setMainPage(pageSetOp);
                const sendData = {
                    type: 'goPage',
                    value: {
                        pageSetOp: pageSetOp,
                    },
                    callback: function (mainManager, pageSetOp) {
                    },
                };
                parent.customFn(sendData);
            // }
        });
    }

    if (typeof data === 'string') {
        switch (data) {
            // UI의 하단 페이지 표시자(.dot_tab) 감추기
            case 'dot':
                // if (isIframe() === true) {
                //     $(top.document).find('.dot_tab').removeClass('on');
                // }
                break;
            // UI의 페이지 그룹간 이동할 수 있게 이벤트 부여
            case 'navi':
                setPageEvt($('.navi li'));
                break;
        }
    }
    else {
        setPageEvt(data);
    }
}

/* ──────────────────────────────────────────────────────
* QR
/* ────────────────────────────────────────────────────── */

function initQR() {
    $('.qr').find('.qrimg').on('mouseover', function () {
        const $qr = $(this).closest('.qr');
        $qr.find('.qrtext').show();
    });
    $('.qr').find('.qrimg').on('mouseout', function () {
        const $qr = $(this).closest('.qr');
        $qr.find('.qrtext').hide();
    });
    $('.qr').on('click', function () {
        const $qr = $(this).closest('.qr');
        let ksUrl = $qr.find('.url').text();
        window.open(ksUrl, '_blank');
    });
}

/* ──────────────────────────────────────────────────────
* 캐릭터 팝업
/* ────────────────────────────────────────────────────── */

function initCharPop() {
    $('.chapop').on('click', function () {
        effectAdo('click');

        $(this).toggleClass('on');

        let $chaPopMal;
        if ($(this).next().hasClass('chapop-mal') === true) {
            $chaPopMal = $(this).next();
        }
        else {
            $chaPopMal = $(this).closest('.contents').find('.chapop-mal').eq(0);
        }
        $chaPopMal.toggleClass('on');
    });
}


/* ──────────────────────────────────────────────────────
* quizListCheck (스피드 퀴즈)
/* ────────────────────────────────────────────────────── */
//@see file:///Z:/WEP/타회사_2016_제안샘플/YBM_2025/pra/05/WEB_실과%205/book/content/contents/lessonBox/lesson1/L1_009_07_07.html
var quizListCheck = function quizListCheck(wrap) {
    var self = this;
    this.wrap = wrap;
    this.list = this.wrap.find('.quizList');
    this.items = this.list.find('.quizItem');
    this.corAnswer = 0;     // 사용자가 선택한 정답
    this.answer = 0;        // 정답
    this.popTimeout;

    this.makeHtml = function () {
        var html = `
        <button class="btn confirm"></button>
        <button class="btn rebtn"></button>
        <div class="quizpop cor katuri">정답입니다!</div>
        <div class="quizpop wro katuri">다시 생각해 보세요.</div>
        `;
        self.wrap.append(html);
    };

    this.init = function () {
        self.makeHtml();
        self.items.each(function (i) {
            var item = $(this);
            item.on('click', function () {
                effectAdo('click');
                if (item.hasClass('on')) {
                    item.removeClass('on');
                    self.corAnswer = 0;
                } else {
                    item.addClass('on');
                    item.siblings().removeClass('on');
                    self.corAnswer = item.index() + 1;
                }
            });
        });

        self.wrap.find('.confirm').on('click', function () {
            self.list.addClass('com');

            self.wrap.find('.confirm').hide();
            self.wrap.find('.rebtn').show();

            function setQuizpopTimeout() {
                clearTimeout(self.popTimeout);
                self.popTimeout = setTimeout(function(){
                    self.wrap.find('.quizpop').fadeOut();
                }, 1700);
            }

            // 단순 정답 확인
            if (self.corAnswer === 0) {
                // effectAdo('click');
                effectAdo('anschk_o');
                self.wrap.attr('data-result', 'check');
                self.items.eq(self.answer - 1).addClass('on');
                self.items.eq(self.answer - 1).addClass('answer');
                self.list.addClass('com');
                self.wrap.find('.quizpop.cor').fadeIn();
                setQuizpopTimeout();
                return false;
            }

            // 정답
            if (self.corAnswer === self.answer) {
                effectAdo('anschk_o');
                self.wrap.attr('data-result', 'true');
                self.items.eq(self.answer - 1).addClass('answer');
                self.list.addClass('com');
                self.wrap.find('.quizpop.cor').fadeIn();
                setQuizpopTimeout();
            }
            // 오답
            else {
                effectAdo('anschk_x');
                self.wrap.attr('data-result', 'false');
                self.wrap.find('.quizpop.wro').fadeIn();
                setQuizpopTimeout();
            }
        });

        self.wrap.find('.rebtn').on('click', function () {
            $(this).hide();
            self.wrap.find('.quizpop').hide();
            self.wrap.find('.confirm').show();
            effectAdo('click');
            self.items.removeClass('on answer');
            self.list.removeClass('com');
            self.corAnswer = 0;
        });
    };
};



/* ──────────────────────────────────────────────────────
* quizClkContents (초성 클릭 퀴즈)
/* ────────────────────────────────────────────────────── */
//@ see file:///Z:/WEP/타회사_2016_제안샘플/YBM_2025/pra/06/WEB_실과%206/book/content/contents/lessonBox/lesson4/L4_085_06.html

var quizClkContents = function quizClkContents(wrap, data) {
    let self = this;
    this.wrap = wrap;
    this.root = undefined;

    // let value = data.value || 0;

    const defaults = {
        value: 0,
    };
    data = $.extend(true, {}, defaults, data);

    this.clkTotal = data.clkTotal || 6;

    this.conSet = undefined;

    this.elements = {
    };

    const timeoutId = {};

    const intervalId = {};

    this.onClick = undefined;
    this.onShowAns = undefined;
    this.onReset = undefined;

    this.init = function () {
        self.makeUI();

        self.reset();
        addEvent();

        //*-------------

        initConSet();
    };

    this.makeUI = function () {
        /* self.wrap.empty();
        let html = `
        `;
        self.wrap.append(html); */
        /* self.wrap.find('.listWrap li').remove();

        self.elements.menuWrap = self.wrap.find('.menuWrap'); */
    };

    this.reset = function () {
        for (let prop in timeoutId) {
            clearTimeout(timeoutId[prop]);
        }
        for (let prop in intervalId) {
            clearTimeout(intervalId[prop]);
        }
    };

    const addEvent = function () {
    };


    //*-------------

    const initConSet = function () {
        self.conSet1 = new contentsSet(contents.find('.contentbox'));
        self.conSet1.clickCon(self.clkTotal);
        self.conSet1.onClick = function () {
            effectAdo('click');

            if (typeof self.onClick !== 'undefined') { self.onClick(); }

        };
        self.conSet1.onShowAns = function () {
            effectAdo('confirm');

            if (typeof self.onShowAns !== 'undefined') { self.onShowAns(); }

        };
        self.conSet1.onReset = function () {
            effectAdo('confirm');

            if (typeof self.onReset !== 'undefined') { self.onReset(); }

        };
    };

};





/* ──────────────────────────────────────────────────────
* quizChoContents (초성 입력 퀴즈)
/* ────────────────────────────────────────────────────── */
//@ see file:///Z:/WEP/타회사_2016_제안샘플/YBM_2025/pra/06/WEB_실과%206/book/content/contents/lessonBox/lesson4/L4_085_06.html
var quizChoContents = function quizChoContents(wrap, data) {
    let self = this;
    this.wrap = wrap;
    this.root = undefined;

    // let value = data.value || 0;

    this.ans = data.ans;
    this.conWrap = wrap.find('.choContents');
    this.ip = self.conWrap.find('input');

    this.btnAns = self.conWrap.find('.ansbtn');

    const defaults = {
        value: 0,
    };
    data = $.extend(true, {}, defaults, data);

    this.elements = {
    };

    const timeoutId = {};

    const intervalId = {};

    this.init = function () {
        // self.makeUI();

        self.reset();
        addEvent();
    };

    this.makeUI = function () {
        self.wrap.empty();
        let html = `
        `;
        self.wrap.append(html);
        /* self.wrap.find('.listWrap li').remove();

        self.elements.menuWrap = self.wrap.find('.menuWrap'); */
    };

    this.reset = function () {
        for (let prop in timeoutId) {
            clearTimeout(timeoutId[prop]);
        }
        for (let prop in intervalId) {
            clearTimeout(intervalId[prop]);
        }
    };

    const addEvent = function () {
        self.btnAns.off().on('click', function () {
            // 다시하기
            if ($(this).hasClass('re') === true) {
                effectAdo('click');
                self.conWrap.removeClass('com');
                self.btnAns.removeClass('re');
                self.ip.val('');
            }
            // 정답보기
            else {
                effectAdo('anschk_o');
                self.conWrap.addClass('com');
                self.btnAns.addClass('re');
                self.ip.each(function (idx) {
                    $(this).val(self.ans[idx]);
                });

            }
        });
    };
};



/* ──────────────────────────────────────────────────────
* aniSyncContents (시퀀스 애니메이션 + 음성(재생/일시정지))
/* ────────────────────────────────────────────────────── */

//@see file:///Z:/WEP/타회사_2016_제안샘플/YBM_2025/pra/05/WEB_실과%205/book/content/contents/lessonBox/lesson1/L1_009_07_01.html
var aniSyncContents = function aniSyncContents(wrap, data) {
    let self = this;
    this.wrap = wrap;
    this.root = undefined;

    // let value = data.value || 0;

    const defaults = {
        value: 0,
    };
    data = $.extend(true, {}, defaults, data);

    this.aniSyncWrap = wrap;
    this.aniSync = data.aniSync || wrap.find('.aniSync');       // 시퀀스 애니메이션
    this.aniCover = data.aniCover || wrap.find('.aniCover');    // 시퀀스 애니메이션 커버

    this.soundbtn = wrap.find('.soundbtn');                     // 음성 버튼

    this.ado = undefined;   // <audio/>
    this.isPaused = false;  // 일시정지중인지여부

    this.elements = {
    };

    const timeoutId = {};

    const intervalId = {};

    this.onUpdate = undefined;
    this.onState = undefined;
    this.onEnded = undefined;

    this.init = function () {
        self.makeUI();

        self.reset();
        addEvent();
    };

    this.makeUI = function () {
        /* self.wrap.empty();
        let html = `
        `;
        self.wrap.append(html); */
        /* self.wrap.find('.listWrap li').remove();

        self.elements.menuWrap = self.wrap.find('.menuWrap'); */

        self.aniSyncWrap.attr('data-paused', 'false');

        self.aniSync.each(function (idx) {
            $(this).attr('data-idx', idx);
        });
        self.aniCover.each(function (idx) {
            $(this).attr('data-idx', idx);
        });
    };

    this.reset = function () {
        for (let prop in timeoutId) {
            clearTimeout(timeoutId[prop]);
        }
        for (let prop in intervalId) {
            clearTimeout(intervalId[prop]);
        }
    };

    this.stop = function () {
        self.ado[0].pause();
        if (self.ado[0].currentTime > 0) {
            self.ado[0].currentTime = 0;
        }
        self.ado.off('ended');

        self.soundbtn.removeClass('on');
        self.isPaused = true;

        self.aniSyncWrap.attr('data-paused', self.isPaused);
        self.aniSync.removeClass('on');
        self.aniSync.attr('data-play-state', 'paused');

        self.aniCover.show();
    };

    const addEvent = function () {
        self.soundbtn.on('click', function () {
            // audio play|pause
            var src = $(this).attr('data-ado');
            var path = data.path;
            adoPauseMode(src, path, $(this));

            // sync
            if (typeof data.sync !== 'undefined') {
                var ado = $('#' + src);
                var sync = data.sync; // millisecond
                adoSyncMode(ado, sync, wrap.find('.syncbox'));
            }





            self.ado = $(`#${src}`);
            self.isPaused = self.ado[0].paused;
            self.aniSyncWrap.attr('data-paused', self.isPaused);

            if (self.isPaused === false) {
                self.aniCover.hide();
            }

            if (typeof self.onState !== 'undefined') {
                self.onState({ pause: self.isPaused });
            }

            if (typeof data.sync === 'undefined') {
                self.ado.off('timeupdate');
            }
            self.ado.on('timeupdate', function () {
                if (typeof self.onTimeUpdate !== 'undefined') {
                    self.onTimeUpdate();
                }
            });

            // 재생중
            if ($(this).hasClass('on') === true) {
                self.aniSync.addClass('on');
                self.aniSync.attr('data-play-state', 'running');

                self.ado.on('ended', function () {
                    self.stop();

                    if (typeof self.onEnded === 'undefined') {
                        self.onEnded();
                    }
                });
            }
            // 일시정지중
            else {
                self.aniSync.addClass('running');
                self.aniSync.attr('data-play-state', 'paused');
                // self.aniSync.not('[data-play-once="true"]').removeClass('on');
            }
        });
    };
};








/* ──────────────────────────────────────────────────────
* vdoGroupContents (시퀀스 애니메이션 + 음성(재생/일시정지))
/* ────────────────────────────────────────────────────── */
// @see file:///Z:/WEP/타회사_2016_제안샘플/YBM_2025/pra/05/WEB_실과%205/book/content/contents/lessonBox/lesson1/L1_009_07_01.html
// @see file:///Z:/WEP/타회사_2016_제안샘플/YBM_2025/pra/06/WEB_실과%206/book/content/contents/lessonBox/lesson2/L2_037_04_02.html

const vdoGroupContents = function vdoGroupContents(wrap, data) {
    let self = this;
    this.wrap = wrap;
    this.root = undefined;

    // let value = data.value || 0;

    const defaults = {
        value: 0,
    };
    data = $.extend(true, {}, defaults, data);

    this.elements = {
    };

    const timeoutId = {};

    const intervalId = {};


    this.soundbtn = undefined;
    this.vdoFrameWrap = undefined;
    this.vdoFrames = undefined;
    this.vdos = undefined;

    let loadcount = 0;

    this.idx = 0;
    this.total = 0;

    this.playing = false;

    this.currentVdo = undefined;    // 현재 재생중인 .videoFrame

    this.onPlay = undefined;
    this.onPause = undefined;
	this.onStop = undefined;
	this.onEnded = undefined;

	this.onRenderVideoIdx = undefined;


    this.init = function () {
        self.makeUI();

        self.reset();
        addEvent();

        loadVideo();
        addEventTool();
    };

    this.makeUI = function () {
        /* self.wrap.empty();
        let html = `
        `;
        self.wrap.append(html); */
        /* self.wrap.find('.listWrap li').remove();

        self.elements.menuWrap = self.wrap.find('.menuWrap'); */

        self.soundbtn = wrap.find('.soundbtn');

        self.vdoFrameWrap = wrap.find('.vdoFrameWrap');
        self.vdoFrames = self.vdoFrameWrap.find('.videoFrame');
        self.vdos = self.vdoFrameWrap.find('video');
        self.vdos.each(function (idx) {
            $(this).attr('data-idx', idx);
        });

        self.idx = 0;
        self.total = self.vdoFrames.length;
    };

    this.reset = function () {
        for (let prop in timeoutId) {
            clearTimeout(timeoutId[prop]);
        }
        for (let prop in intervalId) {
            clearTimeout(intervalId[prop]);
        }
    };

    const addEvent = function () {
    };


    const loadVideo = function () {
        loadcount = 0;
        self.vdos.each(function (idx) {
            const $vdo = $(this);
            const vdo = this;

            if (idx === 0) {
                self.currentVdo = $vdo;
            }
            vdo.load();
            $vdo.off('loadedmetadata').on('loadedmetadata', function () {
                // console.log('loadedmetadata: ', $(this)[0].duration);
            });
            $vdo.off('loadeddata').on('loadeddata', function () {
                loadcount++;

                // 모두 로드완료
                if (loadcount == self.total) {
                    initVideo();
                }
            });
        });
    };

    const initVideo = function () {
        self.vdos.each(function (idx) {
            const $vdo = $(this);
            const vdo = this;
            const vdoIdx = parseInt($vdo.attr('data-idx'), 10);
            const duration = vdo.duration;
            console.log(`[${vdoIdx}]:`, duration);

            //--------------------- 이벤트


            // 재생
            $vdo.off('play').on('play', function () {
                self.currentVdo = $(this);
                self.playing = true;

                if (typeof (self.onRenderVideoIdx) !== 'undefined') {
                    // self.onRenderVideoIdx(self.currentVdo.index(self.vdos));

                    const idx = parseInt($(this).attr('data-idx'), 10);
                    self.onRenderVideoIdx(idx);
                }
            });


            // 일시정지
            $vdo.off('pause').on('pause', function () {
                self.playing = false;
            });


            // 종료
            $vdo.off('ended').on('ended', function () {
                const nextIdx = vdoIdx + 1;
                const $nextVdo = self.vdos.filter(`[data-idx="${nextIdx}"]`);
                const nextVdo = $nextVdo[0];

                // 다음 audio 처음부터 재생
                if ($nextVdo.length > 0) {
                    self.idx = nextIdx;
                    // self.currentVdo = nextVdo;
                    nextVdo.currentTime = 0;
                    nextVdo.play();
                }
                // 모든 audio 재생완료
                else {
                    self.stop();
                    // self.pause();

                    if (typeof (self.onEnded) !== 'undefined') {
                        self.onEnded();
                    }
                }
            });
        });
    };



    const addEventTool = function () {
        self.soundbtn.on('click', function () {
            if ($(this).hasClass('on') === false) {
                self.play();
            }
            else {
                self.pause();
            }
        });
    };


    this.play = function () {
        self.playing = true;

        self.soundbtn.addClass('on');

        self.currentVdo[0].play();

        if (typeof (self.onPlay) !== 'undefined') { self.onPlay(); }
	};

    this.pause = function () {
        self.playing = false;

        self.soundbtn.removeClass('on');

        self.currentVdo[0].pause();

        if (typeof (self.onPause) !== 'undefined') { self.onPause(); }
    };

    this.stop = function () {

        self.vdos.each(function () {
            this.currentTime = 0;
            this.pause();
        });

        // 재로드 해서, 포스터 보이게
        self.vdos.each(function () {
            this.load();
        });

        self.idx = 0;
        self.currentVdo = self.vdos.filter(`[data-idx="${self.idx}"]`);

		self.playing = false;

		self.soundbtn.removeClass('on');

        if (typeof (self.onRenderAudioIdx) !== 'undefined') {
            self.onRenderAudioIdx(-1);
        }

        if (typeof (self.onStop) !== 'undefined') { self.onStop(); }
	};

};





/* ──────────────────────────────────────────────────────
* goalContents (학습목표)
/* ────────────────────────────────────────────────────── */

var goalContents = function goalContents(wrap, data) {
    let self = this;
    this.wrap = wrap;
    this.root = undefined;

    this.adoClick = undefined;
    this.adoEnded = undefined;

    // let value = data.value || 0;

    const defaults = {
        value: 0,
    };
    data = $.extend(true, {}, defaults, data);

    this.char = data.char || wrap.find('.char');

    this.elements = {
    };

    const timeoutId = {};

    const intervalId = {};

    this.init = function () {
        // self.makeUI();

        self.reset();
        addEvent();
    };

    this.makeUI = function () {
        self.wrap.empty();
        let html = `
        `;
        self.wrap.append(html);
        /* self.wrap.find('.listWrap li').remove();

        self.elements.menuWrap = self.wrap.find('.menuWrap'); */
    };

    this.reset = function () {
        for (let prop in timeoutId) {
            clearTimeout(timeoutId[prop]);
        }
        for (let prop in intervalId) {
            clearTimeout(intervalId[prop]);
        }
    };

    const addEvent = function () {
        wrap.find('.soundbtn').on('click', function () {
            // audio play|pause
            var $this = $(this);
            var src = $(this).attr('data-ado');
            var path = data.path;
            adoPauseMode(src, path, $(this));

            // sync
            if (typeof data.sync !== 'undefined') {
                var ado = $('#' + src);
                var sync = data.sync; // millisecond
                adoSyncMode(ado, sync, wrap.find('.syncbox'));
            }

            const $ado = $(`#${src}`);

            if ($(this).hasClass('on') === true) {
                self.char.addClass('on');

                $ado.on('ended', function () {
                    self.char.removeClass('on');
                    
                    if (typeof self.adoEnded !== 'undefined') self.adoEnded($(this), $this);
                });
            }
            else {
                self.char.removeClass('on');
            }

            if (typeof self.adoClick !== 'undefined') self.adoClick($this);
        });
    };
};





/* ──────────────────────────────────────────────────────
* outroContents (마지막)
/* ────────────────────────────────────────────────────── */

var outroContents = function outroContents(wrap, data) {
    let self = this;
    this.wrap = wrap;
    this.root = undefined;

    // let value = data.value || 0;

    const defaults = {
        value: 0,
    };
    data = $.extend(true, {}, defaults, data);

    this.elements = {
    };

    const timeoutId = {};

    const intervalId = {};

    this.init = function () {
        // self.makeUI();

        self.reset();
        addEvent();
    };

    this.makeUI = function () {
        self.wrap.empty();
        let html = `
        `;
        self.wrap.append(html);
        /* self.wrap.find('.listWrap li').remove();

        self.elements.menuWrap = self.wrap.find('.menuWrap'); */
    };

    this.reset = function () {
        for (let prop in timeoutId) {
            clearTimeout(timeoutId[prop]);
        }
        for (let prop in intervalId) {
            clearTimeout(intervalId[prop]);
        }
    };

    const addEvent = function () {
        wrap.find('.soundbtn').on('click', function () {
            // audio play|pause
            var src = $(this).attr('data-ado');
            var path = data.path;
            adoPauseMode(src, path, $(this));

            // sync
            if (typeof data.sync !== 'undefined') {
                var ado = $('#' + src);
                var sync = data.sync; // millisecond
                adoSyncMode(ado, sync, wrap.find('.syncbox'));
            }
        });
    };
};



















































































/* ──────────────────────────────────────────────────────
* 순차 모션 관련
/* ────────────────────────────────────────────────────── */

const motionContents = function motionContents(wrap, data) {
    let self = this;
    this.wrap = wrap;
    this.root = undefined;

    // let value = data.value || 0;

    const defaults = {
        value: 0,
    };
    data = $.extend(true, {}, defaults, data);

    this.elements = {
    };

    this.step = 0;              // 현재단계
    this.stepTotal = 0;         // 총 단계
    this.repeat = false;        // 반복 여부

    this.timeouts = 1250;       // 회차별 대기 시간. [] or number
    this.timeoutRepeat = 3000;  // 반복 대기 시간

    this.targets = wrap.find('.obj');   // 대상 요소

    const timeoutId = {
        step: -1,
    };

    const intervalId = {};

    this.onStart = undefined;
    this.onStep = undefined;
    this.onEnd = undefined;

    this.init = function () {
        self.makeUI();

        self.reset();
        addEvent();
    };

    this.makeUI = function () {
        /* self.wrap.empty();
        let html = `
        `;
        self.wrap.append(html); */
        /* self.wrap.find('.listWrap li').remove();

        self.elements.menuWrap = self.wrap.find('.menuWrap'); */
    };

    this.reset = function () {
        for (let prop in timeoutId) {
            clearTimeout(timeoutId[prop]);
        }
        for (let prop in intervalId) {
            clearTimeout(intervalId[prop]);
        }
    };

    const addEvent = function () {
    };


    this.resetMotion = function () {
        for (let prop in timeoutId) {
            clearTimeout(timeoutId[prop]);
        }

        self.step = 0;
        self.stepMotion(self.step);
    };

    this.stepMotion = function (step) {
        self.targets.each(function () {
            if ($(this).hasClass('stop') === false) {
                self.targets.attr('data-step', step);
            }
        });
    };

    this.nextMotion = function () {
        let nowTimeout;
        if (Array.isArray(self.timeouts) === true) {
            nowTimeout = self.timeouts[self.step];
        }
        else {
            nowTimeout = self.timeouts;
        }

        timeoutId.step = setTimeout(function () {
            clearTimeout(timeoutId.step);

            self.step++;
            self.stepMotion(self.step);
            // console.log('step: ', self.step);

            if (typeof self.onStep !== 'undefined') self.onStep(self.step);

            if (self.step === self.stepTotal) {
                if (self.repeat === true) {
                    timeoutId.step = setTimeout(function () {
                        self.startMotion();
                    }, self.timeoutRepeat);
                }
                // console.log('end');

                if (typeof self.onEnd !== 'undefined') self.onEnd(self.step);
                return;
            }

            self.nextMotion();

        }, nowTimeout);
    };

    this.startMotion = function () {
        // console.log('start');
        self.resetMotion();
        self.nextMotion();
        if (typeof self.onStart !== 'undefined') self.onStart();
    };
};

/* ──────────────────────────────────────────────────────
* introContents (처음)
/* ────────────────────────────────────────────────────── */

var introContents = function introContents(wrap, data) {
    let self = this;
    this.wrap = wrap;
    this.root = undefined;

    // let value = data.value || 0;

    const defaults = {
        value: 0,
    };
    data = $.extend(true, {}, defaults, data);

    this.elements = {
    };

    const timeoutId = {};

    const intervalId = {};

    this.init = function () {
        // self.makeUI();

        self.reset();
        addEvent();
    };

    this.makeUI = function () {
        self.wrap.empty();
        let html = `
        `;
        self.wrap.append(html);
        /* self.wrap.find('.listWrap li').remove();

        self.elements.menuWrap = self.wrap.find('.menuWrap'); */
    };

    this.reset = function () {
        for (let prop in timeoutId) {
            clearTimeout(timeoutId[prop]);
        }
        for (let prop in intervalId) {
            clearTimeout(intervalId[prop]);
        }
    };

    const addEvent = function () {
    };
};


/* ──────────────────────────────────────────────────────
* thinkContents (생각펼치기)
/* ────────────────────────────────────────────────────── */

var thinkContents = function thinkContents(wrap, data) {
    let self = this;
    this.wrap = wrap;
    this.root = undefined;

    // let value = data.value || 0;

    const defaults = {
        value: 0,
    };
    data = $.extend(true, {}, defaults, data);

    this.elements = {
    };

    const timeoutId = {};

    const intervalId = {};

    this.init = function () {
        // self.makeUI();

        self.reset();
        addEvent();
    };

    this.makeUI = function () {
        self.wrap.empty();
        let html = `
        `;
        self.wrap.append(html);
        /* self.wrap.find('.listWrap li').remove();

        self.elements.menuWrap = self.wrap.find('.menuWrap'); */
    };

    this.reset = function () {
        for (let prop in timeoutId) {
            clearTimeout(timeoutId[prop]);
        }
        for (let prop in intervalId) {
            clearTimeout(intervalId[prop]);
        }
    };

    const addEvent = function () {
        if (typeof data.path !== 'undefined') {
            wrap.find('.soundbtn').on('click', function () {

                // audio play|pause
                var src = $(this).attr('data-ado');
                var path = data.path;
                adoPauseMode(src, path, $(this));
            });
        }

        let clkTotal = data.clkTotal || 1;

        const conSet1 = new contentsSet(contents.find('.contentbox'));
        conSet1.clickCon(clkTotal);
        conSet1.onClick = function () {
            effectAdo('click');
        };
        conSet1.onShowAns = function () {
            effectAdo('confirm');
        };
        conSet1.onReset = function () {
            effectAdo('confirm');
        };
    };
};


/* ──────────────────────────────────────────────────────
* graspContents (이해하기)
/* ────────────────────────────────────────────────────── */

var graspContents = function graspContents(wrap, data) {
    let self = this;
    this.wrap = wrap;
    this.root = undefined;

    // let value = data.value || 0;

    const defaults = {
        value: 0,
    };
    data = $.extend(true, {}, defaults, data);

    this.elements = {
    };

    const timeoutId = {};

    const intervalId = {};

    this.init = function () {
        // self.makeUI();

        self.reset();
        addEvent();
    };

    this.makeUI = function () {
        self.wrap.empty();
        let html = `
        `;
        self.wrap.append(html);
        /* self.wrap.find('.listWrap li').remove();

        self.elements.menuWrap = self.wrap.find('.menuWrap'); */
    };

    this.reset = function () {
        for (let prop in timeoutId) {
            clearTimeout(timeoutId[prop]);
        }
        for (let prop in intervalId) {
            clearTimeout(intervalId[prop]);
        }
    };

    const addEvent = function () {
        wrap.find('.soundbtn').on('click', function () {

            // audio play|pause
            var src = $(this).attr('data-ado');
            var path = data.path;
            adoPauseMode(src, path, $(this));

            // sync
            if (typeof data.sync !== 'undefined') {
                var ado = $('#' + src);
                var sync = data.sync; // millisecond
                adoSyncMode(ado, sync, wrap.find('.syncbox'));
            }
        });
    };
};


/* ──────────────────────────────────────────────────────
* summaryContents (정리하기)
/* ────────────────────────────────────────────────────── */

var summaryContents = function summaryContents(wrap, data) {
    let self = this;
    this.wrap = wrap;
    this.root = undefined;

    // let value = data.value || 0;

    const defaults = {
        value: 0,
    };
    data = $.extend(true, {}, defaults, data);

    this.elements = {
    };

    const timeoutId = {};

    const intervalId = {};

    this.init = function () {
        // self.makeUI();

        self.reset();
        addEvent();

        connViewer('dot');
        connViewer('navi');
    };

    this.makeUI = function () {
        self.wrap.empty();
        let html = `
        `;
        self.wrap.append(html);
        /* self.wrap.find('.listWrap li').remove();

        self.elements.menuWrap = self.wrap.find('.menuWrap'); */
    };

    this.reset = function () {
        for (let prop in timeoutId) {
            clearTimeout(timeoutId[prop]);
        }
        for (let prop in intervalId) {
            clearTimeout(intervalId[prop]);
        }
    };

    const addEvent = function () {
        // 요소내 라인의  총 개수를 속성값으로 저장
        wrap.find('li').each(function () {
            const $li = $(this);
            const $text = $li.find('.text');
            if ($text.find('br').length > 0) {
                $li.attr('data-total-line', $text.find('br').length + 1);
            }
        });


        wrap.find('.soundbtn').on('click', function () {

            // audio play|pause
            var src = $(this).attr('data-ado');
            var path = data.path;
            adoPauseMode(src, path, $(this));

            // sync
            if (typeof data.sync !== 'undefined') {
                var ado = $('#' + src);
                var sync = data.sync; // millisecond
                adoSyncMode(ado, sync, wrap.find('.syncbox'));
            }
        });

        wrap.find('.chk').on('click', function () {
            effectAdo('click', false);

            var $ts = $(this);
            var idx = $ts.index();
            var stars = $ts.closest('.flex').find('.chk');

            if ($ts.hasClass('on') && !$ts.next().hasClass('on')) {
                $ts.removeClass('on');
                checkAnsRe();
                return false;
            }

            stars.removeClass('on blnk');
            stars.slice(0, idx + 1).addClass('on');
            checkAnsRe();

        });

        wrap.find('.ansbtn').on('click', function () {
            effectAdo('confirm', false);
            $(this).toggleClass('re')

            if ($(this).hasClass('re')) {
                wrap.find('.chk').addClass('on');
                wrap.find('.chk').removeClass('blnk');
            }
            else {
                wrap.find('.chk').removeClass('on');
                wrap.find('.chk').addClass('blnk');
                // wrap.find('.chk1').eq(0).addClass('ballFlash1');
                // wrap.find('.chk2').eq(0).addClass('ballFlash2');
            }
        });

        wrap.find('.chk').on(sAnimationEnd, function() {
            $(this).removeClass('blnk');
        });
    };

    const checkAnsRe = function () {
        const re = wrap.find('.chk.on').length != 0;
        if (re) {
            wrap.find('.ansbtn').addClass('re');
        }
        else {
            wrap.find('.ansbtn').removeClass('re');
        }
    };
};



/* ──────────────────────────────────────────────────────
* 팝업버튼 보이기/감추기 제어
/* ────────────────────────────────────────────────────── */
/**
 * btnPopup 보이기/감추기 제어
 * @param {*} wrap 팝업버튼 있는 wrap
 * @param {*} indices 팝업 idx 값들
 * @param {*} show 팝업을 보일지 말지
 */
function showHidePopup(wrap, indices, show) {
    for (const i of indices) {
        const item = wrap.find(`.btnPopup[data-idx="${i}"]`);
        if (show) {
            item.show();
        } else {
            item.hide();
        }
    }
}
/**
 * btnPop 보이기/감추기 제어
 * @param {*} wrap 팝업버튼 있는 wrap
 * @param {*} indices 팝업 idx 값들
 * @param {*} show 팝업을 보일지 말지
 */
function showHidePop(wrap, indices, show) {
    for (const i of indices) {
        const item = wrap.find(`.btnPop[data-idx="${i}"]`);
        if (show) {
            item.show();
        } else {
            item.hide();
        }
    }
}


/**
 * 캐릭터 말풍선 음성 재생/일시정지
 * @param {*} wrap 
 * @param {*} parentPath 오디오 파일의 부모 경로
 * @param {*} btns 음성 버튼들
 */
function sequenceAdoBtn(wrap, parentPath, btns) {
    const allObj = wrap.find(`[data-ado-idx]`);
    btns.removeClass('on');
    allObj.removeClass('ing');

    btns.each(function () {
        const tsBtn = $(this);
        const group = tsBtn.attr('data-ado-group');
        const obj = wrap.find(`[data-ado-group="${group}"][data-ado-idx]`);

        function playAdo(idx) {
            const targetObj = obj.filter(`[data-ado-idx=${idx}]`);
            const eff = targetObj.attr('data-ado');
            if (targetObj.length === 0) {
                // 모든 음성 재생 완료
                btns.removeClass('on');
                allObj.removeClass('ing');
                btns.removeAttr('data-playing-idx');
                return;
            } else {
                // 음성 재생
                tsBtn.attr('data-playing-idx', idx);
                adoPauseMode(eff, parentPath, tsBtn);
                const targetAdo = $(`#${eff}`);
                targetObj.addClass('ing');

                // 현재 음성 끝나면 다음 음성 이어서 재생
                targetAdo.on('ended', function () {
                    btns.removeClass('on');
                    playAdo(idx + 1);
                });
            }
        }

        tsBtn.off('click').on('click', function () {
            if (tsBtn.hasClass('on')) {
                // 일시정지
                const playingIdx = parseInt(tsBtn.attr('data-playing-idx'));
                const targetObj = obj.filter(`[data-ado-idx=${playingIdx}]`);
                const eff = targetObj.attr('data-ado');
                adoPauseMode(eff, parentPath, tsBtn);
            } else {
                // 재생
                if (tsBtn.is('[data-playing-idx]')) {
                    // 이어서 재생
                    const playingIdx = parseInt(tsBtn.attr('data-playing-idx'));
                    playAdo(playingIdx);
                } else {
                    // 처음 재생
                    btns.removeClass('on');
                    btns.removeAttr('data-playing-idx');
                    allObj.removeClass('ing');
                    playAdo(1);
                }
            }
        });
    });
}

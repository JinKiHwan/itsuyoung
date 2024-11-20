class ImageLoader {
    constructor(minLoadingTime = 1000) {
        this.loadingOverlay = document.querySelector('.loading-overlay');
        this.minLoadingTime = minLoadingTime;
        this.init();
    }

    init() {
        this.startTime = Date.now();
        this.showLoading();
        this.checkImagesLoaded();
    }

    showLoading() {
        // 이전에 추가된 hidden 클래스 제거
        this.loadingOverlay.classList.remove('hidden');
    }

    hideLoading() {
        const elapsedTime = Date.now() - this.startTime;
        const remainingTime = Math.max(0, this.minLoadingTime - elapsedTime);

        setTimeout(() => {
            this.loadingOverlay.style.opacity = '0';

            // opacity 트랜지션이 완료된 후 hidden 클래스 추가
            this.loadingOverlay.addEventListener(
                'transitionend',
                () => {
                    this.loadingOverlay.classList.add('hidden');
                },
                { once: true }
            ); // 이벤트 리스너를 한 번만 실행
        }, remainingTime);
    }

    checkImagesLoaded() {
        const images = document.querySelectorAll('img');
        const totalImages = images.length;
        let loadedImages = 0;

        if (totalImages === 0) {
            this.hideLoading();
            return;
        }

        const imageLoaded = () => {
            loadedImages++;
            if (loadedImages === totalImages) {
                this.hideLoading();
            }
        };

        images.forEach((img) => {
            if (img.complete) {
                imageLoaded();
            } else {
                img.addEventListener('load', imageLoaded);
                img.addEventListener('error', imageLoaded);
            }
        });
    }
}

// 사용
const imageLoader = new ImageLoader(2000); // 1초 최소 로딩 시간

/* ----------------------- */
/* --widget 시간 업데이트 -- */
/* ----------------------- */
function updateTime() {
    const now = new Date();
    const days = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];

    const month = now.getMonth() + 1;
    const date = now.getDate();
    const day = days[now.getDay()];
    const hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, '0');

    $('#lock_date').text(`${month}월 ${date}일 ${day}`);
    $('#clock').text(`${hours}:${minutes}`);
    $('#lock_clock').text(`${hours}:${minutes}`);
}

// 1초마다 시간 업데이트
setInterval(updateTime, 1000);

// 초기 로드시 즉시 시간 표시
updateTime();

/* ------------------------- */
/* --- [s]Lock 해제 버튼  --- */
/* ------------------------ */
function unLock() {
    const lock = document.querySelector('.lock');
    const menuList = gsap.utils.toArray('.menu_wrap li');

    console.log(menuList);

    const tl = gsap.timeline();
    tl.set(menuList, {
        z: 1000,
    })
        .to(lock, {
            filter: 'blur(5px)',
            duration: 0.5,
        })
        .to(lock, {
            y: '-150%',
            delay: 0.3,
            ease: 'power4.inOut',
            duration: 1.2,
        })
        .to(menuList, {
            z: 0,
            ease: 'elastic.out(0.9,0.6)',
            duration: 1,
            stagger: {
                amount: 0.1,
            },
        });
}
/* ------------------------- */
/* --- [e]Lock 해제 버튼  --- */
/* ------------------------ */

/* ----------------------------*/
/* ---- [s]브라우저 온/오프 ---- */
/* ---------------------------*/
//$('#browserPicture').load('/menu/picture.html');

let browserBtn = false;

function browserOpen(type) {
    if (type === 'type1') {
        if (browserBtn == false) {
            const tl = gsap.timeline();
            tl.to('#browser', {
                scale: 1,
                y: 0,
                ease: 'power3.inOut',
                duration: 0.5,

                onComplete: function () {
                    browserBtn = true;
                },
            });
        } else {
            return;
        }
    }
    if (type === 'type2') {
        if (browserBtn == false) {
            const tl = gsap.timeline();
            tl.to('#browserPicture', {
                scale: 1,
                y: 0,
                ease: 'power3.inOut',
                duration: 0.5,

                onComplete: function () {
                    browserBtn = true;
                },
            });
        } else {
            return;
        }
    }
}
function browserClose(type) {
    if (browserBtn == true) {
        if (type === 'album') {
            const tl2 = gsap.timeline();

            tl2.to('.albumThumbSwiper .swiper-slide', {
                opacity: 0,
                scale: 0,
                stagger: {
                    amount: 0.1,
                    from: 'edges',
                },

                onComplete: function () {
                    $('#albumThumb').empty();
                },
            });
        }

        const tl = gsap.timeline();
        tl.to('#browser', {
            scale: 0,
            y: '100%',
            ease: 'power3.inOut',
            duration: 0.5,

            onComplete: function () {
                browserBtn = false;
                $('#browser').empty();
            },
        });
    }
}
/* ----------------------------*/
/* ---- [e]브라우저 온/오프 ---- */
/* ---------------------------*/

/* ------------------------ */
/* ---- [s]메뉴 식별 -------*/
/* ------------------------ */

$('.menu_list').click(function () {
    let menuId = $(this).attr('id');
    switch (menuId) {
        case 'menuSafari':
            $('#browser').load('/menu/safari.html', function () {
                browserOpen('type1');
                //safariAni();
            });
            break;
        case 'menuAlbum':
            $('#browser').load('/menu/album.html', function () {
                browserOpen('type1');
                albumSwiper();

                $('#albumThumb').load('/menu/albumThumb.html', function () {
                    albumThumbSwiper();

                    // width가 제대로 계산되었는지 확인
                    var width = $('.albumSwiper .swiper-slide').width();
                    if (width) {
                        $('#albumThumb').css('width', `calc(${width}px - 80px)`);
                    } else {
                        setTimeout(() => {
                            width = $('.albumSwiper .swiper-slide').width();
                            $('#albumThumb').css('width', width);
                            console.log('지연 후 width 설정:', width);
                        }, 100);
                    }
                });
            });
            break;
        case 'menuPicture':
            $('#browser').load('/menu/picture.html', function () {
                pictureSwiper('artist');
                browserOpen('type1');
            });
            //browserOpen('type2');
            break;
        case 'menuContact':
            $('#browser').load('/menu/contact.html');
            browserOpen('type1');
            break;
        case 'menuMessage':
            $('#browser').load('/menu/Message.html');
            browserOpen('type1');
            break;
    }
});
/* ------------------------ */
/* ---- [e]메뉴 식별 -------*/
/* ------------------------ */

/* ------------------------ */
/* ---- [s]앨범 스와이퍼 ----*/
/* ------------------------ */
function albumSwiper() {
    const $albumSwiperWrap = $('.albumSwiper .swiper-wrapper');

    albumArr.forEach((album) => {
        $('<div>', {
            class: 'swiper-slide',
            'data-youtube': album.youtube,
            html: `
                <div class="album-item">
                    <div class="cover">
                        <figure class="cover-img">
                            <img src="${album.cover}" alt="${album.title}">
                        </figure>
                        <figure class="soundtrack">
                            <img src="/resources/images/album/soundtrack.png">
                        </figure>
                    </div>
                    <h3>${album.title}</h3>

                    <p class="script">
                        ${album.script}
                    </p>
                </div>
            `,
        }).appendTo($albumSwiperWrap);
    });

    var swiper = new Swiper('.albumSwiper', {
        slidesPerView: 1,
        allowTouchMove: false, // 드래그 비활성화
        centeredSlides: true,
        freeMode: true,
        watchSlidesProgress: true,

        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
    });

    albumPlayer();
}

function albumThumbSwiper() {
    const $albumThumbSwiperWrap = $('.albumThumbSwiper .swiper-wrapper');

    albumArr.forEach((album) => {
        $('<div>', {
            class: 'swiper-slide',
            html: `
                <div class="album-item">
                    <figure>
                        <img src="${album.cover}" alt="${album.title}">
                    </figure>
                </div>
            `,
        }).appendTo($albumThumbSwiperWrap);
    });
    var swiper2 = new Swiper('.albumThumbSwiper', {
        centeredSlides: true,
        freeMode: true,
        watchSlidesProgress: true,
        spaceBetween: 100,
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
    });

    gsap.to('.albumThumbSwiper .swiper-slide', {
        opacity: 1,
        scale: 1,
        delay: 0.3,
    });
}

let albumArr = [];
$.ajax({
    url: '/resources/js/album.json',
    dataType: 'json',
    async: false, // 동기적 로딩 (필요한 경우만)
    success: function (data) {
        albumArr = data.albums;
    },
});

function albumPlayer() {
    //최초로드시 플레이어에 아이프레임 추가
    let youtubeUrl = $('.albumSwiper .swiper-slide-active').data('youtube');
    createPlayer(youtubeUrl);

    function createPlayer(videoId) {
        // 기존 플레이어가 있다면 제거

        if (player) {
            player.destroy();
        }

        // 플레이어 컨테이너가 비어있는지 확인
        $('#albumMusic').empty();

        // 새로운 div 엘리먼트 추가
        $('#albumMusic').append('<div id="youtubePlayer"></div>');

        // 새 플레이어 생성
        player = new YT.Player('youtubePlayer', {
            height: '360',
            width: '640',
            videoId: videoId,
            playerVars: {
                autoplay: 0,
                mute: 1,
                rel: 0,
                enablejsapi: 1,
            },
            events: {
                onReady: onPlayerReady,
                onStateChange: onPlayerStateChange,
            },
        });
    }

    function onPlayerReady(event) {
        setTimeout(() => {
            player.unMute();
            player.setVolume(100);
        }, 1000);

        // 볼륨 가져오기 (0-100)
        function getVolume() {
            return player.getVolume();
        }

        // 볼륨 설정하기 (0-100)
        function setVolume(volume) {
            if (volume >= 0 && volume <= 100) {
                player.setVolume(volume);
            }
        }

        // 음소거 설정
        function mute() {
            player.mute();
        }

        // 음소거 해제
        function unMute() {
            player.unMute();
        }

        // 음소거 상태 확인
        function isMuted() {
            return player.isMuted();
        }
        // 볼륨 슬라이더 이벤트 리스너 예시
        const volumeSlider = document.getElementById('volume-slider');
        volumeSlider.addEventListener('input', (e) => {
            setVolume(e.target.value);
        });

        // 음소거 버튼 이벤트 리스너 예시
        const muteButton = document.getElementById('mute-button');
        muteButton.addEventListener('click', () => {
            if (isMuted()) {
                unMute();
            } else {
                mute();
            }
        });
    }

    function onPlayerStateChange(event) {
        // 상태 변경 처리
    }
    let isPaused = false;

    // Swiper 버튼 클릭 이벤트
    $('.swiper-button-next, .swiper-button-prev').click(function () {
        $('.play_btn').removeClass('paused');
        $('.play_btn').addClass('play');
        isPaused = false;

        youtubeUrl = $('.albumSwiper .swiper-slide-active').data('youtube');
        // YouTube URL에서 videoId만 추출
        if (youtubeUrl.includes('watch?v=')) {
            youtubeUrl = youtubeUrl.split('watch?v=')[1];
        } else if (youtubeUrl.includes('youtu.be/')) {
            youtubeUrl = youtubeUrl.split('youtu.be/')[1];
        }
        createPlayer(youtubeUrl);
    });

    // 재생 버튼 클릭 이벤트

    $('.play_btn').click(function () {
        if (player && typeof player.getPlayerState === 'function') {
            const state = player.getPlayerState();
            const $soundtrackImg = $('.swiper-slide-active .soundtrack img');
            let tl = gsap.timeline();

            if (state === YT.PlayerState.PLAYING) {
                player.pauseVideo();
                $(this).removeClass('paused');
                $(this).addClass('play');

                gsap.to('.swiper-slide-active .soundtrack img', {
                    xPercent: 0,
                });
            } else {
                player.playVideo();
                player.unMute();
                player.setVolume(100);
                $(this).removeClass('play');
                $(this).addClass('paused');

                if (isPaused == false) {
                    tl.to('.swiper-slide-active .cover-img', {
                        scale: 0.7,
                        //xPercent: '-10',
                    }).to('.swiper-slide-active .soundtrack img', {
                        xPercent: 25,
                        onComplete: function () {
                            isPaused = true;
                            gsap.to($soundtrackImg, {
                                rotate: 360,
                                repeat: -1,
                                ease: 'none',
                                duration: 3,
                            });
                        },
                    });
                } else {
                    gsap.to('.swiper-slide-active .soundtrack img', {
                        xPercent: 25,
                    });
                }
            }
        }
    });

    // YT API가 준비되었을 때 실행될 함수
    function onYouTubeIframeAPIReady() {
        // 초기 비디오 ID로 플레이어 생성
        let initialVideoId = $('.albumSwiper .swiper-slide-active').data('youtube');
        if (initialVideoId) {
            // YouTube URL에서 videoId만 추출
            if (initialVideoId.includes('watch?v=')) {
                initialVideoId = initialVideoId.split('watch?v=')[1];
            } else if (initialVideoId.includes('youtu.be/')) {
                initialVideoId = initialVideoId.split('youtu.be/')[1];
            }
            createPlayer(initialVideoId);
        }
    }
}

/* ------------------------ */
/* ---- [e]앨범 스와이퍼 ----*/
/* ------------------------ */

/* ------------------------ */
/* ---- [s]사진 스와이퍼 ----*/
/* ------------------------ */

let pictureArr = [];
$.ajax({
    url: '/resources/js/picture.json',
    dataType: 'json',
    async: false, // 동기적 로딩 (필요한 경우만)
    success: function (data) {
        pictureArr = data.pictures;

        console.log(pictureArr);
    },
});

let pictureArr2 = [];
$.ajax({
    url: '/resources/js/picture2.json',
    dataType: 'json',
    async: false, // 동기적 로딩 (필요한 경우만)
    success: function (data) {
        pictureArr2 = data.picture2;

        console.log(pictureArr2);
    },
});

function pictureSwiper(type) {
    const $pictureSwiperWrap = $('.pictureSwiper .swiper-wrapper');
    const $pictureSwiperWrap2 = $('.pictureSwiper2 .swiper-wrapper');

    if (type == 'artist') {
        $pictureSwiperWrap.empty();
        $pictureSwiperWrap2.empty();

        pictureArr.forEach((picture) => {
            $('<div>', {
                class: 'swiper-slide',
                html: `
            <div>
                <figure class="background">
                    <img src="${picture.img}">
                </figure>
                <figure class="img">
                    <img src="${picture.img}">
                </figure>
            </div>
            `,
            }).appendTo($pictureSwiperWrap);

            $('<div>', {
                class: 'swiper-slide',
                html: `
          <div>
              <figure class="img">
                  <img src="${picture.img}">
              </figure>
          </div>
          `,
            }).appendTo($pictureSwiperWrap2);
        });

        var pictureSwiper2 = new Swiper('.pictureSwiper2', {
            slidesPerView: 'auto',
            watchSlidesProgress: true, // thumbs swiper에 필요
        });

        var pictureSwiper = new Swiper('.pictureSwiper', {
            slidesPerView: 1,
            centeredSlides: true,
            thumbs: {
                swiper: pictureSwiper2, // 이제 swiper2가 정의되어 있으므로 사용 가능
            },
        });
    } else if (type == 'normal') {
        $pictureSwiperWrap.empty();
        $pictureSwiperWrap2.empty();

        pictureArr2.forEach((picture2) => {
            $('<div>', {
                class: 'swiper-slide',
                html: `
                <div>
                    <figure class="background">
                        <img src="${picture2.img}">
                    </figure>
                    <figure class="img">
                        <img src="${picture2.img}">
                    </figure>
                </div>
                 `,
            }).appendTo($pictureSwiperWrap);

            $('<div>', {
                class: 'swiper-slide',
                html: `
                <div>
                    <figure class="img">
                        <img src="${picture2.img}">
                    </figure>
                </div>
                `,
            }).appendTo($pictureSwiperWrap2);
        });

        var swiper = new Swiper('.pictureSwiper', {
            slidesPerView: 1,
            centeredSlides: true,
            //watchSlidesProgress: true,
            // navigation: {
            //     nextEl: '.swiper-button-next',
            //     prevEl: '.swiper-button-prev',
            // },
        });
    }
}

/* ------------------------ */
/* ---- [e]사진 스와이퍼 ----*/
/* ------------------------ */

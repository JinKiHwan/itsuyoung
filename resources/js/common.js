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

/* ----------------------- */
/* ---  Lock 해제 버튼  --- */
/* ----------------------- */
function unLock() {
    const lock = document.querySelector('.lock');
    const tl = gsap.timeline();
    tl.to(lock, {
        filter: 'blur(5px)',
        duration: 0.5,
    }).to(lock, {
        y: '-100%',
        delay: 0.3,
        ease: 'power4.inOut',
        duration: 0.8,
    });
}

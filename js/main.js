// js/main.js - 필수적인 초기 기능만 포함
function showTopBar(){
    let country = "France";
    let vat = 20;
    // 비동기 작업으로 전환
    requestIdleCallback(() => {
        document.querySelector("section.country-bar")
          .innerHTML = `<p>Orders to <b>${country}</b> are subject to <b>${vat}%</b> VAT</p>`;
        document.querySelector("section.country-bar")
          .classList.remove('hidden');
    });
}

// 페이지 로드 완료 후 호출
document.addEventListener('DOMContentLoaded', () => {
    showTopBar();
    
    // 메뉴 아이콘 클릭 이벤트 (필요한 경우)
    const menuIcon = document.querySelector('.menu-icon');
    if (menuIcon) {
        menuIcon.addEventListener('click', () => {
            // 메뉴 토글 로직
        });
    }
    
    // 제품 데이터 지연 로딩
    if (document.getElementById('all-products')) {
        import('./products.js').then(module => {
            console.log('제품 모듈 로드 완료');
        }).catch(err => {
            console.error('제품 로딩 중 오류 발생:', err);
        });
    }
});

// 뉴스레터 폼 제출 처리 - 사용자 상호작용 시에만 필요
const newsletterForm = document.querySelector('.newsletter form');
if (newsletterForm) {
    newsletterForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const email = this.querySelector('input[type="email"]').value;
        if (email) {
            alert(`Thank you for subscribing with ${email}!`);
            this.reset();
        }
    });
}
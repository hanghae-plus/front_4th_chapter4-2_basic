// js/main.js - 이벤트 위임 적용
function showTopBar(){
    let country = "France";
    let vat = 20;
    // 비동기 작업으로 전환
    setTimeout(() => {
        const countryBar = document.querySelector("section.country-bar");
        if (countryBar) {
            countryBar.innerHTML = `<p>Orders to <b>${country}</b> are subject to <b>${vat}%</b> VAT</p>`;
            countryBar.classList.remove('hidden');
        }
    }, 0);
}

// 문서 전체에 대한 이벤트 위임 설정
function setupGlobalEventDelegation() {
    // 문서 레벨에서 클릭 이벤트 리스너 한 번만 추가
    document.addEventListener('click', (event) => {
        // 메뉴 아이콘 클릭 처리
        if (event.target.closest('.menu-icon')) {
            handleMenuIconClick();
        }
        
        // 기타 전역 클릭 이벤트 처리
        if (event.target.closest('#open_preferences_center')) {
            // 쿠키 설정 센터 열기 처리
            event.preventDefault();
            if (typeof cookieconsent !== 'undefined') {
                cookieconsent.showPreferencesModal();
            }
        }
    });
    
    // 문서 레벨에서 제출 이벤트 리스너 한 번만 추가
    document.addEventListener('submit', (event) => {
        // 뉴스레터 폼 제출 처리
        if (event.target.closest('.newsletter form')) {
            event.preventDefault();
            const form = event.target;
            const email = form.querySelector('input[type="email"]').value;
            if (email) {
                alert(`Thank you for subscribing with ${email}!`);
                form.reset();
            }
        }
    });
}

// 메뉴 아이콘 클릭 처리 함수
function handleMenuIconClick() {
    console.log("메뉴 아이콘 클릭됨");
    // 메뉴 토글 로직
}

// 페이지 로드 완료 후 호출
document.addEventListener('DOMContentLoaded', () => {
    showTopBar();
    setupGlobalEventDelegation();
    
    // 제품 데이터 지연 로딩
    if (document.getElementById('all-products')) {
        import('./products.js')
          .then(module => {
              console.log('제품 모듈 로드 완료');
              if (typeof module.loadProducts === 'function') {
                  module.loadProducts();
              }
          })
          .catch(err => {
              console.error('제품 로딩 중 오류 발생:', err);
              // 오류 처리: 사용자에게 로딩 실패 메시지 표시
              const container = document.querySelector('#all-products .container');
              if (container) {
                  container.innerHTML = `
                        <div style="text-align:center;padding:30px;">
                            <h3>Unable to load products</h3>
                            <p>Please try again later</p>
                            <button onclick="window.location.reload()">Retry</button>
                        </div>
                    `;
              }
          });
    }
});
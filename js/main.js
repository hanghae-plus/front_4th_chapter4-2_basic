// js/main.js - 인터섹션 옵저버를 활용한 성능 최적화
function showTopBar() {
    let country = "France";
    let vat = 20;
    
    // requestIdleCallback 지원 확인
    if ('requestIdleCallback' in window) {
        requestIdleCallback(() => {
            updateCountryBar(country, vat);
        }, { timeout: 2000 });
    } else {
        // 폴백: setTimeout 사용
        setTimeout(() => {
            updateCountryBar(country, vat);
        }, 200);
    }
}

// 국가 바 업데이트 함수 분리
function updateCountryBar(country, vat) {
    const countryBar = document.querySelector("section.country-bar");
    if (countryBar) {
        countryBar.innerHTML = `<p>Orders to <b>${country}</b> are subject to <b>${vat}%</b> VAT</p>`;
        countryBar.classList.remove('hidden');
    }
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

// 인터섹션 옵저버를 활용한 이미지 지연 로딩 설정
function setupImageLazyLoading() {
    // 브라우저가 IntersectionObserver를 지원하는지 확인
    if ('IntersectionObserver' in window) {
        const imgObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    const src = img.dataset.src;
                    
                    if (src) {
                        // 고해상도 이미지 로드
                        img.src = src;
                        img.classList.remove('blur');
                        img.classList.add('loaded');
                        
                        // 관찰 중단
                        observer.unobserve(img);
                    }
                }
            });
        }, {
            rootMargin: '50px 0px',
            threshold: 0.1
        });
        
        // 모든 지연 로딩 대상 이미지에 관찰자 적용
        const lazyImages = document.querySelectorAll('img[data-src]');
        lazyImages.forEach(img => {
            imgObserver.observe(img);
        });
    } else {
        // IntersectionObserver를 지원하지 않는 브라우저를 위한 폴백
        const lazyImages = document.querySelectorAll('img[data-src]');
        lazyImages.forEach(img => {
            img.src = img.dataset.src;
        });
    }
}

// 섹션별 지연 로딩 설정
function setupSectionLazyLoading() {
    if ('IntersectionObserver' in window) {
        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const section = entry.target;
                    const action = section.dataset.lazyAction;
                    
                    if (action === 'load-products' && !section.classList.contains('loaded')) {
                        // 제품 데이터 지연 로딩
                        import('./products.js').then(module => {
                            console.log('제품 모듈 로드 완료');
                            section.classList.add('loaded');
                        }).catch(err => {
                            console.error('제품 로딩 중 오류 발생:', err);
                        });
                    }
                    
                    // 관찰 중단
                    section.classList.add('lazy-loaded');
                    sectionObserver.unobserve(section);
                }
            });
        }, {
            rootMargin: '200px 0px', // 뷰포트 200px 전에 미리 로드 시작
            threshold: 0.1
        });
        
        // 지연 로딩할 섹션들을 관찰
        const lazySections = document.querySelectorAll('[data-lazy-action]');
        lazySections.forEach(section => {
            sectionObserver.observe(section);
        });
    } else {
        // IntersectionObserver를 지원하지 않는 브라우저를 위한 폴백
        const productSection = document.getElementById('all-products');
        if (productSection) {
            import('./products.js').then(module => {
                console.log('제품 모듈 로드 완료');
            }).catch(err => {
                console.error('제품 로딩 중 오류 발생:', err);
            });
        }
    }
}

// 페이지 초기화
function initializePage() {
    showTopBar();
    setupGlobalEventDelegation();
    setupImageLazyLoading();
    
    // HTML에 data-lazy-action 속성 추가
    const productSection = document.getElementById('all-products');
    if (productSection) {
        productSection.dataset.lazyAction = 'load-products';
        setupSectionLazyLoading();
    } else {
        // 제품 섹션이 없는 경우 기본 로딩
        import('./products.js').then(module => {
            console.log('제품 모듈 로드 완료');
        }).catch(err => {
            console.error('제품 로딩 중 오류 발생:', err);
        });
    }
}

// 페이지 로드 완료 후 호출
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializePage);
} else {
    // 이미 DOMContentLoaded 이벤트가 발생한 경우
    initializePage();
}
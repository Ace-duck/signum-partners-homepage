/* ========================================
   시그넘파트너스 - Apple Style JavaScript
   스크롤 기반 애니메이션 및 인터랙션
======================================== */

// ========================================
// 전역 변수 및 설정
// ========================================

let isScrolling = false;
let scrollTimeout;

// 슬라이더 변수
let currentSlide = 0;
let slidesPerView = 4;
let totalSlides = 20;

const observerOptions = {
  root: null,
  rootMargin: '0px 0px -100px 0px',
  threshold: [0.1, 0.3, 0.5, 0.7, 1.0]
};

// ========================================
// DOM 로드 후 초기화
// ========================================

document.addEventListener('DOMContentLoaded', function() {
  initializeAnimations();
  initializeNavigation();
  initializeCounters();

  initializeProcessTimeline();
  initializeContactForm();
  initializeFloatingCTA();
  initializeScrollEffects();
  initializeCaseSlider();
  
  // AOS 라이브러리 초기화
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 800,
      easing: 'ease-out-cubic',
      once: true,
      offset: 50,
      delay: 0,
      anchorPlacement: 'top-bottom'
    });
  }
});

// ========================================
// 스크롤 기반 애니메이션 시스템
// ========================================

function initializeAnimations() {
  // Intersection Observer for reveal animations
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        
        // 추가 애니메이션 트리거
        if (entry.target.classList.contains('stat-number')) {
          animateCounter(entry.target);
        }
        
        if (entry.target.classList.contains('chart-bar')) {
          animateChartBar(entry.target);
        }
        
        if (entry.target.classList.contains('progress-bar')) {
          animateProgressBar();
        }
      }
    });
  }, observerOptions);

  // 애니메이션 대상 요소들 관찰 시작
  const elementsToAnimate = document.querySelectorAll([
    '.fade-in-up',
    '.slide-in-left', 
    '.slide-in-right',
    '.stat-number',
    '.chart-bar',
    '.progress-bar',
    '.reveal-text'
  ].join(','));

  elementsToAnimate.forEach(element => {
    revealObserver.observe(element);
  });
}

// ========================================
// 네비게이션 시스템
// ========================================

function initializeNavigation() {
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-item');
  
  // 스크롤 시 네비게이션 스타일 변경
  let lastScrollTop = 0;
  
  window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // 스크롤 다운/업 감지
    if (scrollTop > lastScrollTop && scrollTop > 100) {
      navbar.classList.add('nav-hidden');
    } else {
      navbar.classList.remove('nav-hidden');
    }
    
    // 스크롤 배경 변경
    if (scrollTop > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    
    lastScrollTop = scrollTop;
  });

  // 부드러운 스크롤링
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        const offsetTop = targetElement.offsetTop - 70; // 네비게이션 높이 고려
        
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });
        
        // 활성 링크 업데이트
        updateActiveNavLink(link);
      }
    });
  });
}

function updateActiveNavLink(activeLink) {
  const navLinks = document.querySelectorAll('.nav-item');
  navLinks.forEach(link => link.classList.remove('active'));
  activeLink.classList.add('active');
}

// ========================================
// 카운터 애니메이션
// ========================================

function initializeCounters() {
  const counters = document.querySelectorAll('[data-count]');
  
  counters.forEach(counter => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    
    observer.observe(counter);
  });
}

function animateCounter(element) {
  const target = parseInt(element.getAttribute('data-count'));
  const duration = 2000;
  const steps = 60;
  const stepValue = target / steps;
  const stepDuration = duration / steps;
  
  let current = 0;
  
  const timer = setInterval(() => {
    current += stepValue;
    
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    
    // 소수점 처리
    if (target % 1 !== 0) {
      element.textContent = current.toFixed(1);
    } else {
      element.textContent = Math.floor(current).toLocaleString();
    }
  }, stepDuration);
}

// ========================================
// 차트 바 애니메이션
// ========================================

function animateChartBar(chartBar) {
  const width = chartBar.getAttribute('data-width');
  
  setTimeout(() => {
    chartBar.style.setProperty('--bar-width', width + '%');
    chartBar.classList.add('animated');
  }, 500);
}



// ========================================
// 프로세스 타임라인 애니메이션
// ========================================

function initializeProcessTimeline() {
  const processSection = document.getElementById('process');
  const progressBar = document.querySelector('.progress-bar');
  const stepItems = document.querySelectorAll('.step-item');
  
  if (!processSection || !progressBar) return;
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateProgressBar();
        animateStepItems();
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });
  
  observer.observe(processSection);
}

function animateProgressBar() {
  const progressBar = document.querySelector('.progress-bar');
  if (progressBar) {
    setTimeout(() => {
      progressBar.style.width = '100%';
    }, 500);
  }
}

function animateStepItems() {
  const stepItems = document.querySelectorAll('.step-item');
  
  stepItems.forEach((item, index) => {
    setTimeout(() => {
      item.classList.add('step-animated');
    }, (index + 1) * 300);
  });
}

// ========================================
// 컨택트 폼 처리
// ========================================

function initializeContactForm() {
  const form = document.getElementById('consultationForm');
  
  if (form) {
    form.addEventListener('submit', handleFormSubmission);
  }
  
  // 입력 필드 포커스 효과
  const formInputs = document.querySelectorAll('.form-group input, .form-group select, .form-group textarea');
  
  formInputs.forEach(input => {
    input.addEventListener('focus', (e) => {
      e.target.parentElement.classList.add('focused');
    });
    
    input.addEventListener('blur', (e) => {
      if (!e.target.value) {
        e.target.parentElement.classList.remove('focused');
      }
    });
    
    // 초기 값이 있는 경우 focused 클래스 추가
    if (input.value) {
      input.parentElement.classList.add('focused');
    }
  });
}

function handleFormSubmission(e) {
  e.preventDefault();
  
  // 폼 데이터 수집
  const formData = new FormData(e.target);
  const data = Object.fromEntries(formData);
  
  // 간단한 유효성 검사
  if (!validateForm(data)) {
    return;
  }
  
  // 제출 버튼 로딩 상태
  const submitBtn = e.target.querySelector('.form-submit');
  const originalText = submitBtn.innerHTML;
  
  submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 전송 중...';
  submitBtn.disabled = true;
  
  // 실제 환경에서는 서버로 데이터 전송
  setTimeout(() => {
    showSuccessMessage();
    
    // 버튼 상태 복원
    submitBtn.innerHTML = originalText;
    submitBtn.disabled = false;
    
    // 폼 리셋
    e.target.reset();
  }, 2000);
}

function validateForm(data) {
  const required = ['company', 'name', 'phone', 'industry', 'revenue'];
  
  for (let field of required) {
    if (!data[field] || data[field].trim() === '') {
      alert(`${getFieldLabel(field)} 항목을 입력해주세요.`);
      return false;
    }
  }
  
  if (!data.privacy) {
    alert('개인정보 수집 및 이용에 동의해주세요.');
    return false;
  }
  
  return true;
}

function getFieldLabel(field) {
  const labels = {
    company: '업체명',
    name: '대표자명', 
    phone: '연락처',
    industry: '업종',
    revenue: '연매출',
    source: '유입경로'
  };
  
  return labels[field] || field;
}

function showSuccessMessage() {
  // 성공 메시지 모달 또는 알림 표시
  const message = document.createElement('div');
  message.className = 'success-message';
  message.innerHTML = `
    <div class="success-content">
      <i class="fas fa-check-circle"></i>
      <h3>상담 신청이 완료되었습니다!</h3>
      <p>30분 내에 담당자가 연락드리겠습니다.</p>
      <button onclick="this.parentElement.parentElement.remove()" class="success-btn">확인</button>
    </div>
  `;
  
  document.body.appendChild(message);
  
  // 3초 후 자동 제거
  setTimeout(() => {
    if (message.parentElement) {
      message.remove();
    }
  }, 5000);
}

// ========================================
// 플로팅 CTA 버튼
// ========================================

function initializeFloatingCTA() {
  const floatingCTA = document.getElementById('floatingCta');
  const heroSection = document.getElementById('hero');
  const contactSection = document.getElementById('contact');
  
  if (!floatingCTA) return;
  
  window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset;
    const heroBottom = heroSection.offsetTop + heroSection.offsetHeight;
    const contactTop = contactSection.offsetTop;
    
    // Hero 섹션을 벗어나고 Contact 섹션 전까지만 표시
    if (scrollTop > heroBottom && scrollTop < contactTop - window.innerHeight) {
      floatingCTA.classList.add('show');
    } else {
      floatingCTA.classList.remove('show');
    }
  });
}

// ========================================
// 스크롤 효과 (패럴랙스, 페이드)
// ========================================

function initializeScrollEffects() {
  window.addEventListener('scroll', handleScrollEffects);
  
  // 초기 실행
  handleScrollEffects();
}

function handleScrollEffects() {
  const scrollTop = window.pageYOffset;
  
  // Hero 섹션 패럴랙스 효과
  const hero = document.getElementById('hero');
  if (hero) {
    const heroContent = hero.querySelector('.hero-content');
    const heroVisual = hero.querySelector('.hero-visual');
    
    if (heroContent && heroVisual) {
      const parallaxSpeed = 0.3;
      const yPos = scrollTop * parallaxSpeed;
      
      heroContent.style.transform = `translateY(${yPos}px)`;
      heroVisual.style.transform = `translateY(${yPos * 0.5}px)`;
    }
  }
  
  // 스크롤 인디케이터 페이드
  const scrollIndicator = document.querySelector('.scroll-indicator');
  if (scrollIndicator) {
    const opacity = Math.max(0, 1 - (scrollTop / 300));
    scrollIndicator.style.opacity = opacity;
  }
  
  // 스크롤 진행률에 따른 요소 변화
  updateScrollProgress();
}

function updateScrollProgress() {
  const winHeight = window.innerHeight;
  const docHeight = document.documentElement.scrollHeight;
  const scrollTop = window.pageYOffset;
  const scrollPercent = scrollTop / (docHeight - winHeight);
  
  // 프로그레스 바 업데이트 (있는 경우)
  const progressBars = document.querySelectorAll('.scroll-progress-bar');
  progressBars.forEach(bar => {
    bar.style.width = (scrollPercent * 100) + '%';
  });
}

// ========================================
// 성공사례 슬라이더 시스템
// ========================================

function initializeCaseSlider() {
  updateSlidesPerView();
  createDots();
  updateSliderPosition();
  
  // 윈도우 리사이즈 시 슬라이더 업데이트
  window.addEventListener('resize', () => {
    updateSlidesPerView();
    createDots();
    updateSliderPosition();
  });
  
  // 터치/스와이프 지원
  initializeSwipeSupport();
}

function updateSlidesPerView() {
  const width = window.innerWidth;
  
  if (width >= 1200) {
    slidesPerView = 4;
  } else if (width >= 768) {
    slidesPerView = 2;
  } else {
    slidesPerView = 1;
  }
}

function createDots() {
  const dotsContainer = document.getElementById('sliderDots');
  if (!dotsContainer) return;
  
  const maxSlides = Math.ceil(totalSlides / slidesPerView);
  // 모바일에서는 dots 개수를 줄임
  const dotsToShow = window.innerWidth <= 767 ? Math.min(maxSlides, 5) : maxSlides;
  
  dotsContainer.innerHTML = '';
  
  for (let i = 0; i < dotsToShow; i++) {
    const dot = document.createElement('div');
    dot.className = `dot ${i === currentSlide ? 'active' : ''}`;
    dot.onclick = () => goToSlide(i);
    dotsContainer.appendChild(dot);
  }
}

function slideCase(direction) {
  const maxSlides = Math.ceil(totalSlides / slidesPerView) - 1;
  
  currentSlide += direction;
  
  if (currentSlide < 0) {
    currentSlide = maxSlides;
  } else if (currentSlide > maxSlides) {
    currentSlide = 0;
  }
  
  updateSliderPosition();
  updateDots();
}

function goToSlide(slideIndex) {
  currentSlide = slideIndex;
  updateSliderPosition();
  updateDots();
}

function updateSliderPosition() {
  const slider = document.getElementById('casesSlider');
  if (!slider) return;
  
  const slideWidth = 100 / slidesPerView;
  const translateX = -currentSlide * slideWidth;
  
  slider.style.transform = `translateX(${translateX}%)`;
  
  // 버튼 상태 업데이트
  updateNavigationButtons();
}

function updateDots() {
  const dots = document.querySelectorAll('.dot');
  dots.forEach((dot, index) => {
    dot.classList.toggle('active', index === currentSlide);
  });
}

function updateNavigationButtons() {
  const prevBtn = document.querySelector('.prev-btn');
  const nextBtn = document.querySelector('.next-btn');
  const maxSlides = Math.ceil(totalSlides / slidesPerView) - 1;
  
  if (prevBtn && nextBtn) {
    prevBtn.disabled = currentSlide === 0;
    nextBtn.disabled = currentSlide === maxSlides;
  }
}

// 자동 슬라이드 (선택사항)
function startAutoSlide() {
  setInterval(() => {
    slideCase(1);
  }, 5000); // 5초마다 자동 슬라이드
}

// 스와이프 지원
function initializeSwipeSupport() {
  const slider = document.getElementById('casesSlider');
  if (!slider) return;
  
  let startX = 0;
  let currentX = 0;
  let isDragging = false;
  
  slider.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    isDragging = true;
  });
  
  slider.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    currentX = e.touches[0].clientX;
  });
  
  slider.addEventListener('touchend', () => {
    if (!isDragging) return;
    
    const diffX = startX - currentX;
    const threshold = 50;
    
    if (Math.abs(diffX) > threshold) {
      if (diffX > 0) {
        slideCase(1); // 오른쪽으로 스와이프 (다음 슬라이드)
      } else {
        slideCase(-1); // 왼쪽으로 스와이프 (이전 슬라이드)
      }
    }
    
    isDragging = false;
  });
  
  // 마우스 드래그 지원 (데스크톱)
  slider.addEventListener('mousedown', (e) => {
    startX = e.clientX;
    isDragging = true;
    e.preventDefault();
  });
  
  slider.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    currentX = e.clientX;
  });
  
  slider.addEventListener('mouseup', () => {
    if (!isDragging) return;
    
    const diffX = startX - currentX;
    const threshold = 100;
    
    if (Math.abs(diffX) > threshold) {
      if (diffX > 0) {
        slideCase(1);
      } else {
        slideCase(-1);
      }
    }
    
    isDragging = false;
  });
  
  slider.addEventListener('mouseleave', () => {
    isDragging = false;
  });
}

// ========================================
// 유틸리티 함수들
// ========================================

function debounce(func, wait, immediate) {
  let timeout;
  return function executedFunction() {
    const context = this;
    const args = arguments;
    
    const later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    
    if (callNow) func.apply(context, args);
  };
}

function throttle(func, limit) {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  }
}

// ========================================
// 모바일 터치 지원
// ========================================

let touchStartY = 0;
let touchEndY = 0;

document.addEventListener('touchstart', e => {
  touchStartY = e.changedTouches[0].screenY;
});

document.addEventListener('touchend', e => {
  touchEndY = e.changedTouches[0].screenY;
  handleGesture();
});

function handleGesture() {
  const swipeThreshold = 50;
  const diff = touchStartY - touchEndY;
  
  if (Math.abs(diff) > swipeThreshold) {
    if (diff > 0) {
      // 위로 스와이프 - 다음 섹션으로
      console.log('Swiped up');
    } else {
      // 아래로 스와이프 - 이전 섹션으로  
      console.log('Swiped down');
    }
  }
}

// ========================================
// 성능 최적화
// ========================================

// 스크롤 이벤트 최적화
const optimizedScrollHandler = throttle(handleScrollEffects, 16); // 60fps
window.addEventListener('scroll', optimizedScrollHandler);

// 리사이즈 이벤트 최적화
const optimizedResizeHandler = debounce(() => {
  // 리사이즈 시 필요한 재계산 작업
  console.log('Window resized');
}, 250);
window.addEventListener('resize', optimizedResizeHandler);

// ========================================
// CSS 동적 추가 (성공 메시지 스타일)
// ========================================

const successMessageCSS = `
.success-message {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  animation: fadeIn 0.3s ease-out;
}

.success-content {
  background: white;
  padding: 40px;
  border-radius: 20px;
  text-align: center;
  max-width: 400px;
  box-shadow: 0 20px 40px rgba(0,0,0,0.2);
  animation: slideInUp 0.5s ease-out;
}

.success-content i {
  font-size: 4rem;
  color: #4caf50;
  margin-bottom: 20px;
}

.success-content h3 {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 10px;
  color: #1d1d1f;
}

.success-content p {
  font-size: 1.4rem;
  color: #666;
  margin-bottom: 24px;
}

.success-btn {
  background: var(--gradient-primary);
  color: white;
  padding: 12px 32px;
  border: none;
  border-radius: 25px;
  font-size: 1.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.success-btn:hover {
  transform: translateY(-2px);
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideInUp {
  from { 
    opacity: 0;
    transform: translateY(30px);
  }
  to { 
    opacity: 1;
    transform: translateY(0);
  }
}
`;

// 스타일시트 추가
const style = document.createElement('style');
style.textContent = successMessageCSS;
document.head.appendChild(style);

// ========================================
// AOS 대체 커스텀 애니메이션 (AOS 로드 실패 시)
// ========================================

if (typeof AOS === 'undefined') {
  console.log('AOS library not loaded, using custom animations');
  
  // 커스텀 스크롤 애니메이션 구현
  const customObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const element = entry.target;
        const delay = element.getAttribute('data-aos-delay') || 0;
        
        setTimeout(() => {
          element.classList.add('aos-animate');
        }, parseInt(delay));
        
        customObserver.unobserve(element);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });
  
  // AOS 속성을 가진 요소들에 커스텀 애니메이션 적용
  document.querySelectorAll('[data-aos]').forEach(el => {
    customObserver.observe(el);
  });
}
// 페이지가 로드되면 초기화 수행
window.addEventListener('DOMContentLoaded', () => {
  // 오늘 날짜로 기본 세팅
  const dateInput = document.getElementById('diaryDate');
  if (dateInput) {
    dateInput.valueAsDate = new Date();
  }
  
  // 저장 버튼에 이벤트 리스너 직접 연결
  const saveBtn = document.getElementById('saveBtn');
  if (saveBtn) {
    saveBtn.addEventListener('click', saveDiary);
  }

  loadDiaries();
});

// 일기 저장 함수
function saveDiary() {
  const date = document.getElementById('diaryDate').value;
  const mood = document.getElementById('diaryMood').value;
  const title = document.getElementById('diaryTitle').value.trim();
  const content = document.getElementById('diaryContent').value.trim();

  if (!date || !title || !content) {
    alert('날짜, 제목, 내용을 모두 작성해 주세요!');
    return;
  }

  const newDiary = {
    id: Date.now(),
    date,
    mood,
    title,
    content
  };

  try {
    const diaries = JSON.parse(localStorage.getItem('myDiaries') || '[]');
    diaries.unshift(newDiary); // 최신글이 맨 위로 오도록 추가
    localStorage.setItem('myDiaries', JSON.stringify(diaries));

    // 입력창 초기화
    document.getElementById('diaryTitle').value = '';
    document.getElementById('diaryContent').value = '';

    loadDiaries();
    alert('일기가 성공적으로 저장되었습니다!');
  } catch (error) {
    console.error('저장 중 오류 발생:', error);
    alert('저장소 용량이 부족하거나 브라우저 설정으로 인해 저장이 실패했습니다.');
  }
}

// 일기 목록 불러오기 함수
function loadDiaries() {
  const listElement = document.getElementById('diaryList');
  if (!listElement) return;

  const diaries = JSON.parse(localStorage.getItem('myDiaries') || '[]');
  listElement.innerHTML = '';

  if (diaries.length === 0) {
    listElement.innerHTML = '<div class="empty-msg">아직 작성된 일기가 없습니다. 첫 일기를 기록해 보세요!</div>';
    return;
  }

  diaries.forEach(diary => {
    const card = document.createElement('div');
    card.className = 'diary-card';
    card.innerHTML = `
      <div class="card-header">
        <span class="card-date">${diary.date} <span class="card-mood">${diary.mood}</span></span>
        <button class="delete-btn" onclick="deleteDiary(${diary.id})">삭제</button>
      </div>
      <div class="card-title">${escapeHtml(diary.title)}</div>
      <div class="card-content">${escapeHtml(diary.content)}</div>
    `;
    listElement.appendChild(card);
  });
}

// 일기 삭제 함수
function deleteDiary(id) {
  if (!confirm('이 일기를 삭제하시겠습니까?')) return;

  let diaries = JSON.parse(localStorage.getItem('myDiaries') || '[]');
  diaries = diaries.filter(item => item.id !== id);
  localStorage.setItem('myDiaries', JSON.stringify(diaries));
  loadDiaries();
}

// HTML 이스케이프 함수 (보안 처리)
function escapeHtml(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
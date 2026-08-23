document.addEventListener('DOMContentLoaded', () => {
  // 오늘 날짜로 기본 세팅
  document.getElementById('diaryDate').valueAsDate = new Date();
  loadDiaries();
});

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

  const diaries = JSON.parse(localStorage.getItem('myDiaries') || '[]');
  diaries.unshift(newDiary); // 최신글이 맨 위로 오도록 추가
  localStorage.setItem('myDiaries', JSON.stringify(diaries));

  // 입력창 초기화
  document.getElementById('diaryTitle').value = '';
  document.getElementById('diaryContent').value = '';

  loadDiaries();
}

function loadDiaries() {
  const diaries = JSON.parse(localStorage.getItem('myDiaries') || '[]');
  const listElement = document.getElementById('diaryList');
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

function deleteDiary(id) {
  if (!confirm('이 일기를 삭제하시겠습니까?')) return;

  let diaries = JSON.parse(localStorage.getItem('myDiaries') || '[]');
  diaries = diaries.filter(item => item.id !== id);
  localStorage.setItem('myDiaries', JSON.stringify(diaries));
  loadDiaries();
}

function escapeHtml(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
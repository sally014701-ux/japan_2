# 저장소 연결 및 푸시

원격 저장소: **https://github.com/sally014701-ux/japan_2.git**

## 최초 1회 (아직 git을 안 썼다면)

```bash
cd c:\Users\gram\Desktop\japan
git init
git remote add origin https://github.com/sally014701-ux/japan_2.git
git branch -M main
git add -A
git commit -m "Initial commit: 일본어 퀴즈 + 연락하기(Resend)"
git push -u origin main
```

## 이후 수정할 때마다 (Cursor가 커밋 안 했을 때)

```bash
cd c:\Users\gram\Desktop\japan
git add -A
git commit -m "변경 내용 요약"
git push origin main
```

Git이 설치되어 있어야 합니다: https://git-scm.com/download/win

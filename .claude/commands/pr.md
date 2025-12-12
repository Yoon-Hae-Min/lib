# Create Pull Request

현재 브랜치의 변경사항으로 Pull Request를 생성하거나 기존 PR을 업데이트합니다.

다음 단계를 수행해주세요:

1. 현재 브랜치의 기존 PR 확인

   - `gh pr list --head <현재브랜치명> --base main --json number,url`로 기존 PR 존재 여부 확인
   - 기존 PR이 있으면: PR 정보를 저장하고 업데이트 모드로 진행
   - 기존 PR이 없으면: 새 PR 생성 모드로 진행

2. 현재 브랜치와 변경사항 확인

   - `git status`로 현재 상태 확인
   - **기존 PR이 있는 경우**: `gh pr view <PR번호> --json commits --jq '.commits[-1].oid'`로 PR의 마지막 커밋 해시 가져오기
   - **기존 PR이 있는 경우**: `git log <마지막PR커밋>..HEAD --oneline`으로 새로 추가된 커밋 확인
   - **기존 PR이 없는 경우**: `git diff main...HEAD`로 main과의 전체 차이 확인

3. 변경된 패키지 파악

   - packages/ 디렉토리에서 변경된 패키지 확인
   - 각 패키지의 변경 내용 분석 (기능 추가, 버그 수정, 문서 업데이트 등)

4. PR 제목 작성

   - 형식: `타입(스코프): 간단한 설명`
   - 타입:
     - `feat`: 새로운 기능 추가
     - `fix`: 버그 수정
     - `docs`: 문서 변경
     - `style`: 코드 포맷팅, 세미콜론 등
     - `refactor`: 코드 리팩토링
     - `test`: 테스트 추가/수정
     - `chore`: 빌드, 설정, 도구 변경
     - `perf`: 성능 개선
   - 스코프: 패키지명 (use-modal, swagger-generator 등) 또는 영역 (ci, deps 등)
   - 예시:
     - `feat(use-modal): 중첩 모달 닫기 기능 추가`
     - `fix(use-param-state): URL 인코딩 버그 수정`
     - `chore(ci): 워크플로우 캐싱 최적화`
     - `docs(use-file-upload): README 사용 예시 추가`

5. PR 본문 작성 (프로젝트 템플릿 기반)

```markdown
## 📝 Summary

- 변경사항 요약 (bullet points)
- 영향받는 패키지 명시

## 🎯 Changes

- **패키지명**: 구체적인 변경 내용
- 추가된 기능, 수정된 버그, 개선사항 등

## 🧪 Test Plan

- [ ] 로컬에서 `pnpm test` 실행
- [ ] 로컬에서 `pnpm build:prod` 성공 확인
- [ ] 변경된 패키지의 기능 테스트
- [ ] 문서 업데이트 확인 (필요시)

## 📦 Related Packages

- `@yoonhaemin-lib/패키지명` - 변경 이유

## 💡 Additional Notes

(선택) 추가 설명, breaking changes, migration guide 등

---

🤖 Generated with [Claude Code](https://claude.com/claude-code)
```

6. PR 생성/업데이트 실행

   **기존 PR이 없는 경우 (새 PR 생성):**

   - base 브랜치가 main인지 확인
   - 브랜치가 원격에 푸시되었는지 확인
   - 푸시되지 않았으면 `git push -u origin <브랜치명>`으로 푸시
   - `gh pr create --base main --title "<제목>" --body "<본문>"` 사용하여 생성
   - 생성된 PR URL 반환

   **기존 PR이 있는 경우 (PR 업데이트):**

   - 새로운 커밋이 있는지 확인
   - 새 커밋이 없으면: "이미 모든 커밋이 PR에 반영되어 있습니다" 메시지 출력
   - 새 커밋이 있으면:
     - `git push origin <브랜치명>`으로 새 커밋 푸시 (이미 추적 중이므로 -u 불필요)
     - `gh pr edit <PR번호> --body "<업데이트된 본문>"` 사용하여 PR 본문 업데이트
     - 업데이트된 PR URL 반환
     - "기존 PR에 N개의 새로운 커밋이 추가되었습니다" 메시지 출력

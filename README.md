# CILAB · Kookmin University

국민대학교 Computational Intelligence Laboratory의 콘텐츠와 로고를 적용한 정적 홈페이지입니다. 외부 프레임워크나 npm 패키지를 설치하지 않아도 Node.js 20 이상에서 실행됩니다. 원본 출처와 변경 범위는 [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md)에 기록했습니다.

## 실행

```sh
node scripts/serve.mjs
```

미리보기: http://127.0.0.1:4173

```sh
node scripts/build.mjs   # 배포용 dist/ 생성
node scripts/check.mjs   # 빌드 및 내부 링크·이미지·콘텐츠 검증
```

`npm run dev`, `npm run build`, `npm run check`도 사용할 수 있습니다. 개발 서버는 시작할 때 빌드합니다. 파일 수정 후 `node scripts/build.mjs`를 실행하고 브라우저를 새로고침하세요.

## 페이지

Home, Team, News, Research, Publications, Projects, Teaching, Gallery, Contact, Joining CILAB의 10개 페이지입니다. 본문은 빌드 시 HTML로 생성됩니다. Home은 Welcome → Lab Openings → 사진 2장 → 최신 소식 → 연구 영상 순서를 따릅니다. Team은 원형 교수 사진, 멤버 카드, 메일·Google Scholar·홈페이지 SVG 아이콘을 제공합니다.

Publications는 크게 표시한 한 단 목록이며 Region·Type·연도·Venue 다중 태그, 연도 범위, 건수, Default Filter, Show all, 논문별 Bib 복사를 지원합니다. Default Filter 옆에는 기본 조회 범위(국제 학회·저널·프리프린트, 전체 연도·학회)를 안내합니다. Conference는 CVPR·ICCV·ICRA·IROS·ACCV·BMVC, Journal은 TPAMI·TIV·Scientific Reports·IJCAS·IEEE ACCESS로 묶었고 나머지는 Others 버튼 하나로 필터링합니다. Book 및 CILAB/External Collaborations 필터는 제거했습니다. 키워드 검색도 같은 필터에 연결했습니다. 기본값은 International + Conference/Journal/Preprint이므로 27편 중 Workshop 1편을 제외한 26편을 표시합니다. Show all은 전체 27편을 표시합니다. BibTeX는 확인된 제목·저자·학회·연도로 생성됩니다.

## 내용 수정

| 파일 | 역할 |
| --- | --- |
| `data/site.json` | 멤버, 논문, 뉴스, 과제, 사진 앨범, 강의, 초청강연 |
| `data/lab.json` | CILAB 로고 경로, 대표 사진, 연구 방향, Scholar 주소 |
| `data/videos.json` | Home·Research 공통 YouTube 영상 목록 |
| `scripts/build.mjs` | HTML 생성, 자산 복사, 기존 주소 연결, 404 |
| `scripts/components.mjs` | 공통 머리말·꼬리말, 뉴스 번역, 영상 임베드 |
| `scripts/primary-pages.mjs` | Home, Team |
| `scripts/publications-page.mjs` | Publications 목록·태그·멤버 링크 |
| `scripts/secondary-pages.mjs` | News, Research, Gallery, Contact, Joining |
| `scripts/academic-pages.mjs` | 원본 Projects·Teaching·Invited Talks 형식 |
| `scripts/videos.mjs` | YouTube URL 처리 및 공통 플레이어 |
| `assets/theme/` | 공통 CSS 및 상호작용 코드 |
| `assets/site.css` | CILAB 로고·콘텐츠에 필요한 소규모 스타일 보정 |
| `assets/site.js` | CILAB 뉴스·과제·모집 안내의 한·영 전환 |
| `assets/brand/` | 기존 CILAB 로고 원본 |
| `assets/contact-map.js` | 미래관 위치 지도 및 마커 |
| `assets/vendor/leaflet/` | 지도 라이브러리와 원본 라이선스 |
| `assets/images/` | 최적화한 실제 연구실 사진과 논문 이미지 |

사진을 추가할 때는 `assets/images/`에 파일을 넣고 JSON에 `assets/images/...` 상대 경로를 기록하세요. Gallery의 `images` 배열에 넣은 순서대로 앨범 사진이 표시됩니다. 논문 링크는 `{ "label": "Paper", "url": "https://..." }` 형태입니다. News의 `description`에서는 `**강조**`를 지원합니다.

멤버의 `homepage`, `scholar`에 URL을 추가하면 해당 아이콘이 활성화됩니다. 공개 원본에 없는 학생 링크는 비활성 아이콘으로 표시합니다. 이름을 누르면 모든 논문 유형을 대상으로 해당 이름을 검색한 Publications로 이동합니다. 논문에 표시된 연구실 멤버 이름은 Team의 해당 카드로 이동하며 카드가 강조됩니다. 논문마다 같은 파란색의 학회·저널 배지를 표시하며, 자료 링크는 Page·Paper·Supp 등의 짧은 이름을 사용합니다. 논문 연도·유형·학회·수상 태그를 누르면 해당 조건의 목록으로 바로 이동합니다. News 항목에는 `publicationFilters`(예: `{ "venue": "cvpr", "year": 2026 }`) 또는 `paperId`를 지정하면 한·영 안내에 관련 논문 링크가 생깁니다. 논문의 `award`와 `oralNote`로 수상·구두 발표 주석을 관리합니다. 여러 표기의 이름은 `publicationQuery`에 `English Name|한글이름`처럼 지정할 수 있습니다. 현재 로고는 기존 홈페이지에서 사용한 `assets/brand/CILAB_LOGO_fit_1.png`입니다. Home 사진은 원본과 동일한 16:10 비율입니다. 뉴스 한국어 문구는 `components.mjs`의 `newsKo`에 원본 뉴스 순서대로 관리합니다.

### YouTube 영상 교체

`data/videos.json`의 해당 영상 `youtubeUrl`에 업로드한 YouTube 주소를 넣고 빌드하면 Home·Research 플레이어와 해당 논문의 Video 링크가 함께 바뀝니다. `watch?v=`, `youtu.be/`, `shorts/`, `embed/` 주소 및 11자리 영상 ID를 지원합니다. `paperId`는 `data/site.json`의 논문 ID와 연결되며, 논문과 무관한 영상은 생략할 수 있습니다.

기존 YouTube 영상 4개와 [KMU-CILAB 채널](https://www.youtube.com/channel/UCKfMj6B_uX_9tkErT2njT4A)의 RayOcc·VG3T 영상 2개를 연결했습니다. RoomNeRF는 영상 목록에서 제외했으며 논문 자체는 Publications에 유지합니다. 상단 YouTube 링크는 `data/lab.json`의 `youtubeChannel`에서 관리합니다. YouTube에서 외부 사이트의 재생을 허용한 공개 또는 일부 공개 영상의 주소를 사용하세요.

### Projects와 Teaching

Projects는 원본의 제목·상태 배지·항목별 메타데이터·오른쪽 그림 형식입니다. `program`, `program_ko`, `role`, `role_ko`, `funding_ko`를 추가할 수 있습니다. 확인되지 않은 연구 역할은 임의로 표시하지 않습니다. 진행/완료 필터와 한·영 전환을 지원합니다.

Courses는 `year`, `semester`, `code`, `title`, `title_ko`, `main`, `ta`, `url`, `description`을 지원합니다. 연도·학기별 카드, 목차, 연도 접기/펼치기는 원본 Teaching 구성을 따릅니다. 기존 `term` 형식도 지원합니다. Invited Talks는 원본의 Invited Talk 배지와 Date·Event·Speaker·Slides 형식입니다.

### 연구 소개와 연락처

`data/lab.json`의 `vision`, `visionGoal`, `research`를 수정하면 Home·Research 소개에 반영됩니다. 연구 방향은 Perceive the World / Understand the Scene / Move into Reality의 세 축입니다. Research의 세 일러스트는 내장 image_gen으로 생성한 개념 이미지이며 `assets/images/research/`에 저장했습니다. 생성 프롬프트와 각 파일 경로는 `data/research-image-prompts.json`에 기록했습니다. 개별 주제의 논문 링크 대신 페이지 마지막에서 전체 Publications로 안내합니다. 전화번호와 호실도 이 파일에서 공통 관리합니다.

Contact 지도는 Leaflet과 OpenStreetMap을 사용하며 Google Maps·Naver Map 길찾기 링크를 제공합니다. Google Maps의 미래관 위치 코드 `8Q98JX6W+2R`에서 좌표를 확인했습니다. 지도는 건물 위치를 나타내며 703호는 마커 안내에 표시됩니다.

Teaching에는 사용자가 제공한 수업 목록에서 2024–2026년의 14개 개설 내역을 옮겼습니다. 연도·학기·과목코드·한국어 과목명은 첨부 자료를 따르며, 영어 과목명은 표시용 번역입니다. 공학인증 표기는 제외했습니다. 확인된 초청강연 7건은 별도로 유지합니다. 아래 형식으로 `courses`에 추가하면 강의가 표시됩니다.

```json
{
  "title": "실제 강의명",
  "term": "실제 개설 학기",
  "description": "강의 소개",
  "url": "https://강의자료주소"
}
```

`scripts/import-source.mjs`는 최초 자료 이전을 위해 만든 도구입니다. 평소 수정 시 실행하지 마세요. 실행하면 JSON이 원본 캐시 내용으로 다시 생성됩니다. `.source-cache/`는 공개 원본을 보관한 로컬 작업용 폴더로 배포·커밋에서 제외됩니다.

## GitHub Pages 배포

1. 이 프로젝트의 소스를 배포할 GitHub 저장소의 `main` 브랜치에 올립니다.
2. 저장소의 **Settings → Pages → Build and deployment → Source**를 **GitHub Actions**로 선택합니다.
3. 포함된 `.github/workflows/pages.yml`이 검증 후 `dist/`를 배포합니다.

공식 안내: [GitHub Pages 사용자 지정 워크플로](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages).

배포 대상은 `kookmin-cilab/kookmin-cilab.github.io`입니다. 기존 저장소에서 확인한 커스텀 도메인 `cilab.kookmin.ac.kr`을 `CNAME`에 유지하며 빌드 결과에도 복사합니다. DNS는 기존 설정을 그대로 사용합니다.

사이트는 상대 경로를 사용하므로 사용자/조직 Pages와 저장소 하위 경로 Pages 모두 지원합니다. 이전 주소 `/members/`, `/photos/`, `/joining_us/`, `/allnews.html`과 새 페이지의 디렉터리 형식 주소도 연결됩니다. 알 수 없는 주소는 404 페이지로 안내합니다.

이전 범위와 확인 사항은 [MIGRATION.md](MIGRATION.md)를 참고하세요. 배포에 필요한 공통 스타일과 상호작용 코드는 `assets/theme/`에 포함됩니다.

기존 사이트 전체 이력은 `codex/backup-before-renewal-2026-10-05` 브랜치에 보관합니다. 교체 전 커밋은 `ca51a68d6a8da52d59dd18ff294f266193cbdd0f`입니다.

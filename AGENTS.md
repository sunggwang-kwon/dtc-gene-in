# DTC-GENE-IN (지니인사이트 고객용 결과지 조회 포털) 에이전트 가이드 (AGENTS.md)

이 문서는 `dtc-gene-in` (지니인사이트 수검자/고객용 온라인 유전자 검사 결과 조회 포털) 프로젝트를 유지보수하고 개발할 때 반드시 기억하고 준수해야 하는 핵심 기술 정보, 아키텍처, 디자인 가이드 및 작업 규칙을 정리한 지침서입니다.

---

## 1. 프로젝트 개요 및 기술 스택

- **프로젝트명**: dtc-gene-in (지니인사이트 고객용 유전자 검사 결과 조회 포털)
- **주요 역할**:
  - 일반 고객/수검자가 바코드 번호(검체 ID)와 이름을 입력하여 로그인한 뒤, 검사 진행 상황을 확인하고 최종 결과지(웹 리포트)를 열람하는 대고객 서비스.
- **프론트엔드 프레임워크**:
  - **Vue 2** (`vue@^2.6.14`)
  - **Vuetify 2** (`vuetify@^2.6.0`, `vue-cli-plugin-vuetify@~2.5.8`)
  - **상태 관리**: Vuex 3 (`vuex@^3.6.2`)
  - **라우터**: Vue Router 3 (`vue-router@^3.5.3`, hash mode)
  - **다국어**: Vue I18n 8 (`vue-i18n@^8.28.2`, 한국어 'kor' 고정 정책)
  - **HTTP 통신**: Axios (`axios@^1.3.4`)
  - **스타일**: SASS/SCSS (`custom.scss`, `variable.scss`, `variables.scss`)
  - **빌드**: Vue CLI 5
- **패키지 매니저**: **`pnpm` 전용** (`npm` 사용 절대 금지)
- **배포 환경**:
  - 웹 서버: Apache 2.4 (SFTP Smart Sync 배포)
  - 배포 설정: Google Cloud Secret Manager(`sgkwon-vault`)의 `DTC_GENE_SFTP_*` 자격증명을 공용 헬퍼 스크립트(`/home/sgkwon/scripts/get-gcp-secret.mjs`)를 통해 실시간 주입받아 배포 수행 (로컬 `.deploy.env` 파일 제거됨)

---

## 2. 디자인 및 테마 시스템 (Brand Identity)

`dtc-gene-in-admin`과 일관된 지니인사이트 공식 디자인 아이덴티티를 적용합니다.

- **브랜드 로고 및 타이틀**:
  - 상단 앱바 타이틀: 영문 브랜드 타이틀 **`GeneInsight`** (딥 블랙 `#222222`, `letter-spacing: 0.5px`, `user-select: none`, 상단 앱바 로고 미사용)
  - 메인 로고: `@/assets/geni-in-logo.svg` (로그인 카드 중앙)
  - 파비콘: `public/favicon.svg`, `@/assets/symbol-logo.svg`
- **상단 앱바 (Header)**:
  - 배경색: `#F0F5FE` (소프트 파스텔 블루, 하단 테두리 없음)
  - 로그아웃 버튼: `.header-logout-btn` 다크 스타일 (`#333333` 배경/보더, 호버 시 `#222222`)
- **컬러 팔레트**:
  - Primary: `#0C67DF` (지니인사이트 메인 블루)
  - Accent: `#21b4e9` (시안 포인트)
  - Success: `#00BFA5`, Error: `#FF5252`, Warning: `#FB8C00`, Info: `#0091EA`
  - Background: 부드러운 그라데이션 (`linear-gradient(rgb(255, 255, 255), rgb(245, 249, 250))`)
- **타이포그래피**:
  - Pretendard 폰트 전역 적용 (`CDN` 연동 및 `variable.scss` 폴백 설정)
- **컴포넌트 스타일링 (dtc-gene-in-admin 통일 규격)**:
  - 전역 Dense 규격: 버튼 높이 28px/폰트 13px/굵기 700, 텍스트 인풋/셀렉트 최소 높이 32px/폰트 13px
  - 카드: Flat 카드 (`box-shadow: none !important`), 보더 반경 8px, 액션 구분선 및 세부 슬롯 스타일링
  - 데이터 테이블: 헤더 배경 `#f1f3f4`, 행 호버 `#f5f7fa`, 선택 행 `#eef4fc`, 유틸리티 셀 클래스 제공
  - 기타 UI: 탭 텍스트 강조, 아웃라인 칩, 다이얼로그 라운드 12px, flat 페이지네이션, `.status` 인디케이터 유틸리티
  - 스피너: 지니인사이트 브랜드 블루 기반의 모던 원형 인디케이터

---

## 3. 작업 절대 원칙 (Strict Rules)

### 3.1. 배포 및 원격 접속 제한
1. **Deploy 절대 금지 원칙**: 사용자의 직접적이고 명시적인 지시(`"배포해"`, `"배포 진행"` 등)가 있기 전까지 배포 스크립트 실행(`bash deploy.sh`, `pnpm run deploy`)은 절대 금지합니다.
2. **원격 서버 소스코드 참조 원칙**:
   - **서버 최신 코드 동기화**: 백엔드 소스코드 확인 및 수정사항 여부 점검 시 `/home/sgkwon/git/.server/sync-dtc-gene.sh`를 1회 실행하여 원격 서버의 최신 코드를 즉시 로컬로 동기화한 후 조회합니다.


### 3.2. 패키지 매니저 규칙
- 반드시 **`pnpm`**만 사용합니다.
- `npm` 명령어 실행은 일체 금지하며, `package-lock.json` 파일 생성 시 즉시 삭제합니다.

### 3.3. 터미널 명령어 실행 규칙
1. **단일 명령어 규칙**: `&&`, `||`, `2>/dev/null` 같은 쉘 연산자를 쓰지 말고, 순수 단일 명령어로만 실행합니다.
2. **find 명령어 제한**: 보안 제한으로 인해 `find` 명령어에 `-exec` 옵션을 사용하지 않습니다.

### 3.4. 에러 핸들링 및 코드 수정 전 승인 규칙 (5단계 준수)
문제 발생 시 코드를 즉시 임의 수정하지 않고, **문제 보고 ➔ 증거 제시 ➔ 원인 분석 ➔ 수정안 제안 ➔ 사용자 승인 대기** 단계를 거친 후 명시적 승인이 있을 때만 수정합니다.

### 3.5. 사후 검증 필수
코드 수정 후 `pnpm run lint` 및 `pnpm run build`를 반드시 실행하여 빌드 및 컴파일 무결성을 확인합니다.

### 3.6. AI 에이전트 응답 및 커뮤니케이션 규칙 (Strict Communication Rules) - 절대 준수
> [!CAUTION]
> **이모티콘, 이모지, 스티커 사용 절대 금지 (STRICTLY PROHIBITED)**
> - AI 에이전트는 사용자와의 모든 답변, 작업 보고, 설명, 요약 등에서 **이모지(예: 각종 유니코드 이모지 심볼), 텍스트 이모티콘(^^, :), ㅠㅠ 등), 스티커성 그래픽 기호를 일절 사용하지 않습니다.**
> - 장식적인 이모티콘을 완전히 배제하고, 오직 **명확하고 건조하며 전문적인 텍스트와 표준 마크다운(글머리 기호, 볼드, 표, 코드 블록 등)**으로만 간결하게 소통합니다.
> - 이 규칙은 어떠한 상황에서도 예외 없이 강력하게 준수되어야 합니다.

### 3.7. 배포 완료 후 가이드 문서(AGENTS.md) 최신화 원칙
- 배포가 성공적으로 완료되면, 이번 배포에서 변경되거나 추가된 비즈니스 로직, 라우트, API 연동, UI 구조 등을 분석하여 해당 프로젝트 루트의 **`AGENTS.md`** 가이드 문서를 최신 상태로 동기화합니다.
- **문서 작성 원칙**:
  - 단순 배포 일자, 커밋 메시지, 수정 이력 등의 **히스토리성/로그성 내용은 일체 작성하지 않습니다.**
  - 항상 최신 시스템 스펙을 기술하는 **'살아있는 명세서(Living Specification)'**가 되도록 기존 설명의 흐름을 자연스럽게 갱신합니다.
  - **민감정보 포함 절대 금지**: `AGENTS.md` 파일에 서버 호스트 아이피, 포트, 아이디, 비밀번호 등 민감정보를 절대 포함하지 않습니다.

### 3.8. 설계 문서 관리 규칙 (Architecture Docs)
- **설계/계획 문서 저장 경로**: `/home/sgkwon/git/architecture/dtc-gene/`
- **작성 대상**: 기능 구현 계획, 아키텍처 설계, API 스펙 정리, 기술 스택 결정 등 구조적 문서
- **형식**: Markdown (`.md`)
- **명명 규칙**: 내용을 명확히 나타내는 파일명 사용 (예: `plan.md`, `spec.md`)
- **주의**: 설계 문서는 에이전트의 임시 artifact 디렉토리가 아닌 반드시 위 경로에 저장합니다.
- 파일이나 디렉터리 경로를 언급할 때는 클릭 가능한 파일 링크 형태(`[파일명](file:///전체경로)`)와 독립된 코드 블록(```path 또는 ```text) 안의 전체 경로를 각각 한 줄씩 함께 작성합니다.

### 3.9. 원격 대화형 웹 테스트 규칙 (Remote Interactive Visual Testing)
사용자가 **"웹으로 붙어서 테스트 해줘"**, **"웹 화면 보면서 테스트하자"**, **"noVNC로 테스트하자"**, **"playwright 테스트"** 등 원격 브라우저 화면을 직접 시청하며 검증을 요청할 때 적용하는 표준 런북입니다:
- **가상 디스플레이**: `DISPLAY=:10` (해상도 `1920x1080`)
- **서비스 포트**:
  - 네이티브 VNC 포트: `5900` (`x11vnc`, 순수 TCP RFB 프로토콜)
  - noVNC 웹소켓 스트리밍 포트: `6080` (`websockify`, 브라우저용 `ws://` 프록시)
- **관리 스크립트**:
  - 구동: `/home/sgkwon/scripts/start-vnc.sh`
  - 종료: `/home/sgkwon/scripts/stop-vnc.sh`
  - 창 위치/크기 자동 보정: `/home/sgkwon/scripts/fix-vnc-window.py` (상단 잘림 보정 및 `(0, 0)` 정렬)
- **접속 환경별 안내**:
  - **PC 환경**: `http://127.0.0.1:6080/vnc.html` (SSH 터널링 `L6080 127.0.0.1:6080`)
  - **모바일 환경 (Android/iOS)**: 웹소켓 끊김 방지를 위해 Termius `5900` 포트 포워딩(`127.0.0.1:5900`) 후 **RealVNC Viewer** 앱으로 `127.0.0.1:5900` 직접 연결

### 3.10. 시크릿 및 자격증명 관리 규칙 (Secret Management Rules)
- **GCP Secret Manager 1순위 연동 원칙**:
  - 금융 API 자격증명, 원격 SFTP 배포 비밀번호, SSH 인증 키 등 민감정보는 독립된 전용 영구 금고 프로젝트인 Google Cloud Secret Manager(`sgkwon-vault`)에 등록하여 중앙 집중식으로 관리합니다.
  - 평문 비밀번호가 포함된 `.env` 파일은 Git에 커밋하지 않으며, 소스코드 및 배포 스크립트는 Secret Manager에서 최신 시크릿을 인메모리로 실시간 주입받아 동작합니다.
- **공용 시크릿 조회 헬퍼 스크립트**:
  - 쉘 스크립트 및 배포 도구에서는 `/home/sgkwon/scripts/get-gcp-secret.mjs <SECRET_NAME>` 헬퍼를 활용하여 메모리에만 시크릿을 호출합니다.
  - 소스코드나 설정 파일에 실제 비밀번호, 계정 식별자, 인증 키를 평문으로 하드코딩하거나 Git에 커밋하지 않습니다.

### 3.11. AI 모델 사용량(쿼터) 확인 규칙 (Model Usage Check Rules)
- 사용자가 **"사용량"**, **"쿼터"**, **"남은 한도"**, **"usage"** 등을 문의할 때:
  - 전용 쿼터 확인 스크립트(`/home/sgkwon/scripts/agy-usage.sh`)를 1회 실행하여 실시간 쿼터 잔여율 및 충전 시간을 조회합니다.
  - 모바일 등 좁은 화면에서도 줄바꿈 왜곡 없이 가독성이 유지되도록 스크립트의 컴팩트 레이아웃 출력 결과 그대로 간결하고 명확하게 즉시 보고합니다.
  - 대화록 토큰(Input/Output) 단순 집계가 아닌 실제 모델 그룹별 잔여 한도(`agy -p "/usage"`)를 기준으로 안내합니다.

---

## 4. 디렉터리 구조 및 주요 컴포넌트

```
dtc-gene-in/
├── client/
│   ├── public/
│   │   ├── favicon.svg          # 지니인사이트 심볼 파비콘
│   │   └── index.html           # Pretendard 웹폰트 및 뷰포트 메타
│   ├── src/
│   │   ├── assets/
│   │   │   ├── geni-in-logo.svg # 지니인사이트 풀 로고
│   │   │   └── symbol-logo.svg  # 지니인사이트 심볼 마크
│   │   ├── components/
│   │   │   ├── Login.vue        # 고객 로그인 (바코드 ID, 성명)
│   │   │   └── Progress.vue     # 접수일자 선택, 상태 타임라인, 결과지 뷰어 오픈
│   │   ├── i18n/
│   │   │   └── index.js         # 한국어(kor) / 영어(eng) 다국어 메시지
│   │   ├── plugins/
│   │   │   └── vuetify.js       # Vuetify 팔레트 설정 (Primary #0C67DF)
│   │   ├── router/
│   │   │   └── index.js         # Vue Router 라우팅 (Login, Progress, 404 리다이렉트)
│   │   ├── styles/
│   │   │   ├── custom.scss      # 지니인사이트 테마 스타일 및 Vuetify 컴포넌트 커스텀
│   │   │   ├── variable.scss    # SASS 변수 토큰
│   │   │   └── variables.scss   # Vuetify 변수 연동 파일
│   │   ├── store.js             # Vuex 상태 관리 (언어 코드, 로딩 스피너)
│   │   ├── App.vue              # 레이아웃, 상단 앱바, 토큰 자동 갱신 및 타임아웃
│   │   └── main.js              # 엔트리 포인트
│   ├── .deploy.env.default      # 원격 배포 접속 템플릿 (민감정보 제외)
│   ├── deploy.sh                # lftp 기반 SFTP Smart Sync 배포 스크립트
│   ├── vue.config.js            # Webpack 설정 및 /lookup/proxy 개발 프록시
│   └── package.json             # 프로젝트 메타 및 의존성
└── AGENTS.md                    # 본 프로젝트 가이드 문서
```

---

## 5. 비즈니스 로직 및 결과지 연동 흐름

### 5.1. 인증 및 세션 관리
- **로그인 (`Login.vue`)**:
  - 입력값: 바코드 번호(`patient_id`) + 고객 성명(`patient_name`)
  - API: `/server/login.php` (POST)
  - 성공 시 세션 저장(`jwt`, `Patient_id`, `Name`, `Auth`) 후 `/progress` 라우트로 이동.
- **세션 유지 및 자동 로그아웃 (`App.vue`)**:
  - 20분 주기로 토큰 재발급 API (`/server/common/reissuance_token.php`) 호출.
  - 60분 동안 사용자 인터랙션(클릭) 부재 시 자동 로그아웃 처리.

### 5.2. 접수일자 선택 및 진행상황 (`Progress.vue`)
- API: `/server/result/get_request_date_combo.php`로 고객의 검사 접수일자 목록을 조회.
- 접수일자 선택 시 `/server/result_preview.php`를 통해 단계별 진행상태(접수, 검사진행, 완료 등) 확인.

### 5.3. 결과지 뷰어 열람
- 검사 결과 완료 시 결과지 열람 버튼이 활성화됩니다.
- 템플릿 버전(`template_version`)에 따라 분기:
  - 템플릿 코드 `T003` 또는 버전 `v4`: `/lookup/v4/?data=...`
  - 템플릿 코드 `T004` 이상 또는 최신 버전: `/lookup/v5/?data=...`
  - 영문 검사지(`lang_cd === 'eng'`): `/lookup/eng/v1/?data=...`
- 브라우저 새 창/탭으로 결과지 뷰어를 안전하게 팝업 오픈합니다.

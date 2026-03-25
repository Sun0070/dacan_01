import type { HackathonDetail } from '../types';

export const INITIAL_HACKATHON_DETAILS: Record<string, HackathonDetail> = {

  // ── ENDED ──────────────────────────────────────────────────────────────

  'cv-detection-2025-12': {
    slug: 'cv-detection-2025-12',
    title: '컴퓨터 비전 챌린지 : 객체 탐지 정확도 최적화',
    sections: {
      overview: {
        summary:
          '실세계 드론 촬영 이미지에서 다중 객체를 정확하게 탐지하는 모델을 개발합니다. 다양한 조도·날씨 조건의 이미지 5만 장이 제공되며, mAP 기준으로 최고 성능 모델을 선발합니다.',
        teamPolicy: { allowSolo: true, maxTeamSize: 4 },
      },
      info: {
        notice: [
          '사전 학습된 가중치(pretrained weights) 사용은 허용되나, 학습 데이터는 제공 데이터셋만 사용 가능합니다.',
          '추론 시간이 이미지 1장당 100ms를 초과하는 제출물은 실격 처리됩니다.',
          '외부 데이터 증강 라이브러리 사용은 허용됩니다.',
          '제출 마감 후 코드 검토가 진행되며, 재현 불가 시 수상이 취소될 수 있습니다.',
        ],
        links: {
          rules: 'https://example.com/rules/cv2025',
          faq: 'https://example.com/faq/cv2025',
        },
      },
      eval: {
        metricName: 'mAP@0.5:0.95',
        description: 'COCO 평가 기준 mAP(mean Average Precision)을 IoU 임계값 0.5~0.95 범위에서 측정합니다. 높을수록 좋습니다.',
        limits: {
          maxRuntimeSec: 600,
          maxSubmissionsPerDay: 3,
        },
      },
      schedule: {
        timezone: 'Asia/Seoul',
        milestones: [
          { name: '대회 시작 및 데이터 공개', at: '2025-12-01T10:00:00+09:00' },
          { name: '팀 구성 마감', at: '2025-12-10T23:59:00+09:00' },
          { name: '리더보드 제출 마감', at: '2025-12-20T10:00:00+09:00' },
          { name: '코드 제출 마감', at: '2025-12-21T10:00:00+09:00' },
          { name: '대회 종료 및 결과 발표', at: '2025-12-22T10:00:00+09:00' },
        ],
      },
      prize: {
        items: [
          { place: '1st', amountKRW: 2000000 },
          { place: '2nd', amountKRW: 1000000 },
          { place: '3rd', amountKRW: 500000 },
        ],
      },
      teams: {
        campEnabled: true,
        listUrl: '/camp?hackathon=cv-detection-2025-12',
      },
      submit: {
        allowedArtifactTypes: ['zip'],
        submissionUrl: '/hackathons/cv-detection-2025-12#submit',
        guide: [
          'inference.py와 requirements.txt를 포함한 zip 파일을 업로드합니다.',
          '제출 전 로컬에서 docker 환경 재현을 확인하세요.',
          '제출 횟수는 하루 3회로 제한됩니다.',
        ],
      },
      leaderboard: {
        publicLeaderboardUrl: '/hackathons/cv-detection-2025-12#leaderboard',
        note: 'Public 리더보드는 검증 세트 30% 기준이며, 최종 순위는 Private 세트 70%로 결정됩니다.',
      },
    },
  },

  'nlp-sentiment-2026-01': {
    slug: 'nlp-sentiment-2026-01',
    title: 'NLP 감성 분석 해커톤 : 리뷰 데이터로 감정 읽기',
    sections: {
      overview: {
        summary:
          '쇼핑몰·앱스토어·음식 배달 플랫폼의 한국어 리뷰 20만 건을 대상으로 긍정/부정/중립 3클래스 감성 분류 모델을 개발합니다. 도메인 간 일반화 성능이 핵심 평가 포인트입니다.',
        teamPolicy: { allowSolo: true, maxTeamSize: 5 },
      },
      info: {
        notice: [
          'GPT, Claude 등 외부 LLM API를 이용한 데이터 생성은 금지됩니다.',
          '공개 사전학습 모델(KLUE-BERT, KoELECTRA 등) 파인튜닝은 허용됩니다.',
          '앙상블은 최대 5개 모델까지 허용됩니다.',
          '훈련/추론 코드를 포함한 재현 패키지를 최종 제출 시 함께 업로드해야 합니다.',
        ],
        links: {
          rules: 'https://example.com/rules/nlp2026',
          faq: 'https://example.com/faq/nlp2026',
        },
      },
      eval: {
        metricName: 'Macro F1-Score',
        description: '클래스 불균형을 고려하여 각 클래스별 F1-Score를 계산한 뒤 평균(Macro Average)을 최종 점수로 사용합니다.',
        limits: {
          maxRuntimeSec: 900,
          maxSubmissionsPerDay: 5,
        },
      },
      schedule: {
        timezone: 'Asia/Seoul',
        milestones: [
          { name: '대회 오픈 및 데이터셋 공개', at: '2026-01-06T10:00:00+09:00' },
          { name: '중간 토론 세션 (온라인)', at: '2026-01-15T14:00:00+09:00' },
          { name: '제출 마감', at: '2026-01-28T10:00:00+09:00' },
          { name: '코드 검증 기간', at: '2026-01-28T10:00:00+09:00' },
          { name: '최종 결과 발표', at: '2026-01-30T10:00:00+09:00' },
        ],
      },
      prize: {
        items: [
          { place: '1st', amountKRW: 1500000 },
          { place: '2nd', amountKRW: 700000 },
          { place: '3rd', amountKRW: 300000 },
        ],
      },
      teams: {
        campEnabled: true,
        listUrl: '/camp?hackathon=nlp-sentiment-2026-01',
      },
      submit: {
        allowedArtifactTypes: ['zip'],
        submissionUrl: '/hackathons/nlp-sentiment-2026-01#submit',
        guide: [
          'predictions.csv (id, label 컬럼) 파일을 업로드합니다.',
          '최종 제출 시에는 코드 재현 패키지(zip)도 함께 업로드합니다.',
          '일일 제출 횟수는 5회로 제한됩니다.',
        ],
      },
      leaderboard: {
        publicLeaderboardUrl: '/hackathons/nlp-sentiment-2026-01#leaderboard',
        note: '리더보드는 Public 테스트셋 기준이며, 최종 순위는 Private 테스트셋으로 결정됩니다.',
      },
    },
  },

  'aimers-8-model-lite': {
    slug: 'aimers-8-model-lite',
    title: 'Aimers 8기 : 모델 경량화 온라인 해커톤',
    sections: {
      overview: {
        summary:
          '제한된 평가 환경(CPU only, 메모리 4GB)에서 LLM 모델의 성능과 추론 속도를 함께 최적화합니다. Quantization, Pruning, Knowledge Distillation 등 다양한 경량화 기법을 자유롭게 활용하세요.',
        teamPolicy: { allowSolo: true, maxTeamSize: 5 },
      },
      info: {
        notice: [
          '제출 마감 이후 추가 제출은 불가합니다.',
          '평가 환경은 고정(CPU, 4GB RAM)이며, 제출물은 별도 설치 없이 실행 가능해야 합니다.',
          'vLLM, llama.cpp 등 추론 최적화 프레임워크 사용은 허용됩니다.',
          '베이스라인 모델 성능의 80% 이상을 유지해야 합니다.',
        ],
        links: {
          rules: 'https://example.com/public/rules/aimers8',
          faq: 'https://example.com/public/faq/aimers8',
        },
      },
      eval: {
        metricName: 'FinalScore',
        description: '정확도(Accuracy) 70% + 추론속도(Throughput) 30%를 가중 합산한 최종 점수입니다. 두 지표 모두 베이스라인 대비 상대값으로 계산됩니다.',
        limits: {
          maxRuntimeSec: 1200,
          maxSubmissionsPerDay: 5,
        },
      },
      schedule: {
        timezone: 'Asia/Seoul',
        milestones: [
          { name: '대회 시작 및 베이스라인 코드 공개', at: '2026-02-10T10:00:00+09:00' },
          { name: '질의응답 마감', at: '2026-02-20T23:59:00+09:00' },
          { name: '리더보드 제출 마감', at: '2026-02-25T10:00:00+09:00' },
          { name: '대회 종료', at: '2026-02-26T10:00:00+09:00' },
        ],
      },
      prize: {
        items: [
          { place: '1st', amountKRW: 3000000 },
          { place: '2nd', amountKRW: 1500000 },
          { place: '3rd', amountKRW: 800000 },
        ],
      },
      teams: {
        campEnabled: true,
        listUrl: '/camp?hackathon=aimers-8-model-lite',
      },
      submit: {
        allowedArtifactTypes: ['zip'],
        submissionUrl: '/hackathons/aimers-8-model-lite#submit',
        guide: [
          '제출물은 규정에 맞는 단일 zip 파일로 업로드합니다.',
          "업로드 후 '제출' 버튼을 눌러야 리더보드에 반영됩니다.",
          'run.sh 포함 여부와 실행 가능 여부를 반드시 사전 확인하세요.',
        ],
      },
      leaderboard: {
        publicLeaderboardUrl: '/hackathons/aimers-8-model-lite#leaderboard',
        note: 'Public 리더보드는 제출 마감 시점 기준으로 고정될 수 있습니다(규정 참고).',
      },
    },
  },

  // ── ONGOING ────────────────────────────────────────────────────────────

  'monthly-vibe-coding-2026-02': {
    slug: 'monthly-vibe-coding-2026-02',
    title: '월간 해커톤 : 바이브 코딩 개선 AI 아이디어 공모전 (2026.03)',
    sections: {
      overview: {
        summary:
          '바이브 코딩(AI 보조 코딩) 경험을 개선할 수 있는 아이디어를 기획하고, 간단한 프로토타입 또는 시연 자료와 함께 제출합니다. 기술 구현보다 아이디어의 실용성·참신성이 핵심 평가 기준입니다.',
        teamPolicy: { allowSolo: true, maxTeamSize: 3 },
      },
      info: {
        notice: [
          '프로토타입은 선택 사항이며, 아이디어 기획서만으로도 참가 가능합니다.',
          '타 대회·공모전에 제출한 작품과 중복 제출은 금지됩니다.',
          '생성형 AI 도구를 활용한 기획서 작성은 허용되나, 이를 명시해야 합니다.',
          '제출 후 아이디어 수정은 웹링크 제출 마감 전까지 가능합니다.',
        ],
        links: {
          rules: 'https://example.com/public/rules/vibe202602',
          faq: 'https://example.com/public/faq/vibe202602',
        },
      },
      eval: {
        metricName: 'IdeaScore',
        description: '참가자 투표와 심사위원 평가를 가중 합산합니다. 심사 기준: 참신성(30%), 실용성(30%), 완성도(20%), 발표력(20%)',
        scoreSource: 'vote',
        scoreDisplay: {
          label: '투표 점수',
          breakdown: [
            { key: 'participant', label: '참가자 투표', weightPercent: 30 },
            { key: 'judge', label: '심사위원 평가', weightPercent: 70 },
          ],
        },
      },
      schedule: {
        timezone: 'Asia/Seoul',
        milestones: [
          { name: '접수 시작', at: '2026-03-10T10:00:00+09:00' },
          { name: '기획서 제출 마감', at: '2026-04-10T10:00:00+09:00' },
          { name: '최종 발표자료(PDF) 제출 마감', at: '2026-04-12T23:59:00+09:00' },
          { name: '참가자 투표 기간', at: '2026-04-13T10:00:00+09:00' },
          { name: '투표 마감', at: '2026-04-14T23:59:00+09:00' },
          { name: '결과 발표', at: '2026-04-15T10:00:00+09:00' },
        ],
      },
      prize: {
        items: [
          { place: '1st', amountKRW: 500000 },
          { place: '2nd', amountKRW: 300000 },
          { place: '3rd', amountKRW: 100000 },
        ],
      },
      teams: {
        campEnabled: true,
        listUrl: '/camp?hackathon=monthly-vibe-coding-2026-02',
      },
      submit: {
        allowedArtifactTypes: ['text', 'url', 'pdf'],
        submissionUrl: '/hackathons/monthly-vibe-coding-2026-02#submit',
        guide: [
          '기획서를 텍스트 또는 Google Docs URL로 1차 제출합니다.',
          '최종 발표자료를 PDF로 변환하여 2차 제출합니다.',
          '프로토타입 데모 URL이 있다면 함께 제출하면 가산점이 있습니다.',
        ],
        submissionItems: [
          { key: 'plan', title: '아이디어 기획서 (1차)', format: 'text_or_url' },
          { key: 'web', title: '프로토타입 데모 URL (선택)', format: 'url' },
          { key: 'pdf', title: '최종 발표자료 PDF (2차)', format: 'pdf_url' },
        ],
      },
      leaderboard: {
        publicLeaderboardUrl: '/hackathons/monthly-vibe-coding-2026-02#leaderboard',
        note: '투표 결과는 마감 이후 집계되어 공개됩니다.',
      },
    },
  },

  'time-series-forecast-2026-03': {
    slug: 'time-series-forecast-2026-03',
    title: '시계열 예측 챌린지 : 전력 수요 패턴 예측 대회',
    sections: {
      overview: {
        summary:
          '한국 전역 500개 지역의 2020–2025년 시간별 전력 수요 데이터를 기반으로 향후 7일간의 수요를 예측합니다. 계절성, 이벤트 효과, 기상 데이터를 복합적으로 활용하는 전략이 요구됩니다.',
        teamPolicy: { allowSolo: true, maxTeamSize: 5 },
      },
      info: {
        notice: [
          '기상 데이터(기온, 습도, 강수량)는 제공 데이터셋 외 외부 소스도 허용됩니다.',
          '미래 기상 예측값 사용 시 출처를 반드시 명시해야 합니다.',
          '앙상블은 제한이 없으나, 최종 추론 시간은 10분 이내여야 합니다.',
          '데이터 누수(data leakage) 적발 시 즉시 실격 처리됩니다.',
        ],
        links: {
          rules: 'https://example.com/rules/ts2026',
          faq: 'https://example.com/faq/ts2026',
        },
      },
      eval: {
        metricName: 'RMSE',
        description: 'Root Mean Squared Error(RMSE)를 사용하며, 낮을수록 좋습니다. 예측값과 실제값의 단위는 MW(메가와트)입니다.',
        limits: {
          maxRuntimeSec: 1800,
          maxSubmissionsPerDay: 2,
        },
      },
      schedule: {
        timezone: 'Asia/Seoul',
        milestones: [
          { name: '대회 오픈 및 데이터 공개', at: '2026-03-15T10:00:00+09:00' },
          { name: '베이스라인 공개', at: '2026-03-20T10:00:00+09:00' },
          { name: '중간 리더보드 스냅샷', at: '2026-04-10T10:00:00+09:00' },
          { name: '최종 제출 마감', at: '2026-04-20T10:00:00+09:00' },
          { name: '코드 제출 및 검증', at: '2026-04-22T10:00:00+09:00' },
          { name: '결과 발표', at: '2026-04-25T10:00:00+09:00' },
        ],
      },
      prize: {
        items: [
          { place: '1st', amountKRW: 3000000 },
          { place: '2nd', amountKRW: 1500000 },
          { place: '3rd', amountKRW: 500000 },
        ],
      },
      teams: {
        campEnabled: true,
        listUrl: '/camp?hackathon=time-series-forecast-2026-03',
      },
      submit: {
        allowedArtifactTypes: ['zip'],
        submissionUrl: '/hackathons/time-series-forecast-2026-03#submit',
        guide: [
          'submission.csv (datetime, region_id, predicted_demand 컬럼) 파일을 업로드합니다.',
          '최종 제출 시 코드와 환경 설정 파일(requirements.txt, Dockerfile)을 포함한 zip도 제출합니다.',
          '일일 제출 횟수는 2회로 제한됩니다.',
        ],
      },
      leaderboard: {
        publicLeaderboardUrl: '/hackathons/time-series-forecast-2026-03#leaderboard',
        note: 'RMSE가 낮을수록 상위 순위입니다. Public 리더보드는 테스트 기간의 50% 기준입니다.',
      },
    },
  },

  // ── UPCOMING ───────────────────────────────────────────────────────────

  'daker-handover-2026-03': {
    slug: 'daker-handover-2026-03',
    title: '긴급 인수인계 해커톤: 명세서만 보고 구현하라',
    sections: {
      overview: {
        summary:
          '기능 명세서만 남기고 사라진 개발자의 문서를 기반으로 바이브 코딩을 통해 웹서비스를 구현·배포하는 해커톤입니다. AI 코딩 도구를 적극 활용하여 빠르게 동작하는 서비스를 만드는 것이 핵심입니다.',
        teamPolicy: { allowSolo: true, maxTeamSize: 5 },
      },
      info: {
        notice: [
          '예시 자료 외 데이터는 제공되지 않습니다.',
          '더미 데이터/로컬 저장소(localStorage 등)를 활용해 구현하세요.',
          '배포 URL은 외부에서 접속 가능해야하며 심사 기간동안 접근 가능해야합니다.',
          '외부 API/외부 DB를 쓰는 경우에도 심사자가 별도 키 없이 확인 가능해야 합니다.',
          'Claude, Cursor, GitHub Copilot 등 AI 도구 사용을 적극 권장합니다.',
        ],
        links: {
          rules: 'https://example.com/public/rules/daker-handover-202603',
          faq: 'https://example.com/public/faq/daker-handover-202603',
        },
      },
      eval: {
        metricName: 'FinalScore',
        description: '참가팀/심사위원 투표 점수를 가중치로 합산한 최종 점수. 평가 항목: 기본구현(30), 확장아이디어(30), 완성도(25), 문서/설명(15)',
        scoreSource: 'vote',
        scoreDisplay: {
          label: '투표 점수',
          breakdown: [
            { key: 'participant', label: '참가자 투표', weightPercent: 30 },
            { key: 'judge', label: '심사위원 평가', weightPercent: 70 },
          ],
        },
      },
      schedule: {
        timezone: 'Asia/Seoul',
        milestones: [
          { name: '접수/기획서 제출 시작', at: '2026-03-04T10:00:00+09:00' },
          { name: '기획서 제출 마감', at: '2026-03-30T10:00:00+09:00' },
          { name: '최종 웹링크 제출 마감', at: '2026-04-06T10:00:00+09:00' },
          { name: '최종 솔루션 PDF 제출 마감', at: '2026-04-13T10:00:00+09:00' },
          { name: '1차 투표평가 시작', at: '2026-04-13T12:00:00+09:00' },
          { name: '1차 투표평가 마감', at: '2026-04-17T10:00:00+09:00' },
          { name: '2차 내부평가 종료', at: '2026-04-24T23:59:00+09:00' },
          { name: '최종 결과 발표', at: '2026-04-27T10:00:00+09:00' },
        ],
      },
      teams: {
        campEnabled: true,
        listUrl: '/camp?hackathon=daker-handover-2026-03',
      },
      submit: {
        allowedArtifactTypes: ['text', 'url', 'pdf'],
        submissionUrl: '/hackathons/daker-handover-2026-03#submit',
        guide: [
          '기획서 → 웹링크 → PDF를 단계별로 제출합니다.',
          '배포 URL은 외부에서 접속 가능해야 하며 심사 기간 동안 접근 가능해야 합니다.',
          'PPT는 PDF로 변환하여 제출합니다.',
        ],
        submissionItems: [
          { key: 'plan', title: '기획서 (1차 제출)', format: 'text_or_url' },
          { key: 'web', title: '최종 웹링크', format: 'url' },
          { key: 'pdf', title: '솔루션 설명 PDF', format: 'pdf_url' },
        ],
      },
      leaderboard: {
        publicLeaderboardUrl: '/hackathons/daker-handover-2026-03#leaderboard',
        note: '점수는 투표 결과를 기반으로 표시됩니다. 투표 마감 이후 공개됩니다.',
      },
    },
  },

  'recsys-challenge-2026-04': {
    slug: 'recsys-challenge-2026-04',
    title: '추천 시스템 챌린지 : 클릭률 예측 & 개인화 랭킹',
    sections: {
      overview: {
        summary:
          '대형 이커머스 플랫폼의 사용자 행동 로그(클릭, 구매, 평점)를 기반으로 CTR 예측 모델 및 개인화 아이템 랭킹 시스템을 개발합니다. 실제 서비스 수준의 대용량 데이터(사용자 1천만, 아이템 100만)가 제공됩니다.',
        teamPolicy: { allowSolo: false, maxTeamSize: 4 },
      },
      info: {
        notice: [
          '팀 참가만 허용됩니다(2인 이상 필수).',
          '사용자 개인정보 보호를 위해 데이터는 익명화 처리되었습니다.',
          '사전 접수 후 데이터 다운로드 링크가 이메일로 발송됩니다.',
          '외부 공개 추천 데이터셋 사용은 금지됩니다.',
        ],
        links: {
          rules: 'https://example.com/rules/recsys2026',
          faq: 'https://example.com/faq/recsys2026',
        },
      },
      eval: {
        metricName: 'NDCG@10',
        description: 'Normalized Discounted Cumulative Gain@10을 사용합니다. 상위 10개 추천 아이템의 순서와 관련성을 종합 평가합니다.',
        limits: {
          maxRuntimeSec: 3600,
          maxSubmissionsPerDay: 1,
        },
      },
      schedule: {
        timezone: 'Asia/Seoul',
        milestones: [
          { name: '사전 접수 마감', at: '2026-04-20T23:59:00+09:00' },
          { name: '데이터 공개 및 대회 시작', at: '2026-04-25T10:00:00+09:00' },
          { name: '중간 리더보드 스냅샷', at: '2026-05-05T10:00:00+09:00' },
          { name: '제출 마감', at: '2026-05-10T10:00:00+09:00' },
          { name: '코드 검증', at: '2026-05-12T10:00:00+09:00' },
          { name: '결과 발표', at: '2026-05-15T10:00:00+09:00' },
        ],
      },
      prize: {
        items: [
          { place: '1st', amountKRW: 5000000 },
          { place: '2nd', amountKRW: 2000000 },
          { place: '3rd', amountKRW: 1000000 },
        ],
      },
      teams: {
        campEnabled: true,
        listUrl: '/camp?hackathon=recsys-challenge-2026-04',
      },
      submit: {
        allowedArtifactTypes: ['zip'],
        submissionUrl: '/hackathons/recsys-challenge-2026-04#submit',
        guide: [
          'recommendations.csv (user_id, item_id_list 컬럼, 탭 구분) 파일을 업로드합니다.',
          '최종 제출 시 모델 학습 코드를 포함한 zip 파일을 별도 업로드합니다.',
          '일일 제출 횟수는 1회로 제한됩니다.',
        ],
      },
      leaderboard: {
        publicLeaderboardUrl: '/hackathons/recsys-challenge-2026-04#leaderboard',
        note: '리더보드는 대회 시작 후 공개됩니다. 현재 사전 접수 기간입니다.',
      },
    },
  },

  'multimodal-ai-2026-05': {
    slug: 'multimodal-ai-2026-05',
    title: '멀티모달 AI 해커톤 : 이미지 + 텍스트 융합 챌린지',
    sections: {
      overview: {
        summary:
          '이미지와 텍스트를 동시에 이해하는 멀티모달 AI 모델을 활용하여 실생활 문제를 해결하는 애플리케이션을 개발합니다. CLIP, LLaVA, Gemini Vision 등 최신 VLM을 활용한 창의적인 솔루션을 기대합니다.',
        teamPolicy: { allowSolo: true, maxTeamSize: 5 },
      },
      info: {
        notice: [
          '오픈소스 VLM 모델을 자유롭게 파인튜닝하거나, API 형태로 활용할 수 있습니다.',
          '상용 API(OpenAI, Google, Anthropic 등) 사용 시 비용은 참가팀 부담입니다.',
          '심사자가 키 없이 확인 가능한 방식으로 데모를 구성해야 합니다(환경변수, mock 등).',
          '저작권이 있는 이미지 데이터를 학습에 사용하는 것은 금지됩니다.',
        ],
        links: {
          rules: 'https://example.com/rules/multimodal2026',
          faq: 'https://example.com/faq/multimodal2026',
        },
      },
      eval: {
        metricName: 'TotalScore',
        description: '기술 완성도(40%) + 아이디어 창의성(30%) + 실용성(20%) + 발표력(10%)을 종합 평가합니다.',
        scoreSource: 'vote',
        scoreDisplay: {
          label: '심사 점수',
          breakdown: [
            { key: 'participant', label: '참가자 평가', weightPercent: 20 },
            { key: 'judge', label: '심사위원 평가', weightPercent: 80 },
          ],
        },
      },
      schedule: {
        timezone: 'Asia/Seoul',
        milestones: [
          { name: '접수 시작', at: '2026-05-01T10:00:00+09:00' },
          { name: '접수 마감', at: '2026-05-25T23:59:00+09:00' },
          { name: '데모 URL 제출 마감', at: '2026-06-01T10:00:00+09:00' },
          { name: '발표자료 제출 마감', at: '2026-06-03T23:59:00+09:00' },
          { name: '온라인 발표 심사', at: '2026-06-05T10:00:00+09:00' },
          { name: '최종 결과 발표', at: '2026-06-07T10:00:00+09:00' },
        ],
      },
      prize: {
        items: [
          { place: '1st', amountKRW: 5000000 },
          { place: '2nd', amountKRW: 3000000 },
          { place: '3rd', amountKRW: 1000000 },
        ],
      },
      teams: {
        campEnabled: true,
        listUrl: '/camp?hackathon=multimodal-ai-2026-05',
      },
      submit: {
        allowedArtifactTypes: ['url', 'pdf'],
        submissionUrl: '/hackathons/multimodal-ai-2026-05#submit',
        guide: [
          '데모 웹 URL을 제출합니다(외부 접속 가능해야 함).',
          '발표자료를 PDF로 변환하여 제출합니다.',
          '데모 영상(YouTube/Google Drive 링크)을 발표자료에 포함시키면 가산점이 있습니다.',
        ],
        submissionItems: [
          { key: 'web', title: '데모 웹 URL', format: 'url' },
          { key: 'pdf', title: '발표자료 PDF', format: 'pdf_url' },
        ],
      },
      leaderboard: {
        publicLeaderboardUrl: '/hackathons/multimodal-ai-2026-05#leaderboard',
        note: '심사 점수는 발표 심사 이후 공개됩니다. 현재 접수 기간입니다.',
      },
    },
  },
};

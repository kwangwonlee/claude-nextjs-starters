#!/bin/bash
# Claude Code Slack 알림 전송 스크립트
# stdin으로 hook JSON 데이터를 받아 Slack에 전송

set -e  # 에러 발생 시 즉시 종료

# 프로젝트 디렉토리 경로 설정 (Claude Code가 제공하는 환경 변수 사용)
PROJECT_DIR="${CLAUDE_PROJECT_DIR:-$(pwd)}"

# 환경 변수 로드 (프로젝트 로컬)
if [ -f "$PROJECT_DIR/.claude/.env" ]; then
    source "$PROJECT_DIR/.claude/.env"
fi

# Webhook URL 확인
if [ -z "$CLAUDE_SLACK_WEBHOOK_URL" ]; then
    echo "에러: CLAUDE_SLACK_WEBHOOK_URL 환경 변수가 설정되지 않았습니다." >&2
    echo "$PROJECT_DIR/.claude/.env 파일을 확인하세요." >&2
    exit 1
fi

# 디버그 모드 (환경 변수로 활성화 가능)
DEBUG="${CLAUDE_SLACK_DEBUG:-0}"

# stdin 데이터를 읽기
HOOK_DATA=$(cat)

if [ "$DEBUG" = "1" ]; then
    echo "[DEBUG] Hook 입력 데이터:" >&2
    echo "$HOOK_DATA" >&2
fi

# Python 스크립트로 JSON 파싱 및 Slack 메시지 생성
PYTHON_SCRIPT="$PROJECT_DIR/.claude/hooks/parse-hook-data.py"

if [ ! -f "$PYTHON_SCRIPT" ]; then
    echo "에러: Python 파싱 스크립트를 찾을 수 없습니다: $PYTHON_SCRIPT" >&2
    exit 1
fi

# Python으로 JSON 파싱
SLACK_PAYLOAD=$(echo "$HOOK_DATA" | python "$PYTHON_SCRIPT")
PARSE_EXIT_CODE=$?

if [ $PARSE_EXIT_CODE -ne 0 ]; then
    echo "에러: JSON 파싱 실패 (exit code: $PARSE_EXIT_CODE)" >&2
    exit 1
fi

if [ "$DEBUG" = "1" ]; then
    echo "[DEBUG] Slack 페이로드:" >&2
    echo "$SLACK_PAYLOAD" >&2
fi

# curl로 Slack Webhook에 POST 요청
HTTP_RESPONSE=$(curl -s -w "\n%{http_code}" -X POST \
    -H 'Content-type: application/json' \
    --data "$SLACK_PAYLOAD" \
    "$CLAUDE_SLACK_WEBHOOK_URL")

# HTTP 응답 코드 추출
HTTP_CODE=$(echo "$HTTP_RESPONSE" | tail -n1)
RESPONSE_BODY=$(echo "$HTTP_RESPONSE" | head -n-1)

if [ "$DEBUG" = "1" ]; then
    echo "[DEBUG] HTTP 응답 코드: $HTTP_CODE" >&2
    echo "[DEBUG] 응답 본문: $RESPONSE_BODY" >&2
fi

# HTTP 응답 확인
if [ "$HTTP_CODE" = "200" ]; then
    if [ "$DEBUG" = "1" ]; then
        echo "[SUCCESS] Slack 알림 전송 완료" >&2
    fi
    exit 0
else
    echo "에러: Slack 전송 실패 (HTTP $HTTP_CODE)" >&2
    echo "응답: $RESPONSE_BODY" >&2
    exit 1
fi

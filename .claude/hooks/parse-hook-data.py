#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Claude Code Hook 데이터 파싱 스크립트
stdin에서 JSON을 읽어 Slack 메시지 포맷으로 변환
"""

import sys
import json
from datetime import datetime
from pathlib import Path
import io

# Windows 인코딩 문제 해결: UTF-8 강제 설정
if sys.platform == 'win32':
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8')

def format_timestamp():
    """현재 시간을 한국 시간대로 포맷"""
    return datetime.now().strftime("%Y-%m-%d %H:%M:%S")

def extract_project_name(cwd):
    """경로에서 프로젝트명 추출"""
    return Path(cwd).name if cwd else "Unknown"

def parse_permission_request(data):
    """권한 요청 hook 데이터 파싱"""
    tool_name = data.get("tool_name", "Unknown")
    tool_input = data.get("tool_input", {})
    cwd = data.get("cwd", "")
    project_name = extract_project_name(cwd)

    # tool_input에서 주요 정보 추출
    if isinstance(tool_input, dict):
        if "command" in tool_input:
            detail = f"Command: `{tool_input['command'][:100]}`"
        elif "file_path" in tool_input:
            detail = f"File: `{tool_input['file_path']}`"
        elif "pattern" in tool_input:
            detail = f"Pattern: `{tool_input['pattern']}`"
        else:
            detail = f"{json.dumps(tool_input, ensure_ascii=False)[:100]}"
    else:
        detail = str(tool_input)[:100]

    return {
        "text": ":warning: Claude Code 권한 요청",
        "blocks": [
            {
                "type": "header",
                "text": {
                    "type": "plain_text",
                    "text": "🔐 권한 요청",
                    "emoji": True
                }
            },
            {
                "type": "section",
                "fields": [
                    {"type": "mrkdwn", "text": f"*도구:*\n{tool_name}"},
                    {"type": "mrkdwn", "text": f"*시간:*\n{format_timestamp()}"}
                ]
            },
            {
                "type": "section",
                "text": {"type": "mrkdwn", "text": f"*세부 정보:*\n{detail}"}
            },
            {
                "type": "context",
                "elements": [{"type": "mrkdwn", "text": f"프로젝트: `{project_name}`"}]
            }
        ]
    }

def parse_stop_hook(data):
    """작업 완료 hook 데이터 파싱"""
    session_id = data.get("session_id", "Unknown")[:8]
    cwd = data.get("cwd", "")
    project_name = extract_project_name(cwd)

    return {
        "text": ":white_check_mark: Claude Code 작업 완료",
        "blocks": [
            {
                "type": "header",
                "text": {
                    "type": "plain_text",
                    "text": "✅ 작업 완료",
                    "emoji": True
                }
            },
            {
                "type": "section",
                "fields": [
                    {"type": "mrkdwn", "text": f"*세션:*\n{session_id}"},
                    {"type": "mrkdwn", "text": f"*시간:*\n{format_timestamp()}"}
                ]
            },
            {
                "type": "context",
                "elements": [
                    {"type": "mrkdwn", "text": f"프로젝트: `{project_name}` | Claude가 응답을 완료했습니다."}
                ]
            }
        ]
    }

def main():
    """메인 함수: stdin에서 JSON 읽고 Slack 메시지 포맷으로 변환"""
    try:
        # stdin에서 JSON 읽기
        input_data = json.load(sys.stdin)

        # hook 이벤트 타입 확인
        hook_event = input_data.get("hook_event_name", "")

        # 이벤트 타입별 처리
        if hook_event == "PermissionRequest":
            slack_message = parse_permission_request(input_data)
        elif hook_event == "Stop":
            slack_message = parse_stop_hook(input_data)
        else:
            # 알 수 없는 hook 타입
            slack_message = {
                "text": f":question: 알 수 없는 hook 이벤트: {hook_event}"
            }

        # JSON 출력 (stdout으로 Bash에 전달)
        print(json.dumps(slack_message, ensure_ascii=False))
        sys.exit(0)

    except json.JSONDecodeError as e:
        # JSON 파싱 에러
        print(json.dumps({
            "text": f":x: JSON 파싱 실패: {str(e)}"
        }), file=sys.stderr)
        sys.exit(1)
    except Exception as e:
        # 기타 에러
        print(json.dumps({
            "text": f":x: 에러 발생: {str(e)}"
        }), file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    main()

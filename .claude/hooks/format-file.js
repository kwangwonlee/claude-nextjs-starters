#!/usr/bin/env node

/**
 * PostToolUse 훅: Edit/Write 후 자동 포맷팅
 * 파일이 저장된 후 Prettier와 ESLint로 자동 포맷팅을 수행합니다.
 */

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const filePath = process.env.CLAUDE_TOOL_PARAM_file_path;

// 파일 경로가 없으면 종료
if (!filePath) {
  process.exit(0);
}

// 파일이 실제로 존재하는지 확인
if (!fs.existsSync(filePath)) {
  process.exit(0);
}

// 포맷팅 대상 파일 확장자 확인
const ext = path.extname(filePath);
const formatExtensions = ['.js', '.jsx', '.ts', '.tsx', '.json', '.css', '.scss', '.md'];

if (!formatExtensions.includes(ext)) {
  process.exit(0);
}

console.log(`🎨 포맷팅 중: ${filePath}`);

try {
  // Prettier 실행
  execSync(`npx prettier --write "${filePath}"`, {
    stdio: 'inherit',
    cwd: process.env.CLAUDE_PROJECT_DIR || process.cwd()
  });

  // TypeScript/JavaScript 파일인 경우 ESLint도 실행
  const codeExtensions = ['.js', '.jsx', '.ts', '.tsx'];
  if (codeExtensions.includes(ext)) {
    try {
      execSync(`npx eslint --fix "${filePath}"`, {
        stdio: 'inherit',
        cwd: process.env.CLAUDE_PROJECT_DIR || process.cwd()
      });
    } catch (error) {
      // ESLint 에러는 무시 (규칙 위반 등)
    }
  }

  console.log(`✅ 포맷팅 완료: ${filePath}`);
} catch (error) {
  console.error(`⚠️ 포맷팅 실패: ${error.message}`);
  process.exit(0); // 에러가 있어도 성공으로 처리
}

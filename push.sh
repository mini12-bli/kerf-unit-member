#!/bin/bash
echo "새 GitHub 토큰을 입력하세요 (입력 내용은 보이지 않습니다):"
read -rs TOKEN
git -C "/Users/mijung.kim/Desktop/커프유닛멤버/kerf-unit-member" remote set-url origin "https://mini12-bli:${TOKEN}@github.com/mini12-bli/kerf-unit-member.git"
git -C "/Users/mijung.kim/Desktop/커프유닛멤버/kerf-unit-member" push origin main
echo "완료!"

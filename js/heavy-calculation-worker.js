// 무거운 계산 작업을 메인 스레드에서 분리
for (let i = 0; i < 10000000; i++) {
  const temp = Math.sqrt(i) * Math.sqrt(i);
}

self.postMessage("계산 완료");

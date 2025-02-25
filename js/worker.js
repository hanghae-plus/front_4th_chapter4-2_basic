// worker.js - 무거운 계산 작업을 메인 스레드에서 분리
self.onmessage = function(e) {
  if (e.data === 'start') {
    const result = performHeavyCalculation();
    self.postMessage(result);
  }
};

function performHeavyCalculation() {
  // 기존 무거운 계산 작업
  let result = 0;
  for (let i = 0; i < 10000000; i++) {
    result += Math.sqrt(i) * Math.sqrt(i);
  }
  return result;
}
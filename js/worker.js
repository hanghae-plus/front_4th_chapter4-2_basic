self.onmessage = (event) => {
  // Simulate heavy operation. It could be a complex price calculation.

  const data = event.data;
  if (data.action === "compute") {
    for (let i = 0; i < 10_000_000_000; i++) {
      const temp = Math.sqrt(i) * Math.sqrt(i);
    }
  }
};

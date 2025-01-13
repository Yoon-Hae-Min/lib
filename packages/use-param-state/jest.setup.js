Object.defineProperty(URLSearchParams.prototype, 'size', {
  get() {
    let size = 0;
    for (const entry of this) {
      size++;
    }
    return size;
  },
});

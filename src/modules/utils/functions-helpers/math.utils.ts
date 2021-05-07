export const factorial = (n: number): number => {
  return n != 1 ? n * factorial(n - 1) : 1;
};

export const fib = (n: number): number => {
  let a = 1;
  let b = 1;

  for (let i = 3; i <= n; i++) {
    const c = a + b;
    a = b;
    b = c;
  }

  return b;
};

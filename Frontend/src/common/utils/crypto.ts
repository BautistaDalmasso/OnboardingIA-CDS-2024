export interface IPrivateKey {
  d: number;
  n: number;
}

export interface IPublicKey {
  e: number;
  n: number;
}

export interface IKeyPair {
  publicKey: IPublicKey;
  privateKey: IPrivateKey;
}

const generatePrimeNumber = (): number => {
  const num = Math.floor(Math.random() * 50) + 50;
  if (isPrime(num)) {
    console.log(`Prime: ${num}`)
    return num;
  } else {
    return generatePrimeNumber();
  }
};

const isPrime = (num: number): boolean => {
  for (let i = 2, raiz = Math.sqrt(num); i <= raiz; i++) {
    if (num % i === 0) return false;
  }
  return num > 1;
};

export const generateKeyPair = (): IKeyPair => {
  const p = generatePrimeNumber();
  const q = generatePrimeNumber();

  const n = p * q;

  const phi = (p - 1) * (q - 1);

  let e = 2;
  while (e < phi) {
    if (isPrime(e) && phi % e !== 0) break;
    e++;
  }

  let d = 0;
  for (let i = 1; i < phi; i++) {
    if ((i * e) % phi === 1) {
      d = i;
      break;
    }
  }

  console.log(`Public Key: ${e}, ${n}`)

  return {
    publicKey: { e, n },
    privateKey: { d, n },
  };
};

export const encryptWithPrivateKey = (
  text: string,
  privateKey: IPrivateKey
) => {
  const numericText = text.split("").map((char) => char.charCodeAt(0));

  const encryptedText = numericText
    .map((char) => {
      return BigInt(char) ** BigInt(privateKey.d) % BigInt(privateKey.n);
    })
    .map((num) => Number(num));

  return encryptedText;
};

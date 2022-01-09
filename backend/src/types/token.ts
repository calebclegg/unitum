interface TokenData {
  token: string;
  expiresIn: number;
}

interface DataStoredInToken {
  email: string;
}

export { TokenData, DataStoredInToken };

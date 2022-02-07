const normalizeGoogleData = async (data: any) => {
  return {
    fullName: data.fullName,
    email: data.email,
    picture: data.picture || null,
    authProvider: data.authProvider,
    role: data.role
  };
};

export { normalizeGoogleData };

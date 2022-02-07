const normalizeGoogleData = async (data: any) => {
  return {
    email: data.email,
    firstname: data.givenName,
    lastname: data.familyName,
    picture: data.picture || null,
    authProvider: data.authProvider,
    role: data.role
  };
};

export { normalizeGoogleData };

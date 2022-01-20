const normalizeGoogleData = async (data: any) => {
  
  return {
    email: data.email,
    firstname: data.given_name,
    lastname: data.family_name,
    picture: data.picture || null,
    authProvider: data.authProvider,
    role: data.role
  };
};

export { normalizeGoogleData };

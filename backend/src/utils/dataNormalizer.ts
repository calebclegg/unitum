const normalizeGoogleData = async (data: any) => {
  return {
    fullName: data.fullName,
    email: data.email,
    fullName: data.name,
    picture: data.imageUrl || null,
    authProvider: data.googleId && "GOOGLE",
    role: data.role
  };
};

export { normalizeGoogleData };

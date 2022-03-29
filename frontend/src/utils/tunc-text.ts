export const truncatePostBody = (text?: string) => {
  if (text && text.length > 250) {
    return text.slice(0, 250) + " ...";
  }

  return text;
};

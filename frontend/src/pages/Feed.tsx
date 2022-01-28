import useUser from "../hooks/useUser";

const Feed = () => {
  const { user } = useUser();
  console.log({ user });

  return (
    <>
      <h1>Feed</h1>
    </>
  );
};

export default Feed;

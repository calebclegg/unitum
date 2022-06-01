import Time from "react-timeago";
const Age = ({ date }: { date: string }) => {
  return <Time date={date} />;
};

export default Age;

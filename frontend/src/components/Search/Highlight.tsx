interface IProps {
  highlight: string;
}

const Highlight = ({ highlight }: IProps) => {
  return <span style={{ backgroundColor: "lightblue" }}>{highlight}</span>;
};

export default Highlight;

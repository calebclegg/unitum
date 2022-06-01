import { ImageList, ImageListItem } from "@mui/material";

function srcset(image: string, size: number, rows = 1, cols = 1) {
  return {
    src: `${image}?w=${size * cols}&h=${size * rows}&fit=crop&auto=format`,
    srcSet: `${image}?w=${size * cols}&h=${
      size * rows
    }&fit=crop&auto=format&dpr=2 2x`
  };
}

function ImageListDisplay({ media }: { media: string[] }) {
  const newImages = media?.map((item) => {
    return {
      img: item,
      rows: 1,
      cols: 1
    };
  });

  return (
    <>
      <ImageList variant="standard" cols={media?.length}>
        {newImages?.map((item) => (
          <ImageListItem
            key={item.img}
            cols={item.cols || 1}
            rows={item.rows || 1}
          >
            <img
              {...srcset(item.img, 121, item.rows, item.cols)}
              alt={""}
              loading="lazy"
              // style={{ maxHeight: "50vh" }}
            />
          </ImageListItem>
        ))}
      </ImageList>
    </>
  );
}

export default ImageListDisplay;

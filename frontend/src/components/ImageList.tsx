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
  const newImages = media?.map((item, index) => {
    return {
      img: item,
      rows: index === 0 ? 3 : 1,
      cols: index === 0 ? 3 : 1
    };
  });

  return (
    <>
      {media?.length > 1 ? (
        <ImageList
          sx={{ maxWidth: 500, maxHeight: 450 }}
          variant="quilted"
          cols={4}
          rowHeight={80}
        >
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
              />
            </ImageListItem>
          ))}
        </ImageList>
      ) : (
        <img src={media && media[0]} style={{ width: "90%" }} />
      )}
    </>
  );
}

export default ImageListDisplay;

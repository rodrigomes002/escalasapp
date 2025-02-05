import { Typography } from "@mui/material";

export default function ColoredComponent({ color }: any) {
  return (
    <div
      style={{
        backgroundColor: color,
        color: "white",
        paddingTop: "8px",
        paddingBottom: "8px",
        textAlign: "center",
      }}
    >
      <Typography variant="body1">Sample piece of text</Typography>
    </div>
  );
}

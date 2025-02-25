import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import { Box, Checkbox, FormControlLabel, FormGroup } from "@mui/material";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<unknown>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface DataEscala {
  datas: [];
}

export default function MembersDialog() {
  const [open, setOpen] = React.useState(false);
  const [data, setData] = React.useState<DataEscala>();
  const [selectedItems, setSelectedItems] = React.useState([]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = () => {
    const novasDatas = datas.filter((f) => selectedItems.includes(f.id));

    console.log(novasDatas);
  };

  const handleChange = (id: any) => {
    setSelectedItems((prev: any) => {
      if (prev.includes(id)) {
        // Se o ID já existe, remove ele
        return prev.filter((item: any) => item !== id);
      } else {
        // Se o ID não existe, adiciona ele
        return [...prev, id];
      }
    });
  };

  const datas = [
    { id: 1, data: "02/02/2025", checked: false },
    { id: 2, data: "09/02/2025", checked: false },
    { id: 3, data: "16/02/2025", checked: false },
    { id: 4, data: "23/02/2025", checked: false },
  ];

  return (
    <React.Fragment>
      <Button sx={{ mb: 2 }} variant="outlined" onClick={handleClickOpen}>
        Agendar escala
      </Button>

      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <AppBar sx={{ position: "relative" }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              Datas
            </Typography>
            <Button autoFocus color="inherit" onClick={handleSubmit}>
              Salvar
            </Button>
          </Toolbar>
        </AppBar>
        <Box sx={{ ml: 2, flex: 1 }}>
          <Typography
            sx={{ mt: 2, mb: 2, flex: 1 }}
            variant="h5"
            component="div"
          >
            Fevereiro
          </Typography>

          <FormGroup>
            {datas.map((d) => (
              <FormControlLabel
                control={
                  <Checkbox
                    id={`checkbox-${d.id}`}
                    checked={selectedItems.includes(d.id)}
                    value={d.data}
                    onChange={() => handleChange(d.id)}
                    inputProps={{ "aria-label": "controlled" }}
                  />
                }
                label={d.data}
              />
            ))}
          </FormGroup>
        </Box>
      </Dialog>
    </React.Fragment>
  );
}

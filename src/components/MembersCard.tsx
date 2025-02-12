import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Divider, Grid2, ListItem } from "@mui/material";
import { useState } from "react";

interface CardProperts {
  dia: string;
  diaDaSemana: string;
  horario: string;
}

export default function MembersCard({
  dia,
  diaDaSemana,
  horario,
}: CardProperts) {
  const [usuario, setUsuario] = useState<string>();

  function marcarEscala() {
    setUsuario("Rodrigo");
  }

  return (
    <Card sx={{ minWidth: 275, mb: 4 }}>
      <CardContent>
        <Grid2 container>
          <Grid2 size="auto">
            <ListItem>
              <Typography variant="h5" component="h5">
                {diaDaSemana}
              </Typography>
            </ListItem>
            <ListItem>
              <Typography variant="h3" component="h3">
                {dia}
              </Typography>
            </ListItem>
          </Grid2>
          <Divider orientation="vertical" flexItem />
          <Grid2 size={6}>
            <ListItem>{horario}</ListItem>
            <ListItem>
              {usuario ? (
                usuario
              ) : (
                <Button onClick={marcarEscala}>Entrar na escala</Button>
              )}
            </ListItem>
          </Grid2>
        </Grid2>
      </CardContent>
      <CardActions></CardActions>
    </Card>
  );
}

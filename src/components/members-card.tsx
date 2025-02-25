import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { Divider, Grid2, ListItem } from "@mui/material";
import { useState } from "react";

interface CardProperts {
  dia: string;
  diaDaSemana: string;
  horario: string;
}

interface Escala {
  data: Date;
  instrumental: [];
  vocal: [];
}

export default function MembersCard({
  dia,
  diaDaSemana,
  horario,
}: CardProperts) {
  const [usuario, setUsuario] = useState<string>();
  const [escala, setEscala] = useState<Escala>();

  function marcarEscala(funcao: string) {
    //todo: faz request pra base
    //ex: Guitarra, Rodrigo
  }

  const instrumental = ["Guitarra", "Baixo", "Teclado", "Bateria"];
  const vocal = ["Soprano", "Contralto", "Base", "Base"];

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
          <Grid2 size={9}>
            <ListItem>{horario}</ListItem>

            <Grid2 container>
              <Grid2 size={6}>
                {instrumental.map((i) => (
                  <ListItem>
                    {i}:{" "}
                    {usuario ? (
                      usuario
                    ) : (
                      <Button
                        onClick={() => marcarEscala(i)}
                        disabled={usuario ? true : false}
                      >
                        <AddCircleOutlineIcon />
                      </Button>
                    )}
                  </ListItem>
                ))}
              </Grid2>

              <Grid2 size={6}>
                {vocal.map((i) => (
                  <ListItem>
                    {i}:{" "}
                    {usuario ? (
                      usuario
                    ) : (
                      <Button
                        onClick={() => marcarEscala(i)}
                        disabled={usuario ? true : false}
                      >
                        <AddCircleOutlineIcon />
                      </Button>
                    )}
                  </ListItem>
                ))}
              </Grid2>
            </Grid2>
          </Grid2>
        </Grid2>
      </CardContent>
    </Card>
  );
}

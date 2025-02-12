import MembersDialog from "@/components/members-dialog";
import MembersCard from "../components/members-card";

const EscalasPage = () => {
  const calendario = [
    {
      dia: "02",
      diaDaSemana: "Dom.",
      horario: "10:00",
    },
    {
      dia: "03",
      diaDaSemana: "Seg.",
      horario: "11:30",
    },
    {
      dia: "04",
      diaDaSemana: "Ter.",
      horario: "18:00",
    },
    {
      dia: "05",
      diaDaSemana: "Sab.",
      horario: "10:00",
    },
  ];

  return (
    <>
      <h1>Fevereiro</h1>

      <MembersDialog />

      {calendario.map((c) => (
        <MembersCard
          dia={c.dia}
          diaDaSemana={c.diaDaSemana}
          horario={c.horario}
        />
      ))}
    </>
  );
};

export default EscalasPage;

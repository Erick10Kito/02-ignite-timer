import { format } from "date-fns";
import { useContext } from "react";
import { CyclesContext } from "../../contexts/CyclesContext";
import { HistoryContainer, HistoryList, Status } from "./styles";

export function History() {
  const { cycles } = useContext(CyclesContext);
  return (
    <HistoryContainer>
      <h1>Meu Historico</h1>

      <HistoryList>
        <table>
          <thead>
            <tr>
              <th>Tarefa</th>
              <th>Duração</th>
              <th>Inicio</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {cycles.map((cycle) => {
              return (
                <tr key={cycle.id}>
                  <td>{cycle.task}</td>
                  <td>{cycle.minutesAmount} minutos</td>
                  <td>{format(new Date(cycle.startDate), "dd/MM/yyyy")}</td>
                  <td>
                    {cycle.finishedDate && (
                      <Status statusColor="green">Concluido</Status>
                    )}

                    {cycle.interruptDate && (
                      <Status statusColor="red">Interrompido</Status>
                    )}
                    {!cycle.interruptDate && !cycle.interruptDate && (
                      <Status statusColor="yellow">Em andamento</Status>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </HistoryList>
    </HistoryContainer>
  );
}

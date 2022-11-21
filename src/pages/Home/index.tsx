import { HandPalm, Play } from "phosphor-react";
import { createContext, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as zod from "zod";

import {
  HomeContainer,
  StartCountdownButton,
  StopCountdownButton,
} from "./styles";
import { NewCycleForm } from "./components/NewCycleForm";
import { Countdown } from "./components/Countdown";

interface ICycle {
  id: string;
  task: string;
  minutesAmount: number;
  startDate: Date;
  interruptDate?: Date;
  finishedDate?: Date;
}
interface ICyclesContextData {
  activeCycles: ICycle | undefined;
  activeCycleId: string | null;
  markCurrentCycleAsFinished: () => void;
  amountSecondsPassed: number;
  setSecondsPassed: (seconds: number) => void;
}

export const CyclesContext = createContext({} as ICyclesContextData);
const newCycleFormValidationSchema = zod.object({
  task: zod.string().min(1, "Tente mais tarde"),
  minutesAmount: zod
    .number()
    .min(5, "o ciclo precisa ser até no minimo ate 5 minutos")
    .max(60, "o ciclo precisa ser até no maximo 60 minutos"),
});

type INewCicleFormatData = zod.infer<typeof newCycleFormValidationSchema>;

export function Home() {
  const [amountSecondsPassed, setAmountSecondsPassed] = useState(0);
  //amountSecondsPassed = segundos que ja se passaram desde que o activeCycles foi ativado
  const [cycles, setCycles] = useState<ICycle[]>([]); //estou dizendo que o estado vai armazenar uma lista de ciclos usando o termo <ICycle[]>
  const [activeCycleId, setActiveCycleId] = useState<string | null>(null);

  const newCycleForm = useForm<INewCicleFormatData>({
    resolver: zodResolver(newCycleFormValidationSchema),

    defaultValues: {
      task: "",
      minutesAmount: 0,
    },
  });
  const { handleSubmit, watch, reset } = newCycleForm;
  function setSecondsPassed(seconds: number) {
    setAmountSecondsPassed(seconds);
  }

  function markCurrentCycleAsFinished() {
    setCycles((state) =>
      state.map((cycle) => {
        if (cycle.id === activeCycleId) {
          return { ...cycle, finishedDate: new Date() };
        } else {
          return cycle;
        }
      })
    );
  }

  function handleCreateNewCycle(data: INewCicleFormatData) {
    const id = String(new Date().getTime());

    const newCycle: ICycle = {
      id,
      task: data.task,
      minutesAmount: data.minutesAmount,
      startDate: new Date(),
    };

    setCycles((state) => [...state, newCycle]); //coloquei colchetes pq é um array de ciclos, e para adicionar um novo ciclo é necessario os tres pontos para que usem os possiveis ciclos anteriores e depois crie um novo com o newCycle
    //toda vez que eu estou alterando um estado, e esse estado depende da sua informação anterior, é bom o estado ser setado em formato de função, assim como esta a arrow function acima
    //state = Estado atual ( poderia ser qualquer nome)
    setActiveCycleId(id);
    setAmountSecondsPassed(0); // quando eu crio um novo ciclo, agora eu sempre volto a os segundos que se passaram para zero, para que o ciclo não comece de uma conta errada, do ciclo anterior
    reset();
  }

  function handleInterruptCycle() {
    setCycles((state) =>
      state.map((cycle) => {
        if (cycle.id === activeCycleId) {
          return { ...cycle, interruptDate: new Date() };
        } else {
          return cycle;
        }
      })
    );
    setActiveCycleId(null);
  }
  const activeCycles = cycles.find((cycle) => cycle.id === activeCycleId);

  const task = watch("task");

  const isSubmitDisable = !task;

  return (
    <HomeContainer>
      <form action="" onSubmit={handleSubmit(handleCreateNewCycle)}>
        <CyclesContext.Provider
          value={{
            activeCycles,
            activeCycleId,
            markCurrentCycleAsFinished,
            amountSecondsPassed,
            setSecondsPassed,
          }}
        >
          <FormProvider {...newCycleForm}>
            <NewCycleForm />
          </FormProvider>

          <Countdown />
          {activeCycles ? (
            <StopCountdownButton onClick={handleInterruptCycle} type="button">
              <HandPalm size={24} /> Interromper
            </StopCountdownButton>
          ) : (
            <StartCountdownButton disabled={isSubmitDisable} type="submit">
              <Play size={24} /> Começar
            </StartCountdownButton>
          )}
        </CyclesContext.Provider>
      </form>
    </HomeContainer>
  );
}

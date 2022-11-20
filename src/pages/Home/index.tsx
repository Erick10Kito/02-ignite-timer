import { Play } from "phosphor-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as zod from "zod";
import {
  CountdownContainer,
  FormContainer,
  HomeContainer,
  MinutesAmountInput,
  Separator,
  StartCountdownButton,
  TaskInput,
} from "./styles";

const newCycleFormValidationSchema = zod.object({
  task: zod.string().min(1, "Tente mais tarde"),
  minutesAmount: zod
    .number()
    .min(5, "o ciclo precisa ser até no minimo ate 5 minutos")
    .max(60, "o ciclo precisa ser até no maximo 60 minutos"),
});

type INewCicleFormatData = zod.infer<typeof newCycleFormValidationSchema>;

interface ICycle {
  id: string;
  task:string;
  minutesAmount:number;
}

export function Home() {
const [cycles, setCycles] = useState<ICycle[]>([]) //estou dizendo que o estado vai armazenar uma lista de ciclos usando o termo <ICycle[]>
const [activeCycleId, setActiveCycleId] = useState<string | null>(null)  
const [amountSecondsPassed, setAmountSecondsPassed] = useState(0)
//amountSecondsPassed = segundos que ja se passaram desde que o activeCycles foi ativado
const { register, handleSubmit, watch, reset } = useForm<INewCicleFormatData>({
    resolver: zodResolver(newCycleFormValidationSchema),

    defaultValues: {
      task: "",
      minutesAmount: 0,
    },
  });

  function handleCreateNewCycle(data: INewCicleFormatData) {
const id = String(new Date().getTime())

    const newCycle:ICycle = {
      id,
      task:data.task,
      minutesAmount:data.minutesAmount,
    }

    setCycles((state) => [...state, newCycle])//coloquei colchetes pq é um array de ciclos, e para adicionar um novo ciclo é necessario os tres pontos para que usem os possiveis ciclos anteriores e depois crie um novo com o newCycle
    //toda vez que eu estou alterando um estado, e esse estado depende da sua informação anterior, é bom o estado ser setado em formato de função, assim como esta a arrow function acima
   //state = Estado atual ( poderia ser qualquer nome)
   setActiveCycleId(id)
    reset()
  }
const activeCycles = cycles.find((cycle) => cycle.id===activeCycleId)
console.log(activeCycles)

const TotalSeconds = activeCycles? activeCycles.minutesAmount * 60: 0;
const currentSeconds = activeCycles?TotalSeconds-amountSecondsPassed:0;
const minutesAmount = Math.floor(currentSeconds /60);
const secondsAmount = currentSeconds%60;
const minutes = String(minutesAmount).padStart(2,'0');
const seconds = String(secondsAmount).padStart(2,'0');
  const task = watch("task");

  const isSubmitDisable = !task;

  return (
    <HomeContainer>
      <form action="" onSubmit={handleSubmit(handleCreateNewCycle)}>
        <FormContainer>
          <label htmlFor="task">Vou trabalhar em</label>
          <TaskInput
            id="task"
            list="taskSugestions"
            placeholder="Dê um nome para o seu projeto"
            {...register("task")}
          />

          <datalist id="taskSugestions">
            <option value="Projeto1" />
            <option value="Projeto1" />
            <option value="Projeto1" />
            <option value="Projeto1" />
            <option value="Olas" />
          </datalist>

          <label htmlFor="minutesAmount">durante</label>
          <MinutesAmountInput
            id="minutesAmount"
            placeholder="00"
            type="number"
            step={5}
            max={60}
            {...register("minutesAmount", { valueAsNumber: true })}
          />

          <span>minutos.</span>
        </FormContainer>

        <CountdownContainer>
          <span>{minutes[0]}</span>
          <span>{minutes[1]}</span>
          <Separator>:</Separator>
          <span>{seconds[0]}</span>
          <span>{seconds[1]}</span>
        </CountdownContainer>

        <StartCountdownButton disabled={isSubmitDisable} type="submit">
          <Play size={24} /> Começar
        </StartCountdownButton>
      </form>
    </HomeContainer>
  );
}

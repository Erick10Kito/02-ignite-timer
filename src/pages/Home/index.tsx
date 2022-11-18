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
  task: zod.string().min(1, "vai se foder"),
  minutesAmount: zod
    .number()
    .min(5, "o ciclo precisa ser até no minimo ate 5 minutos")
    .max(60, "o ciclo precisa ser até no maximo 60 minutos"),
});

type INewCicleFormatData = zod.infer<typeof newCycleFormValidationSchema>;

export function Home() {
  const { register, handleSubmit, watch } = useForm<INewCicleFormatData>({
    resolver: zodResolver(newCycleFormValidationSchema),

    defaultValues: {
      task: "",
      minutesAmount: 0,
    },
  });

  function handleCreateNewCycle(data: INewCicleFormatData) {
    console.log(data);
  }

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
          <span>0</span>
          <span>0</span>
          <Separator>:</Separator>
          <span>0</span>
          <span>0</span>
        </CountdownContainer>

        <StartCountdownButton disabled={isSubmitDisable} type="submit">
          <Play size={24} /> Começar
        </StartCountdownButton>
      </form>
    </HomeContainer>
  );
}

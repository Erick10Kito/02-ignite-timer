import { HandPalm, Play } from "phosphor-react";
import { createContext, useContext, useState } from "react";
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
import { CyclesContext } from "../../contexts/CyclesContext";

const newCycleFormValidationSchema = zod.object({
  task: zod.string().min(1, "Tente mais tarde"),
  minutesAmount: zod
    .number()
    .min(5, "o ciclo precisa ser até no minimo ate 5 minutos")
    .max(60, "o ciclo precisa ser até no maximo 60 minutos"),
});

type INewCicleFormData = zod.infer<typeof newCycleFormValidationSchema>;

export function Home() {
  const { createNewCycle, interruptCurrentCycle, activeCycles } =
    useContext(CyclesContext);
  const newCycleForm = useForm<INewCicleFormData>({
    resolver: zodResolver(newCycleFormValidationSchema),

    defaultValues: {
      task: "",
      minutesAmount: 0,
    },
  });
  const { handleSubmit, watch, reset } = newCycleForm;

  function handleCreateNewCycle(data: INewCicleFormData) {
    createNewCycle(data);
    reset();
  }

  const task = watch("task");

  const isSubmitDisable = !task;

  return (
    <HomeContainer>
      <form action="" onSubmit={handleSubmit(createNewCycle)}>
        <FormProvider {...newCycleForm}>
          <NewCycleForm />
        </FormProvider>

        <Countdown />
        {activeCycles ? (
          <StopCountdownButton onClick={interruptCurrentCycle} type="button">
            <HandPalm size={24} /> Interromper
          </StopCountdownButton>
        ) : (
          <StartCountdownButton disabled={isSubmitDisable} type="submit">
            <Play size={24} /> Começar
          </StartCountdownButton>
        )}
      </form>
    </HomeContainer>
  );
}

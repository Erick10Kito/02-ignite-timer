import { FormContainer, MinutesAmountInput, TaskInput } from "./styles";
import * as zod from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFormContext } from "react-hook-form";
import { useContext } from "react";
import { CyclesContext } from "../..";

export function NewCycleForm() {
  const { activeCycles } = useContext(CyclesContext);
  const { register } = useFormContext();

  return (
    <FormContainer>
      <label htmlFor="task">Vou trabalhar em</label>
      <TaskInput
        disabled={!!activeCycles}
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
        min={5}
        max={60}
        {...register("minutesAmount", { valueAsNumber: true })}
      />

      <span>minutos.</span>
    </FormContainer>
  );
}

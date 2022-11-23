import { createContext, ReactNode, useReducer, useState } from "react";
interface ICreateCycleData {
  task: string;
  minutesAmount: number;
}

interface ICycle {
  id: string;
  task: string;
  minutesAmount: number;
  startDate: Date;
  interruptDate?: Date;
  finishedDate?: Date;
}
interface ICyclesContextData {
  cycles: ICycle[];
  activeCycles: ICycle | undefined;
  activeCycleId: string | null;
  markCurrentCycleAsFinished: () => void;
  amountSecondsPassed: number;
  setSecondsPassed: (seconds: number) => void;
  createNewCycle: (data: ICreateCycleData) => void;
  interruptCurrentCycle: () => void;
}
interface ICyclesContextProviderProps {
  children: ReactNode;
}

// interface IProps {
//   type?: string;
//   payload?: {
//     data?: String[];
//   };
// }

interface ICycleState {
  cycles: ICycle[];
  activeCycleId: string | null;
}

export const CyclesContext = createContext({} as ICyclesContextData);

export function CyclesContextProvider({
  children,
}: ICyclesContextProviderProps) {
  const [cyclesState, dispatch] = useReducer(
    (state: ICycleState, action: any) => {
      if (action.type === "ADD_NEW_CYCLE") {
        return {
          ...state,
          cycles: [...state.cycles, action.payload.newCycle],
          activeCycleId: action.payload.newCycle.id,
        };
      }

      if (action.type === "INTERRUPT_CURRENT_CYCLE") {
        return {
          ...state,
          cycles: state.cycles.map((cycle) => {
            if (cycle.id === state.activeCycleId) {
              return { ...cycle, interruptDate: new Date() };
            } else {
              return cycle;
            }
          }),
          activeCycleId: null,
        };
      }
      return state;
    },
    {
      cycles: [],
      activeCycleId: null,
    }
  );

  const [amountSecondsPassed, setAmountSecondsPassed] = useState(0);
  //amountSecondsPassed = segundos que ja se passaram desde que o activeCycles foi ativado

  const { cycles, activeCycleId } = cyclesState;

  // const [cycles, setCycles] = useState<ICycle[]>([]); //estou dizendo que o estado vai armazenar uma lista de ciclos usando o termo <ICycle[]>

  const activeCycles = cycles.find((cycle) => cycle.id === activeCycleId);

  function setSecondsPassed(seconds: number) {
    setAmountSecondsPassed(seconds);
  }

  function markCurrentCycleAsFinished() {
    dispatch({
      type: "MARK_CURRENT_CYCLE_AS_FINISHED",
      payload: {
        data: activeCycleId,
      },
    });
    // setCycles((state) =>
    //   state.map((cycle) => {
    //     if (cycle.id === activeCycleId) {
    //       return { ...cycle, finishedDate: new Date() };
    //     } else {
    //       return cycle;
    //     }
    //   })
    // );
  }

  function createNewCycle(data: ICreateCycleData) {
    const id = String(new Date().getTime());

    const newCycle: ICycle = {
      id,
      task: data.task,
      minutesAmount: data.minutesAmount,
      startDate: new Date(),
    };

    dispatch({
      type: "ADD_NEW_CYCLE",
      payload: {
        newCycle,
      },
    });

    // setCycles((state) => [...state, newCycle]); //coloquei colchetes pq é um array de ciclos, e para adicionar um novo ciclo é necessario os tres pontos para que usem os possiveis ciclos anteriores e depois crie um novo com o newCycle
    //toda vez que eu estou alterando um estado, e esse estado depende da sua informação anterior, é bom o estado ser setado em formato de função, assim como esta a arrow function acima
    //state = Estado atual ( poderia ser qualquer nome)

    setAmountSecondsPassed(0); // quando eu crio um novo ciclo, agora eu sempre volto a os segundos que se passaram para zero, para que o ciclo não comece de uma conta errada, do ciclo anterior
  }

  function interruptCurrentCycle() {
    dispatch({
      type: "INTERRUPT_CURRENT_CYCLE",
      payload: {
        data: activeCycleId,
      },
    });
  }
  return (
    <CyclesContext.Provider
      value={{
        cycles,
        activeCycles,
        activeCycleId,
        markCurrentCycleAsFinished,
        amountSecondsPassed,
        setSecondsPassed,
        createNewCycle,
        interruptCurrentCycle,
      }}
    >
      {children}
    </CyclesContext.Provider>
  );
}

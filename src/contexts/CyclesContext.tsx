import {
  createContext,
  ReactNode,
  useEffect,
  useReducer,
  useState,
} from "react";
import { cyclesReducer, ICycle } from "../reducers/cycles/reducer";
import {
  addNewCycleAction,
  interruptCurrentCycleAction,
  markCurrentCycleAsFinishedAction,
} from "../reducers/cycles/actions";
import { differenceInSeconds } from "date-fns";
interface ICreateCycleData {
  task: string;
  minutesAmount: number;
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

export const CyclesContext = createContext({} as ICyclesContextData);

export function CyclesContextProvider({
  children,
}: ICyclesContextProviderProps) {
  const [cyclesState, dispatch] = useReducer(
    cyclesReducer,
    {
      cycles: [],
      activeCycleId: null,
    },
    () => {
      const storedStateAsJSON = localStorage.getItem(
        "@ignite-timer:cycles-state-1.0.0EI"
      );

      if (storedStateAsJSON) {
        return JSON.parse(storedStateAsJSON);
      }
    }
  );
  const { cycles, activeCycleId } = cyclesState;
  const activeCycles = cycles.find((cycle) => cycle.id === activeCycleId);

  const [amountSecondsPassed, setAmountSecondsPassed] = useState(() => {
    if (activeCycles) {
      return differenceInSeconds(new Date(), new Date(activeCycles.startDate));
    }
    return 0;
  });
  //amountSecondsPassed = segundos que ja se passaram desde que o activeCycles foi ativado

  useEffect(() => {
    const stateJSON = JSON.stringify(cyclesState);

    localStorage.setItem("@ignite-timer:cycles-state-1.0.0EI", stateJSON);
  }, [cyclesState]);

  // const [cycles, setCycles] = useState<ICycle[]>([]); //estou dizendo que o estado vai armazenar uma lista de ciclos usando o termo <ICycle[]>

  function setSecondsPassed(seconds: number) {
    setAmountSecondsPassed(seconds);
  }

  function markCurrentCycleAsFinished() {
    dispatch(markCurrentCycleAsFinishedAction());
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

    dispatch(addNewCycleAction(newCycle));

    // setCycles((state) => [...state, newCycle]); //coloquei colchetes pq é um array de ciclos, e para adicionar um novo ciclo é necessario os tres pontos para que usem os possiveis ciclos anteriores e depois crie um novo com o newCycle
    //toda vez que eu estou alterando um estado, e esse estado depende da sua informação anterior, é bom o estado ser setado em formato de função, assim como esta a arrow function acima
    //state = Estado atual ( poderia ser qualquer nome)

    setAmountSecondsPassed(0); // quando eu crio um novo ciclo, agora eu sempre volto a os segundos que se passaram para zero, para que o ciclo não comece de uma conta errada, do ciclo anterior
  }

  function interruptCurrentCycle() {
    dispatch(interruptCurrentCycleAction());
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

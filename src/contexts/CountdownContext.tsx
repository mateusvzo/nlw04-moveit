import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { ChallengesContext } from "./ChallengesContext";

interface CountdownContextData {
    minutes: number;
    seconds: number;
    hasFinished: boolean;
    isActive: boolean;
    resetCountdown: () => void;
    startCountdown: () => void;
}

interface CountdownProviderProps {
    children: ReactNode;
}


export const CountdownContext = createContext({} as CountdownContextData);

let countdownTimeOut: NodeJS.Timeout;


export function CountdownProvider({children}) {
    const { startNewChallenge } = useContext(ChallengesContext);

    const [time, setTime] = useState(30 * 60);
    const [isActive, setIsActive] = useState(false);
    const [hasFinished, setHasFinished] = useState(false);

    const minutes = Math.floor(time / 60);
    const seconds = time % 60;

    function startCountdown() {
        setIsActive(true);
    }

    function resetCountdown() {
        clearTimeout(countdownTimeOut);
        setIsActive(false);
        setTime(30 * 60);
        setHasFinished(false);
    }

    useEffect(() => {
        if (isActive && time > 0) {
            countdownTimeOut = setTimeout(() => {
                setTime(time - 1);
            }, 1000)
        } else if (isActive && time === 0) {
            setHasFinished(true);
            setIsActive(false);
            startNewChallenge();
        }
    }, [isActive, time])

    return (
        <CountdownContext.Provider value={{
            minutes,
            seconds,
            hasFinished,
            isActive,
            resetCountdown,
            startCountdown
        }}>
            {children}
        </CountdownContext.Provider>
    )
}
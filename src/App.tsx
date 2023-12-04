import { useCallback, useEffect, useState } from "react"
import { HangmanWord } from "./assets/HangmanWord"
import { HangmanDrawing } from "./assets/HangmanDrawing"
import words from "./assets/wordList.json"
import { Keyboard } from "./assets/HangmanKeyboard"


function getWord() {
  return words[Math.floor(Math.random() * words.length)]
}


function App() {

  const [wordToGuess, setWordToGuess] = useState(getWord)
  const [guessedLetters, setGuessedLetters] = useState<string[]>([])

  const incorrectLetters = guessedLetters.filter(letter => !wordToGuess.includes(letter))

  const isLoser = incorrectLetters.length >= 6
  const isWinner = wordToGuess.split("").every(letter => guessedLetters.includes(letter))

  const addGuessedLetter = useCallback((letter: string) => {
    if (guessedLetters.includes(letter) || isLoser || isWinner) return

    setGuessedLetters(currentLetter => [...currentLetter, letter])
  }, [guessedLetters, isWinner, isLoser])



  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const key = e.key
      if (!key.match(/^[a-z]$/)) return

      e.preventDefault()
      addGuessedLetter(key)
    }

    document.addEventListener("keypress", handler)

    return () => {
      document.removeEventListener("keypress", handler)
    }
  }, [guessedLetters])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const key = e.key
      if (key != "Enter") return

      e.preventDefault()
      setGuessedLetters([])
      setWordToGuess(getWord())
    }

    document.addEventListener("keypress", handler)

    return () => {
      document.removeEventListener("keypress", handler)
    }
  }, [])


  return (
    <div>
      <div style={{
        height: "95px", background: "#011816", color: "white", textAlign:"center" }}><h1 style={{ paddingTop: "20px", fontSize: "40px" }}>HangMan</h1></div>
    <div style={{     
      maxWidth: "800px", maxHeight: "600px", display: "flex",
      flexDirection: "column", gap: "2rem", margin: "0 auto", alignItems: "center"
    }}>
      <div style={{ fontSize: "2rem", textAlign: "center" }}>
        {isWinner && "Winner! - Refresh to Try again"}
        {isLoser && "Nice Try - Refresh to Try again"}
      </div>
      <HangmanDrawing numberOfGuesses={incorrectLetters.length} />
      <HangmanWord
        reveal={isLoser}
        guessedLetters={guessedLetters}
        wordToGuess={wordToGuess}

      />
      <div style={{ alignSelf: "stretch" }}>
        <Keyboard
          disabled={isWinner || isLoser}
          activeLetters={guessedLetters.filter(letter => wordToGuess.includes(letter))}
          inactiveLetters={incorrectLetters}
          addGuessedLetter={addGuessedLetter}

        />

      </div>
      </div>
      </div>
  )
}

export default App
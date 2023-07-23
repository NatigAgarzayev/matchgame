import React, { useEffect, useState } from 'react'
import style from './Canvas.module.css'
import Cell from '../cell/Cell'
import replay from '../../images/replay.gif'

function Canvas() {

    const playArr = ['1', '1', '2', '2', '3', '3', '4', '4', '5', '5', '6', '6', '7', '7', '8', '8']
    const [mathcedArr, setMathcedArr] = useState([])
    const [trigger, setTrigger] = useState(false)
    const [arr, setArr] = useState([])
    const [matched, setMathced] = useState({ st: null, nd: null })
    const [ind, setInd] = useState({ st: null, nd: null })
    const [steps, setSteps] = useState(0)
    const [onlyOneTime, setOnlyOneTime] = useState(0)
    const [gameOver, setGameOver] = useState(false)
    const [newGame, setNewGame] = useState(false)
    const [record, setRecord] = useState(window.localStorage.getItem('record') || 0)

    useEffect(() => {
        if (!window.localStorage.getItem('record')) {
            window.localStorage.setItem('record', 0)
            setRecord(0)
        }
        else {
            setRecord(window.localStorage.getItem('record'))
        }
    }, [newGame])


    useEffect(() => {
        function shuffleArray(array) {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
        }
        shuffleArray(playArr)
        setArr(playArr)
    }, [newGame])

    useEffect(() => {
        setMathcedArr(current => [...current, '1'])
        //gameover
        if (mathcedArr.length === 8) {
            setGameOver(true)
            if (steps < record || record === 0) {
                window.localStorage.setItem('record', steps)
                setRecord(steps)
            }
        }
    }, [trigger])

    const handleHint = () => {
        if (onlyOneTime !== 0) return
        setOnlyOneTime(onlyOneTime + 1)
        const cells = document.querySelectorAll(`.${style.playground} > div > div > p`)
        cells.forEach(cell => {
            cell.style.display = ""
        })
        setTimeout(() => {
            cells.forEach(cell => {
                if (!cell.classList.contains('matched')) {
                    cell.style.display = "none"
                }
            })
        }, 2000)
    }

    const openForMatch = (itemT, indexT) => {
        const cells = document.querySelectorAll(`.${style.playground} > div > div > p`)
        const item = itemT
        const index = indexT
        if (cells[index].classList.contains('matched')) return
        cells[index].style.display = ""
        if (!matched.st) {
            setMathced({ ...matched, st: item })
            setInd({ ...ind, st: index })
        }
        else if (ind.st !== index && !matched.nd) {
            setMathced({ ...matched, nd: item })
            setInd({ ...ind, nd: index })
            if (matched.st === item) {
                displayCells(ind.st, index)
            }
            else {
                cells[ind.st].classList.add('wrong')
                cells[index].classList.add('wrong')
                setTimeout(() => {
                    cells[ind.st].style.display = "none"
                    cells[index].style.display = "none"
                    cells[ind.st].classList.remove('wrong')
                    cells[index].classList.remove('wrong')
                }, 500)
            }
            setMathced({ st: null, nd: null })
            setInd({ st: null, nd: null })
            setSteps(steps + 1)
        }
    }


    const displayCells = (val1, val2) => {
        const cells = document.querySelectorAll(`.${style.playground} > div > div > p`)
        cells[val1].style.display = ""
        cells[val2].style.display = ""
        cells[val1].classList.add('matched')
        cells[val2].classList.add('matched')
        setTrigger(!trigger)
    }

    const handleNewGame = () => {
        setMathcedArr([])
        setGameOver(false)
        setMathced({ st: null, nd: null })
        setInd({ st: null, nd: null })
        setSteps(0)
        setOnlyOneTime(0)
        const cells = document.querySelectorAll(`.${style.playground} > div > div > p`)
        cells.forEach(cell => {
            cell.style.display = ""
            cell.classList.remove('matched')
        })
        setArr([])
        setNewGame(!newGame)
        setTrigger(!trigger)
    }

    return (
        <div className={style.playground}>
            {
                gameOver && (
                    <>
                        <div className={style.over}>
                            <div>
                                Game Over <br />
                                Your Score is {steps} <br />
                                Your Record is {record}
                            </div>
                            <div onClick={handleNewGame}>
                                <img src={replay} alt="new game" />
                            </div>
                        </div>
                    </>
                )
            }
            <div className={style.counter}>Steps: {steps}</div>
            <button disabled={onlyOneTime === 0 ? false : true} className={style.hint} onClick={handleHint}>Show hint</button>
            {
                arr.length && arr.map((item, index) => (
                    <div key={index} onClick={() => openForMatch(item, index)}>
                        <Cell cellValue={item} />
                    </div>
                ))
            }
        </div>
    )
}

export default Canvas
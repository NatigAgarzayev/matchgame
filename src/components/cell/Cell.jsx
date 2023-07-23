import React from 'react'
import style from './Cell.module.css'

function Cell({ cellValue }) {
    const images = require(`../../images/${cellValue}.png`)

    return (
        <div className={style.cell}>
            <p className={style.cell__value} style={{ display: "none" }}>
                <img src={images} alt={cellValue} />
            </p>
        </div >
    )
}

export default Cell
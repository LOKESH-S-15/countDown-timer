import React from 'react'
import styles from "./CounterCard.module.css";

const CounterCard = ({property,value}) => {
  return (
    <div className={styles.CounterCardCon}>
      <h1 className={styles.CounterCardtext}>{value}</h1>
      <h1 className={styles.CounterCardtext}>{property
        }</h1>
    </div>
  )
}

export default CounterCard

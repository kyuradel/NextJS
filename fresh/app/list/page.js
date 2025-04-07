'use client';
import { useState } from "react"

export default function List() {
  let 상품 = ['Tomatoes', 'Pasta', 'Coconut']
  let [수량, 수량변경] = useState([0, 0, 0])
  
    return (
      <div>
        <h4 className="title">상품목록</h4>

        

        {
          상품.map((a, i) => {
            return (
              <div className="food" key={i}>
                <img src={`/food${i}.png`} className="food-img"/>
                <h4>{a} $40</h4>
                <button onClick={()=> { if (수량 != 0) 수량변경(수량-1) }}>-</button>
                <span> {수량} </span>
                <button onClick={()=> { 수량변경(수량+1) }}>+</button>
              </div>
            )
          })
        }
      </div>
    )
  }
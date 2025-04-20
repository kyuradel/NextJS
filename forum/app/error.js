'use client'

export default function Error({error, reset}){
  return (
    <div>
      <h4>오 이런 에러남</h4>
      <button onClick={()=>{ reset() }}>다시시도</button>
    </div>
  )
}
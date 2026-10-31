export function Dialog({ onClose }: { onClose: (yes: boolean) => void }) {
  return (
    <div className="overlay">
      <div className="box">
        <h2>Enroll in Python from Zero?</h2>
        <div className="btns">
          <button onClick={() => onClose(true)}>Yes, enroll</button>
          <button className="plain" onClick={() => onClose(false)}>Cancel</button>
        </div>
      </div>
    </div>
  )
}

import { FaqItem } from './FaqItem'
import { MoreText } from './MoreText'

export default function App() {
  return (
    <>
      <header>
        <strong>allcsvideos</strong>
        <span className="tag">Course page</span>
      </header>
      <main>
        <h2>Questions</h2>
        <FaqItem question="Can I start from zero?">
          Yes. The first lesson explains what a web page is.
        </FaqItem>
        <FaqItem question="Is there a certificate?">
          Yes, after the last build video.
        </FaqItem>
        <MoreText text="Meera teaches React from the first tag to a deployed app, one small idea at a time." />
      </main>
    </>
  )
}

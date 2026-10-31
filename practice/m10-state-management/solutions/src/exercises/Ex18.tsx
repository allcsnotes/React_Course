import { whereLives, sharedTool, type Facts } from '../lib/whereLives.ts'

type Thing = { name: string; facts: Facts; changesOften: boolean }

const things: Thing[] = [
  { name: 'Words in the search box while typing', facts: { inAddress: false, fromServer: false, sharedFar: false }, changesOften: true },
  { name: 'List of courses from the API', facts: { inAddress: false, fromServer: true, sharedFar: true }, changesOften: false },
  { name: 'Items in the cart', facts: { inAddress: false, fromServer: false, sharedFar: true }, changesOften: true },
  { name: 'Level chosen in the catalog filter', facts: { inAddress: true, fromServer: false, sharedFar: true }, changesOften: false },
  { name: 'Dark or light theme', facts: { inAddress: false, fromServer: false, sharedFar: true }, changesOften: false },
  { name: 'Signed-in user', facts: { inAddress: false, fromServer: false, sharedFar: true }, changesOften: false },
  { name: 'Is the menu open?', facts: { inAddress: false, fromServer: false, sharedFar: false }, changesOften: false },
  { name: 'Page number of the results', facts: { inAddress: true, fromServer: false, sharedFar: false }, changesOften: false },
]

export default function Ex18() {
  return (
    <div className="card">
      <table>
        <tbody>
          {things.map((t) => {
            const home = whereLives(t.facts)
            return (
              <tr key={t.name}>
                <td>{t.name}</td>
                <td>
                  <strong>{home}</strong>
                  {home === 'shared' ? ` (${sharedTool(t.changesOften)})` : ''}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

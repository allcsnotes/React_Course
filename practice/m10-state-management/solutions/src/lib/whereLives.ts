export type Home = 'address' | 'server' | 'shared' | 'local'

export type Facts = {
  /** Should a link or a refresh bring it back? */
  inAddress: boolean
  /** Does the real copy live on a server? */
  fromServer: boolean
  /** Do two components far apart need it? */
  sharedFar: boolean
}

// The three questions, asked in this order. Local is the default.
export function whereLives(facts: Facts): Home {
  if (facts.inAddress) return 'address'
  if (facts.fromServer) return 'server'
  if (facts.sharedFar) return 'shared'
  return 'local'
}

// For shared state only: which tool?
export function sharedTool(changesOften: boolean): 'context' | 'zustand' {
  return changesOften ? 'zustand' : 'context'
}

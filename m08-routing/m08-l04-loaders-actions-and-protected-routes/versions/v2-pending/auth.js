// a FAKE sign-in flag, kept in this browser only (real login: module 13)
export const isSignedIn = () => localStorage.getItem('signedIn') === 'yes'
export const signIn = () => localStorage.setItem('signedIn', 'yes')
export const signOut = () => localStorage.removeItem('signedIn')

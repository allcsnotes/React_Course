import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

function App() {
  const [msg, setMsg] = useState('Not enrolled yet')
  const enroll = () => setMsg('Enrolled!')

  return (
    <div className="flex min-h-screen flex-col justify-end gap-2 p-6">
      <h2 className="text-xl font-bold">
        Python from Zero
      </h2>
      <Dialog>
        <DialogTrigger asChild>
          <Button>Enroll</Button>
        </DialogTrigger>
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>
              Enroll in Python from Zero?
            </DialogTitle>
            <DialogDescription>
              The first lesson starts right away.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <DialogClose asChild>
              <Button onClick={enroll}>Yes, enroll</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <p>{msg}</p>
    </div>
  )
}

export default App

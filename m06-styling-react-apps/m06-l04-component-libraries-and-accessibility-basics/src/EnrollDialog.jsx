import * as Dialog from '@radix-ui/react-dialog'

function EnrollDialog({ title, onConfirm }) {
  return (
    <Dialog.Root>
      <Dialog.Trigger className="btn">
        Enroll
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="overlay" />
        <Dialog.Content className="dialog">
          <Dialog.Title>
            Enroll in {title}?
          </Dialog.Title>
          <Dialog.Description>
            The first lesson starts right away.
          </Dialog.Description>
          <div className="row">
            <Dialog.Close
              className="btn"
              onClick={onConfirm}
            >
              Yes, enroll
            </Dialog.Close>
            <Dialog.Close className="ghost">
              Cancel
            </Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

export default EnrollDialog

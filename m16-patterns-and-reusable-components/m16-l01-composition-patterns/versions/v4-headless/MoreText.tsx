import { useDisclosure } from './useDisclosure'

export function MoreText({ text }: { text: string }) {
  const { open, buttonProps } = useDisclosure()
  return (
    <p className="more">
      {open ? text : text.slice(0, 44) + '…'}{' '}
      <button className="link" {...buttonProps}>
        {open ? 'Show less' : 'Show more'}
      </button>
    </p>
  )
}

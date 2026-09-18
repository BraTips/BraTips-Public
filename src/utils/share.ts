export type ShareResult = 'shared' | 'copied' | 'cancelled'

export type SharePayload = {
  title: string
  text?: string
  url: string
}

export async function shareOrCopy(payload: SharePayload): Promise<ShareResult> {
  const url = absoluteUrl(payload.url)
  const shareData = { title: payload.title, text: payload.text, url }

  if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
    try {
      await navigator.share(shareData)
      return 'shared'
    } catch (error: any) {
      if (error?.name === 'AbortError') return 'cancelled'
    }
  }

  await copyToClipboard(url)
  return 'copied'
}

export function absoluteUrl(url: string) {
  if (typeof window === 'undefined') return url
  return new URL(url, window.location.origin).toString()
}

async function copyToClipboard(text: string) {
  if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text)
      return
    } catch {
      // Fall through to the textarea fallback for browsers that expose the API
      // but reject it outside a supported clipboard context.
    }
  }

  if (typeof document === 'undefined') throw new Error('Clipboard is not available.')

  const textarea = document.createElement('textarea')
  textarea.value = text
  textarea.setAttribute('readonly', '')
  textarea.style.position = 'fixed'
  textarea.style.left = '-9999px'
  document.body.appendChild(textarea)
  textarea.select()

  try {
    if (!document.execCommand('copy')) throw new Error('Copy command failed.')
  } finally {
    document.body.removeChild(textarea)
  }
}

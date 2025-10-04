'use client'

import { generateQRCode } from '@/lib/utils'

interface QRCodeProps {
  url: string
  size?: number
  className?: string
}

export function QRCode({ url, size = 200, className = '' }: QRCodeProps) {
  const qrCodeUrl = generateQRCode(url)
  
  return (
    <div className={`flex flex-col items-center space-y-2 ${className}`}>
      <img
        src={qrCodeUrl}
        alt={`QR Code for ${url}`}
        width={size}
        height={size}
        className="border rounded-lg"
      />
      <p className="text-sm text-muted-foreground text-center max-w-xs break-all">
        {url}
      </p>
    </div>
  )
}

'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { verifyEmailCode, verifySMSCode, markVerificationComplete } from '@/lib/real-verification'
import { toast } from '@/hooks/use-toast'
import { Mail, Phone, CheckCircle, XCircle } from 'lucide-react'

interface VerificationModalProps {
  isOpen: boolean
  onClose: () => void
  onVerified: () => void
  email: string
  phone: string
  emailVerificationSent: boolean
  phoneVerificationSent: boolean
}

export function VerificationModal({
  isOpen,
  onClose,
  onVerified,
  email,
  phone,
  emailVerificationSent,
  phoneVerificationSent
}: VerificationModalProps) {
  const [emailCode, setEmailCode] = useState('')
  const [phoneCode, setPhoneCode] = useState('')
  const [emailVerified, setEmailVerified] = useState(false)
  const [phoneVerified, setPhoneVerified] = useState(false)
  const [loading, setLoading] = useState(false)

  if (!isOpen) return null

  const handleEmailVerification = async () => {
    if (!emailCode) {
      toast({ title: 'Lütfen e-posta doğrulama kodunu girin', variant: 'destructive' })
      return
    }

    try {
      const response = await fetch('/api/verification/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'email', email, code: emailCode })
      })

      const result = await response.json()
      
      if (result.isValid) {
        setEmailVerified(true)
        toast({ title: 'E-posta doğrulandı!', variant: 'default' })
      } else {
        toast({ title: 'Geçersiz doğrulama kodu', variant: 'destructive' })
      }
    } catch (error) {
      toast({ title: 'Doğrulama hatası', variant: 'destructive' })
    }
  }

  const handlePhoneVerification = async () => {
    if (!phoneCode) {
      toast({ title: 'Lütfen SMS doğrulama kodunu girin', variant: 'destructive' })
      return
    }

    try {
      const response = await fetch('/api/verification/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'phone', phone, code: phoneCode })
      })

      const result = await response.json()
      
      if (result.isValid) {
        setPhoneVerified(true)
        toast({ title: 'Telefon numarası doğrulandı!', variant: 'default' })
      } else {
        toast({ title: 'Geçersiz doğrulama kodu', variant: 'destructive' })
      }
    } catch (error) {
      toast({ title: 'Doğrulama hatası', variant: 'destructive' })
    }
  }

  const handleCompleteVerification = () => {
    if (emailVerified && phoneVerified) {
      markVerificationComplete(email, phone)
      toast({ title: 'Tüm doğrulamalar tamamlandı!', variant: 'default' })
      onVerified()
      onClose()
    } else {
      toast({ title: 'Lütfen tüm doğrulamaları tamamlayın', variant: 'destructive' })
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Doğrulama Gerekli</CardTitle>
          <CardDescription>
            Randevunuzu tamamlamak için e-posta ve telefon numaranızı doğrulayın
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Email Verification */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Mail className="w-5 h-5" />
              <Label className="text-sm font-medium">E-posta Doğrulama</Label>
              {emailVerified ? (
                <CheckCircle className="w-5 h-5 text-green-500" />
              ) : (
                <XCircle className="w-5 h-5 text-red-500" />
              )}
            </div>
            
            {emailVerificationSent && !emailVerified && (
              <div className="space-y-2">
                <Input
                  placeholder="6 haneli doğrulama kodu"
                  value={emailCode}
                  onChange={(e) => setEmailCode(e.target.value)}
                  maxLength={6}
                />
                <Button 
                  onClick={handleEmailVerification}
                  className="w-full"
                  size="sm"
                >
                  E-postayı Doğrula
                </Button>
              </div>
            )}
            
            {emailVerified && (
              <p className="text-sm text-green-600">✓ E-posta doğrulandı</p>
            )}
          </div>

          {/* Phone Verification */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Phone className="w-5 h-5" />
              <Label className="text-sm font-medium">Telefon Doğrulama</Label>
              {phoneVerified ? (
                <CheckCircle className="w-5 h-5 text-green-500" />
              ) : (
                <XCircle className="w-5 h-5 text-red-500" />
              )}
            </div>
            
            {phoneVerificationSent && !phoneVerified && (
              <div className="space-y-2">
                <Input
                  placeholder="6 haneli SMS kodu"
                  value={phoneCode}
                  onChange={(e) => setPhoneCode(e.target.value)}
                  maxLength={6}
                />
                <Button 
                  onClick={handlePhoneVerification}
                  className="w-full"
                  size="sm"
                >
                  Telefonu Doğrula
                </Button>
              </div>
            )}
            
            {phoneVerified && (
              <p className="text-sm text-green-600">✓ Telefon doğrulandı</p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-2">
            <Button variant="outline" onClick={onClose} className="flex-1">
              İptal
            </Button>
            <Button 
              onClick={handleCompleteVerification}
              disabled={!emailVerified || !phoneVerified}
              className="flex-1"
            >
              Doğrula ve Devam Et
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

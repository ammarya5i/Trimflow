// Comprehensive validation utilities with fraud detection

// Turkish phone number validation
export const validateTurkishPhone = (phone: string): { isValid: boolean; error?: string } => {
  // Remove all non-digit characters
  const cleanPhone = phone.replace(/\D/g, '')
  
  // Turkish mobile numbers start with 5 and are 11 digits total
  // Landline numbers start with 2, 3, 4 and are 10-11 digits
  const mobileRegex = /^5[0-9]{9}$/
  const landlineRegex = /^[2-4][0-9]{8,9}$/
  
  if (cleanPhone.length < 10 || cleanPhone.length > 11) {
    return { isValid: false, error: 'Telefon numarası 10-11 haneli olmalıdır' }
  }
  
  if (!mobileRegex.test(cleanPhone) && !landlineRegex.test(cleanPhone)) {
    return { isValid: false, error: 'Geçersiz Türk telefon numarası formatı' }
  }
  
  // Check for suspicious patterns
  if (cleanPhone.match(/(\d)\1{4,}/)) {
    return { isValid: false, error: 'Şüpheli telefon numarası (çok fazla tekrar eden rakam)' }
  }
  
  // Check for sequential numbers
  if (isSequential(cleanPhone)) {
    return { isValid: false, error: 'Şüpheli telefon numarası (ardışık rakamlar)' }
  }
  
  // Check for test numbers
  const testNumbers = ['1111111111', '2222222222', '3333333333', '4444444444', '5555555555', '6666666666', '7777777777', '8888888888', '9999999999', '0000000000']
  if (testNumbers.includes(cleanPhone)) {
    return { isValid: false, error: 'Test numaraları kabul edilmez' }
  }
  
  // Check for invalid carrier codes (Turkish mobile numbers)
  if (cleanPhone.startsWith('5')) {
    const carrierCode = cleanPhone.substring(1, 4)
    const validCarrierCodes = ['050', '051', '052', '053', '054', '055', '059']
    if (!validCarrierCodes.includes(carrierCode)) {
      return { isValid: false, error: 'Geçersiz operatör kodu' }
    }
  }
  
  return { isValid: true }
}

// Email validation with fraud detection
export const validateEmail = (email: string): { isValid: boolean; error?: string } => {
  if (!email || email.length === 0) {
    return { isValid: false, error: 'E-posta adresi gerekli' }
  }
  
  // Basic email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return { isValid: false, error: 'Geçersiz e-posta formatı' }
  }
  
  // Check for suspicious patterns
  if (email.includes('..') || email.startsWith('.') || email.endsWith('.')) {
    return { isValid: false, error: 'Geçersiz e-posta formatı' }
  }
  
  // Check for disposable email domains
  const disposableDomains = [
    '10minutemail.com', 'tempmail.org', 'guerrillamail.com', 'mailinator.com',
    'yopmail.com', 'throwaway.email', 'temp-mail.org', 'sharklasers.com',
    'guerrillamailblock.com', 'pokemail.net', 'spam4.me', 'bccto.me',
    'chacuo.net', 'dispostable.com', 'mailnesia.com', 'maildrop.cc',
    'mailcatch.com', 'inboxalias.com', 'mailme.lv', 'mailmetrash.com'
  ]
  
  const domain = email.split('@')[1]?.toLowerCase()
  if (disposableDomains.includes(domain)) {
    return { isValid: false, error: 'Geçici e-posta adresleri kabul edilmez' }
  }
  
  // Check for suspicious patterns in email
  if (email.match(/\d{10,}/)) {
    return { isValid: false, error: 'Şüpheli e-posta adresi (çok fazla rakam)' }
  }
  
  // Check for fake domains
  const fakeDomains = [
    'gmail.con', 'yahoo.con', 'hotmail.con', 'outlook.con',
    'gmail.co', 'yahoo.co', 'hotmail.co', 'outlook.co',
    'gmail.c', 'yahoo.c', 'hotmail.c', 'outlook.c'
  ]
  
  if (fakeDomains.some(domain => email.toLowerCase().includes(domain))) {
    return { isValid: false, error: 'Şüpheli e-posta adresi (yanlış domain)' }
  }
  
  // Check for suspicious patterns
  if (email.includes('++') || email.includes('--') || email.includes('__')) {
    return { isValid: false, error: 'Şüpheli e-posta adresi (çoklu özel karakter)' }
  }
  
  // Check for test emails
  const testEmails = ['test@test.com', 'test@gmail.com', 'fake@fake.com', 'dummy@dummy.com']
  if (testEmails.includes(email.toLowerCase())) {
    return { isValid: false, error: 'Test e-posta adresleri kabul edilmez' }
  }
  
  return { isValid: true }
}

// Name validation
export const validateName = (name: string): { isValid: boolean; error?: string } => {
  if (!name || name.trim().length < 2) {
    return { isValid: false, error: 'İsim en az 2 karakter olmalıdır' }
  }
  
  if (name.length > 50) {
    return { isValid: false, error: 'İsim çok uzun (maksimum 50 karakter)' }
  }
  
  // Check for valid Turkish characters
  const validNameRegex = /^[a-zA-ZçğıöşüÇĞIİÖŞÜ\s]+$/
  if (!validNameRegex.test(name)) {
    return { isValid: false, error: 'İsim sadece harf içermelidir' }
  }
  
  // Check for suspicious patterns
  if (name.match(/(.)\1{3,}/)) {
    return { isValid: false, error: 'Şüpheli isim (çok fazla tekrar eden karakter)' }
  }
  
  // Check for test names
  const testNames = ['test', 'test123', 'fake', 'dummy', 'admin', 'user', 'guest', 'anonymous']
  if (testNames.includes(name.toLowerCase().trim())) {
    return { isValid: false, error: 'Test isimleri kabul edilmez' }
  }
  
  // Check for names with only numbers or special characters
  if (name.match(/^\d+$/) || name.match(/^[^a-zA-ZçğıöşüÇĞIİÖŞÜ]+$/)) {
    return { isValid: false, error: 'İsim en az bir harf içermelidir' }
  }
  
  // Check for names that are too short (less than 2 characters after trimming)
  if (name.trim().length < 2) {
    return { isValid: false, error: 'İsim en az 2 karakter olmalıdır' }
  }
  
  return { isValid: true }
}

// Fraud detection utilities
const isSequential = (str: string): boolean => {
  const digits = str.split('').map(Number)
  let ascending = 0
  let descending = 0
  
  for (let i = 1; i < digits.length; i++) {
    if (digits[i] === digits[i-1] + 1) ascending++
    if (digits[i] === digits[i-1] - 1) descending++
  }
  
  return ascending >= 4 || descending >= 4
}

// Real-time validation with debouncing
export const createValidator = () => {
  const validationCache = new Map<string, any>()
  
  return {
    validatePhone: (phone: string) => {
      const cacheKey = `phone_${phone}`
      if (validationCache.has(cacheKey)) {
        return validationCache.get(cacheKey)
      }
      
      const result = validateTurkishPhone(phone)
      validationCache.set(cacheKey, result)
      
      // Clear cache after 5 minutes
      setTimeout(() => validationCache.delete(cacheKey), 5 * 60 * 1000)
      
      return result
    },
    
    validateEmail: (email: string) => {
      const cacheKey = `email_${email}`
      if (validationCache.has(cacheKey)) {
        return validationCache.get(cacheKey)
      }
      
      const result = validateEmail(email)
      validationCache.set(cacheKey, result)
      
      setTimeout(() => validationCache.delete(cacheKey), 5 * 60 * 1000)
      
      return result
    },
    
    validateName: (name: string) => {
      const cacheKey = `name_${name}`
      if (validationCache.has(cacheKey)) {
        return validationCache.get(cacheKey)
      }
      
      const result = validateName(name)
      validationCache.set(cacheKey, result)
      
      setTimeout(() => validationCache.delete(cacheKey), 5 * 60 * 1000)
      
      return result
    }
  }
}
